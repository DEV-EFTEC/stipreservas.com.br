import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function findAllRooms() {
  return db('rooms').select('*');
}

export async function createRoom(data) {
  return db('rooms').insert(data);
}

export async function findRoomById(id) {
  return db('rooms').select('*').where(id);
}

export async function findAvailableRooms(checkIn, checkOut) {
  return db('rooms as r')
    .leftJoin('booking_rooms as br', 'r.id', 'br.room_id')
    .leftJoin('bookings as b', 'br.booking_id', 'b.id')
    .where(builder => 
      builder
        .whereNull('b.id')
        .orWhere(function () {
          this.where('b.check_out', '<=', checkIn)
          .orWhere('b.check_in', '>=', checkOut);
        })
    )
    .select('r.*')
    .groupBy('r.id');
}