export async function up(knex) {
  await knex.raw(`
    CREATE TABLE privacy_policy (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      privacy_policy_version TEXT NOT NULL,
      privacy_policy_accepted_at TIMESTAMP NOT NULL DEFAULT NOW(),
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS privacy_policy;
  `);
}
