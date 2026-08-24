import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: 'require' });

async function checkSubjects() {
  const subjects = await sql`SELECT * FROM subjects;`;
  console.log("Subjects in DB:");
  console.table(subjects);

  const questions = await sql`
    SELECT q.id, q.question_text, q.subject_id, s.name as subject_name, s.code as subject_code
    FROM questions q
    LEFT JOIN subjects s ON q.subject_id = s.id
    ORDER BY q.id ASC;
  `;
  console.log("Questions with subject info:");
  console.table(questions.slice(0, 20));

  await sql.end();
}

checkSubjects().catch(console.error);
