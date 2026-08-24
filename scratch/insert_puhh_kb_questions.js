import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 25; // PUHH-KB
  const competencyUnitId = 435; // A.02GNS01.026.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (10 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tempat milik pemegang PBPH/persetujuan pemerintah yang berfungsi untuk menimbun kayu bulat hasil penebangan, yang lokasinya berada di dalam areal perizinan/persetujuan yang bersangkutan disebut :",
      option_a: "TPK Hutan",
      option_b: "TPK Antara",
      option_c: "TPn",
      option_d: "TPT-KB",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "TPK Hutan adalah tempat penimbunan kayu bulat milik pemegang perizinan yang lokasinya berada di dalam areal perizinan/persetujuan yang bersangkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Laporan Hasil Produksi (LHP) adalah :",
      option_a: "Dokumen yang memuat data produksi hasil hutan berupa kayu",
      option_b: "Dokumen yang memuat data hasil pemanenan / pemungutan atau pengumpulan hasil hutan bukan kayu",
      option_c: "Dokumen yang memuat data penggunaan sendiri hasil hutan kayu",
      option_d: "Dokumen yang memuat data produksi hasil hutan baik kayu maupun bukan kayu",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Laporan Hasil Produksi (LHP) adalah dokumen resmi yang memuat data produksi hasil hutan, baik berupa hasil hutan kayu maupun bukan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Semua jenis kayu sisa pembagian batang berupa tunggak, cabang dan ranting yang tertinggal di hutan disebut :",
      option_a: "Tegakan tinggal",
      option_b: "Limbah pemanenan",
      option_c: "Pohon sisa",
      option_d: "Tunggak tebangan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Limbah pemanenan adalah semua jenis kayu sisa pembagian batang berupa tunggak, cabang, dan ranting yang tertinggal di hutan tempat pemanenan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kegiatan pencatatan dan pelaporan atas perencanaan produksi, pemanenan atau penebangan, pengukuran, pengujian, penandaan, pengangkutan/peredaran, pengolahan dan pemasaran hasil hutan disebut :",
      option_a: "Pengukuran dan pengujian hasil hutan",
      option_b: "Sistem Informasi Penatausahaan Hasil Hutan",
      option_c: "Penatausahaan hasil hutan",
      option_d: "Penjaminan legalitas kayu",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penatausahaan Hasil Hutan (PUHH) adalah kegiatan pencatatan dan pelaporan atas perencanaan produksi, pemanenan/penebangan, pengukuran, pengujian, penandaan, pengangkutan, pengolahan, hingga pemasaran.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini adalah merupakan obyek penatausahaan hasil hutan kayu, kecuali :",
      option_a: "Kayu bulat hasil kegiatan pemanfaatan pada hutan alam pada hutan lindung",
      option_b: "Kayu bulat hasil kegiatan pemanfaatan pada hutan alam pada hutan produksi",
      option_c: "Kayu bulat hasil kegiatan pemanfaatan pada hutan tanaman pada hutan produksi",
      option_d: "Kayu bulat tumbuh alami hasil kegiatan pemanfaatan pada areal yang telah dibebani hak atas tanah",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Hutan lindung berfungsi sebagai perlindungan sistem penyangga kehidupan dan tidak diperuntukkan untuk kegiatan pemanfaatan kayu bulat produksi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam hal SKSHHK yang telah habis masa berlakunya dalam perjalanan sebagai akibat dari kerusakan alat angkut, maka hal berikut yang sudah memadai sesuai ketentuan untuk dilakukan adalah :",
      option_a: "Membuat Surat Keterangan bermaterai cukup kemudian disampaikan kepada petugas kehutanan agar diterbitkan SKSHHK lanjutan",
      option_b: "Pengemudi/nakhoda membuat Surat Keterangan bermaterai cukup yang menjelaskan kerusakan alat angkut",
      option_c: "Melaporkan kepada petugas kehutanan agar diterbitkan nota angkutan lanjutan",
      option_d: "Menunggu diterbitkannya SKSHHK dari perusahaan tujuan",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Jika SKSHHK habis masa berlakunya akibat kerusakan alat angkut dalam perjalanan, pengemudi/nakhoda wajib membuat Surat Keterangan bermaterai cukup yang menjelaskan sebab kerusakan alat angkut tersebut.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Langkah pertama yang harus dilakukan GANISPH sesuai kompetensinya di tempat tujuan yang ditunjuk sebagai penerima kayu ketika menerima SKSHHK yang menyertai pengangkutan kayu bulat / kayu olahan adalah :",
      option_a: "Melakukan pemeriksaan fisik sesuai dengan ketentuan",
      option_b: "Melakukan scan ID quick response code yang terdapat pada setiap batang kayu",
      option_c: "Membubuhkan stempel “TELAH DIGUNAKAN” pada halaman muka SKSHHK",
      option_d: "Melakukan pencatatan dokumen SKSHHK untuk disampaikan kepada instansi terkait",
      correct_answer: "C",
      difficulty: "MEDIUM",
      explanation: "Langkah pertama penerima kayu di tempat tujuan saat menerima dokumen SKSHHK adalah membubuhkan stempel 'TELAH DIGUNAKAN' pada halaman muka dokumen tersebut.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tempat Penimbunan Kayu (TPK) Hutan ditetapkan oleh :",
      option_a: "Pimpinan PBPH/perizinan lainnya dan disahkan oleh Kepala Dinas Kehutanan setempat",
      option_b: "Pimpinan PBPH/perizinan lainnya dan cukup dicantumkan dalam dokumen perencanaan",
      option_c: "Kepala Dinas Kehutanan setempat",
      option_d: "Kepala BPHL setempat",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "TPK Hutan ditetapkan langsung oleh pimpinan PBPH/pemegang izin dan dicantumkan di dalam dokumen rencana kerja/perencanaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penetapan TPT-KB oleh Kepala Dinas Kehutanan berlaku selama :",
      option_a: "Sesuai usulan perusahaan atau perorangan",
      option_b: "5 (lima) tahun",
      option_c: "3 (tiga) tahun",
      option_d: "Disesuaikan dengan berakhirnya masa berlaku izin perusahaan atau perorangan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penetapan Tempat Penampungan Terdaftar Kayu Bulat (TPT-KB) oleh Kepala Dinas Kehutanan berlaku untuk jangka waktu 3 (tiga) tahun.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kayu hilang, rusak dan digunakan sendiri oleh pemegang PBPH dan perizinan lainnya dicatat pada SIPUHH melalui mekanisme :",
      option_a: "DKDS",
      option_b: "SKSHHK",
      option_c: "LHP-Kayu",
      option_d: "DKB",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Kayu yang hilang, rusak, atau digunakan sendiri (DKDS) dicatat pada SIPUHH melalui mekanisme laporan DKDS.",
      status: "ACTIVE"
    },

    // --- BENAR / SALAH (10 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kayu bulat yang telah dilakukan pengukuran dan pengujian batang per batang oleh GANISPH dilakukan penandaan pada bontos dan/atau badan kayu menggunakan label ID quick response code.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kayu bulat yang diukur dan diuji wajib diberi tanda ID berupa QR code pada bontos dan/atau badan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] LHP-Kayu terhadap hasil pengukuran dan pengujian yang tercatat pada buku ukur bulan tertentu dibuat paling lambat tanggal 10 bulan berikutnya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pembuatan LHP-Kayu dilakukan secara berkala dan tepat waktu sesuai ketentuan peraturan penatausahaan hasil hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] LHP-Kayu dibuat di Tempat Pengumpulan Kayu (TPn) oleh pembuat LHP-Kayu yang merupakan GANISPH-PKB sesuai kompetensinya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. LHP-Kayu disusun di TPn oleh tenaga teknis berkualifikasi GANISPH-PKB.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam hal LHP-Kayu berasal dari 2 (dua) blok dalam wilayah kabupaten/kota yang sama, LHP-Kayu dibuat untuk masing-masing blok.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Setiap LHP-Kayu diterbitkan per blok tebangan untuk menjamin ketertelusuran (traceability) asal-usul kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan kayu bulat secara bertahap dari tempat pengolahan hasil hutan yang merupakan lokasi penerbitan SKSHHK ke pelabuhan muat menggunakan dokumen Nota Angkutan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Pernyataan BENAR. Pengangkutan bertahap/lanjutan dari lokasi penerbitan SKSHHK ke pelabuhan muat dapat disertai Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] SKSHHK kayu bulat diterbitkan oleh penerbit SKSHHK yang berkualifikasi GANISPH sesuai kompetensinya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penerbitan SKSHHK wajib dilakukan oleh Petugas Penerbit SKSHHK yang telah ditetapkan dan memiliki kualifikasi GANISPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Nota Angkutan kayu bulat dapat diterbitkan oleh karyawan pemegang perizinan yang berkualifikasi GANISPH sesuai kompetensinya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penerbitan Nota Angkutan dilakukan oleh karyawan berwenang yang memiliki sertifikasi/kualifikasi GANISPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] TPT-KB diperkenankan melakukan pengolahan kayu berdasarkan izin dari Dinas Kehutanan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. TPT-KB hanya berfungsi sebagai tempat penampungan terdaftar kayu bulat dan tidak diperkenankan melakukan kegiatan pengolahan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] TPT-KB diperkenankan melakukan pengolahan kayu berdasarkan izin dari Dinas Kehutanan (Soal 9).",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. TPT-KB hanya tempat penampungan dan bukan industri pengolahan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan hasil hutan hasil lelang berupa kayu bulat yang diangkut secara bertahap disertai dokumen SKSHHK.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Pernyataan BENAR. Hasil hutan lelang yang diangkut wajib dilengkapi dokumen legalitas angkutan berupa SKSHHK.",
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

  console.log("✅ Successfully inserted all 20 questions for PUHH-KB and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
