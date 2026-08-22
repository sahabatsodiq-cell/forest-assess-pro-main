import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== QUALIFICATION COMPETENCY UNITS FOR A.02GNS01.001.1 ===");
  const qcu = await sql`
    SELECT qcu.*, cu.code as unit_code, q.code as qual_code
    FROM qualification_competency_units qcu
    JOIN competency_units cu ON qcu.competency_unit_id = cu.id
    JOIN qualifications q ON qcu.qualification_id = q.id
    WHERE cu.code = 'A.02GNS01.001.1'
  `;
  console.log(qcu.map(row => row.qual_code));

  console.log("\n=== QUESTIONS FOR UNIT A.02GNS01.001.1 ===");
  const questions = await sql`
    SELECT q.id, q.question_text, q.competency_unit_id, q.qualification_id, cu.code as unit_code, qual.code as qual_code
    FROM questions q
    LEFT JOIN competency_units cu ON q.competency_unit_id = cu.id
    LEFT JOIN qualifications qual ON q.qualification_id = qual.id
    WHERE cu.code = 'A.02GNS01.001.1'
  `;
  console.log(`Total questions found for K3 unit: ${questions.length}`);
  console.log(questions.slice(0, 3));

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
