import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 49; // Ren-Comdev
  const competencyUnitId = 464; // A.02GNS01.054.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sanksi yang dikenakan kepada pemegang PBPH apabila tidak melaksanakan kemitraan dengan masyarakat di dalam dan di sekitar hutan yaitu:",
      option_a: "Sanksi denda",
      option_b: "Sanksi administratif berupa teguran tertulis",
      option_c: "Sanksi administratif berupa pembekuan PBPH",
      option_d: "Sanksi penghentian pelayanan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Berdasarkan peraturan perundangan-undangan kehutanan, pemegang PBPH yang lalai dalam melaksanakan kemitraan kehutanan dengan masyarakat sekitar dikenakan sanksi bertahap diawali dengan teguran tertulis.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pemberdayaan masyarakat dan atau kemitraan termasuk dalam",
      option_a: "Format proposal teknis permohonan PBPH",
      option_b: "Pedoman identifikasi dan pemetaan konflik pada PBPH",
      option_c: "Laporan kinerja pemegang PBPH",
      option_d: "Semuanya benar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Komponen pemberdayaan masyarakat dan kemitraan wajib diintegrasikan dalam proposal teknis, pedoman penanganan konflik, serta pelaporan evaluasi kinerja berkala pemegang konsesi PBPH.",
      status: "ACTIVE"
    },

    // --- BENAR / SALAH (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penerapan agroforestry dilaksanakan dengan pemberdayaan masyarakat setempat melalui kemitraan kehutanan antara pemegang PBPH dan masyarakat setempat",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penerapan pola tumpangsari/agroforestri di kawasan hutan produksi diwujudkan melalui skema pemberdayaan lewat kemitraan kehutanan dengan masyarakat lokal.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kemitraan kehutanan diharapkan menjadi bagian untuk meningkatkan kesejahteraan masyarakat di sekitar kawasan hutan, melestarikan hutan, tetapi juga mengurangi konflik di antara masyarakat dengan pemegang konsesi.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kemitraan kehutanan merupakan solusi win-win untuk menyejahterakan masyarakat, menjaga kelestarian hutan, dan meredam konflik tenurial antara korporasi dan warga lokal.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Merancang mekanisme pemantauan dan evaluasi partisipatif tidak termasuk dalam langkah mendorong kemitraan kehutanan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Perumusan mekanisme monitoring dan evaluasi (Monev) secara partisipatif justru merupakan langkah krusial dalam siklus fasilitasi kemitraan kehutanan untuk menjamin keterbukaan dan kepercayaan kedua belah pihak.",
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

  console.log("✅ Successfully inserted all 5 questions for Ren-Comdev and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
