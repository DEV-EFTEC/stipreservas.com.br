export async function up(knex) {
  await knex.raw(`
    CREATE TABLE holders_draw_applies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      holder_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      draw_apply_id UUID NOT NULL REFERENCES draw_applications(id) ON DELETE CASCADE,
      room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      CONSTRAINT holders_draw_applies_unique UNIQUE (holder_id, draw_apply_id)
    );
  `);
}

export async function down(knex) {
  await knex.raw(`DROP TABLE IF EXISTS holders_draw_applies;`)
}