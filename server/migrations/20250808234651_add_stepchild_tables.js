export async function up(knex) {
  await knex.raw(`
    CREATE TABLE stepchildren (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      cpf TEXT NOT NULL,
      birth_date DATE NOT NULL,
      has_not_cpf BOOLEAN,
      disability BOOLEAN,
      url_document_picture TEXT,
      url_medical_report TEXT,
      medical_report_status document_status DEFAULT 'neutral',
      document_picture_status document_status DEFAULT 'neutral',
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE stepchildren_bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      stepchild_id UUID NOT NULL REFERENCES stepchildren(id) ON DELETE CASCADE,
      booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
      room_id UUID REFERENCES rooms(id) ON DELETE CASCADE,
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW(),
      UNIQUE (stepchild_id, booking_id)
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS stepchildren_bookings;
    DROP TABLE IF EXISTS stepchildren;
  `);
}
