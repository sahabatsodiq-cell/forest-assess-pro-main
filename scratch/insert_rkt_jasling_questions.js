import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 43; // RKT-JaslingWA
  const competencyUnitId = 456; // A.02GNS01.045.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKT disahkan oleh Direktur Jenderal",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. RKT disahkan langsung oleh pemegang PHBP secara mandiri (self approval) melalui sistem informasi (SICAKAP).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Rencana Pembangunan sarana – prasarana mengacu pada RKT",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Dokumen RKT justru menjabarkan pelaksanaan rencana pembangunan sarpras tahunan yang mengacu pada dokumen perencanaan induk (Desain Tapak, DED).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Survey kepuasan pelanggan penting dilakukan sebagai dasar evaluasi dan performa produk wisata lama",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kepuasan pelanggan menjadi indikator utama evaluasi pengelolaan wisata alam dan acuan perencanaan di RKT.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penyusunan RKT mengacu pada proyeksi trend wisata dan disesuaikan dengan aspek/kaidah wisata alam agar jumlah kunjungan meningkat",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Tren wisata alam dapat menjadi salah satu pertimbangan dalam menyusun rencana kegiatan tahunan di RKT.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Daya tampung ekosistem tidak perlu dimuat dalam pemasaran program/paket wisata cukup dicantumkan dalam RKT",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Informasi daya tampung ekosistem (carrying capacity) wajib disampaikan kepada wisatawan agar prinsip edukasi dan konservasi terjaga.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] To Do, To See, To buy adalah aktivitas khas yang ada pada wisata alam, strategi pelaksanaan yang tertuang dalam RKT tidak harus memuat ketiga aktivitas tersebut",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Elemen To Do, To See, dan To Buy adalah potensi utama wisata alam yang harus dikemas secara terpadu dan dijabarkan di RKT.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Tujuan khusus edukasi konservasi adalah tujuan utama yang harus dimunculkan dalam RKT",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Sesuai prinsip wisata alam di kawasan hutan, edukasi konservasi merupakan tujuan utama yang harus tertuang di RKT.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pemenuhan sumber daya manusia yang berperan dalam pengelolaan wisata alam harus memperhatikan kapasitas masyarakat sekitar dan apabila diperlukan maka dalam RKT harus memuat peningkatan kapasitas SDM",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pemberdayaan dan peningkatan kapasitas SDM masyarakat lokal merupakan bagian dari program RKT sekaligus strategi resolusi konflik.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKT bisa disusun setelah masa berlaku RKT periode sebelumnya berakhir",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. RKT tahun berikutnya wajib disusun dan disahkan paling lambat 2 bulan sebelum periode RKT berjalan berakhir.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Apabila terdapat perluasan wilayah maka cukup dijabarkan dalam RKT",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Perluasan/perubahan wilayah perizinan harus melalui mekanisme amandemen izin PHBP, revisi RKU, dan perbaikan RPHJP.",
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

  console.log("✅ Successfully inserted all 10 questions for RKT-JaslingWA and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
