import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: 'require' });

async function checkQuestions() {
  const rows = await sql`
    SELECT id, question_text, option_a, option_b, option_c, option_d, correct_answer 
    FROM questions 
    ORDER BY id ASC;
  `;
  console.log(`Total questions in database: ${rows.length}`);
  console.table(rows.slice(0, 15));
  await sql.end();
}

checkQuestions().catch(console.error);
