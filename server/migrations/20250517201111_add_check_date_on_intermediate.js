export async function up(knex) {
  await knex.raw(`
    ALTER TABLE children_bookings
      ADD COLUMN check_in DATE NOT NULL;
    ALTER TABLE children_bookings
      ADD COLUMN check_out DATE NOT NULL;
    ALTER TABLE guests_bookings
      ADD COLUMN check_in DATE NOT NULL;
    ALTER TABLE guests_bookings
      ADD COLUMN check_out DATE NOT NULL;
    ALTER TABLE dependents_bookings
      ADD COLUMN check_in DATE NOT NULL;
    ALTER TABLE dependents_bookings
      ADD COLUMN check_out DATE NOT NULL;
  `);
}

export async function down(knex) {
}