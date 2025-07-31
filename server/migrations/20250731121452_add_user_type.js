export async function up(knex) {
  await knex.raw(`
    ALTER TYPE user_type_role
      ADD VALUE 'local';
  `);
}

export async function down(knex) {}
