export async function up(knex) {
  await knex.raw(`
    ALTER TABLE bookings
      ADD COLUMN utc_check_in_confirmed DATE;
    ALTER TABLE bookings
      ADD COLUMN utc_check_out_confirmed DATE;
  `);
}

export async function down(knex) {}
