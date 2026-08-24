import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 9; // Lap-Kurpet
  const competencyUnitId = 418; // A.02GNS01.007.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Peta merupakan sebagai alat penting dalam geografi karena mempunyai beberapa fungsi kecuali ….",
      option_a: "Menunjukan posisi atau lokasi suatu wilayah di permukaan bumi",
      option_b: "Menggambarkan bentuk berbagai gejala di permukaan bumi",
      option_c: "Menggambarkan kondisi fisik dan kondisi sosial suatu wilayah",
      option_d: "Sebagai pendukung kegiatan pemerintahan",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Fungsi utama peta dalam ilmu geografi adalah menyajikan data spasial (posisi, fenomena fisik & sosial, bentuk muka bumi), bukan fungsi administratif pemerintahan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Peta sebagai alat bantu dalam mengkaji geografi. Ahli dalam pembuatan peta disebut dengan ...",
      option_a: "Seismograf",
      option_b: "Theograf",
      option_c: "Petagrafer",
      option_d: "Kartograf",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Kartograf adalah sebutan bagi ahli atau profesional yang berkecimpung dalam bidang pemetaan (kartografi).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Peta Umum dan Khusus :\n1) Chorografi\n2) Persebaran Penduduk\n3) Rupa bumi\n4) Cuaca dan Iklim\n5) Geologi\n6) Regional\n7) Flora dan Fauna\n8) Kesuburan tanah\nDari pernyataan diatas yang merupakan peta khusus ada pada nomor …",
      option_a: "1, 2 dan 3",
      option_b: "1, 3 dan 4",
      option_c: "3, 5 dan 7",
      option_d: "5, 7 dan 8",
      correct_answer: "D",
      difficulty: "MEDIUM",
      explanation: "Peta tematik/khusus menyajikan informasi tema tertentu secara spesifik, seperti Peta Geologi (5), Peta Flora dan Fauna (7), serta Peta Kesuburan Tanah (8).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada peta topografi/rupa bumi tampak garis kontur yang rapat, hal ini menunjukan tentang",
      option_a: "Daerah tersebut wilayah yang landai",
      option_b: "Daerah tersebut wilayah yang terjal",
      option_c: "Daerah tersebut wilayah yang berbukit-bukit",
      option_d: "Daerah tersebut wilayah yang berlembah",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kerapatan garis kontur menggambarkan kemiringan lereng. Garis kontur yang semakin rapat menandakan daerah yang semakin curam/terjal.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Keterangan dari simbol-simbol merupakan defenisi dari komponen peta …",
      option_a: "Inset",
      option_b: "Legenda",
      option_c: "Simbol",
      option_d: "Orientasi",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Legenda adalah bagian dari komponen peta yang memuat penjelasan/keterangan atas simbol-simbol yang digunakan pada muka peta.",
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

  console.log("✅ Successfully inserted all 5 questions for Lap-Kurpet and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
