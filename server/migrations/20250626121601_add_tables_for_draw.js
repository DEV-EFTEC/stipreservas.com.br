export async function up(knex) {
  await knex.raw(`
    CREATE TYPE draw_status AS ENUM ('not_initiated', 'in_progress', 'cancelled', 'concluded');

    CREATE TABLE draws (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      description TEXT,
      color TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      status draw_status NOT NULL DEFAULT 'not_initiated',
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE draw_applications (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      draw_id UUID NOT NULL REFERENCES draws(id) ON DELETE CASCADE,
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      url_receipt_picture TEXT,
      url_word_card_file TEXT,
      status booking_status NOT NULL DEFAULT 'incomplete',
      presence_role booking_presence NOT NULL DEFAULT 'pending',
      partner_presence BOOLEAN NOT NULL,
      expires_at TIMESTAMPTZ,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE draw_rooms (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      room_id UUID NOT NULL REFERENCES rooms(id),
      draw_apply_id UUID NOT NULL REFERENCES draw_applications(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE guests_draw_applies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      guest_id UUID NOT NULL REFERENCES guests(id) ON DELETE CASCADE,
      draw_apply_id UUID NOT NULL REFERENCES draw_applications(id) ON DELETE CASCADE,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (guest_id, draw_apply_id)
    );

    CREATE TABLE dependents_draw_applies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      dependent_id UUID NOT NULL REFERENCES dependents(id) ON DELETE CASCADE,
      draw_apply_id UUID NOT NULL REFERENCES draw_applications(id) ON DELETE CASCADE,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (dependent_id, draw_apply_id)
    );

    CREATE TABLE children_draw_applies (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
      draw_apply_id UUID NOT NULL REFERENCES draw_applications(id) ON DELETE CASCADE,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (child_id, draw_apply_id)
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS 
      children_draw_applies,
      dependents_draw_applies,
      guests_draw_applies,
      draw_rooms,
      draw_applications,
      draws;

    DROP TYPE IF EXISTS draw_status;
  `);
}
