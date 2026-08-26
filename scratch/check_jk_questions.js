import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const questions = await sql`
    SELECT id, question_text, correct_answer, option_a, option_b, option_c, option_d 
    FROM questions 
    WHERE subject_id = 38 OR competency_unit_id = 448
  `;
  console.log("Current Questions:", questions);

  await sql.end();
}

main().catch(console.error);
