export async function up(knex) {
  await knex.raw(`
    ALTER TABLE bookings
      ALTER COLUMN utc_check_in_confirmed TYPE TIMESTAMPTZ USING utc_check_in_confirmed::TIMESTAMPTZ;
    ALTER TABLE bookings
      ALTER COLUMN utc_check_out_confirmed TYPE TIMESTAMPTZ USING utc_check_out_confirmed::TIMESTAMPTZ;
  `);
}

export async function down(knex) {

}