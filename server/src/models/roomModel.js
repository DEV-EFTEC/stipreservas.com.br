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

export async function findAvailableRooms(checkIn, checkOut, capacity) {
  return db('rooms as r')
    .leftJoin('booking_rooms as br', 'r.id', 'br.room_id')
    .where(builder =>
      builder
        .whereNull('br.id')
        .orWhere(function () {
          this.where('br.check_in', '>=', checkOut)
              .orWhere('br.check_out', '<=', checkIn);
        })
    )
    .modify(queryBuilder => {
      if (capacity < 5) {
        queryBuilder.where('r.capacity', 4);
      }
    })
    .select('r.*')
    .groupBy('r.id')
    .orderBy("number", "asc");
}


export async function bookRoom(data) {
  console.log(data)
  return db('booking_rooms').insert(data);
}