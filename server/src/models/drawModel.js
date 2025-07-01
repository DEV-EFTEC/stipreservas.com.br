import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);

export async function findBookingById(id) {
  return db("bookings").where({ id }).first();
}

export async function createDraw(data) {
  const [draw] = await db("draws").insert(data).returning("*");

  return draw;
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
