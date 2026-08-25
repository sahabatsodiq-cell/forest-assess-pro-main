import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== QUESTIONS FOR subject_id = 52 (PUHH-KO) ===");
  const puhhKo = await sql`SELECT id, question_text, correct_answer FROM questions WHERE subject_id = 52 ORDER BY id ASC`;
  console.log("Total Count:", puhhKo.length);

  console.log("=== QUESTIONS FOR subject_id = 60 (Berat-Arang) ===");
  const beratArang = await sql`SELECT id, question_text, correct_answer FROM questions WHERE subject_id = 60 ORDER BY id ASC`;
  console.log("Total Count:", beratArang.length);
  console.log(beratArang);

  await sql.end();
}

main().catch(console.error);
