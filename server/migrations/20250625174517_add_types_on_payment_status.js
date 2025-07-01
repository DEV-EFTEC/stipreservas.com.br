export async function up(knex) {
  await knex.raw(`
    ALTER TYPE payment_status
      ADD VALUE 'refunded';
    ALTER TYPE booking_status
      ADD VALUE 'refunded';
  `)
}

export async function down(knex) {}