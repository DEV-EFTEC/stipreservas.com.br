import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function findAllRooms() {
  return db('rooms').select('*');
}

export async function createRoom(data) {
  return db('rooms').insert([
  {
    number: 1,
    capacity: 6,
    floor: 0,
    preferential: true,
    partner_booking_fee_per_day: 45.00,
    contributor_booking_fee_per_day: 60.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 2,
    capacity: 6,
    floor: 0,
    preferential: true,
    partner_booking_fee_per_day: 45.00,
    contributor_booking_fee_per_day: 60.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 11,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 12,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 13,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 14,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 15,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 16,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 17,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 18,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 19,
    capacity: 4,
    floor: 1,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 21,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 22,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 23,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 24,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 25,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 26,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 27,
    capacity: 4,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 28,
    capacity: 6,
    floor: 2,
    preferential: false,
    partner_booking_fee_per_day: 45.00,
    contributor_booking_fee_per_day: 60.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 31,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 32,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 33,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 34,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 35,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 36,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 37,
    capacity: 4,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 25.00,
    contributor_booking_fee_per_day: 35.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
  {
    number: 38,
    capacity: 6,
    floor: 3,
    preferential: false,
    partner_booking_fee_per_day: 45.00,
    contributor_booking_fee_per_day: 60.00,
    partner_guest_fee_per_day: 40.00,
    contributor_guest_fee_per_day: 70.00,
  },
]);
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
              .orWhere('br.booking_id', '=', bookingId);
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
    .groupBy('r.id', 'br.booking_id')
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