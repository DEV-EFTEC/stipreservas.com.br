import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

export async function findBookingById(id) {
  return db("bookings").where({ id }).first();
}

export async function findBookingsByUser(userId, limit, offset) {
  return db("bookings")
    .where("created_by", "=", userId)
    .orderBy("utc_created_on", "desc")
    .limit(limit)
    .offset(offset);
}

export async function createBooking(data) {
  const [book] = await db("bookings").insert(data).returning("*");

  const [updatedBooking] = await db("bookings")
    .where({ id: book.id })
    .update({
      expires_at: db.raw(`"utc_created_on" + interval '30 minutes'`),
    })
    .returning("*");

  return updatedBooking;
}

export async function updateBooking(id, data) {
  const [updated] = await db("bookings")
    .where({ id })
    .update(data)
    .returning("*");
  return updated;
}

export async function deleteBooking(id) {
  return db.transaction(async (trx) => {
    await trx("guests_bookings").where({ booking_id: id }).delete();
    await trx("children_bookings").where({ booking_id: id }).delete();
    await trx("dependents_bookings").where({ booking_id: id }).delete();
    await trx("booking_rooms").where({ booking_id: id }).delete();

    await trx("bookings").where({ id }).delete();
  });
}

export async function getBookingComplete(id) {
  const [
    guests,
    dependents,
    children,
    stepchildren,
    holders,
    associates,
    rooms,
  ] = await Promise.all([
    db("guests_bookings as gb")
      .join("guests as g", "gb.guest_id", "g.id")
      .select("*")
      .where("gb.booking_id", id),
    db("dependents_bookings as db")
      .join("dependents as d", "db.dependent_id", "d.id")
      .select("*")
      .where("db.booking_id", id),
    db("children_bookings as cb")
      .join("children as c", "cb.child_id", "c.id")
      .select("*")
      .where("cb.booking_id", id),
    db("stepchildren_bookings as sb")
      .join("stepchildren as s", "sb.stepchild_id", "s.id")
      .select("*")
      .where("sb.booking_id", id),
    db("holders_bookings as hb")
      .join("users as u", "hb.holder_id", "u.id")
      .select("*")
      .where("hb.booking_id", id),
    db("associates_bookings as ab")
      .join("users as u", "ab.associate_id", "u.id")
      .join(
        "associate_bookings_invites as abi",
        "abi.booking_id",
        "ab.booking_id"
      )
      .andWhere("ab.booking_id", id)
      .andWhereColumn("abi.associate_invited_id", "ab.associate_id")
      .select("*", "abi.id as invite_id"),
    db("booking_rooms as br")
      .join("rooms as r", "br.room_id", "r.id")
      .select("*")
      .where("br.booking_id", id),
  ]);

  const booking = await db("bookings").where({ id }).first();
  const newAssociates = associates.map(({ password, ...rest }) => rest);

  return {
    ...booking,
    guests,
    dependents,
    children,
    stepchildren,
    holders,
    rooms,
    associates: newAssociates,
  };
}

export async function getLocalBookingComplete(date) {
  // 1. Buscar bookings com check_in OU check_out no dia
  const bookings = await db("bookings")
    .where("status", "approved")
    .andWhere(function () {
      this.where("check_in", date).orWhere("check_out", date);
    });

  const bookingIds = bookings.map((b) => b.id);
  if (bookingIds.length === 0) {
    return []; // nenhum booking no dia
  }

  // 2. Buscar relacionamentos para todos esses bookings em batch

  const [
    guests,
    dependents,
    children,
    stepchildren,
    holders,
    associates,
    rooms,
  ] = await Promise.all([
    db("guests_bookings as gb")
      .join("guests as g", "gb.guest_id", "g.id")
      .select("gb.booking_id", "g.*")
      .whereIn("gb.booking_id", bookingIds),

    db("dependents_bookings as db")
      .join("dependents as d", "db.dependent_id", "d.id")
      .select("db.booking_id", "d.*")
      .whereIn("db.booking_id", bookingIds),

    db("children_bookings as cb")
      .join("children as c", "cb.child_id", "c.id")
      .select("cb.booking_id", "c.*")
      .whereIn("cb.booking_id", bookingIds),

    db("stepchildren_bookings as sb")
      .join("stepchildren as s", "sb.stepchild_id", "s.id")
      .select("sb.booking_id", "s.*")
      .whereIn("sb.booking_id", bookingIds),

    db("holders_bookings as hb")
      .join("users as u", "hb.holder_id", "u.id")
      .select("hb.booking_id", "u.*")
      .whereIn("hb.booking_id", bookingIds),

    db("associates_bookings as ab")
      .join("users as u", "ab.associate_id", "u.id")
      .join("associate_bookings_invites as abi", function () {
        this.on("abi.booking_id", "ab.booking_id").andOn(
          "abi.associate_invited_id",
          "ab.associate_id"
        );
      })
      .select("ab.booking_id", "u.*", "abi.id as invite_id", "u.password")
      .whereIn("ab.booking_id", bookingIds),

    db("booking_rooms as br")
      .join("rooms as r", "br.room_id", "r.id")
      .select("br.booking_id", "r.*")
      .whereIn("br.booking_id", bookingIds),
  ]);

  // 3. Agrupar por booking_id
  function groupByBookingId(items) {
    return items.reduce((acc, item) => {
      const id = item.booking_id;
      if (!acc[id]) acc[id] = [];
      acc[id].push(item);
      return acc;
    }, {});
  }

  const groupedGuests = groupByBookingId(guests);
  const groupedDependents = groupByBookingId(dependents);
  const groupedChildren = groupByBookingId(children);
  const groupedStepchildren = groupByBookingId(stepchildren);
  const groupedHolders = groupByBookingId(holders);
  const groupedAssociatesRaw = groupByBookingId(associates);
  const groupedRooms = groupByBookingId(rooms);

  const groupedAssociates = {};
  for (const [bookingId, assocList] of Object.entries(groupedAssociatesRaw)) {
    groupedAssociates[bookingId] = assocList.map(
      ({ password, ...rest }) => rest
    );
  }

  const bookingsComplete = bookings.map((b) => ({
    ...b,
    guests: groupedGuests[b.id] || [],
    dependents: groupedDependents[b.id] || [],
    children: groupedChildren[b.id] || [],
    stepchildren: groupedStepchildren[b.id] || [],
    holders: groupedHolders[b.id] || [],
    associates: groupedAssociates[b.id] || [],
    rooms: groupedRooms[b.id] || [],
  }));

  return bookingsComplete;
}

export async function getAllBookings(limit, offset) {
  return db("bookings")
    .select(
      "bookings.*",
      "users.name as created_by_name",
      "users.associate_role as created_by_associate_role"
    )
    .where("status", "<>", "incomplete")
    .andWhere("status", "<>", "awaiting_invites")
    .leftJoin("users", "bookings.created_by", "users.id")
    .orderBy("bookings.utc_created_on", "desc")
    .limit(limit)
    .offset(offset);
}

export async function bookingCount() {
  return db("bookings").count();
}

export async function bookingCountByUser(created_by) {
  return db("bookings").where({ created_by }).count();
}

export async function approveBooking(id) {
  const [updatedBooking] = await db("bookings")
    .where({ id })
    .update({
      expires_at: db.raw(`"utc_created_on" + interval '2 days'`),
      status: "payment_pending",
    })
    .returning("*");

  return updatedBooking;
}

export async function refuseBooking(id) {
  const [updatedBooking] = await db("bookings")
    .where({ id })
    .update({
      expires_at: db.raw(`"utc_created_on" + interval '1 day'`),
      status: "refused",
    })
    .returning("*");

  return updatedBooking;
}
