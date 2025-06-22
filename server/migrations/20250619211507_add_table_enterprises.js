export async function up(knex) {
  await knex.raw(`
    CREATE TABLE enterprises (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      cnpj TEXT UNIQUE NOT NULL
    );

    ALTER TABLE users
      ADD COLUMN enterprise_id UUID NOT NULL REFERENCES enterprises(id);
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS enterprises;
  `);
}
