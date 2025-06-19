import knex from "knex";
import knexConfig from "../../knexfile.js";
const db = knex(knexConfig.development);

export async function findPaymentById(id) {
  return db("payments").where({ id }).select("*").first();
}

export async function findPaymentsByUser(created_by) {
  return db("payments").where({ created_by }).select("*");
}

export async function findPaymentByBooking(booking_id) {
  return db("payments").where({ booking_id }).select("*").first();
}

export async function findCustomerIdByUser(id) {
  return db("users")
    .where({ id })
    .select("id", "asaas_customer_id", "name", "cpf", "email", "mobile_phone")
    .first();
}

export async function createPayment(data) {
  return db("payments").insert(data).returning("*");
}

export async function updatePaymentStatus(id, status) {
  return db("payments").where({ id }).update(status);
}

export async function updatePaymentByAsaasPaymentId(id, status) {
  const [updated] = await db("payments")
    .where({ asaas_payment_id: id })
    .update(status)
    .returning("*");

  console.log(id);
  return updated;
}
