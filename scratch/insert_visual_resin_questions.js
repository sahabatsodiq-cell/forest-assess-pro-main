import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 34; // Visual-Resin (Pelaksanaan Uji Visual Kelompok Resin)
  const competencyUnitId = 444; // A.02GNS01.035.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Terhadap resin Damar Mata Kucing dilakukan uji visual berdasarkan:",
      option_a: "Warna, corak dan ukuran bongkahan",
      option_b: "Kebersihan, warna dan ukuran bongkahan",
      option_c: "Warna, ukuran bongkahan dan aroma",
      option_d: "Kebersihan, aroma dan berat",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Uji visual pada resin Damar Mata Kucing dilakukan berdasarkan kriteria kebersihan, warna, dan ukuran bongkahan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Warna damar mata kucing yang kecoklatan masuk ke dalam syarat mutu:",
      option_a: "A",
      option_b: "B",
      option_c: "C",
      option_d: "D",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Warna damar mata kucing yang kecoklatan tergolong ke dalam kualifikasi syarat mutu D.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam uji visual untuk menetapkan mutu kemenyan pernyataan untuk mutu yang paling bagus adalah:",
      option_a: "Bongkahannya lebih besar",
      option_b: "Aromanya lebih kuat",
      option_c: "Berat jenisnya lebih tinggi",
      option_d: "Warnanya lebih gelap",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pada penetapan mutu visual kemenyan, mutu terbaik (kualitas utama) ditandai dengan ukuran bongkahan yang lebih besar.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Prinsip umum dalam uji visual warna terhadap gaharu adalah bahwa:",
      option_a: "Warna dan permukaan harus mengkilat",
      option_b: "Warna lebih gelap lebih besar kadar resinnya",
      option_c: "Warna hitam mengkilat, hitam tidak mengkilat, kecoklatan",
      option_d: "Warna yang lebih terang lebih besar kadar resinnya",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Prinsip uji visual warna pada gubal gaharu adalah semakin gelap warnanya (kehitaman), semakin tinggi kadar gubal/resin yang terkandung di dalamnya.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Uji visual terhadap Kopal dilakukan dengan kondisi kopal harus dalam keadaan bersih dan mempunyai bau khas kopal dengan kandungan non kopal sebesar:",
      option_a: "Minimal 5%",
      option_b: "Maksimal 5%",
      option_c: "3% – 5%",
      option_d: "Maksimal 10%",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Syarat visual kopal harus bersih, beraroma khas kopal, dengan batas toleransi kadar benda asing (non-kopal) maksimal 5%.",
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

  console.log("✅ Successfully inserted all 5 questions for Visual-Resin (A.02GNS01.035.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
