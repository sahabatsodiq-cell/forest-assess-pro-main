import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: 'require' });

async function checkAllQuestions() {
  const rows = await sql`
    SELECT id, qualification_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer 
    FROM questions 
    ORDER BY id ASC;
  `;
  console.log(`Total questions in DB: ${rows.length}`);
  
  rows.forEach((q, idx) => {
    console.log(`\n--- Question #${q.id} ---`);
    console.log(`Text: ${q.question_text}`);
    console.log(`A: ${q.option_a}`);
    console.log(`B: ${q.option_b}`);
    console.log(`C: ${q.option_c}`);
    console.log(`D: ${q.option_d}`);
    console.log(`Correct: ${q.correct_answer}`);
  });

  await sql.end();
}

checkAllQuestions().catch(console.error);
