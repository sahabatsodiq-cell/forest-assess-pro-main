import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function main() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS exam_registration_requests (
        id               SERIAL PRIMARY KEY,
        user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        qualification_id INTEGER NOT NULL REFERENCES qualifications(id) ON DELETE CASCADE,
        notes            TEXT,
        status           TEXT NOT NULL DEFAULT 'PENDING',
        reviewed_by      INTEGER REFERENCES users(id),
        reviewed_at      TIMESTAMP,
        created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_exam_reg_req_user_id ON exam_registration_requests(user_id)`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_exam_reg_req_status ON exam_registration_requests(status)`);
    await sql.unsafe(`CREATE INDEX IF NOT EXISTS idx_exam_reg_req_qual_id ON exam_registration_requests(qualification_id)`);

    // Verify table exists
    const rows = await sql.unsafe(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'exam_registration_requests'
      ORDER BY ordinal_position
    `);
    console.log('Table created successfully! Columns:');
    rows.forEach(r => console.log(' -', r.column_name, ':', r.data_type));
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

main();
