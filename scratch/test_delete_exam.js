import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== CHECKING CONSTRAINT ACTIONS ===");
  const constraints = await sql`
    SELECT
        r.conname,
        pg_catalog.pg_get_constraintdef(r.oid, true) as condef
    FROM
        pg_catalog.pg_constraint r
    WHERE
        r.conrelid = 'exam_enrollments'::regclass OR r.conrelid = 'exam_attempts'::regclass;
  `;
  console.log(constraints);

  console.log("\n=== ATTEMPTING TRANSACTION DELETE ===");
  try {
    await sql.begin(async sql => {
      const rows = await sql`SELECT id, name FROM exam_packages WHERE name = 'Ujian Teori Lengkap CANHUT'`;
      console.log("Found exam packages:", rows);
      if (rows.length > 0) {
        const id = rows[0].id;
        console.log("Deleting id:", id);
        const delRes = await sql`DELETE FROM exam_packages WHERE id = ${id}`;
        console.log("Delete result count:", delRes.count);
      } else {
        console.log("Exam not found by name.");
      }
      throw new Error("ROLLBACK_FOR_TEST"); // rollback to avoid actual deletion
    });
  } catch (err) {
    if (err.message === "ROLLBACK_FOR_TEST") {
      console.log("✓ Deletion script would have succeeded (Transaction rolled back successfully).");
    } else {
      console.error("❌ Deletion failed with database error:", err);
    }
  }

  await sql.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
