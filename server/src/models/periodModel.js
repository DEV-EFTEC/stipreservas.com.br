import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);

export async function getPeriods() {
  return db("high_season_periods").select("*");
}

export async function createPeriod(data) {
  const [created] = await db("high_season_periods").insert(data).returning('*');
  return created;
}

export async function updatePeriod(id, data) {
  const [updated] = await db("high_season_periods").where({ id }).update(data);
  return updated;
}

export async function deletePeriod(id) {
  return db("high_season_periods").where({ id }).delete();
}

export async function isHighSeason(today) {
  return db("high_season_periods").where("start_date", "<=", today).andWhere("end_date", ">=", today).first();
}
