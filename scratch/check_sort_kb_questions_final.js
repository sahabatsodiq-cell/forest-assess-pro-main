import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const count = await sql`
    SELECT COUNT(*) FROM questions 
    WHERE subject_id = 23 OR competency_unit_id = 433
  `;
  console.log("Total Questions Count:", count[0].count);

  const unit = await sql`
    SELECT id, code, title, question_count 
    FROM competency_units 
    WHERE id = 433
  `;
  console.log("Competency Unit:", unit[0]);

  await sql.end();
}

main().catch(console.error);
