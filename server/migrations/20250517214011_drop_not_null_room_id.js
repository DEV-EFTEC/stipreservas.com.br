export async function up(knex) {
  await knex.raw(`
    ALTER TABLE children_bookings
      ALTER COLUMN room_id DROP NOT NULL;
    ALTER TABLE holders_bookings
      ALTER COLUMN room_id DROP NOT NULL;
     ALTER TABLE dependents_bookings
      ALTER COLUMN room_id DROP NOT NULL;
     ALTER TABLE guests_bookings
      ALTER COLUMN room_id DROP NOT NULL;
  `);
}

export async function down(knex) {
}