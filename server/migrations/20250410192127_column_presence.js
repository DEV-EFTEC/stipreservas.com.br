export async function up(knex) {
    await knex.raw(`
        CREATE TYPE booking_presence AS ENUM ('pending', 'not_present', 'present');

        ALTER TABLE bookings
            ADD COLUMN presence_role
            booking_presence NOT NULL DEFAULT 'pending'; 
    `);
}

export async function down(knex) {
    await knex.raw(`
        DROP TYPE IF EXISTS booking_presence;    
    `);
}