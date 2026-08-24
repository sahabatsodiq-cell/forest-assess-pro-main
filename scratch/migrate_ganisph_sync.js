// Migration: Add email to master_ganisph + create user_ganisph_assignments bridge table
// Run: node scratch/migrate_ganisph_sync.js

import postgres from "postgres";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(DATABASE_URL, { ssl: "require" });


  try {
    console.log("Running migration: ganisph sync system...");

    await sql`
      ALTER TABLE master_ganisph
      ADD COLUMN IF NOT EXISTS email TEXT DEFAULT NULL
    `;
    console.log("✅ Added email column to master_ganisph");

    // 2. Create index on email for fast lookup
    await sql`
      CREATE INDEX IF NOT EXISTS idx_master_ganisph_email
      ON master_ganisph (LOWER(email))
      WHERE email IS NOT NULL
    `;
    console.log("✅ Created index on master_ganisph.email");

    // 3. Create index on registration_number for fast lookup
    await sql`
      CREATE INDEX IF NOT EXISTS idx_master_ganisph_reg_no
      ON master_ganisph (registration_number)
      WHERE registration_number IS NOT NULL
    `;
    console.log("✅ Created index on master_ganisph.registration_number");

    // 4. Create user_ganisph_assignments bridge table
    await sql`
      CREATE TABLE IF NOT EXISTS user_ganisph_assignments (
        id          SERIAL PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        master_ganisph_id INTEGER NOT NULL REFERENCES master_ganisph(id) ON DELETE CASCADE,
        synced_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (user_id, master_ganisph_id)
      )
    `;
    console.log("✅ Created user_ganisph_assignments table");

    // 5. Index for fast lookup by user_id
    await sql`
      CREATE INDEX IF NOT EXISTS idx_user_ganisph_assignments_user
      ON user_ganisph_assignments (user_id)
    `;
    console.log("✅ Created index on user_ganisph_assignments.user_id");

    console.log("\n🎉 Migration completed successfully!");
    await sql.end();
  } catch (err) {
    console.error("Migration failed:", err);
    await sql.end();
    process.exit(1);
  }
}

main();
