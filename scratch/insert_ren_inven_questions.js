import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 10; // Ren-Inven (Penyusunan Rencana Kerja Inventarisasi Tegakan Hutan)
  const competencyUnitId = 420; // A.02GNS01.008.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini yang BUKAN merupakan komponen dalam rencana kerja inventarisasi tegakan hutan adalah…",
      option_a: "Rencana bagan sampling (sampling design)",
      option_b: "Rencana alat dan perlengkapan di lapangan",
      option_c: "Rencana pemasaran hasil hutan",
      option_d: "Rencana organisasi dan penyediaan tenaga kerja",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Rencana kerja inventarisasi tegakan fokus pada aspek teknis pelaksanaan inventarisasi (design, alat, SDM), bukan pemasaran hasil hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Inventarisasi tegakan sebelum penebangan disebut juga dengan istilah…",
      option_a: "Sampling",
      option_b: "Timber cruising",
      option_c: "Enumerasi",
      option_d: "IHMB",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Inventarisasi Tegakan Sebelum Penebangan (ITSP) secara umum dikenal dalam dunia kehutanan sebagai istilah Timber Cruising.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan Keputusan Direktur Jenderal Planologi Kehutanan Nomor 3 Tahun 2025, tahap Perencanaan dalam inventarisasi tegakan hutan meliputi…",
      option_a: "Desain Sampling, Perencanaan, Persiapan Lapangan",
      option_b: "Pembangunan Klaster, Pengumpulan Data Lapangan",
      option_c: "Pelaporan Pelaksanaan",
      option_d: "Pengolahan Data dan Analisis",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Berdasarkan petunjuk teknis inventarisasi, tahap perencanaan mencakup pembuatan desain sampling, perencanaan kerja, dan persiapan lapangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dokumen yang perlu dipersiapkan dalam perencanaan inventarisasi tegakan hutan adalah peta areal kerja digital dengan skala…",
      option_a: "1:10.000",
      option_b: "1:25.000",
      option_c: "1:50.000",
      option_d: "1:100.000",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Peta areal kerja dasar yang digunakan dalam perencanaan awal inventarisasi tegakan hutan umumnya berskala 1:50.000.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Yang dimaksud dengan pohon inti dalam inventarisasi tegakan sebelum penebangan adalah pohon dengan diameter…",
      option_a: "10 - 19 cm",
      option_b: "20 - 29 cm",
      option_c: "20 - 49 cm",
      option_d: "30 - 49 cm",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pohon inti dalam kegiatan ITSP pada hutan alam produksi adalah pohon komersial yang berdiameter 20 cm hingga 49 cm (sebagai calon pohon tebang siklus berikutnya).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "ITSP digunakan sebagai dasar perhitungan…",
      option_a: "MMC (Monthly Management Cut)",
      option_b: "BBC (Basic Business Cut)",
      option_c: "AAC (Annual Allowable Cut)",
      option_d: "ACC (Annual Cutting Capacity)",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Hasil ITSP menjadi dasar utama perhitungan AAC (Annual Allowable Cut) atau Jatah Tebang Tahunan (JTT).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam penyusunan rencana kerja inventarisasi tegakan hutan, kegiatan merancang sampling dan menentukan jumlah plot termasuk dalam elemen kompetensi…",
      option_a: "Mempersiapkan rencana kerja",
      option_b: "Merancang sampling dan menentukan jumlah plot",
      option_c: "Menyusun kebutuhan",
      option_d: "Mengolah dan menganalisis data",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kegiatan penentuan desain sampling dan jumlah sampel plot secara spesifik masuk ke dalam elemen kompetensi merancang sampling dan menentukan jumlah plot.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam dokumen rencana kerja inventarisasi tegakan hutan yang disusun oleh GANISPH, komponen yang HARUS dicantumkan antara lain…",
      option_a: "Tim, alat, dan bahan",
      option_b: "Harga kayu dan biaya angkut",
      option_c: "Nama pembeli dan kontrak kerja",
      option_d: "Izin edar dan sertifikat",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Dokumen rencana kerja wajib memuat perencana operasional lapangan seperti susunan tim pelaksana, peralatan kerja, dan bahan pendukung.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sasaran utama dalam melaksanakan kegiatan inventarisasi hutan adalah…",
      option_a: "Kawasan, iklim, tanah, tegakan",
      option_b: "Iklim, lapangan, tegakan, tumbuhan bawah",
      option_c: "Kawasan, tanah, tegakan, tumbuhan bawah",
      option_d: "Kawasan, tanah, tegakan, cuaca",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Sasaran inventarisasi hutan mencakup kondisi fisik kawasan, tempat tumbuh/tanah, struktur tegakan pohon, serta vegetasi tumbuhan bawah.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Persyaratan pelaksanaan ITSP yang benar secara berurutan meliputi…",
      option_a: "Membuat perencanaan, persiapan regu, persiapan alat dan akomodasi, pemeriksaan dan penyimpanan peralatan",
      option_b: "Persiapan regu, persiapan alat dan akomodasi, pemeriksaan dan penyimpanan peralatan, membuat perencanaan",
      option_c: "Persiapan alat, persiapan regu, membuat perencanaan, pemeriksaan peralatan",
      option_d: "Membuat perencanaan, pemeriksaan peralatan, persiapan regu, persiapan akomodasi",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Urutan logis alur pelaksanaan ITSP dimulai dari membuat perencanaan, dilanjutkan persiapan regu kerja, persiapan alat & akomodasi, hingga pemeriksaan dan penanganan peralatan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam penyusunan rencana kerja inventarisasi tegakan hutan, salah satu komponen yang harus direncanakan adalah…",
      option_a: "Rencana pemasaran hasil inventarisasi",
      option_b: "Rencana pengolahan dan analisis data serta pelaporan hasil",
      option_c: "Rencana penjualan kayu",
      option_d: "Rencana pembangunan jalan angkut",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Perencanaan inventarisasi mencakup alur pasca lapangan yaitu rencana pengolahan data, analisis, hingga penyusunan laporan hasil.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam dokumen rencana kerja inventarisasi tegakan hutan, uraian kegiatan mencakup informasi tentang…",
      option_a: "Tim pelaksana, alat yang digunakan, dan bahan yang diperlukan",
      option_b: "Hasil inventarisasi dan volume kayu",
      option_c: "Peta lokasi dan batas areal",
      option_d: "Semua jawaban benar",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Uraian rencana kegiatan teknis menjabarkan rincian kebutuhan tim pelaksana, daftar peralatan, dan bahan operasional yang diperlukan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam penyusunan rencana kerja, penentuan jumlah plot contoh (sample plot) didasarkan pada…",
      option_a: "Luas areal dan tingkat ketelitian yang diinginkan",
      option_b: "Jumlah tenaga kerja yang tersedia",
      option_c: "Anggaran yang disediakan",
      option_d: "Jenis pohon yang dominan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Jumlah plot sampel ditentukan secara statistik berdasarkan total luas wilayah inventarisasi dan tingkat ketelitian (sampling error) yang ditargetkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut yang merupakan tujuan dari penyusunan rencana kerja inventarisasi tegakan hutan adalah…",
      option_a: "Memastikan kegiatan inventarisasi berjalan efektif dan efisien",
      option_b: "Membuat peta kawasan hutan",
      option_c: "Memperoleh izin penebangan",
      option_d: "Menyusun laporan keuangan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Tujuan utama pembuatan rencana kerja adalah agar pelaksanaan kegiatan inventarisasi berjalan secara terstruktur, efektif, efisien, serta sesuai standar teknis.",
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

  console.log("✅ Successfully inserted all 14 questions for Ren-Inven (A.02GNS01.008.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
