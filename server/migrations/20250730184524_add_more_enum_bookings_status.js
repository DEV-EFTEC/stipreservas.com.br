export async function up(knex) {
  await knex.raw(`
    ALTER TYPE booking_status
      ADD VALUE 'declined';
    ALTER TYPE booking_status
      ADD VALUE 'expire_approve';
  `);
}

export async function down(knex) {}
