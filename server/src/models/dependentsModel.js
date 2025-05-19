import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function createDependent(data) {
  const [created] = await db('dependents').insert(data).returning('*');
  return created;
}

export async function updateDependent(id, data) {
  const [updated] = await db('dependents').where({ id }).update(data).returning('*');
  return updated;
}

export async function deleteDependent(id) {
  return db('dependents').where({ id }).delete();
}

export async function findDependentById(id) {
  return db('dependents').where({ id }).select('*').first();
}

export async function findDependentsByUser(id) {
  return db('dependents').where({ created_by: id }).select('*');
}

export async function findExistingDependent({ created_by, cpf }) {
  return db.dependents.findFirst({
    where: {
      created_by,
      cpf
    },
  });
}

export async function createDependentByBooking(data) {
  return db('dependents_bookings').insert(data).onConflict(['dependent_id', 'booking_id']).ignore();
}

export async function getDependentsByBooking(booking_id) {
  return db('dependents_bookings as db')
    .join('dependents as d', 'db.dependent_id', 'd.id')
    .where('db.booking_id', booking_id)
    .select('d.*');
}

export async function getDependetByParcialName(partialName, created_by) {
  const dependents = await db('dependents')
    .whereILike('name', `${partialName}%`)
    .andWhere({ created_by });

  return dependents;
}

export async function updateDependentsByBooking({dependent_id, check_in, check_out, room_id, booking_id}) {
  return db('dependents_bookings').where({ booking_id, dependent_id }).update({ check_in, check_out, room_id });
}
