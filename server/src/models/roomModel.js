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

export async function findAvailableRooms(checkIn, checkOut, capacity, bookingId) {
  return db('rooms as r')
    .leftJoin('booking_rooms as br', 'r.id', 'br.room_id')
    .where(builder =>
      builder
        .whereNull('br.id')
        .orWhere(function () {
          this.where('br.check_in', '>=', checkOut)
              .orWhere('br.check_out', '<=', checkIn)
              .orWhere('br.booking_id', '=', bookingId); // mantém os do booking atual
        })
    )
    .modify(queryBuilder => {
      if (capacity < 5) {
        queryBuilder.where('r.capacity', 4);
      }
    })
    .select(
      'r.*',
      db.raw(`CASE WHEN br.booking_id = ? THEN true ELSE false END as is_selected`, [bookingId])
    )
    .groupBy('r.id', 'br.booking_id') // necessário incluir br.booking_id no groupBy
    .orderBy('r.number', 'asc');
}

export async function bookRoom(data) {
  return db('booking_rooms').insert(data);
}

export async function unselectRoom(bookingId, roomId) {
  return db('booking_rooms')
  .where({booking_id: bookingId, room_id: roomId})
  .del();
}