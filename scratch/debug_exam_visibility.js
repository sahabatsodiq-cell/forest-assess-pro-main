import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== QUALIFICATIONS IN DB ===");
  const quals = await sql`SELECT id, code, name FROM qualifications ORDER BY id ASC`;
  console.log(quals);

  console.log("\n=== MASTER GANISPH FOR ARSYAD ===");
  const master = await sql`SELECT * FROM master_ganisph WHERE LOWER(email) = 'arsyadbjbaru@gmail.com' OR LOWER(name) LIKE '%arsyad%'`;
  console.log(master);

  console.log("\n=== USERS TABLE FOR ARSYAD ===");
  const users = await sql`SELECT id, name, email, role, participant_number FROM users WHERE LOWER(email) = 'arsyadbjbaru@gmail.com' OR LOWER(name) LIKE '%arsyad%'`;
  console.log(users);

  if (users.length > 0) {
    const userId = users[0].id;
    console.log(`\n=== USER_QUALIFICATIONS FOR USER_ID ${userId} ===`);
    const uq = await sql`
      SELECT uq.*, q.code, q.name as qual_name
      FROM user_qualifications uq
      LEFT JOIN qualifications q ON uq.qualification_id = q.id
      WHERE uq.user_id = ${userId}
    `;
    console.log(uq);
  }

  console.log("\n=== EXAM PACKAGES IN DB ===");
  const exams = await sql`
    SELECT ep.id, ep.code, ep.name, ep.qualification_id, ep.status, q.code as qual_code, q.name as qual_name
    FROM exam_packages ep
    LEFT JOIN qualifications q ON ep.qualification_id = q.id
  `;
  console.log(exams);

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
