import postgres from "postgres";

const databaseUrl = process.env["DATABASE_URL"] || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(databaseUrl, { ssl: "require" });

  console.log("Cleaning NIK and Qualifications for ADMIN and SUPER_ADMIN users...");

  // 1. Get IDs of Admin and Super Admin users
  const adminUsers = await sql`SELECT id, name, role, email FROM users WHERE role IN ('ADMIN', 'SUPER_ADMIN')`;
  console.log("Found admin users:", adminUsers);

  if (adminUsers.length > 0) {
    const adminIds = adminUsers.map(r => r.id);

    // 2. Set participant_number to NULL
    await sql`UPDATE users SET participant_number = NULL WHERE role IN ('ADMIN', 'SUPER_ADMIN')`;
    console.log("Cleared participant_number for admin users.");

    // 3. Delete qualifications for admin users
    await sql`DELETE FROM user_qualifications WHERE user_id = ANY(${adminIds})`;
    console.log("Deleted qualification records for admin users.");

    // 4. Delete assignment records for admin users if any
    await sql`DELETE FROM user_ganisph_assignments WHERE user_id = ANY(${adminIds})`;
    console.log("Deleted assignment records for admin users.");
  }

  await sql.end();
  console.log("Database clean up complete!");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
