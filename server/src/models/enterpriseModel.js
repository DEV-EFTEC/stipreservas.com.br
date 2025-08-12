import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

export async function createEnterprise(data) {
  const existing = await db("enterprises").where({ cnpj: data.cnpj }).first();

  if (existing) {
    return existing.id;
  }

  const [id] = await db("enterprises").insert(data).returning("id");

  return id;
}

export async function getEnterpriseById(id) {
  return db("enterprises").select("*").where({ id }).first();
}
