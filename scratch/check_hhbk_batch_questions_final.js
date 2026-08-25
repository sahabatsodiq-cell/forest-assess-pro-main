import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  console.log("=== QUESTIONS FOR Uji-HHBK (subject_id = 28) ===");
  const qList1 = await sql`SELECT id, question_text, correct_answer FROM questions WHERE subject_id = 28 ORDER BY id ASC`;
  console.log("Questions found (Uji-HHBK):", qList1.length);
  console.log(qList1);

  console.log("=== QUESTIONS FOR Mutu-HHBK (subject_id = 30) ===");
  const qList2 = await sql`SELECT id, question_text, correct_answer FROM questions WHERE subject_id = 30 ORDER BY id ASC`;
  console.log("Questions found (Mutu-HHBK):", qList2.length);
  console.log(qList2);

  await sql.end();
}

main().catch(console.error);
