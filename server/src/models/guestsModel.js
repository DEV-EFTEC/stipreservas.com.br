import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function createGuest(data) {
  const [created] = await db('guests').insert(data).returning('*');
  return created;
}

export async function updateGuest(id, data) {
  const [updated] = await db('guests').where({ id }).update(data).returning('*');
  return updated;
}

export async function deleteGuest(id) {
  return db('guests').where({ id }).delete();
}

export async function findGuestById(id) {
  return db('guests').where({ id }).select('*').first();
}

export async function findGuestsByUser(id) {
  return db('guests').where({ created_by: id }).select('*');
}

export async function createGuestByBooking(data) {
  return db('guests_bookings').insert(data);
}

export async function getGuestsByBooking(booking_id) {
  return db('guests_bookings as gb')
    .join('guests as g', 'gb.guest_id', 'g.id')
    .where('gb.booking_id', booking_id)
    .select('g.*');
}
