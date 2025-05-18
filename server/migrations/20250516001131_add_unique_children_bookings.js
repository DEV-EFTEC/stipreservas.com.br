export async function up(knex) {
  await knex.raw(`
    ALTER TABLE children_bookings
      ADD CONSTRAINT unique_child_booking
      UNIQUE (child_id, booking_id);  
  `);
}

export async function down(knex) {
}