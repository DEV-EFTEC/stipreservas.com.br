export async function up(knex) {
  await knex.raw(`
    ALTER TABLE guests_bookings
      ADD CONSTRAINT unique_guest_booking
      UNIQUE (guest_id, booking_id);  
  `);
}

export async function down(knex) {
}