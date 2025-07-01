export async function up(knex) {
  await knex.raw(`
    ALTER TABLE draws
      ADD COLUMN draw_date DATE NOT NULL;
    ALTER TABLE draws
      ADD COLUMN color_2 TEXT;
  `);
}

export async function down(knex) {
}