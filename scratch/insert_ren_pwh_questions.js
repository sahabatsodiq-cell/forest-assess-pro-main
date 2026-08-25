import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 15; // Ren-PWH
  const competencyUnitId = 425; // A.02GNS01.015.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN BENAR ATAU SALAH (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rencana pembukaan wilayah hutan tidak harus selalu ada pada RKTPH PBPH.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Rencana pembukaan wilayah hutan (PWH) merupakan prasyarat mutlak yang wajib dicantumkan dalam RKTPH PBPH untuk memastikan aksesibilitas operasional yang legal dan terencana.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kegiatan pembukaan wilayah hutan dilakukan sebelum tahun pertama kegiatan (Et-1) pada seluruh blok/petak yang telah dilakukan inventarisasi sebelum penebangan (cruising).",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kegiatan PWH dilaksanakan pada tahun persiapan (Et-1) sebelum tahun penebangan agar seluruh infrastruktur jalan sarad dan jalan angkut siap digunakan ketika penebangan dimulai.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam perencanaan PWH sangat diperlukan data bentuk wilayah dan kemiringan lahan. Peta topografi yang disarankan adalah peta berskala sedang 1 : 25 000 s.d. 1 : 50 000.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Skala 1 : 25.000 s.d. 1 : 50.000 terlalu kecil/kasar untuk perencanaan mikro tata letak PWH. Perencanaan rute jalan sarad dan angkut memerlukan peta berskala besar (1 : 5.000 s.d. 1 : 10.000) agar detil topografi dan kemiringan lereng terlihat jelas.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut yang bukan merupakan fungsi dari Pembukaan Wilayah Hutan, adalah…",
      option_a: "Mempermudah pengangkutan pekerja, peralatan dan bahan keluar masuk hutan",
      option_b: "Mempermudah perhitungan biaya perlindungan hutan",
      option_c: "Mempermudah kegiatan penanaman",
      option_d: "Mempermudah pengawasan hutan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Fungsi utama PWH mencakup aksesibilitas pekerja, penanaman, pengangkutan logistik/hasil hutan, serta perlindungan/pengawasan hutan. Namun, PWH tidak secara langsung mempermudah perhitungan matematis dari biaya perlindungan hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Jalan yang menghubungkan individu pohon dengan jalan ranting, biasanya memiliki jarak angkut 300-400 m disebut :",
      option_a: "Jalan utama",
      option_b: "Jalan cabang",
      option_c: "Jalan kontur",
      option_d: "Jalan sarad",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Jalan sarad (skidding trail) adalah jalur sementara yang digunakan untuk menarik kayu gelondongan (log) dari tunggul tebangan (lokasi pohon tumbuh) menuju TPn (Tempat Pengumpulan Sementara) atau jalan ranting.",
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

  console.log("✅ Successfully inserted all 5 questions for Ren-PWH and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
