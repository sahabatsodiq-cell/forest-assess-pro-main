import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: 'require' });

async function updateK3SubjectAndQuestions() {
  console.log("Updating Subject 'Keselamatan dan Kesehatan Kerja' with code 'K3'...");

  // 1. Get or create subject 'Keselamatan dan Kesehatan Kerja' with code 'K3'
  let existingSub = await sql`
    SELECT id FROM subjects 
    WHERE code = 'K3' OR name ILIKE '%Keselamatan%' OR name ILIKE '%K3%'
    LIMIT 1;
  `;

  let k3SubjectId;
  if (existingSub.length > 0) {
    k3SubjectId = existingSub[0].id;
    await sql`
      UPDATE subjects 
      SET name = 'Keselamatan dan Kesehatan Kerja', code = 'K3', updated_at = CURRENT_TIMESTAMP
      WHERE id = ${k3SubjectId};
    `;
    console.log(`Updated existing subject ID ${k3SubjectId} to 'Keselamatan dan Kesehatan Kerja' (K3)`);
  } else {
    // get first qualification_id
    const qual = await sql`SELECT id FROM qualifications ORDER BY id ASC LIMIT 1;`;
    const qualificationId = qual[0]?.id || 1;
    const inserted = await sql`
      INSERT INTO subjects (qualification_id, code, name)
      VALUES (${qualificationId}, 'K3', 'Keselamatan dan Kesehatan Kerja')
      RETURNING id;
    `;
    k3SubjectId = inserted[0].id;
    console.log(`Created new subject ID ${k3SubjectId}: 'Keselamatan dan Kesehatan Kerja' (K3)`);
  }

  // 2. Update all 17 K3 questions (IDs 35 to 51) to use k3SubjectId
  const updatedQuestions = await sql`
    UPDATE questions 
    SET subject_id = ${k3SubjectId}, updated_at = CURRENT_TIMESTAMP
    WHERE id >= 35 AND id <= 51
    RETURNING id;
  `;

  console.log(`Updated ${updatedQuestions.length} questions to subject_id = ${k3SubjectId}`);

  // Also update any other questions that mention APD, K3, or SMK3
  const extraUpdated = await sql`
    UPDATE questions 
    SET subject_id = ${k3SubjectId}, updated_at = CURRENT_TIMESTAMP
    WHERE question_text ILIKE '%APD%' 
       OR question_text ILIKE '%K3%' 
       OR question_text ILIKE '%SMK3%' 
       OR question_text ILIKE '%risiko%'
    RETURNING id;
  `;
  console.log(`Extra updated questions count: ${extraUpdated.length}`);

  // Verify questions and subjects
  const res = await sql`
    SELECT q.id, q.question_text, s.name as subject_name, s.code as subject_code
    FROM questions q
    JOIN subjects s ON q.subject_id = s.id
    ORDER BY q.id ASC;
  `;

  console.table(res.map(r => ({
    id: r.id,
    text: r.question_text.slice(0, 45) + '...',
    subject: r.subject_name,
    code: r.subject_code
  })));

  await sql.end();
}

updateK3SubjectAndQuestions().catch(console.error);
