import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || 'development';
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
  const [guests, dependents, children, holders, rooms] = await Promise.all([
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
    db("holders_bookings as hb")
      .join("users as u", "hb.holder_id", "u.id")
      .select("*")
      .where("hb.booking_id", id),
    db("booking_rooms as br")
      .join("rooms as r", "br.room_id", "r.id")
      .select("*")
      .where("br.booking_id", id),
  ]);

  console.info(holders);
  const booking = await db("bookings").where({ id }).first();

  return { ...booking, guests, dependents, children, holders, rooms };
}

export async function getAllBookings(limit, offset) {
  return db("bookings")
    .select(
      "bookings.*",
      "users.name as created_by_name",
      "users.associate_role as created_by_associate_role"
    )
    .where("status", "<>", "incomplete")
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