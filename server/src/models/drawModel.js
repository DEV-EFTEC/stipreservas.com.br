import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);

export async function getDrawById(id) {
  return db("draws").where({ id }).first();
}

export async function createDraw(data) {
  const [draw] = await db("draws").insert(data).returning("*");

  return draw;
}

export async function updateDraw(id, data) {
  const [updated] = await db("draws").where({ id }).update(data).returning("*");
  return updated;
}

export async function deleteDraw(id) {
  return db.transaction(async (trx) => {
    await trx("guests_bookings").where({ booking_id: id }).delete();
    await trx("children_bookings").where({ booking_id: id }).delete();
    await trx("dependents_bookings").where({ booking_id: id }).delete();
    await trx("booking_rooms").where({ booking_id: id }).delete();

    await trx("bookings").where({ id }).delete();
  });
}

export async function getAllDraws(limit, offset) {
  return db("draws")
    .select("*")
    .orderBy("draws.utc_created_on", "desc")
    .limit(limit)
    .offset(offset);
}

export async function drawCount() {
  return db("draws").count();
}

export async function getDrawByDate(start_date, end_date) {
  return db("draws")
    .select("*")
    .where("start_date", ">=", start_date)
    .andWhere("end_date", "<=", end_date);
}
