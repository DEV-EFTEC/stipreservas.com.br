import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);

export async function findUserByCPF(cpf) {
  return db("users").select("*").where({ cpf }).first();
}

export async function createUser(data) {
  return db("users").insert(data);
}

export async function getAllUsers() {
  return db.select("*").from("users");
}

export async function findUserById(id) {
  return db("users").select("*").where({ id }).first();
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
