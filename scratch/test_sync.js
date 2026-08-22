import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  // Check unique constraints on user_qualifications
  const constraints = await sql`
    SELECT conname, pg_get_constraintdef(c.oid)
    FROM pg_constraint c
    JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE conrelid = 'user_qualifications'::regclass;
  `;
  console.log("CONSTRAINTS ON user_qualifications:", constraints);

  // Let's add unique constraint on (user_id, qualification_id) if missing
  await sql.unsafe(`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'user_qualifications_user_id_qualification_id_key'
      ) THEN
        ALTER TABLE user_qualifications ADD CONSTRAINT user_qualifications_user_id_qualification_id_key UNIQUE (user_id, qualification_id);
      END IF;
    END $$;
  `);

  console.log("Unique constraint verified.");

  // Run sync for Arsyad (user_id = 5)
  const user = (await sql`SELECT * FROM users WHERE email = 'arsyadbjbaru@gmail.com'`)[0];
  console.log("Target user:", user);

  const masterList = await sql`SELECT * FROM master_ganisph WHERE LOWER(email) = LOWER(${user.email})`;
  console.log("Master list count:", masterList.length);

  const allQuals = await sql`SELECT id, code, name FROM qualifications`;

  for (const mItem of masterList) {
    const mQualNameUpper = (mItem.qualification_name || "").toUpperCase();
    const matchedQual = allQuals.find((q) => {
      const qCodeUpper = (q.code || "").toUpperCase();
      const qNameUpper = (q.name || "").toUpperCase();
      return (
        mQualNameUpper.includes(qCodeUpper) ||
        mQualNameUpper.includes(qNameUpper) ||
        qNameUpper.includes(mQualNameUpper.replace("GANISPH ", ""))
      );
    });

    if (matchedQual) {
      console.log(`Matching ${mItem.qualification_name} -> Qual ID ${matchedQual.id} (${matchedQual.code})`);
      await sql`
        INSERT INTO user_qualifications (user_id, qualification_id, registration_number)
        VALUES (${user.id}, ${matchedQual.id}, ${mItem.registration_number || null})
        ON CONFLICT (user_id, qualification_id) DO UPDATE SET
          registration_number = COALESCE(user_qualifications.registration_number, EXCLUDED.registration_number);
      `;
    }
  }

  const uqAfter = await sql`
    SELECT uq.*, q.code, q.name
    FROM user_qualifications uq
    JOIN qualifications q ON uq.qualification_id = q.id
    WHERE uq.user_id = ${user.id}
  `;
  console.log("\n=== USER_QUALIFICATIONS FOR ARSYAD AFTER SYNC ===");
  console.log(uqAfter);

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
