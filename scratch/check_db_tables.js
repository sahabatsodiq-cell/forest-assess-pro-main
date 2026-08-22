import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== TABLES IN DB ===");
  const tables = await sql`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name;
  `;
  console.log(tables.map(t => t.table_name));

  console.log("\n=== COMPETENCY UNIT QUALIFICATIONS JUNCTION TABLE ===");
  const cuq = await sql`
    SELECT cuq.*, cu.code as unit_code, q.code as qual_code
    FROM competency_unit_qualifications cuq
    JOIN competency_units cu ON cuq.competency_unit_id = cu.id
    JOIN qualifications q ON cuq.qualification_id = q.id
    WHERE cu.code = 'A.02GNS01.001.1'
  `;
  console.log(cuq);

  console.log("\n=== QUESTIONS TABLE SCHEMA & SAMPLE ===");
  const qCols = await sql`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'questions';
  `;
  console.log(qCols);

  const sampleQ = await sql`
    SELECT q.id, q.question_text, q.competency_unit_id, q.qualification_id, cu.code as unit_code, qual.code as qual_code
    FROM questions q
    LEFT JOIN competency_units cu ON q.competency_unit_id = cu.id
    LEFT JOIN qualifications qual ON q.qualification_id = qual.id
    LIMIT 5;
  `;
  console.log(sampleQ);

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
