export async function up(knex) {
  await knex.raw(`
    ALTER TABLE draws
      ADD COLUMN start_period_date DATE NOT NULL;
    ALTER TABLE draws
      ADD COLUMN end_period_date DATE NOT NULL;
  `);
}

export async function down(knex) {}