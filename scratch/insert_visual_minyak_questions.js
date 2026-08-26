import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 59; // Visual-Minyak (Pelaksanaan Uji Visual Kelompok Minyak)
  const competencyUnitId = 453; // A.02GNS01.065.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengujian visual/warna pada minyak terpentin dilakukan dengan indra penglihatan langsung pada contoh uji dengan jarak pengamatan antara mata dan contoh uji adalah 30 cm.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Sesuai SNI Terpentin No. 7633:2020, pengujian visual/warna dilakukan secara langsung dengan jarak pengamatan antara mata dan contoh uji adalah 30 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Hasil uji yang disajikan harus sesuai dengan warna contoh minyak daun cengkeh yang diamati. Apabila contoh minyak daun cengkeh yang diamati berwarna kuning muda, maka warna contoh minyak daun cengkeh dinyatakan kuning muda.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Hasil uji visual disajikan sesuai dengan warna pengamatan nyata contoh uji yang diamati.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengambilan contoh uji visual minyak terpentin menggunakan dua cara yaitu isotank dan drum.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengambilan contoh uji minyak terpentin disesuaikan dengan wadah kemasannya (isotank atau drum).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Cara mengidentifikasi bau minyak terpentin dengan menyelupkan kertas uji ke dalam gelas piala yang berisi contoh uji sedalam 5 cm, kemudian cium bau kertas uji.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengujian bau minyak terpentin dilakukan dengan menyelupkan kertas uji ke dalam contoh uji sedalam 5 cm lalu mencium bau pada kertas uji.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengujian visual/warna pada minyak nilam dilakukan dengan indra penglihatan langsung pada contoh uji dengan jarak pengamatan antara mata dan contoh uji adalah",
      option_a: "20 cm",
      option_b: "30 cm",
      option_c: "25 cm",
      option_d: "35 cm",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengujian visual/warna minyak nilam dilakukan dengan jarak pengamatan 30 cm antara mata dan contoh uji.",
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

  console.log("✅ Successfully inserted all 5 questions for Visual-Minyak (A.02GNS01.065.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
