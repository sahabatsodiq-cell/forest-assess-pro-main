import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 44; // Ren-Binhut
  const competencyUnitId = 459; // A.02GNS01.046.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dibawah ini merupakan kewajiban GANISPH, kecuali:",
      option_a: "mematuhi ketentuan peraturan perundang-undangan sesuai dengan profesi dan penugasannya",
      option_b: "melaksanakan pekerjaan sesuai dengan perintah atasan",
      option_c: "melaksanakan tugas sesuai dengan profesi dan penugasannya",
      option_d: "membuat dan menyampaikan laporan yang menguraikan secara jelas tentang pelaksanaan pekerjaan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kewajiban GANISPH diatur secara profesional dalam peraturan perundang-undangan kehutanan (profesi mandiri yang memiliki tanggung jawab hukum atas kebenaran teknis hasil kerjanya), bukan sekedar menuruti segala perintah atasan jika perintah tersebut melanggar hukum kehutanan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Di bawah ini yang termasuk kegiatan Pembinaan Hutan yaitu:",
      option_a: "pembuatan persemaian, pengadaan bibit, penanaman, pemeliharaan",
      option_b: "pembukaan wilayah, pembuatan persemaian, pemeliharaan",
      option_c: "pengadaan bibit, penanaman, pemeliharaan, inventarisasi tegakan sebelum penebangan",
      option_d: "inventarisasi, pembukaan wilayah, pembuatan persemaian",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Kegiatan pembinaan hutan (silvikultur) secara umum meliputi pembuatan persemaian, penyediaan/pengadaan bibit, penanaman, dan pemeliharaan tegakan hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Evaluasi dan perubahan RKUPH dapat dipertimbangkan jika terjadi hal-hal berikut ini, kecuali:",
      option_a: "Perubahan sistem dan teknik silvikultur",
      option_b: "Perubahan dalam sistem manajemen",
      option_c: "Perubahan terhadap kondisi fisik sumber daya hutan yang disebabkan oleh faktor manusia maupun faktor alam",
      option_d: "Penambahan atau perubahan jenis kegiatan usaha (multiusaha) dengan dilengkapi penyesuaian atau perubahan dokumen lingkungan",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Evaluasi & revisi dokumen RKUPH diajukan akibat perubahan kondisi fisik hutan (kebakaran, hama, bencana alam), perubahan sistem silvikultur, atau multiusaha. Perubahan manajemen internal perusahaan tidak menjadi dasar hukum revisi RKUPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tujuan Multi Sistem Silvikultur (MSS) adalah:",
      option_a: "Meningkatkan nilai ekonomi pemanfaatan/ pengusahaan hutan",
      option_b: "Meningkatkan produktivitas hasil hutan serta meningkatkan nilai finansial dan ekonomi pemanfaatan/pengusahaan hutan",
      option_c: "Meningkatkan produktivitas lahan",
      option_d: "Mengoptimalkan hasil hutan dan pelestarian hutan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Multi Sistem Silvikultur bertujuan untuk mengoptimalkan pemanfaatan ruang tumbuh guna meningkatkan nilai finansial dan produktivitas hasil hutan secara lestari.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dasar pemilihan teknik silvikultur sebagai berikut, yaitu:",
      option_a: "Luas areal kerja",
      option_b: "Jangka waktu PBPH",
      option_c: "Kondisi fisik sumber daya hutan",
      option_d: "Umur tegakan dan sistem pemanenan hutan",
      correct_answer: "D",
      difficulty: "MEDIUM",
      explanation: "Dasar penetapan sistem/teknik silvikultur di antaranya bertumpu pada karakteristik tegakan (umur tegakan) serta metode penebangan/pemanenan hutan yang direncanakan.",
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

  console.log("✅ Successfully inserted all 5 questions for Ren-Binhut and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
