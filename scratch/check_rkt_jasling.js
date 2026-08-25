import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== CHECKING COMPETENCY UNIT ===");
  const cu = await sql`SELECT * FROM competency_units WHERE code = 'A.02GNS01.045.1' OR title ILIKE '%RKT-JaslingWA%' OR title ILIKE '%Penyusunan Rencana Kerja Tahunan (RKT) pada Pemanfaatan Jasa%'`;
  console.log("CU Result:", cu);

  console.log("=== CHECKING SUBJECTS ===");
  const sub = await sql`SELECT * FROM subjects WHERE UPPER(code) = 'RKT-JASLINGWA' OR name ILIKE '%RKT%Jasling%'`;
  console.log("Subject Result:", sub);

  await sql.end();
}

main().catch(console.error);
