export async function up(knex) {
  await knex.raw(`
    ALTER TYPE payment_status
      ADD VALUE 'refund_solicitation';
    ALTER TYPE booking_status
      ADD VALUE 'refund_solicitation';
  `)
}

export async function down(knex) {}