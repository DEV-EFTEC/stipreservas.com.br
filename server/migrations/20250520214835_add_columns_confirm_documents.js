export async function up(knex) {
  await knex.raw(`
    CREATE TYPE document_status AS ENUM ('approved', 'neutral', 'refused');

    ALTER TABLE guests
      ADD COLUMN medical_report_status document_status DEFAULT 'neutral';
    ALTER TABLE guests
      ADD COLUMN document_picture_status document_status DEFAULT 'neutral';
    ALTER TABLE dependents
      ADD COLUMN medical_report_status document_status DEFAULT 'neutral';
    ALTER TABLE dependents
      ADD COLUMN document_picture_status document_status DEFAULT 'neutral';
    ALTER TABLE children
      ADD COLUMN medical_report_status document_status DEFAULT 'neutral';
    ALTER TABLE children
      ADD COLUMN document_picture_status document_status DEFAULT 'neutral';
  `);
}

export async function down(knex) {
  await knex.raw(`
    ALTER TABLE guests
      DROP COLUMN IF EXISTS medical_report_status,
      DROP COLUMN IF EXISTS document_picture_status;
    ALTER TABLE dependents
      DROP COLUMN IF EXISTS medical_report_status,
      DROP COLUMN IF EXISTS document_picture_status;
    ALTER TABLE children
      DROP COLUMN IF EXISTS medical_report_status,
      DROP COLUMN IF EXISTS document_picture_status;

    DROP TYPE IF EXISTS document_status;
  `);
}
