import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 33; // Berat-Resin (Penetapan Berat Resin)
  const competencyUnitId = 443; // A.02GNS01.034.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berat tiap kemasan damar mata kucing secara umum dalam perdagangan damar mata kucing ditetapkan:",
      option_a: "5 kg per kemasan",
      option_b: "10 kg per kemasan",
      option_c: "Sesuai kemampuan mesin kemas",
      option_d: "Sesuai permintaan pembeli",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Berat tiap kemasan damar mata kucing secara umum dalam perdagangan ditetapkan sesuai permintaan pembeli (kesepakatan pembeli dan penjual).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Secara umum pengemasan kopal dalam perdagangan dilakukan dengan standar berat kemasan:",
      option_a: "20 Kg – 30 kg",
      option_b: "30 kg – 50 kg",
      option_c: "40 kg – 60 kg",
      option_d: "50 kg – 70 kg",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Secara umum pengemasan kopal dalam perdagangan dilakukan dalam karung/kemasan dengan berat standar 50 kg – 70 kg.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kemenyan dalam bentuk butiran halus sampai dengan bentuk tepung dalam pengemasannya menggunakan plastik dengan dijahit rapat dan kuat dengan berat rata-rata:",
      option_a: "20 kg",
      option_b: "25 kg",
      option_c: "30 kg",
      option_d: "35 kg",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengemasan kemenyan bentuk butiran halus hingga tepung menggunakan kantong plastik yang dijahit rapat dengan berat rata-rata 25 kg.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengemasan resin dilakukan dengan pertimbangan:",
      option_a: "Ketahanan dan keamanan saat bongkar dan muat",
      option_b: "Kemampuan alat angkut",
      option_c: "Penyesuaian untuk kegiatan proses lanjutan",
      option_d: "Kemudahan dalam pemasaran",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pertimbangan utama dalam pengemasan resin adalah ketahanan dan keamanan bahan serta kemasan saat proses bongkar dan muat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berat contoh uji yang diambil secara acak dari karung kemasan dalam pengujian kopal adalah kurang lebih:",
      option_a: "1.000 gr",
      option_b: "500 gr",
      option_c: "100 gr",
      option_d: "50 gr",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pengambilan contoh uji kopal secara acak dari tiap karung sampel diambil sebanyak kurang lebih 100 gram.",
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

  console.log("✅ Successfully inserted all 5 questions for Berat-Resin (A.02GNS01.034.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
