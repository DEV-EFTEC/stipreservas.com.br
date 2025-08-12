import knex from "knex";
import knexConfig from "../knexfile.js";
import bcrypt from "bcrypt";
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

const SALT_ROUNDS = 12;

export async function seed() {
  const existing = await db("users").where("role", "=", "admin").first();
  const hash = bcrypt.hashSync(process.env.DEFAULT_ADMIN_PASSWORD, SALT_ROUNDS);


  if (!existing) {
    await db("users").insert({
      name: 'Perfil Curitiba 1',
      password: hash,
      email: "info@stip-reservas.com.br",
      cpf: process.env.DEFAULT_ADMIN_CPF,
      birth_date: new Date("1999-01-01"),
      associate_role: "none",
      mobile_phone: "+5541999999999",
      enterprise_id: "c98e2bd7-b5eb-4f30-b7f4-abe17c09028a",
      role: 'admin',
    });
    console.log("✅ Admin criado com sucesso!");
  } else {
    console.log("⚠️ Admin já existe, nada foi feito.");
  }
}
