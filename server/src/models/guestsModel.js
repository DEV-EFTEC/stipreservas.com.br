import knex from 'knex';
import knexConfig from '../../knexfile.js';
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

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
  return db('guests_bookings').insert(data).onConflict(['guest_id', 'booking_id']).ignore();
}

export async function getGuestsByBooking(booking_id) {
  return db('guests_bookings as gb')
    .join('guests as g', 'gb.guest_id', 'g.id')
    .where('gb.booking_id', booking_id)
    .select('g.*');
}

export async function updateGuestsByBooking({guest_id, check_in, check_out, room_id, booking_id}) {
  return db('guests_bookings').where({ booking_id, guest_id }).update({ check_in, check_out, room_id });
}

export async function updateGuestsByDraw({guest_id, draw_apply_id}) {
  return db('guests_draw_applies').where({ draw_apply_id, guest_id }).update({ check_in, check_out, room_id });
}

export async function createGuestByDraw(data) {
  return db('guests_draw_applies').insert(data).onConflict(['guest_id', 'draw_apply_id']).ignore();
}