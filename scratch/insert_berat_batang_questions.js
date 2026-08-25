import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  const subjectId = 27; // Berat-Batang
  const competencyUnitId = 438; // A.02GNS01.028.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Batang rotan yang berasal dari rotan mentah yang telah mengalami pembersihan dan peruntian tetapi belum mengalami pencucian dan perlakuan pengolahan lebih lanjut disebut",
      option_a: "Rotan Bundar",
      option_b: "Rotan Asalan",
      option_c: "Rotan Bundar W&S",
      option_d: "Rotan Merah",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Rotan asalan merupakan sebutan bagi batang rotan mentah yang baru dibersihkan dari pelepah/duri (dirunti) namun belum diproses cuci, belerang (W&S), atau pengolahan lanjutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Batang rotan yang dibentuk secara khusus melalui mesin pembentuk dengan pisau matahari disebut !",
      option_a: "Rotan Bundar",
      option_b: "Rotan Asalan",
      option_c: "Rotan Bentukan",
      option_d: "Rotan Merah",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Rotan bentukan (shaped rattan) adalah batang rotan yang diproses secara mekanis menggunakan mesin dengan pisau khusus (pisau matahari) untuk mendapatkan kelurusan dan profil diameter tertentu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rotan dengan diameter 18 mm atau lebih disebut !",
      option_a: "Rotan Bundar",
      option_b: "Rotan Asalan",
      option_c: "Rotan Bentukan",
      option_d: "Rotan Berdiameter Besar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Berdasarkan standar pengujian rotan, rotan dengan ukuran diameter pangkal/tengah ≥ 18 mm dikelompokkan ke dalam kategori Rotan Berdiameter Besar.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rotan bundar W & S dengan panjang kurang dari 1 m disebut !",
      option_a: "Rotan Bundar",
      option_b: "Rotan Berdiameter Kecil",
      option_c: "Rotan Bentukan",
      option_d: "Rotan Berdiameter Besar",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Rotan bundar yang telah mengalami pengasapan (Washed & Sulfurized / W&S) berukuran pendek (< 1 m) umumnya dipilah sebagai rotan potongan/berdiameter kecil dalam perdagangan sortimen rotan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dibawah ini yang bukan merupakan Klasifikasi rotan berdasarkan sortimen adalah !",
      option_a: "Rotan Bundar W & S",
      option_b: "Rotan Bundar Kupasan",
      option_c: "Rotan Bentukan",
      option_d: "Rotan Berdiameter Besar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Rotan Berdiameter Besar merupakan pengelompokan berdasarkan Ukuran (dimensi/diameter), bukan berdasarkan bentuk sortimen pengolahan (seperti W&S, Kupasan, atau Bentukan).",
      status: "ACTIVE"
    },

    // --- PILIHAN BENAR ATAU SALAH (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rumus dibawah ini untuk merupakan salah satu untuk menentukan Berat Jenis Rotan. Berat Jenis : BJ = (berat kering tanur) / (volume kering Udara)",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Perhitungan berat jenis (BJ) rotan secara fisik memperhitungkan perbandingan antara massa kering tanur dengan volume pada kondisi kering udara.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rumus dibawah ini untuk merupakan salah satu untuk menentukan Kadar Air Rotan. KA = (berat awal – berat oven) – (berat oven)",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Rumus penentuan Kadar Air (KA) rotan yang benar adalah persentase rasio selisih berat awal dan berat kering oven terhadap berat kering oven: KA = [(berat awal - berat oven) / (berat oven)] x 100%.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Cara menentukan penyusutan volume pada rotan dengan menggunakan rumus di bawah ini. Susut Berat = {[ berat awal – berat akhir] / [berat awal]} x 100 %",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Rumus yang ditampilkan adalah rumus penyusutan Berat, bukan penyusutan Volume (yang seharusnya berbasis perubahan dimensi volume awal dan akhir).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Cara menentukan penyusutan Berat pada rotan dengan menggunakan rumus di bawah ini. Susut Volume = {[volume awal – volume akhir] / [volume awal]} x 100 %",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Rumus yang ditampilkan adalah rumus penyusutan Volume, bukan penyusutan Berat (yang seharusnya berbasis selisih massa/berat).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Klasifikasi Rotan berdasarkan ukuran antara lain rotan bundar berdiameter besar dan rotan bundar berdiameter Kecil.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengelompokan rotan berdasar kriteria ukuran dimensi diameter secara umum dibagi dua, yaitu rotan berdiameter besar (≥ 18 mm) dan berdiameter kecil (< 18 mm).",
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

  console.log("✅ Successfully inserted all 10 questions for Berat-Batang and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
