import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 17; // Ren-Tebang
  const competencyUnitId = 427; // A.02GNS01.017.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN BENAR ATAU SALAH (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Berdasarkan Permen LHK Nomor 8 Tahun 2021, informasi alat-alat pemanenan kayu dituangkan dalam RKTPH PBPH.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Regulasi Permen LHK No. 8/2021 mewajibkan pencantuman jenis, kapasitas, dan jumlah alat pemanenan kayu yang ramah lingkungan dalam penyusunan dokumen RKTPH PBPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kegiatan penebangan dilakukan berdasarkan peta sebaran pohon binaan skala 1:1.000 dan dilaksanakan pada petak tebangan dalam blok RKTPH yang telah disahkan/disetujui.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penebangan pohon harus terkendali (Reduced Impact Logging) berbasis peta pohon skala 1:1.000 hasil kegiatan cruising (ITSPS) pada petak tebangan yang sah secara administratif.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut merupakan tujuan pemanenan hutan, kecuali …",
      option_a: "Mendapatkan produk hasil hutan yang dibutuhkan masyarakat",
      option_b: "Membuka akses wilayah",
      option_c: "Meningkatkan kemampuan regenerasi tanaman",
      option_d: "Memberi kesempatan kerja bagi masyarakat di sekitar hutan.",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pemanenan hutan berpotensi mengganggu atau merusak sebagian tanaman muda/permudaan alam di sekitarnya. Tujuannya adalah pemanfaatan kayu, pembukaan akses, dan penyediaan lapangan kerja, bukan secara langsung meningkatkan kemampuan regenerasi tanaman secara biologis.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sistem pemanenan kayu berdasarkan sortimen, dimana batang dipotong sesuai optimalisasi disebut..",
      option_a: "Tree length",
      option_b: "Full tree",
      option_c: "Long wood",
      option_d: "Cut to length",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Cut-to-Length (CTL) adalah sistem pemanenan kayu di mana pohon langsung dipotong menjadi sortimen tertentu (log dengan ukuran komersial) di dekat tunggul tebangan sebelum diangkut ke TPn.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penetapan lokasi TPn dilarang pada…",
      option_a: "Kawasan dengan nilai konservasi tinggi",
      option_b: "Areal landai, pada punggung bukit",
      option_c: "Kawasan hutan produksi",
      option_d: "Berjarak lebih dari 1 km dari sungai",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "TPn (Tempat Pengumpulan Sementara) dilarang keras dibangun pada area lindung, kawasan bernilai konservasi tinggi (HCVF), sempadan sungai, atau lereng curam guna mencegah degradasi lingkungan dan erosi tanah.",
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

  console.log("✅ Successfully inserted all 5 questions for Ren-Tebang and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
