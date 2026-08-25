import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  const subjectId = 26; // Jenis-Batang
  const competencyUnitId = 437; // A.02GNS01.027.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rotan Merupakan salah satu Hasil Hutan Bukan Kayu Kelompok ?",
      option_a: "Resin",
      option_b: "Getah",
      option_c: "Batang",
      option_d: "Kulit",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Berdasarkan pengelompokan HHBK (Hasil Hutan Bukan Kayu), rotan dan bambu diklasifikasikan ke dalam kelompok HHBK jenis Batang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dibawah ini yang merupakan Bukan Kelompok Batang !",
      option_a: "rotan",
      option_b: "nira",
      option_c: "bambu",
      option_d: "Karet",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Karet (latex) termasuk dalam HHBK kelompok Getah, sedangkan rotan, nira (sagu/palm), dan bambu memanfaatkan struktur batang atau cairan batang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Iklim subtropis dan tropis yang ada di hutan Indonesia merupakan habitat tumbuh yang cocok ?",
      option_a: "Sagu",
      option_b: "nira",
      option_c: "bambu",
      option_d: "Rotan",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Hutan tropis dan subtropis di Indonesia merupakan habitat alami paling subur bagi keanekaragaman spesies rotan di dunia.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini yang Bukan Karakteristik Rotan adalah !",
      option_a: "Memiliki batang silindris",
      option_b: "Serat batang tidak kokoh dan Rapuh",
      option_c: "Tekstur batangnya halus",
      option_d: "Memiliki ruas batang yang lebih samar",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Salah satu keunggulan utama serat batang rotan adalah sangat liat, ulet, kuat, dan elastis (tidak mudah patah/rapuh).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rotan memiliki warna khas, Kecuali ?",
      option_a: "Putih Kuning",
      option_b: "Coklat",
      option_c: "Hijau",
      option_d: "Hitam",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Warna rotan olahan alami pada umumnya bervariasi dari putih kekuningan, coklat muda/tua, hingga kehitaman. Hijau merupakan warna rotan mentah sebelum dikupas/diolah.",
      status: "ACTIVE"
    },

    // --- PILIHAN BENAR ATAU SALAH (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rotan adalah tanaman yang tumbuh merambat dari keluarga Palmae ?",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Rotan merupakan sekelompok palma (suku Arecaceae / Palmae) yang tumbuh memanjat atau merambat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rotan dikenal sebagai tanaman yang tumbuh cepat secara merambat ?",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Rotan dapat tumbuh dengan sangat cepat merambat pada pohon penopang di hutan tropis.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rotan sering sekali dikatakan mirip dengan bambu !",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Rotan dan bambu memiliki kemiripan fisik pada struktur batang beruas, namun rotan memiliki bagian dalam pejal (padat), sedangkan bambu berongga.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rotan Sintetis biasanya hanya menghasilkan warna-warna alami atau natural !",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Rotan sintetis yang berbahan dasar plastik (PE/PPC) justru diproduksi dengan variasi warna yang sangat luas (pastel, neon, monokrom) dan tidak terbatas pada warna alami saja.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rotan merupakan komoditas hasil hutan kayu !",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Rotan diklasifikasikan secara resmi sebagai komoditas Hasil Hutan Bukan Kayu (HHBK).",
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

  console.log("✅ Successfully inserted all 10 questions for Jenis-Batang and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
