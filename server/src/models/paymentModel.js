import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function findPaymentById(id) {
  return db('payments').where({ id }).select('*').first();
}

export async function findPaymentsByUser(created_by) {
  return db('payments').where({ created_by }).select('*');
}

export async function createPayment(data) {
  return db('payments').insert(data).returning('*');
}

export async function updatePaymentStatus(id, status) {
  return db('payments').where({ id }).update(status);
}
