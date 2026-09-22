// check_enrollment_pg.mjs - run from project root
import postgres from 'postgres';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('No DATABASE_URL in .env');
  process.exit(1);
}

const sql = postgres(dbUrl, { ssl: 'require', max: 1 });

async function run() {
  // 1. Find Adit Akbar
  const users = await sql`
  SELECT id, name, email, participant_number
  FROM users
  WHERE name ILIKE '%syasya%'
`;
  console.log('\n=== Users named Syasya ===');
  console.log(JSON.stringify([...users], null, 2));

  if (users.length === 0) {
    const allUsers = await sql`SELECT id, name, email, participant_number FROM users LIMIT 20`;
    console.log('All users:', JSON.stringify([...allUsers], null, 2));
    await sql.end();
    return;
  }

  const userId = users[0].id;
  console.log('\nChecking for user_id:', userId);

  // 2. user_qualifications
  const quals = await sql`SELECT * FROM user_qualifications WHERE user_id = ${userId}`;
  console.log('\n=== user_qualifications ===');
  console.log(JSON.stringify([...quals], null, 2));

  // 3. user_ganisph_assignments
  const assigns = await sql`SELECT uga.*, mg.name as master_name, mg.qualification_name FROM user_ganisph_assignments uga LEFT JOIN master_ganisph mg ON uga.master_ganisph_id = mg.id WHERE uga.user_id = ${userId}`;
  console.log('\n=== user_ganisph_assignments (with master_name) ===');
  console.log(JSON.stringify([...assigns], null, 2));

  // 4. exam_enrollments
  const enrollments = await sql`SELECT * FROM exam_enrollments WHERE user_id = ${userId}`;
  console.log('\n=== exam_enrollments ===');
  console.log(JSON.stringify([...enrollments], null, 2));

  // 5. Active exam packages
  const packages = await sql`SELECT id, name, code, status, qualification_id FROM exam_packages WHERE status IN ('PUBLISHED','ACTIVE')`;
  console.log('\n=== Active exam_packages ===');
  console.log(JSON.stringify([...packages], null, 2));

  // 6. qualifications
  const allQuals = await sql`SELECT id, code, name FROM qualifications`;
  console.log('\n=== qualifications ===');
  console.log(JSON.stringify([...allQuals], null, 2));

  // 7. Check exam_enrollments schema
  const cols = await sql`SELECT column_name, data_type, column_default FROM information_schema.columns WHERE table_name = 'exam_enrollments' ORDER BY ordinal_position`;
  console.log('\n=== exam_enrollments columns ===');
  console.log(JSON.stringify([...cols], null, 2));

  await sql.end();
}

run().catch(e => { console.error(e); process.exit(1); });
