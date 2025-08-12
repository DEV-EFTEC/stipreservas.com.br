export async function up(knex) {
  await knex.raw(`
    ALTER TYPE booking_status
      ADD VALUE 'awaiting_invites';
  `);
}

export async function down(knex) {}
