import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 19; // Was-Sarad
  const competencyUnitId = 429; // A.02GNS01.019.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN BENAR ATAU SALAH (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pada operasi penyaradan, apabila penyaradan dilakukan dengan traktor, disarankan menggunakan skidder ukuran sedang yang dilengkapi winch dan arch atau arch integral atau fairlead.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penggunaan skidder berukuran sedang yang dilengkapi winch dan arch (tiang/lengkungan penarik) sangat disarankan untuk menjaga efisiensi penarikan log sekaligus meminimalkan gesekan log dengan tanah.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Jalan sarad berukuran paling lebar 4 m (empat meter) dan diupayakan sedekat mungkin dengan TPn.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Batas maksimal lebar jalan sarad adalah 4 meter untuk menekan tingkat kerusakan tanah akibat alat berat, serta posisinya diatur seefisien mungkin menuju TPN.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] saat penarikan kayu dalam kegiatan penyaradan, bagian ujung/pangkal kayu sejajar dengan tanah.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Saat penyaradan, bagian depan (ujung/pangkal) kayu harus diangkat sedikit dari permukaan tanah (suspended logging) menggunakan winch/arch traktor agar log tidak menancap di tanah, mengurangi gaya gesek traktor, dan mencegah kerusakan parah pada tanah atas (top soil).",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Alternatif alat penyaradan kayu SILIN yang hanya bisa dilakukan pada areal datar/landai (kemiringan 0-15%), adalah :",
      option_a: "Manual/gravitas",
      option_b: "monorel",
      option_c: "traktor",
      option_d: "feller buncher / harvester.",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Penyaradan sistem SILIN (Silvikultur Intensif) di areal datar/landai sering menggunakan alternatif monorel karena ramah lingkungan, tidak merusak tanah hutan, dan sangat efisien untuk memindahkan log berdiameter kecil-sedang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hal yang tidak termasuk dalam tahapan konstruksi TPN dan jalan sarad dalam penerapan RIL adalah …",
      option_a: "Dimulai sebelum pembukaan TPN, jalan sarad dan penebangan",
      option_b: "Dilakukan oleh tim penyarad",
      option_c: "Gali timbun di jalan sarad hanya dilakukan jika sangat perlu",
      option_d: "Kayu dan cabang yang tidak dikeluarkan dimanfaatkan untuk menutupi permukaan jalan sarad.",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Dalam RIL (Reduced Impact Logging), konstruksi TPN dan jalan sarad berjalan seiring atau bagian dari pembukaan wilayah tebangan (PWH), bukan merupakan tahapan terpisah yang dimulai sebelum pembukaan itu sendiri dilakukan.",
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

  console.log("✅ Successfully inserted all 5 questions for Was-Sarad and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
