import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 56; // Mutu-Serpih
  const competencyUnitId = 471; // A.02GNS01.062.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (7 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan kandungan kulit yang diperkenankan untuk serpih kayu maksimal :",
      option_a: "5%",
      option_b: "1,5%",
      option_c: "12%",
      option_d: "2,5%",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Berdasarkan standar SNI mutu serpih kayu, kandungan kulit maksimum yang diperkenankan adalah 1,5%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Ukuran nominal panjang maksimum serpih kayu adalah",
      option_a: "15 mm",
      option_b: "20 mm",
      option_c: "25 mm",
      option_d: "30 mm",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Ukuran nominal panjang maksimum serpih kayu (chip) yang dipersyaratkan adalah 25 mm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan proporsi dimensi serpih kayu kelas serpih kayu ukuran lebih dan serpih kayu tebal adalah :",
      option_a: "Maksimum 10%",
      option_b: "Minimum 10%",
      option_c: "Maksimum 5%",
      option_d: "Minimum 85%",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Toleransi proporsi untuk kelas serpih kayu ukuran lebih (oversize) dan serpih kayu tebal (overthick) dipersyaratkan maksimum 10%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan proporsi dimensi serpih kayu kelas serpih kayu lebar dan serpih kayu kecil yang diterima adalah :",
      option_a: "≥ 80%",
      option_b: "≥ 85%",
      option_c: "≥ 50%",
      option_d: "≥ 75%",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Proporsi serpih kayu kelas lebar dan kecil yang memenuhi syarat (diterima) minimal 85%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan bahan baku serpih kayu tidak diperkenankan adanya :",
      option_a: "Lapuk",
      option_b: "Serpih kayu ukuran lebih ≥ 15%",
      option_c: "Kandungan kulit maksimal 1,5%",
      option_d: "Serbuk kayu",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Bahan baku serpih kayu berkualitas mutlak tidak boleh mengandung kayu lapuk/busuk.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan kadar air maksimum serpih kayu adalah :",
      option_a: "48%",
      option_b: "50%",
      option_c: "60%",
      option_d: "52%",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Standar kadar air maksimum serpih kayu yang dipersyaratkan adalah 48%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan proporsi dimensi serpih kayu kelas serpih kayu ukuran jarum dan serbuk kayu adalah :",
      option_a: "≤ 5%",
      option_b: "≥ 85%",
      option_c: "≥ 5%",
      option_d: "< 75%",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Proporsi serpih kayu ukuran jarum (pin chips) dan serbuk kayu (fines) yang diperbolehkan maksimum 5%.",
      status: "ACTIVE"
    },

    // --- BENAR / SALAH (10 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Persyaratan mutu bahan baku serpih kayu diperkenankan adanya lapuk",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Bahan baku serpih kayu tidak diperkenankan mengandung bagian lapuk/busuk.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Untuk kelas serpih kayu ukuran lebih dan serpih kayu tebal diperkenankan dengan proporsi maksimal 10%",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Proporsi serpih kayu ukuran lebih dan tebal dibatasi maksimal 10%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Persyaratan kandungan kulit yang diperkenankan maksimal 1,5%",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Toleransi maksimal kandungan kulit pada serpih kayu adalah 1,5%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Persyaratan kadar air serpih kayu maksimum 56%",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Kadar air maksimum serpih kayu yang disyaratkan adalah 48% (bukan 56%).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Persyaratan kerapatan tumpukan serpih kayu (bulk density) diperkenankan antara 150 – 170 kg/m3",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Kerapatan tumpukan serpih kayu standar umumnya berada pada kisaran 200 – 400 kg/m³ tergantung jenis kayu baku.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kelas serpih kayu ukuran jarum dan serbuk kayu diperkenankan dengan proporsi maksimal 15%",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Proporsi serpih ukuran jarum dan serbuk kayu diperkenankan maksimal 5% (bukan 15%).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Untuk kelas serpih kayu lebar dan serpih kayu kecil diperkenankan dengan proporsi minimal 85%",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kelas serpih kayu lebar dan kecil merupakan komponen utama serpih kayu yang disyaratkan minimal 85%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Persyaratan mutu bahan baku serpih kayu tidak diperkenankan adanya busuk",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Bahan baku serpih kayu harus dari kayu sehat dan bebas dari cacat busuk.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Klasifikasi serpih kayu berdasarkan ukuran dimensi digolongkan ke dalam 6 kelompok",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penggolongan dimensi serpih kayu dibagi menjadi 6 kelas (ukuran lebih, tebal, lebar, kecil, jarum, dan serbuk).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Serpih kayu adalah partikel kayu yang sehat (tidak diserang jamur atau serangga), tanpa kulit dengan ukuran nominal panjang maksimal 25 mm, lebar 20-30 mm dan tebal 3-5 mm",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Definisi baku serpih kayu adalah partikel kayu sehat tanpa kulit dengan spesifikasi dimensi nominal tersebut.",
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

  console.log("✅ Successfully inserted all 17 questions for Mutu-Serpih and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
