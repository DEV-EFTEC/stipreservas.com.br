export async function up(knex) {
  await knex.raw(`
    CREATE TABLE registration_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      token TEXT UNIQUE NOT NULL,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );  
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS registration_tokens;
  `);
}
