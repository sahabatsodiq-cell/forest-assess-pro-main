import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 11; // Lak-Inven
  const competencyUnitId = 421; // A.02GNS01.009.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini merupakan peralatan kerja yang diperlukan dalam kegiatan Inventarisasi tegakan Hutan, kecuali …..",
      option_a: "Kompas/GPS",
      option_b: "ID Barcode",
      option_c: "Buku tally sheet",
      option_d: "Tabel volume pohon.",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Tabel volume pohon digunakan pada tahap pengolahan data/perhitungan volume, bukan peralatan lapangan utama kegiatan cruising/inventarisasi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penentuan titik ikat pada peta berupa bentuk-bentuk fisik permanen seperti simpang sungai, simpang jalan, jembatan atau landmark lainnya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Titik ikat (reference point) harus berupa fitur geografis permanen dan mudah diidentifikasi di lapangan serta peta.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengukuran azimuth dari titik ikat dapat dilakukan dengan menggunakan GPS",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Sudut azimuth/sudut jurusan diukur menggunakan kompas bidik (kompas Silva/Suunto), sedangkan GPS digunakan untuk koordinat posisi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini adalah ketentuan pemasangan label pohon adalah ….",
      option_a: "Pemasangan label pohon hanya dilakukan pada pohon jenis komersiil",
      option_b: "Label pohon dipasang pada ketinggian 15 cm diatas lingkar pengukuran diameter",
      option_c: "Label dipasang di menghadap ke Utara",
      option_d: "Label terbuat dari material plastik berukuran 8 cm x 5 cm",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pemasangan plat/label pohon dipaku pada ketinggian 15 cm di atas batas lingkar pengukuran diameter (DBH) agar tidak mengganggu pita ukur.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Hasil Laporan Hasil Cruising (LHC) dibuat Rekapitulasi LHC yang memuat informasi jenis kayu yang dilindungi dan kayu yang siap tebang.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Rekapitulasi LHC memuat rincian rekapitulasi pohon siap tebang, pohon inti, pohon dilindungi, dan pohon sarang.",
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

  console.log("✅ Successfully inserted all 5 questions for Lak-Inven and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
