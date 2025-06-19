export async function up(knex) {
  await knex.raw(`
    CREATE TABLE high_season_periods (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      description TEXT,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    ); 
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS high_season_periods;
  `);
}
