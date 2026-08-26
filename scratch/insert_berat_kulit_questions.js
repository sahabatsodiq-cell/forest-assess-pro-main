import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 39; // Berat-Kulit (Penetapan Berat Kulit)
  const competencyUnitId = 449; // A.02GNS01.040.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Berat jenis kulit Kayu Manis adalah 0,57 (0,42- 0,69) dan termasuk kelas awet IV menurut Seng (1990).",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Berat jenis kulit Kayu Manis adalah 0,57 (0,42- 0,69) dan termasuk kelas awet IV menurut Seng (1990).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Berat jenis kulit Gemor adalah 0,77 dengan kelas awet II dan kelas kuat kisaran antara II-III.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Nilai atau pengelompokan kelas awet/kuat untuk kulit Gemor tidak sesuai dengan pernyataan tersebut.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Besarnya berat jenis kulit kayu tergantung dari kandungan zat-zat pada kulit kayu, kandungan ekstraktif serta kandungan air.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Berat jenis kulit kayu dipengaruhi oleh kandungan zat-zat pembentuk, kandungan ekstraktif, dan kadar air.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Jumlah kadar air maksimum pada kulit masohi adalah 10%.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Ketentuan jumlah kadar air maksimum pada kulit masohi tidak sebesar 10%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Ketebalan kulit mempengaruhi beratnya. Ketebalan kulit gemor bagian dalam diukur dengan menggunakan jangka sorong.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Ketebalan mempengaruhi volume dan berat kulit, dan pengukuran ketebalan kulit bagian dalam menggunakan jangka sorong.",
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

  console.log("✅ Successfully inserted all 5 Benar/Salah questions for Berat-Kulit (A.02GNS01.040.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
