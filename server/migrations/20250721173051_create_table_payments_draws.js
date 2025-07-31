export async function up(knex) {
  await knex.raw(`
    CREATE TABLE payments_draws (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      draw_apply_id UUID NOT NULL REFERENCES draw_applications(id) ON DELETE CASCADE,
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      link TEXT,
      price NUMERIC(10,2) NOT NULL,
      status_role payment_status NOT NULL DEFAULT 'pending',
      asaas_customer_id TEXT NOT NULL,
      asaas_payment_id TEXT NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    )
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS payments_draws;
  `);
}