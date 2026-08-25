import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== QUESTIONS FOR subject_id = 62 (PUHH-Arang) ===");
  const qList = await sql`SELECT id, question_text FROM questions WHERE subject_id = 62 OR competency_unit_id = 474 ORDER BY id ASC`;
  console.log("Questions found:", qList.length);
  console.log(qList);

  await sql.end();
}

main().catch(console.error);
