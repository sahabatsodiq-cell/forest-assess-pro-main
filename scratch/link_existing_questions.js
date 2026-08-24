import postgres from "postgres";

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: "require" });

async function linkExistingQuestions() {
  try {
    console.log("Updating existing questions in DB to set competency_unit_id matching subject_code...");

    // Update questions where competency_unit_id is null based on subject code matching competency_units.subject_code
    const updated = await sql`
      UPDATE questions q
      SET competency_unit_id = cu.id
      FROM subjects s
      JOIN competency_units cu ON s.code = cu.subject_code
      WHERE q.subject_id = s.id
        AND q.competency_unit_id IS NULL;
    `;

    console.log("Questions updated count:", updated.count);

    // Verify questions state
    const questions = await sql`
      SELECT q.id, q.question_text, q.competency_unit_id, cu.code as unit_code, cu.title as unit_title, s.code as subject_code
      FROM questions q
      LEFT JOIN competency_units cu ON q.competency_unit_id = cu.id
      LEFT JOIN subjects s ON q.subject_id = s.id
    `;

    console.log("\n=== UPDATED QUESTIONS LIST ===");
    console.log(questions);

  } catch (err) {
    console.error("Error linking questions:", err);
  } finally {
    await sql.end();
  }
}

linkExistingQuestions();
