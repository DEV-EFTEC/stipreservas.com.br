import knex from "knex";
import knexConfig from "../../knexfile.js";
import { formatCPF, generateValidCPF } from "#lib/cpf.js";
import randomBytes from "randombytes";
import bcrypt from "bcrypt";
const environment = process.env.NODE_ENV || "development";
const db = knex(knexConfig[environment]);

const SALT_ROUNDS = 12;

export async function createUser(data, token) {
  await db("users").insert(data);
  return db("registration_tokens").update({ used: true }).where({ token });
}

export async function registrationLink(data) {
  return db("registration_tokens").insert(data);
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
      "enterprise_id",
      "mobile_phone",
      "birth_date",
      "url_profile_picture",
      "url_document_picture"
    )
    .where({ cpf })
    .first();
}

export async function findUserByCpfAndAll(cpf) {
  return db("users").select("*").where({ cpf }).first();
}

export async function updateUser(id, data) {
  const [updated] = await db("users")
    .where({ id })
    .update(data)
    .returning([
      "id",
      "email",
      "enterprise_id",
      "cpf",
      "name",
      "role",
      "associate_role",
      "asaas_customer_id",
      "mobile_phone",
      "birth_date",
      "url_profile_picture",
      "url_document_picture",
    ]);
  return updated;
}

function generatePassword(length = 12) {
  return randomBytes(length).toString("base64").slice(0, length);
}

export async function createUserLocal(data) {
  let adminsCount = 0;
  let localsCount = 0;
  const cpf = formatCPF(generateValidCPF());
  const password = generatePassword();
  const hash = bcrypt.hashSync(password, SALT_ROUNDS);

  if (data.role === "admin") {
    const admins = await db("users")
      .where("role", "=", "admin")
      .count("id as count")
      .first();
    adminsCount = admins?.count ? Number(admins.count) : 0;
  } else if (data.role === "local") {
    const locals = await db("users")
      .where("role", "=", "local")
      .count("id as count")
      .first();
    localsCount = locals?.count ? Number(locals.count) : 0;
  }

  const name =
    data.role === "local"
      ? `Perfil Shangri-lá ${localsCount + 1}`
      : `Perfil Curitiba ${adminsCount + 1}`;

  const email =
    data.role === "local"
      ? `local_${localsCount + 1}@stip-reservas.com.br`
      : `cwb_${adminsCount + 1}@stip-reservas.com.br`;

  const [created] = await db("users")
    .insert({
      name,
      password: hash,
      email,
      cpf,
      birth_date: new Date("1999-01-01"),
      associate_role: "none",
      mobile_phone: "+5541999999999",
      enterprise_id: "73fd6447-1ecd-4710-aa1a-18586434d486",
      role: data.role,
    })
    .returning("id", "role");

  console.log("Usuário local criado com CPF:", cpf);
  return { id: created.id, name, role: data.role, cpf, password };
}

export async function generateNewPasswordToUser(id) {
  const password = generatePassword();
  const hash = bcrypt.hashSync(password, SALT_ROUNDS);

  await db("users").where({ id }).update({ password: hash });

  return password;
}

export async function findNoAssociate() {
  return db("users")
    .where("role", "<>", "associate")
    .select("id", "name", "cpf", "role");
}
