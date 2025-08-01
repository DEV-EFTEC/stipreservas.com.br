import knex from "knex";
import knexConfig from "../../knexfile.js";
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

export async function findPaymentById(id) {
  return db("payments_bookings").where({ id }).select("*").first();
}

export async function findPaymentsByUser(created_by, table) {
  return db(table).where({ created_by }).select("*");
}

export async function findPaymentByBooking(booking_id) {
  return db("payments_bookings").where({ booking_id }).select("*").first();
}

export async function findPaymentByDraw(draw_apply_id) {
  return db("payments_draws").where({ draw_apply_id }).select("*").first();
}

export async function findCustomerIdByUser(id) {
  return db("users")
    .where({ id })
    .select("id", "asaas_customer_id", "name", "cpf", "email", "mobile_phone")
    .first();
}

export async function createPayment(table, data) {
  return db(table).insert(data).returning("*");
}

export async function updatePaymentStatus(id, table, status) {
  return db(table).where({ id }).update(status);
}

export async function updatePaymentByAsaasPaymentId(id, table, status) {
  const [updated] = await db(table)
    .where({ asaas_payment_id: id })
    .update(status)
    .returning("*");

  return updated;
}