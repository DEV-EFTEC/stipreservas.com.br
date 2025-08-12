export async function up(knex) {
  await knex.raw(`
    ALTER TABLE associate_bookings_invites
      ADD COLUMN document_picture_status document_status DEFAULT 'neutral';
  `);
}

export async function down(knex) {}
