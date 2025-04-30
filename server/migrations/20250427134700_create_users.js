export async function up(knex) {
  await knex.raw(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
  
    CREATE TYPE user_type_role AS ENUM ('associate', 'admin');
    CREATE TYPE user_role_associate AS ENUM ('partner', 'contributor', 'none');
    CREATE TYPE booking_status AS ENUM (
      'pending_approval',
      'refused',
      'expired',
      'closed',
      'approved',
      'payment_pending',
      'cancelled',
      'incomplete'
    );
    CREATE TYPE booking_presence AS ENUM ('pending', 'not_present', 'present');
    CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'expired');

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT UNIQUE NOT NULL,
      cpf TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password TEXT NOT NULL,
      birth_date DATE NOT NULL,
      url_profile_picture TEXT,
      url_document_picture TEXT,
      role user_type_role NOT NULL,
      associate_role user_role_associate NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE rooms (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      number INT NOT NULL,
      capacity INT NOT NULL,
      floor INT NOT NULL,
      preferential BOOLEAN NOT NULL,
      partner_booking_fee_per_day NUMERIC(10,2) NOT NULL,
      contributor_booking_fee_per_day NUMERIC(10,2) NOT NULL,
      partner_guest_fee_per_day NUMERIC(10,2) NOT NULL,
      contributor_guest_fee_per_day NUMERIC(10,2) NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE guests (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_by UUID NOT NULL REFERENCES users(id),
      name TEXT,
      cpf TEXT UNIQUE,
      birth_date DATE,
      url_document_picture TEXT,
      url_medical_report TEXT,
      disability BOOLEAN,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE dependents (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_by UUID NOT NULL REFERENCES users(id),
      name TEXT,
      cpf TEXT UNIQUE,
      degree_of_kinship TEXT,
      birth_date DATE,
      disability BOOLEAN,
      url_document_picture TEXT,
      url_medical_report TEXT,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE children (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_by UUID NOT NULL REFERENCES users(id),
      name TEXT,
      cpf TEXT UNIQUE,
      birth_date DATE,
      has_not_cpf BOOLEAN,
      disability BOOLEAN,
      url_document_picture TEXT,
      url_medical_report TEXT,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      created_by UUID NOT NULL REFERENCES users(id),
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      guests_quantity INTEGER NOT NULL,
      dependents_quantity INTEGER NOT NULL,
      children_age_max_quantity INTEGER NOT NULL,
      url_receipt_picture TEXT,
      url_word_card_file TEXT,
      status booking_status NOT NULL DEFAULT 'incomplete',
      presence_role booking_presence NOT NULL DEFAULT 'pending',
      partner_presence BOOLEAN NOT NULL,
      expires_at TIMESTAMPTZ,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE booking_rooms (
      id UUID DEFAULT uuid_generate_v4(),
      room_id UUID NOT NULL REFERENCES rooms(id),
      booking_id UUID NOT NULL REFERENCES bookings(id),
      check_in DATE NOT NULL,
      check_out DATE NOT NULL,
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE guests_bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      guest_id UUID NOT NULL REFERENCES guests(id),
      booking_id UUID NOT NULL REFERENCES bookings(id),
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE dependents_bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      dependent_id UUID NOT NULL REFERENCES dependents(id),
      booking_id UUID NOT NULL REFERENCES bookings(id),
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE children_bookings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      child_id UUID NOT NULL REFERENCES children(id),
      booking_id UUID NOT NULL REFERENCES bookings(id),
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );

    CREATE TABLE payments (
      id UUID DEFAULT uuid_generate_v4(),
      booking_id UUID NOT NULL REFERENCES bookings(id),
      user_id UUID NOT NULL REFERENCES users(id),
      link TEXT NOT NULL,
      price NUMERIC(10,2) NOT NULL,
      status_role payment_status NOT NULL DEFAULT 'pending',
      utc_created_on TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(knex) {
  await knex.raw(`
    DROP TABLE IF EXISTS payments, children_bookings, dependents_bookings, guests_bookings,
    booking_rooms, bookings, children, dependents, guests, rooms, users CASCADE;

    DROP TYPE IF EXISTS user_type_role, user_role_associate, booking_status, booking_presence, payment_status;
  `);
}
