import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 40; // Visual-Kulit (Pelaksanaan Uji Visual Kelompok Kulit)
  const competencyUnitId = 450; // A.02GNS01.041.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengukuran kulit gemor diukur pada bagian kulit dalam (inner bark).",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengukuran ketebalan kulit gemor dilakukan pada bagian kulit dalam (inner bark).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengujian keaslian kulit masohi jika digores akan mengeluarkan minyak beraroma seperti …..",
      option_a: "Kemiri",
      option_b: "Kelapa",
      option_c: "Ekaliptus",
      option_d: "Sereh wangi",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Dalam pengujian keaslian kulit masohi, jika bagian dalam kulit digores akan mengeluarkan minyak yang memiliki aroma khas seperti kelapa.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penggaris merupakan alat yang digunakan untuk mengukur tebal kulit kayu manis.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengukuran ketebalan kulit kayu manis yang presisi menggunakan alat ukur khusus seperti jangka sorong atau kaliper, bukan penggaris biasa.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Warna kayu manis yang telah bersih dari pengotor akan berwarna kuning/kuning tua atau kuning kecoklatan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Warna kulit kayu manis yang bersih dari pengotor adalah kuning, kuning tua, atau kuning kecoklatan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rasa kulit masohi apabila digigit akan terasa ……",
      option_a: "Manis",
      option_b: "Pahit",
      option_c: "Getir",
      option_d: "Asam",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Rasa khas dari kulit masohi apabila digigit adalah terasa getir.",
      status: "ACTIVE"
    }
  ];

  for (const q of questionsData) {
    const res = await sql`
      INSERT INTO questions (
        qualification_id, subject_id, competency_unit_id, question_text,
        option_a, option_b, option_c, option_d,
        correct_answer, difficulty, explanation, status
      ) VALUES (
        1, ${q.subject_id}, ${q.competency_unit_id}, ${q.question_text},
        ${q.option_a}, ${q.option_b}, ${q.option_c}, ${q.option_d},
        ${q.correct_answer}, ${q.difficulty}, ${q.explanation}, ${q.status}
      ) RETURNING id;
    `;
    console.log(`Inserted question ID: ${res[0].id}`);
  }

  // Update question_count in competency_units
  await sql`
    UPDATE competency_units
    SET question_count = (SELECT COUNT(*) FROM questions WHERE competency_unit_id = ${competencyUnitId})
    WHERE id = ${competencyUnitId}
  `;

  console.log("✅ Successfully inserted all 5 questions for Visual-Kulit (A.02GNS01.041.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
