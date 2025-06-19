export async function up(knex) {
  await knex.raw(`
    ALTER TABLE payments
      ADD COLUMN asaas_customer_id TEXT NOT NULL;
    ALTER TABLE payments
      ADD COLUMN asaas_payment_id TEXT NOT NULL;
  `)
}

export async function down(knex) {}