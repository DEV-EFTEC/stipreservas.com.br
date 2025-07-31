export async function up(knex) {
  await knex.raw(`
    ALTER TABLE bookings
      ADD COLUMN justification TEXT;
  `);
}

export async function down(knex) {}
