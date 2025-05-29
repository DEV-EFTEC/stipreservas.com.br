import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function createHolderByBooking(data) {
  await db('holders_bookings')
    .insert(data)
    .onConflict(['holder_id', 'booking_id'])
    .ignore();

  const holder = await db('holders_bookings as hb')
    .join('users as u', 'hb.holder_id', 'u.id')
    .select(
      'hb.*',
      'u.name as user_name',
      'u.email as user_email'
    )
    .where({
      'hb.holder_id': data[0].holder_id,
      'hb.booking_id': data[0].booking_id
    });
  
  return holder[0]
}

export async function getHolderByBooking(booking_id) {
  return db('holders_bookings as hb')
    .join('holders as h', 'hb.holder_id', 'h.id')
    .where('hb.booking_id', booking_id)
    .select('h.*');
}

export async function updateHoldersByBooking({holder_id, check_in, check_out, room_id, booking_id}) {
  return db('holders_bookings').where({ booking_id, holder_id }).update({ check_in, check_out, room_id });
}