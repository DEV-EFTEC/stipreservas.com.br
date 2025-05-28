export async function up(knex) {
  await knex.raw(`
    CREATE TABLE holders_bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      holder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`DROP TABLE IF EXISTS holders_bookings;`)
}