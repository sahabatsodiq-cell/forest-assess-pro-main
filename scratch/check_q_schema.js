import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== QUESTIONS TABLE COLUMNS ===");
  const qCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'questions'
    ORDER BY ordinal_position;
  `;
  console.log(qCols);

  const sampleQ = await sql`SELECT * FROM questions LIMIT 1`;
  console.log("Sample question row:", sampleQ);

  await sql.end();
}

main().catch(console.error);
