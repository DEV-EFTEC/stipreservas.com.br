import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function findUserByCPF(cpf) {
  return db('users').select('*').where({ cpf }).first();
}

export async function createUser(data) {
  return db('users').insert(data);
}

export async function getAllUsers() {
  return db.select('*').from('users');
}