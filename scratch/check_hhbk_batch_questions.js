import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  console.log("=== QUESTIONS FOR subject_id = 28 (Uji-HHBK) ===");
  const qList1 = await sql`SELECT id, question_text FROM questions WHERE subject_id = 28 OR competency_unit_id = 439 ORDER BY id ASC`;
  console.log("Questions found (Uji-HHBK):", qList1.length);

  console.log("=== QUESTIONS FOR subject_id = 30 (Mutu-HHBK) ===");
  const qList2 = await sql`SELECT id, question_text FROM questions WHERE subject_id = 30 OR competency_unit_id = 441 ORDER BY id ASC`;
  console.log("Questions found (Mutu-HHBK):", qList2.length);

  await sql.end();
}

main().catch(console.error);
