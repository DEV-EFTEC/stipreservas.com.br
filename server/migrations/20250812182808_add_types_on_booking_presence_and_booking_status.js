export async function up(knex) {
  await knex.raw(`
    ALTER TYPE booking_presence
      ADD VALUE 'check_in_confirmed';
    ALTER TYPE booking_presence
      ADD VALUE 'check_out_confirmed';
    ALTER TYPE booking_status
      ADD VALUE 'finished';
  `)
}

export async function down(knex) {}