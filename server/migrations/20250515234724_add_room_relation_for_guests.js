export async function up(knex) {
  await knex.raw(`
    ALTER TABLE children_bookings
      ADD COLUMN room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE;
    ALTER TABLE guests_bookings
      ADD COLUMN room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE;
    ALTER TABLE dependents_bookings
      ADD COLUMN room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE;
  `);
}

export async function down(knex) {
}