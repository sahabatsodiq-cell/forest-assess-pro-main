import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  console.log("=== CHECKING COMPETENCY UNIT ===");
  const cu = await sql`SELECT * FROM competency_units WHERE code = 'A.02GNS01.030.1' OR title ILIKE '%Visual-Batang%' OR title ILIKE '%Uji Visual Kelompok Batang%'`;
  console.log("CU Result:", cu);

  console.log("=== CHECKING SUBJECTS ===");
  const sub = await sql`SELECT * FROM subjects WHERE UPPER(code) = 'VISUAL-BATANG' OR name ILIKE '%Uji Visual Kelompok Batang%'`;
  console.log("Subject Result:", sub);

  await sql.end();
}

main().catch(console.error);
