import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== EXISTING QUESTIONS FOR PUHH-KO (subject_id = 52) ===");
  const puhhKoQuestions = await sql`SELECT id, question_text FROM questions WHERE subject_id = 52 ORDER BY id ASC`;
  console.log("Count:", puhhKoQuestions.length);

  console.log("=== EXISTING QUESTIONS FOR Berat-Arang (subject_id = 60) ===");
  const beratArangQuestions = await sql`SELECT id, question_text FROM questions WHERE subject_id = 60 ORDER BY id ASC`;
  console.log("Count:", beratArangQuestions.length);

  await sql.end();
}

main().catch(console.error);
