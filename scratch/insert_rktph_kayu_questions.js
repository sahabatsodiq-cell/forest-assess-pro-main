import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 14; // RKTPH-Kayu
  const competencyUnitId = 424; // A.02GNS01.012.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini dasar dalam penyusunan RKTPH, kecuali ….",
      option_a: "Dokumen RKUPH yang telah disetujui",
      option_b: "Rekapitulasi Laporan Hasil Cruising",
      option_c: "Peta penafsiran citra satelit skala 1 : 25.000 berumur paling lama 2 tahun terakhir",
      option_d: "Rekapitulasi hasil identifikasi potensi HHBK dan/atau jasa lingkungan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Peta citra satelit yang digunakan sebagai dasar penyusunan RKTPH menggunakan skala resolusi tinggi/skala operasional sesuai ketentuan teknis yang berlaku.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sejak tahun 2022, proses pengajuan dan persetujuan RKTPH untuk seluruh pemegang PBPH dilakukan secara mandiri melalui system informasi. Apakah system informasi yang dimaksud?",
      option_a: "SIPUHH",
      option_b: "SICAKAP",
      option_c: "SEHATI",
      option_d: "EMONEV KINERJA PHA",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "SICAKAP (Sistem Informasi Perencanaan dan Kinerja Pemanfaatan Hutan) adalah sistem informasi resmi KLHK untuk penyusunan dan pengajuan RKTPH mandiri.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini susunan format Rencana Kerja Tahunan Pemanfaatan Hutan :\n1. Halaman judul\n2. Halaman Pakta Integritas\n3. Halaman Persetujuan\n4. Rencana Kerja Tahunan Pemanfaatan Hutan\n5. Peta\nUrutan yang benar format Rencana Kerja Tahunan Pemanfaatan Hutan adalah ….",
      option_a: "1,3,2,5,4",
      option_b: "1,3,2,4,5",
      option_c: "3,2,1,4,5",
      option_d: "1,2,3,4,5",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Sistematika dokumen RKTPH yang benar dimulai dari (1) Halaman Judul, (3) Halaman Persetujuan, (2) Pakta Integritas, (4) Batang Tubuh Dokumen RKTPH, dan (5) Lampiran Peta.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam hal terdapat rencana kegiatan yang tidak dapat direalisasikan sesuai RKTPH tahun berjalan, maka dapat diusulkan kembali tanpa mengurangi target RKTPH tahun berikutnya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kegiatan yang belum terealisasi pada tahun berjalan dapat dimasukkan kembali pada RKTPH tahun berikutnya sesuai ketentuan peraturan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Jangka waktu RKTPH berlaku mulai 1 Januari sampai dengan tanggal 1 Januari tahun berikutnya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Jangka waktu RKTPH berlaku selama 1 (satu) tahun anggaran, yaitu mulai tanggal 1 Januari sampai dengan tanggal 31 Desember tahun berjalan.",
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

  console.log("✅ Successfully inserted all 5 questions for RKTPH-Kayu and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
