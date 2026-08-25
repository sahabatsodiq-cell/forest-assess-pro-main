import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("=== 1. INSERTING QUESTIONS FOR PUHH-KO (subject_id = 52, competency_unit_id = 467) ===");

  const puhhKoNewQuestions = [
    {
      subject_id: 52,
      competency_unit_id: 467,
      question_text: "Pengangkutan bahan baku pembuatan arang berupa kayu bulat kecil jenis Nangka dari kebun masyarakat ke tungku pembakaran arang kayu menggunakan dokumen :",
      option_a: "SKSHHK",
      option_b: "SAKR",
      option_c: "Nota Angkutan",
      option_d: "SKAU",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengangkutan kayu bulat kecil dari hutan hak/kebun masyarakat menuju tempat pengolahan/pembakaran dilengkapi dengan Surat Angkutan Kayu Rakyat (SAKR).",
      status: "ACTIVE"
    },
    {
      subject_id: 52,
      competency_unit_id: 467,
      question_text: "Setiap pengangkutan kayu olahan berikut ini dari dan/atau ke tempat pengolahan hasil hutan wajib dilengkapi bersama dokumen SKSHHK, kecuali :",
      option_a: "Kayu gergajian",
      option_b: "Kayu Lapis",
      option_c: "Veneer",
      option_d: "Serpih kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kayu lapis merupakan produk olahan lanjutan yang diangkut menggunakan dokumen Nota Perusahaan, bukan SKSHHK.",
      status: "ACTIVE"
    },
    {
      subject_id: 52,
      competency_unit_id: 467,
      question_text: "[Benar / Salah] Pengangkutan arang kayu secara bertahap dari tempat pengolahan hasil hutan yang merupakan lokasi penerbitan SKSHHK ke pelabuhan muat harus menggunakan dokumen SKSHHK",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengangkutan bertahap hasil hutan olahan dari lokasi penerbitan ke pelabuhan muat dilengkapi dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: 52,
      competency_unit_id: 467,
      question_text: "[Benar / Salah] Pengangkutan kayu impor dari pelabuhan ke tempat pengolahan hasil hutan menggunakan dokumen SKSHHK",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengangkutan kayu impor dari pelabuhan muat ke industri pengolahan menggunakan dokumen Nota Angkutan.",
      status: "ACTIVE"
    }
  ];

  for (const q of puhhKoNewQuestions) {
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
    console.log(`[PUHH-KO] Inserted question ID: ${res[0].id}`);
  }

  // Update question_count for CU 467
  await sql`
    UPDATE competency_units
    SET question_count = (SELECT COUNT(*) FROM questions WHERE competency_unit_id = 467)
    WHERE id = 467
  `;


  console.log("\n=== 2. INSERTING QUESTIONS FOR Berat-Arang (subject_id = 60, competency_unit_id = 472) ===");

  // Clean up any existing questions for Berat-Arang first
  await sql`DELETE FROM questions WHERE subject_id = 60`;

  const beratArangQuestions = [
    {
      subject_id: 60,
      competency_unit_id: 472,
      question_text: "[Benar / Salah] Briket arang kayu adalah serbuk arang kayu dan bahan penolong dicetak dengan bentuk dan ukuran tertentu yang dikeraskan melalui proses pengepresan yang digunakan untuk bahan bakar",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengertian briket arang kayu adalah serbuk arang kayu yang dicetak dan dikeraskan untuk keperluan bahan bakar.",
      status: "ACTIVE"
    },
    {
      subject_id: 60,
      competency_unit_id: 472,
      question_text: "[Benar / Salah] Arang kayu adalah kayu yang telah dikarbonisasi pada suhu tinggi lebih kecil atau sama dengan 200°C (derajat celcius) sehingga mempunya nilai kalor bakar dan kadar karbon terikat yang lebih tinggi dari bahan penyusunnya",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Proses pirolisis/karbonisasi arang kayu berlangsung pada suhu tinggi di atas 400°C - 500°C (bukan ≤ 200°C).",
      status: "ACTIVE"
    },
    {
      subject_id: 60,
      competency_unit_id: 472,
      question_text: "[Benar / Salah] Kadar air adalah persentase kandungan air yang terkandung didalam arang hasil proses karbonisasi.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kadar air mengukur rasio/persentase bobot air dalam produk arang hasil pirolisis.",
      status: "ACTIVE"
    },
    {
      subject_id: 60,
      competency_unit_id: 472,
      question_text: "[Benar / Salah] SNI Arang Kayu diatur dalam SNI 1683:2020",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Nomor standar SNI Arang Kayu yang berlaku di Indonesia diatur pada SNI 01-1683-1989 / SNI 8951.",
      status: "ACTIVE"
    },
    {
      subject_id: 60,
      competency_unit_id: 472,
      question_text: "[Benar / Salah] Bahan baku yang digunakan adalah berupa kayu, limbah tebangan, limbah penggergajian kayu tidak termasuk kayu bakau, bekas bangunan dan furniture yang mengandung residu kimia",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Bahan baku arang kayu hendaknya berasal dari kayu/limbah tebangan yang aman dan bebas dari bahan kayu bekas yang terkontaminasi perekat/residu kimia berbahaya.",
      status: "ACTIVE"
    }
  ];

  for (const q of beratArangQuestions) {
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
    console.log(`[Berat-Arang] Inserted question ID: ${res[0].id}`);
  }

  // Update question_count for CU 472
  await sql`
    UPDATE competency_units
    SET question_count = (SELECT COUNT(*) FROM questions WHERE competency_unit_id = 472)
    WHERE id = 472
  `;

  console.log("\n✅ All questions inserted successfully!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
