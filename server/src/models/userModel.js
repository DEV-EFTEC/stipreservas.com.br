import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

export async function findUserByCPF(cpf) {
  return db("users").select("*").where({ cpf }).first();
}

export async function createUser(data, token) {
  await db("users").insert(data);
  return db("registration_tokens").update({ used: true }).where({ token });
}

export async function registrationLink(data) {
  return db("registration_tokens").insert(data)
}

export async function verifyToken(token) {
    return db("registration_tokens").select().where({ token }).first();
}

export async function getAllUsers() {
  return db.select("*").from("users");
}

export async function findUserById(id) {
  return db("users").select("*").where({ id }).first();
}

export async function findUserByCpf(cpf) {
  return db("users")
    .select(
      "id",
      "email",
      "cpf",
      "name",
      "role",
      "associate_role",
      "asaas_customer_id",
      "mobile_phone",
      "birth_date",
      "url_profile_picture",
      "url_document_picture"
    )
    .where({ cpf })
    .first();
}

export async function updateUser(id, data) {
  const [updated] = await db("users")
    .where({ id })
    .update(data)
    .returning(
      "id",
      "email",
      "cpf",
      "name",
      "role",
      "associate_role",
      "asaas_customer_id",
      "mobile_phone",
      "birth_date",
      "url_profile_picture",
      "url_document_picture"
    );
  return updated;
}
