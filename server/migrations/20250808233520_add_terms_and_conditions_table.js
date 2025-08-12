export async function up(knex) {
  await knex.raw(`
    CREATE TABLE terms_of_use (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      terms_version TEXT NOT NULL,
      terms_accepted_at TIMESTAMP NOT NULL DEFAULT NOW(),
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS terms_of_use;
  `);
}
