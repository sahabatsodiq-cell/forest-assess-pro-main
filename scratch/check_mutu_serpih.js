import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== CHECKING COMPETENCY UNIT ===");
  const cu = await sql`SELECT * FROM competency_units WHERE code = 'A.02GNS01.062.2' OR title ILIKE '%Serpih%' OR title ILIKE '%Mutu-Serpih%'`;
  console.log("CU Result:", cu);

  console.log("=== CHECKING SUBJECTS ===");
  const sub = await sql`SELECT * FROM subjects WHERE UPPER(code) = 'MUTU-SERPIH' OR name ILIKE '%Serpih%'`;
  console.log("Subject Result:", sub);

  await sql.end();
}

main().catch(console.error);
