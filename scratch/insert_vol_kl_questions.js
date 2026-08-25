import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 53; // Vol-KL
  const competencyUnitId = 468; // A.02GNS01.059.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- BENAR / SALAH (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Jika tidak dinyatakan dalam perjanjian/kontrak, nilai persyaratan kadar air panel kayu lapis adalah 12 ± 2%.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Standar persyaratan kadar air (MC) panel kayu lapis adalah 12 ± 2% jika tidak ada kesepakatan khusus dalam kontrak.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Panjang dan lebar kayu lapis diukur dengan ketentuan dalam satuan millimeter dengan pembulatan 0,1 mm",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Panjang dan lebar kayu lapis diukur dalam satuan mm utuh atau meter, sedangkan pembulatan 0,1 mm dipergunakan untuk pengukuran tebal.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengukuran tebal kayu lapis dapat menggunakan Roll Meter",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengukuran tebal kayu lapis harus menggunakan jangka sorong (caliper), micrometer, atau dial gauge untuk presisi 0,1 mm.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tebal kayu lapis diukur dengan ketentuan :",
      option_a: "dalam satuan meter dengan pembulatan 0,1 m",
      option_b: "dalam satuan centimeter dengan pembulatan 0,1 cm",
      option_c: "dalam satuan millimeter dengan pembulatan 1 mm",
      option_d: "dalam satuan millimeter dengan pembulatan 0,1 mm",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Berdasarkan standar pengujian kayu lapis, tebal diukur dalam satuan millimeter (mm) dengan tingkat pembulatan/ketelitian 0,1 mm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Perhitungan Volume Partai Kayu lapis yang benar adalah :",
      option_a: "P x L x T x Jumlah lembar/pieces, dengan satuan volume M2",
      option_b: "P x L x T, dengan satuan volume M2",
      option_c: "P x L x T x Jumlah lembar/pieces, dengan satuan volume M3",
      option_d: "P x L x T, dengan satuan volume M3",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Volume total partai kayu lapis dihitung dari hasil perkalian Panjang (m) × Lebar (m) × Tebal (m) × Jumlah Lembar/pieces, dinyatakan dalam meter kubik (m³).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Toleransi panjang atau lebar untuk kayu lapis adalah",
      option_a: "+- 1,5 mm/m atau maksimum +- 3,5 mm",
      option_b: "+- 2 mm/m atau maksimum +- 4 mm",
      option_c: "+- 2,5 mm/m atau maksimum +- 4,5 mm",
      option_d: "+- 3 mm/m atau maksimum +- 5 mm",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Berdasarkan standar SNI kayu lapis, toleransi penyimpangan panjang dan lebar yang diizinkan adalah ± 1,5 mm/m dengan batas maksimum ± 3,5 mm.",
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

  console.log("✅ Successfully inserted all 6 questions for Vol-KL and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
