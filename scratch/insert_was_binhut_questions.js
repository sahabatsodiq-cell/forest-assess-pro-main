import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 45; // Was-Binhut (Pengawasan Kegiatan Pembinaan Hutan)
  const competencyUnitId = 460; // A.02GNS01.047.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "GANISPH Pembinaan Hutan (BINHUT) memiliki fungsi kunci utama, yaitu…",
      option_a: "Merencanakan, mengawasi, dan melaporkan pembinaan hutan",
      option_b: "Menebang, mengangkut, dan memasarkan hasil hutan",
      option_c: "Merencanakan, mengawasi, dan mengevaluasi kegiatan pembinaan hutan",
      option_d: "Mengelola, membina, dan mengawasi masyarakat sekitar hutan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Fungsi kunci GANISPH Pembinaan Hutan mencakup perencanaan, pengawasan, serta evaluasi pelaksanaan kegiatan pembinaan hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam melaksanakan tugas pengawasan kegiatan pembinaan hutan, GANISPH Pembinaan Hutan harus memahami dan menerapkan…",
      option_a: "Hanya regulasi kehutanan",
      option_b: "Regulasi dan standar teknis secara tepat",
      option_c: "Hukum adat setempat",
      option_d: "Kebijakan internal tim",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "GANISPH wajib memahami serta menerapkan seluruh regulasi kehutanan dan standar teknis pembinaan hutan yang berlaku secara rinci dan tepat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu objek pengawasan yang dilakukan oleh GANISPH Pembinaan Hutan adalah aktivitas…",
      option_a: "Keberhasilan penanaman dan pemeliharaan tanaman",
      option_b: "Pembuatan peta kawasan hutan",
      option_c: "Pengukuran diameter pohon",
      option_d: "Penentuan harga kayu",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Objek pengawasan utama pembinaan hutan adalah pelaksanaan dan persen keberhasilan penanaman serta pemeliharaan tanaman hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "GANISPH Pembinaan Hutan dalam melaksanakan pengawasan wajib membuat laporan pelaksanaan tugas dengan frekuensi… …",
      option_a: "Paling sedikit 1 kali dalam 1 tahun",
      option_b: "Paling sedikit 1 kali dalam 1 bulan",
      option_c: "Paling sedikit 1 kali dalam 3 bulan",
      option_d: "Paling sedikit 1 kali dalam 6 bulan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Sesuai ketentuan pelaporan GANISPH, laporan pelaksanaan tugas pengawasan wajib disusun dan disampaikan paling sedikit 1 kali dalam sebulan (bulanan).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "GANISPH Pembinaan Hutan (BINHUT) bertugas pada jenis perizinan berikut, KECUALI…",
      option_a: "Perizinan Berusaha Pengolahan Hasil Hutan (PBPHH)",
      option_b: "Perizinan Berusaha Pemanfaatan Hutan (PBPH)",
      option_c: "Persetujuan pengelolaan perhutanan sosial",
      option_d: "Persetutujuan penggunaan kawasan hutan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "PBPHH adalah perizinan untuk industri pengolahan kayu (dikawal GANISPH Pengolahan/PBPHH), bukan pada bidang pembinaan hutan (hulu/tapak).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam konteks pengawasan kegiatan pembinaan hutan, yang dimaksud dengan \"pembinaan hutan\" adalah…",
      option_a: "Kegiatan penebangan dan pemanenan kayu",
      option_b: "Kegiatan pengelolaan hutan yang bertujuan untuk meningkatkan kualitas dan kelestarian hutan",
      option_c: "Kegiatan pembuatan jalan di dalam hutan",
      option_d: "Kegiatan penjualan hasil hutan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pembinaan hutan merujuk pada seluruh upaya silvikutur dan pemeliharaan untuk meningkatkan kualitas tegakan, nilai potensi, dan kelestarian fungsi hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu elemen penting dalam pengawasan kegiatan pembinaan hutan adalah pemantauan dampak terhadap…",
      option_a: "Harga kayu di pasar",
      option_b: "Tanah dan air akibat pemanfaatan hutan",
      option_c: "Nilai ekonomi pemanfaatan hutan",
      option_d: "Kebijakan ketenagakerjaan di lingkungan perusahaan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengawasan pembinaan hutan juga mencakup pengawasan terhadap dampak ekologis/lingkungan, seperti pencegahan erosi tanah dan perbaikan daerah aliran air.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "GANISPH Pembinaan Hutan dalam melaksanakan pengawasan harus memiliki kemampuan untuk melakukan…",
      option_a: "Pemetaan potensi konflik sosial",
      option_b: "Inventarisasi sosial, ekonomi dan budaya masyarakat",
      option_c: "Pemantauan flora dan fauna yang dilindungi",
      option_d: "Semua jawaban di atas benar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Kompetensi pengawasan BINHUT bersifat komprehensif mencakup aspek kelola sosial (konflik, sosekbud) serta kelola lingkungan (pemantauan keanekaragaman hayati flora/fauna).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Perbedaan utama antara GANISPH Pembinaan Hutan dengan GANISPH Perencanaan Hutan terletak pada…",
      option_a: "Lokasi kerja",
      option_b: "Fungsi dan fokus kegiatan yang diawasi",
      option_c: "Gaji yang diterima",
      option_d: "Jenis alat yang digunakan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Perbedaan spesialisasi terletak pada fungsi teknis; Perencanaan fokus pada inventarisasi/tata batas/rencana kerja, sedangkan Pembinaan Hutan fokus pada silvikultur/penanaman/pemeliharaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengawasan kegiatan pembinaan hutan, GANISPH harus memastikan bahwa setiap kegiatan pemanfaatan hutan berjalan secara…",
      option_a: "Cepat dan murah",
      option_b: "Administratively compliant / tertib administrasi",
      option_c: "Menguntungkan perusahaan",
      option_d: "Mandiri tanpa intervensi",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengawasan wajib memastikan seluruh prosedur berjalan secara tertib administrasi (administratively compliant) dan taat azas terhadap ketentuan perundang-undangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam melaksanakan pengawasan, GANISPH Pembinaan Hutan harus mampu melakukan evaluasi terhadap…",
      option_a: "Kinerja perusahaan secara keseluruhan",
      option_b: "Efisiensi biaya operasional",
      option_c: "Pelaksanaan kegiatan pembinaan hutan sesuai rencana dan ketentuan",
      option_d: "Kepuasan pelanggan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Evaluasi pengawasan difokuskan pada penilaian kesesuaian antara realisasi fisik pembinaan hutan di lapangan dengan dokumen rencana teknis.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "GANISPH Pembinaan Hutan dalam menjalankan tugas pengawasannya harus menyampaikan dan melaporkan hasil kegiatannya melalui sistem informasi yang disebut…",
      option_a: "SIMAK",
      option_b: "SIGANISHUT",
      option_c: "SIMPEG",
      option_d: "SIKEP",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "SIGANISHUT adalah Sistem Informasi Tenaga Teknis Pengelolaan Hutan resmi dari Kementerian LHK untuk pelaporan kinerja GANISPH.",
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

  console.log("✅ Successfully inserted all 12 questions for Was-Binhut (A.02GNS01.047.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
