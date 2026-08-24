import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 13; // RPHJP-Kayu
  const competencyUnitId = 423; // A.02GNS01.011.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengumpulan data-data areal yang terlibat konflik dan tumpang tindih dengan kawasan sangat penting dalam rangka Penataan Areal Kerja",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Identifikasi dan pengumpulan data areal tumpang tindih/konflik sangat krusial untuk penataan ruang areal kerja (PAK) dan penetapan zona pengelolaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hasil inventarisasi hutan dilakukan identifikasi dan analisa berdasarkan atas kriteria berikut ini, kecuali …….",
      option_a: "500 m dari tepi waduk atau danau",
      option_b: "500 m dari tepi mata air dan kiri kanan sungai di daerah rawa",
      option_c: "50 m dari kiri kanan tepi anak sungai",
      option_d: "100 m dari kiri kanan tepi sungai",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Berdasarkan aturan kawasan lindung/sempadan, kawasan sekitar mata air berjarak radius 200 m (atau 50-100 m sempadan sungai), bukan 500 m di daerah rawa.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Hasil identifikasi dan analisis areal kerja dilakukan untuk mendapatkan informasi mengenai Kawasan Fungsi Lindung Ekosistem Gambut",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Analisis areal kerja berfungsi mengidentifikasi kawasan lindung termasuk Kawasan Fungsi Lindung Ekosistem Gambut (KFLEG) agar tidak masuk dalam blok tebangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini adalah Sistem silvikultur dalam pemanfaatan hasil hutan kayu yang bertujuan meningkatkan produktivitas tegakan melalui penggunaan bibit unggul dan manipulasi lingkungan adalah …",
      option_a: "Sistem Silvikultur Tebang Jalur Tanam Indonesia",
      option_b: "Sistem Silvikultur Tebang Pilih Tanam Jalur",
      option_c: "Sistem Silvikultur Intensif",
      option_d: "Sistem Silvikultur Tebang Habis Permudaan Buatan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Sistem Silvikultur Intensif (SILIN) menggabungkan pemuliaan tanaman (bibit unggul), manipulasi lingkungan, dan pemeliharaan intensif untuk meningkatkan produktivitas tegakan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Usulan RKUPH diajukan paling lambat ……. sebelum berakhirnya masa berlaku RKUPH berjalan.",
      option_a: "12 bulan",
      option_b: "6 bulan",
      option_c: "5 bulan",
      option_d: "18 bulan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Usulan Rencana Kerja Usaha Pemanfaatan Hutan (RKUPH) sepuluh tahunan diajukan paling lambat 12 bulan sebelum berakhirnya masa berlaku RKUPH berjalan.",
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

  console.log("✅ Successfully inserted all 5 questions for RPHJP-Kayu and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
