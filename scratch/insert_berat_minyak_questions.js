import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 58; // Berat-Minyak (Penetapan Berat Minyak)
  const competencyUnitId = 452; // A.02GNS01.064.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Diketahui massa piknometer kosong 6,80 g, massa piknometer + akuades 8,65 g, massa piknometer + minyak kayu putih 8,45 g. Berapa bobot jenis minyak kayu putih yang dihasilkan?",
      option_a: "0,97 g/mL",
      option_b: "0,93 g/mL",
      option_c: "0,89 g/mL",
      option_d: "0,87 g/mL",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Massa akuades = 8,65 - 6,80 = 1,85 g. Massa minyak = 8,45 - 6,80 = 1,65 g. Bobot jenis = 1,65 / 1,85 ≈ 0,89 g/mL.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berapa bobot jenis minyak kayu putih sesuai dengan standar SNI 3954:2014?",
      option_a: "0,800 – 0,830 g/mL",
      option_b: "0,900 – 0,930 g/mL",
      option_c: "0,800 – 0,860 g/mL",
      option_d: "0,900 – 0,960 g/mL",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Berdasarkan SNI 3954:2014, bobot jenis minyak kayu putih pada suhu 20°C berkisar antara 0,900 – 0,930 g/mL.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Bobot jenis minyak nilam pada suhu 25°C sesuai standar SNI 06-2385-2006 adalah 0,950-0,975.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Berdasarkan SNI 06-2385-2006, bobot jenis minyak nilam pada suhu 25°C adalah 0,950 – 0,975.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Bobot jenis minyak terpentin pada suhu 25°C sesuai standar SNI 7633:2020 adalah 0,848 g/mL – 0,865 g/mL.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Berdasarkan SNI 7633:2020, bobot jenis minyak terpentin pada suhu 25°C adalah 0,848 g/mL – 0,865 g/mL.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Bobot jenis minyak cengkeh pada suhu 20°C sesuai standar SNI 06-2387-2006 adalah 1,025 – 1,049.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Berdasarkan SNI 06-2387-2006, bobot jenis minyak cengkeh pada suhu 20°C adalah 1,025 – 1,049.",
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

  console.log("✅ Successfully inserted all 5 questions for Berat-Minyak (A.02GNS01.064.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
