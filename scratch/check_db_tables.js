import postgres from 'postgres';

function generateOptionMapping() {
  const options = ['A', 'B', 'C', 'D'];
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [options[i], options[j]] = [options[j], options[i]];
  }
  return JSON.stringify(options);
}

const DATABASE_URL = 'postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres';

async function main() {
  const sql = postgres(DATABASE_URL, { ssl: 'require' });

  try {
    const attempts = await sql.unsafe("SELECT a.id, a.exam_id, p.qualification_id FROM exam_attempts a JOIN exam_packages p ON a.exam_id = p.id WHERE a.status = 'IN_PROGRESS'");

    for (const att of attempts) {
      const existingQs = await sql.unsafe("SELECT COUNT(*) FROM attempt_questions WHERE attempt_id = $1", [att.id]);
      if (Number(existingQs[0].count) === 0) {
        console.log(`Attempt ${att.id} has 0 questions. Generating...`);

        const questions = await sql.unsafe(`
          SELECT q.id
          FROM questions q
          JOIN qualification_competency_units qcu ON q.competency_unit_id = qcu.competency_unit_id
          WHERE q.status = 'ACTIVE' AND (q.qualification_id = $1 OR qcu.qualification_id = $1)
          GROUP BY q.id
          ORDER BY RANDOM() LIMIT 50
        `, [att.qualification_id]);


        let order = 1;
        for (const q of questions) {
          const mapping = generateOptionMapping();
          await sql.unsafe(`
            INSERT INTO attempt_questions (attempt_id, question_id, display_order, option_mapping)
            VALUES ($1, $2, $3, $4)
          `, [att.id, q.id, order++, mapping]);
        }
        console.log(`Populated ${questions.length} questions for attempt ${att.id}`);
      }
    }

    const totalAttemptQs = await sql.unsafe("SELECT attempt_id, COUNT(*) FROM attempt_questions GROUP BY attempt_id");
    console.log('ATTEMPT QUESTIONS AFTER POPULATING:', totalAttemptQs);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await sql.end();
  }
}

main();










