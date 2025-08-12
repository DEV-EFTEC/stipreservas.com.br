export async function up(knex) {
  await knex.raw(`
    CREATE TYPE booking_invite_role AS ENUM ('accepted', 'refused', 'pending');

    CREATE TABLE associate_bookings_invites (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      associate_invited_id UUID NOT NULL REFERENCES users(id),
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      url_receipt_picture TEXT,
      url_word_card_file TEXT,
      status booking_invite_role NOT NULL DEFAULT 'pending',
      expires_at TIMESTAMPTZ,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (booking_id, associate_invited_id)
    );

    CREATE TABLE associates_bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      associate_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (associate_id, booking_id)
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS associates_bookings;
    DROP TABLE IF EXISTS associate_bookings_invites;
    DROP TYPE IF EXISTS booking_invite_role;
  `)
}