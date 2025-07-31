export async function up(knex) {
  await knex.raw(`
    ALTER TYPE booking_status
      ADD VALUE 'drawn';
    ALTER TYPE booking_status
      ADD VALUE 'not_drawn';
  `)
}

export async function down(knex) {}