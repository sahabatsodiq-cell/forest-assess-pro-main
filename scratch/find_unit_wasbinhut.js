import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("--- Searching Competency Units ---");
  const units = await sql`
    SELECT * FROM competency_units 
    WHERE code ILIKE '%047%' OR title ILIKE '%Pembinaan Hutan%' OR subject_code ILIKE '%Was-Binhut%'
  `;
  console.log("Units:", units);

  console.log("--- Searching Subjects ---");
  const subjects = await sql`
    SELECT * FROM subjects 
    WHERE code ILIKE '%Was-Binhut%' OR name ILIKE '%Pembinaan Hutan%'
  `;
  console.log("Subjects:", subjects);

  await sql.end();
}

main().catch(console.error);
