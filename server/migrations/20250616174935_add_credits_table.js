export async function up(knex) {
  await knex.raw(`
    CREATE TYPE credit_status AS ENUM ('VALID', 'EXPIRED');

    CREATE TABLE credits (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      payment_id UUID NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
      status credit_status DEFAULT 'VALID',
      expires_at TIMESTAMPTZ,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS credits;
    DROP TYPE IF EXISTS credit_status;
  `)
}