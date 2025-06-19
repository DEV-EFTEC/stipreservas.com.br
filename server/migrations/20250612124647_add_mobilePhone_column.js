export async function up(knex) {
  await knex.raw(`
    ALTER TABLE users
      ADD COLUMN mobile_phone TEXT NOT NULL;
  `);
}

export async function down(knex) {
  
}