import knex from 'knex';
import knexConfig from '../../knexfile.js';
const db = knex(knexConfig.development);

export async function findBookingById(id) {
    return db('bookings').where({ id }).first();
}

export async function findBookingsByUser(userId) {
    return db('bookings').where('created_by', '=', userId).orderBy('utc_created_on', 'desc');
}

export async function createBooking(data) {
    return db('bookings').insert(data).returning("*");
}

export async function updateBooking(id, data) {
    const [updated] = await db('bookings').where({ id }).update(data).returning('*');
    return updated;
}

export async function deleteBooking(id) {
    return db.transaction(async (trx) => {
      await trx('guests_bookings').where({ booking_id: id }).delete();
      await trx('children_bookings').where({ booking_id: id }).delete();
      await trx('dependents_bookings').where({ booking_id: id }).delete();
      await trx('booking_rooms').where({ booking_id: id }).delete();
  
      await trx('bookings').where({ id }).delete();
    });
  }
export async function getBookingComplete(id) {
    const [guests, dependents, children] = await Promise.all([
        db('guests_bookings as gb')
            .join('guests as g', 'gb.guest_id', 'g.id')
            .select('*')
            .where('gb.booking_id', id),
        db('dependents_bookings as db')
            .join('dependents as d', 'db.dependent_id', 'd.id')
            .select('*')
            .where('db.booking_id', id),
        db('children_bookings as cb')
            .join('children as c', 'cb.child_id', 'c.id')
            .select('*')
            .where('cb.booking_id', id)
    ]);

    const booking = await db('bookings').where({ id }).first();

    return { ...booking, guests, dependents, children }
}
