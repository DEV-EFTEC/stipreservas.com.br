export async function up(knex) {
  await knex.raw(`
    ALTER TABLE users
      ADD COLUMN asaas_customer_id TEXT;
  `);
}

export async function down(knex) {
  
}