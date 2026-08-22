import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== COMPETENCY UNITS ===");
  const units = await sql`SELECT * FROM competency_units ORDER BY code ASC`;
  console.log(units);

  console.log("\n=== UNIT QUALIFICATIONS (LINKED QUALIFICATIONS FOR UNITS) ===");
  const unitQuals = await sql`
    SELECT uq.*, cu.code as unit_code, q.code as qual_code
    FROM unit_qualifications uq
    JOIN competency_units cu ON uq.unit_id = cu.id
    JOIN qualifications q ON uq.qualification_id = q.id
    WHERE cu.code = 'A.02GNS01.001.1'
  `;
  console.log(unitQuals);

  console.log("\n=== QUESTIONS IN DB ===");
  const questions = await sql`
    SELECT q.id, q.competency_unit_id, q.qualification_id, q.question_text, cu.code as unit_code, qual.code as qual_code
    FROM questions q
    LEFT JOIN competency_units cu ON q.competency_unit_id = cu.id
    LEFT JOIN qualifications qual ON q.qualification_id = qual.id
    LIMIT 10
  `;
  console.log(questions);

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
