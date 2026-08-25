import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== CHECKING COMPETENCY UNITS ===");
  const cus = await sql`
    SELECT * FROM competency_units 
    WHERE code IN ('A.02GNS01.058.1', 'A.02GNS01.066.2') 
       OR subject_code IN ('PUHH-KO', 'Berat-Arang')
       OR title ILIKE '%Arang%';
  `;
  console.log("CU Results:", cus);

  console.log("=== CHECKING SUBJECTS ===");
  const subs = await sql`
    SELECT * FROM subjects 
    WHERE UPPER(code) IN ('PUHH-KO', 'BERAT-ARANG') 
       OR name ILIKE '%Arang%';
  `;
  console.log("Subject Results:", subs);

  await sql.end();
}

main().catch(console.error);
