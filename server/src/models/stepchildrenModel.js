import knex from 'knex';
import knexConfig from '../../knexfile.js';
const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

export async function createStepchild(data) {
  const [created] = await db('stepchildren').insert(data).returning('*');
  return created;
}

export async function updateStepchild(id, data) {
  const [updated] = await db('stepchildren').where({ id }).update(data).returning('*');
  return updated;
}

export async function deleteStepchild(id) {
  return db('stepchildren').where({ id }).delete();
}

export async function findStepchildById(id) {
  return db('stepchildren').where({ id }).select('*').first();
}

export async function findStepchildrenByUser(id) {
  return db('stepchildren').where({ created_by: id }).select('*');
}

export async function createStepchildByBooking(data) {
  return db('stepchildren_bookings').insert(data).onConflict(['stepchild_id', 'booking_id']).ignore();
}

export async function getStepchildrenByBooking(booking_id) {
  return db('stepchildren_bookings as sb')
    .join('stepchildren as s', 'sb.stepchild_id', 's.id')
    .where('sb.booking_id', booking_id)
    .select('s.*');
}

export async function updateStepchildByBooking({stepchild_id, check_in, check_out, room_id, booking_id}) {
  return db('stepchildren_bookings').where({ booking_id, stepchild_id }).update({ check_in, check_out, room_id });
}

export async function updateStepchildByDraw({child_id, check_in, check_out, room_id, draw_apply_id}) {
  return db('stepchildren_draw_applies').where({ draw_apply_id, child_id }).update({ check_in, check_out, room_id });
}

export async function createStepchildByDraw(data) {
  return db('stepchildren_draw_applies').insert(data).onConflict(['stepchild_id', 'draw_apply_id']).ignore();
}