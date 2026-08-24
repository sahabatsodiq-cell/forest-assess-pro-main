import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 12; // Lap-Inven
  const competencyUnitId = 422; // A.02GNS01.010.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Laporan Hasil Cruising (LHC) merupakan hasil pengolahan data pohon dari pelaksanaan kegiatan ITSP pada petak kerja tebangan yang memuat nomor pohon, jenis, diameter, tinggi pohon total, dan taksiran volume kayu",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. LHC memuat rincian data pohon hasil cruising/ITSP (nomor pohon, jenis, DBH, tinggi, dan taksiran volume).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini merupakan kelompok jenis Meranti sesuai dengan Keputusan Menteri Kehutanan Nomor : 163/Kpts-II/2003 tentang Pengelompokkan Jenis Kayu sebagai Dasar Pengenaan Iuran Kehutanan, kecuali ……",
      option_a: "Jelutung",
      option_b: "Mahang",
      option_c: "Durian",
      option_d: "Meranti Merah",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Mahang tergolong dalam kelompok jenis kayu Rimba Campuran / jenis kayu lokal non-komersial utama, bukan kelompok Meranti.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hasil inventarisasi tegakan di lapangan diketahui TBC tegakan sengon 15 m, diameter 0,54 m. Dengan memperhatikan factor angka bentuk 0,6, berapakah kelas diameter jenis Sengon tersebut ?",
      option_a: "10-19 cm",
      option_b: "20 -29 cm",
      option_c: "40 – 49 cm",
      option_d: "50 – 59 cm",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Diameter 0,54 m = 54 cm. Dalam pengelompokan kelas diameter kayu, 54 cm masuk dalam rentang kelas diameter 50 – 59 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hasil inventarisasi tegakan di lapangan diketahui TBC tegakan sengon 15 m, diameter 0,54 m. Dengan memperhatikan factor angka bentuk 0,6, berapakah taksiran volume tegakan Sengon sebagai target dalam RKTPH?",
      option_a: "1,6489 m³",
      option_b: "1,1542 m³",
      option_c: "2,0612 m³",
      option_d: "1,8550 m³",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Perhitungan volume pohon: V = 1/4 × π × d² × h × f = 0,25 × 3,14159 × (0,54)² × 15 × 0,6 = 1,1542 m³.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Hasil Laporan Hasil Cruising (LHC) dibuat Rekapitulasi LHC yang memuat informasi jenis kayu yang dilindungi, pohon induk dan kayu yang siap tebang.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Rekapitulasi LHC memuat ringkasan data pohon siap tebang, pohon inti/induk, dan jenis pohon yang dilindungi.",
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

  console.log("✅ Successfully inserted all 5 questions for Lap-Inven and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
