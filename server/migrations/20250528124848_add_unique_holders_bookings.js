export async function up(knex) {
  await knex.raw(`
      ALTER TABLE holders_bookings
      ADD CONSTRAINT holders_bookings_unique UNIQUE (holder_id, booking_id);
  `)
}

export async function down(knex) {
  
}