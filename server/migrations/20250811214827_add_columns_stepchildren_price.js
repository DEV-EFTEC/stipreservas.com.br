export async function up(knex) {
  await knex.raw(`
    ALTER TABLE rooms
      ADD COLUMN contributor_stepchild_fee_per_day NUMERIC (10,2) DEFAULT 70.00 NOT NULL;
    ALTER TABLE rooms
      ADD COLUMN partner_stepchild_fee_per_day NUMERIC (10,2) DEFAULT 30.00 NOT NULL;
  `);
}

export async function down(knex) {}
