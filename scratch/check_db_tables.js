import postgres from 'postgres';

const DATABASE_URL = 'postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function main() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    const reqs = await sql.unsafe("SELECT * FROM exam_registration_requests");
    console.log('exam_registration_requests count:', reqs.length);
    console.log('exam_registration_requests rows:', reqs);

    const uq = await sql.unsafe("SELECT * FROM user_qualifications LIMIT 10");
    console.log('user_qualifications sample:', uq);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sql.end();
  }
}

main();


