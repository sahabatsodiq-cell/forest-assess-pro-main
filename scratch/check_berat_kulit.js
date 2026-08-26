import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const tfQuestions = await sql`
    SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer 
    FROM questions 
    WHERE option_a ILIKE 'BENAR' OR option_b ILIKE 'SALAH' OR option_a ILIKE 'True'
    LIMIT 5
  `;
  console.log("Sample TF Questions:", tfQuestions);

  const unit = await sql`SELECT * FROM competency_units WHERE code = 'A.02GNS01.040.2'`;
  console.log("Unit 040:", unit);

  const subject = await sql`SELECT * FROM subjects WHERE code = 'Berat-Kulit'`;
  console.log("Subject Berat-Kulit:", subject);

  await sql.end();
}

main().catch(console.error);
