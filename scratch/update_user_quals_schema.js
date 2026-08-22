import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);
  console.log("Connected to Supabase PostgreSQL Cloud via postgres driver.");

  // Add registration_number column to user_qualifications if not exists
  await sql.unsafe(`
    ALTER TABLE user_qualifications 
    ADD COLUMN IF NOT EXISTS registration_number TEXT;
  `);

  console.log("user_qualifications table updated with registration_number column successfully!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
