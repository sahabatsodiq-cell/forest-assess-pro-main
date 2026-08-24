import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== COMPETENCY UNITS COLUMNS ===");
  const cuCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'competency_units';
  `;
  console.log(cuCols);

  console.log("=== QUALIFICATIONS COLUMNS & ALL ROWS ===");
  const qualCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'qualifications';
  `;
  console.log(qualCols);
  const quals = await sql`SELECT * FROM qualifications ORDER BY id`;
  console.log(quals);

  console.log("=== SUBJECTS TABLE ===");
  const subjects = await sql`SELECT s.*, q.code as qual_code FROM subjects s LEFT JOIN qualifications q ON s.qualification_id = q.id LIMIT 20;`;
  console.log("Subjects count:", subjects.length);
  console.log(subjects);

  console.log("\n=== QUALIFICATION COMPETENCY UNITS JUNCTION TABLE WITH SUBJECT/MATERI ===");
  const qcu = await sql`
    SELECT qcu.*, cu.code as unit_code, cu.title as unit_title, q.code as qual_code
    FROM qualification_competency_units qcu
    JOIN competency_units cu ON qcu.competency_unit_id = cu.id
    JOIN qualifications q ON qcu.qualification_id = q.id
    LIMIT 20;
  `;
  console.log("=== MASTER GANISPH COLUMNS ===");
  const cols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'master_ganisph' 
    ORDER BY ordinal_position;
  `;
  console.log(cols);

  const sample = await sql`SELECT * FROM master_ganisph LIMIT 5;`;
  console.log("Sample rows:", sample);

  console.log("\n=== QUESTIONS SUBJECT_IDS ===");
  const qs = await sql`SELECT id, question_text, subject_id, competency_unit_id FROM questions;`;
  console.log("Questions count:", qs.length);
  console.log("Questions subject_ids:", qs.map(q => q.subject_id));

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

