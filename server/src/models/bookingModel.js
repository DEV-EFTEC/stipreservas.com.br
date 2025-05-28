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
    const [book] = await db('bookings').insert(data).returning("*");

    const [updatedBooking] = await db("bookings")
        .where({ id: book.id })
        .update({
            expires_at: db.raw(`"utc_created_on" + interval '30 minutes'`)
        })
        .returning('*');
    
    return updatedBooking;
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
    const [guests, dependents, children, rooms, holder] = await Promise.all([
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
            .where('cb.booking_id', id),
        db('booking_rooms as br')
            .join('rooms as r', "br.room_id", "r.id")
            .select('*')
            .where('br.booking_id', id),
        db('bookings as b')
            .join('users as u', 'b.created_by', 'u.id')
            .select('*')
            .whereRaw('u.id = b.created_by').first()
    ]);

    const booking = await db('bookings').where({ id }).first();
    const { associate_role, presence_role, url_receipt_picture, url_word_card_file, email, name, cpf } = holder;

    return { ...booking, guests, dependents, children, rooms, holder: { associate_role, presence_role, url_receipt_picture, url_word_card_file, email, name, id: holder.id, cpf } }
}

export async function getAllBookings(limit, offset) {
  return db('bookings')
    .select(
      'bookings.*',
      'users.name as created_by_ name',
      'users.associate_role as created_by_associate_role',
    )
    .where('status', '<>', 'incomplete')
    .leftJoin('users', 'bookings.created_by', 'users.id')
    .orderBy('bookings.utc_created_on', 'desc')
    .limit(limit)
    .offset(offset);
}


export async function bookingCount() {
    return db('bookings').count();
}