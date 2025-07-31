import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function createChild(data) {
  const [created] = await db('children').insert(data).returning('*');
  return created;
}

export async function updateChild(id, data) {
  const [updated] = await db('children').where({ id }).update(data).returning('*');
  return updated;
}

export async function deleteChild(id) {
  return db('children').where({ id }).delete();
}

export async function findChildById(id) {
  return db('children').where({ id }).select('*').first();
}

export async function findChildrenByUser(id) {
  return db('children').where({ created_by: id }).select('*');
}

export async function createChildByBooking(data) {
  return db('children_bookings').insert(data).onConflict(['child_id', 'booking_id']).ignore();
}

export async function getChildrenByBooking(booking_id) {
  return db('children_bookings as cb')
    .join('children as c', 'cb.child_id', 'c.id')
    .where('cb.booking_id', booking_id)
    .select('c.*');
}

export async function updateChildByBooking({child_id, check_in, check_out, room_id, booking_id}) {
  return db('children_bookings').where({ booking_id, child_id }).update({ check_in, check_out, room_id });
}

export async function updateChildByDraw({child_id, check_in, check_out, room_id, draw_apply_id}) {
  return db('children_draw_applies').where({ draw_apply_id, child_id }).update({ check_in, check_out, room_id });
}

export async function createChildByDraw(data) {
  return db('children_draw_applies').insert(data).onConflict(['child_id', 'draw_apply_id']).ignore();
}