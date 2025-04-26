export async function up(knex) {
    await knex.raw(`
        DROP TYPE IF EXISTS payment_status;
        CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'expired');

        ALTER TABLE payments
            ADD COLUMN status_role
            payment_status NOT NULL DEFAULT 'pending'; 
    `);
}

export async function down(knex) {
    await knex.raw(`
    `);
}