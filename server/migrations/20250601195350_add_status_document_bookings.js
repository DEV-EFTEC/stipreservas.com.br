export async function up(knex) {
  await knex.raw(`
    ALTER TABLE bookings
      ADD COLUMN word_card_file_status document_status DEFAULT 'neutral';
    ALTER TABLE bookings
      ADD COLUMN receipt_picture_status document_status DEFAULT 'neutral';
  `);
}

export async function down(knex) {}
