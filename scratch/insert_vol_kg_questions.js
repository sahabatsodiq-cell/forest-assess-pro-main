import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 50; // Vol-KG
  const competencyUnitId = 465; // A.02GNS01.056.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- BENAR / SALAH (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Toleransi ukuran lebar untuk kayu gergajian daun lebar selain jati adalah < 5 mm.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Standar toleransi penyimpangan ukuran lebar untuk kayu gergajian daun lebar selain jati adalah ≤ 5 mm (bukan strictly < 5 mm).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] penetapan tebal diukur pada bagian ujung sortimen",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengukuran tebal kayu gergajian dilakukan pada bagian kayu yang paling tipis / bebas cacat di sepanjang badan sortimen, bukan hanya di bagian ujung.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] panjang diukur pada jarak antara kedua bontos.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengukuran panjang kayu gergajian dilakukan pada jarak terpendek antara kedua bontos kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Isi dinyatakan dalam satuan meter kubik (m3) dengan 2 angka desimal (dua angka di belakang koma)",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Isi/volume kayu gergajian dinyatakan dalam meter kubik (m³) dengan tingkat pembulatan 4 angka di belakang koma (4 desimal).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] panjang dinyatakan dalam satuan mm atau cm, dengan kelipatan 5 mm.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengukuran panjang kayu gergajian dinyatakan dalam mm atau cm dengan pembulatan kelipatan 5 mm.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Toleransi dimensi ukuran baku kayu gergajian daun lebar adalah sebagai berikut, kecuali :",
      option_a: "tebal ≤ 5 mm",
      option_b: "lebar ≤ 5 mm",
      option_c: "panjang ≤ 50 mm",
      option_d: "panjang ≤ 30 mm",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Toleransi ukuran baku panjang kayu gergajian daun lebar yang berlaku adalah ≤ 50 mm, sehingga 'panjang ≤ 30 mm' adalah pengecualian/jawaban yang salah.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dimensi kayu gergajian meliputi, kecuali :",
      option_a: "Panjang",
      option_b: "Lebar",
      option_c: "Tinggi",
      option_d: "Tebal",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Dimensi geometris kayu gergajian terdiri atas Tebal, Lebar, dan Panjang. 'Tinggi' bukan merupakan istilah parameter dimensi kayu gergajian.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Untuk papan jeblosan, ukuran lebar adalah :",
      option_a: "Lebar tersempit",
      option_b: "Lebar terlebar",
      option_c: "Rata-rata antara lebar tersempit dan lebar terlebar",
      option_d: "Semua jawaban salah",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Berdasarkan standar pengujian papan jeblosan (waney-edged board), lebar dihitung dari rata-rata antara lebar tersempit dan lebar terlebar di permukaan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Yang termasuk peralatan untuk melaksanakan pengukuran dimensi kayu :",
      option_a: "Jangka sorong",
      option_b: "Meteran (pita ukur)",
      option_c: "Loupe",
      option_d: "Kalkulator",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Loupe (kaca pembesar) merupakan alat bantu identifikasi struktur anatomi kayu, bukan alat untuk mengukur dimensi (tebal, lebar, panjang) kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hasil pengukuran lebar sortimen = 12,3 cm , akan dibaca menjadi :",
      option_a: "12,0 cm",
      option_b: "13,0 cm",
      option_c: "12,5 cm",
      option_d: "12,3 cm",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Sesuai aturan pembulatan pengukuran dimensi kayu gergajian, kelebihan ukuran cm yang belum mencapai kelipatan yang ditentukan dibulatkan ke bawah menjadi 12,0 cm.",
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

  console.log("✅ Successfully inserted all 10 questions for Vol-KG and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
