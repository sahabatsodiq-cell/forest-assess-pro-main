import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("--- Searching Competency Units ---");
  const units = await sql`
    SELECT * FROM competency_units 
    WHERE code ILIKE '%024%' OR title ILIKE '%Sortimen%' OR subject_code ILIKE '%Sort-KB%'
  `;
  console.log("Units:", units);

  console.log("--- Searching Subjects ---");
  const subjects = await sql`
    SELECT * FROM subjects 
    WHERE code ILIKE '%Sort-KB%' OR name ILIKE '%Sortimen%'
  `;
  console.log("Subjects:", subjects);

  await sql.end();
}

main().catch(console.error);
