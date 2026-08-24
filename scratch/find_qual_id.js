import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== QUALIFICATIONS FOR CU 415 ===");
  const qcu = await sql`
    SELECT * FROM qualification_competency_units WHERE competency_unit_id = 415
  `;
  console.log("QCU:", qcu);

  if (qcu.length === 0) {
    const allQ = await sql`SELECT id, code, name FROM qualifications LIMIT 10`;
    console.log("All Qualifications:", allQ);
  }

  await sql.end();
}

main().catch(console.error);
