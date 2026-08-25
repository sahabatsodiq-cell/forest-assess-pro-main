import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 31; // PUHH-HHBK
  const competencyUnitId = 436; // A.02GNS01.032.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (12 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hasil hutan hayati selain kayu baik nabati maupun hewani beserta produk turunan dan budidaya yang berasal dari Hutan Negara disebut :",
      option_a: "Hasil Hutan Bukan Kayu (HHBK)",
      option_b: "Hasil Hutan",
      option_c: "Hasil Hutan Hayati",
      option_d: "Hasil Hutan Nabati dan Hewani",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Berdasarkan definisi perundang-undangan kehutanan, Hasil Hutan Bukan Kayu (HHBK) adalah hasil hutan hayati selain kayu baik nabati maupun hewani beserta produk turunan dan budidayanya.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pemungutan HHBK yang dilakukan dengan maksud mengambil hasil hutan berupa HHBK seperti madu, rotan, getah, buah, biji, dll di dalam kawasan hutan diatur dengan ketentuan berikut, kecuali :",
      option_a: "Hanya memungut HHBK yang sudah tersedia secara alami dan/atau hasil rehabilitasi",
      option_b: "Tidak mengurangi, mengubah atau menghilangkan fungsi utamanya",
      option_c: "Memungut HHBK sesui jumlah, berat atau volume yang diizinkan",
      option_d: "Dokumen yang memuat data produksi hasil hutan baik kayu maupun bukan kayu",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Ketentuan pemungutan HHBK mengatur cara dan batasan pemungutan tanpa merusak fungsi hutan. Pilihan D bukan merupakan ketentuan pemungutan HHBK.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penatausahaan HHBK dari Hutan Negara dilakukan terhadap HHBK sebagai berikut, kecuali :",
      option_a: "HHBK dari kegiatan pemanfaatan hutan berupa hasil hutan hayati selain kayu",
      option_b: "HHBK dari kegiatan pemungutan hasil hutan berupa hasil hutan hayati hasil budidaya",
      option_c: "HHBK dari kegiatan pemungutan hasil hutan berupa hasil hutan hayati selain kayu",
      option_d: "HHBK berupa produk fisik selain kayu dari kegiatan pemanfaatan kawasan dan jasa lingkungan",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Penatausahaan HHBK Hutan Negara mencakup hasil hutan hayati alami/pemungutan/pemanfaatan fisik, bukan hasil budidaya murni non-hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penatausahaan HHBK yang meliputi rencana produksi, realisasi produksi, pengangkutan, pengolahan dan pemasaran HHBK dilakukan pencatatan melalui :",
      option_a: "SIPUHH-BK",
      option_b: "SI-HHBK",
      option_c: "SIPUHH",
      option_d: "SILK",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Sistem Informasi Penatausahaan Hasil Hutan (SIPUHH) adalah aplikasi resmi pemerintah untuk pencatatan PUHH kayu dan bukan kayu secara online.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "LHP-Bukan Kayu terhadap hasil pengukuran dan pengujian yang tercatat pada buku ukur bulan tertentu dibuat pada :",
      option_a: "Paling lambat tanggal 10 bulan berikutnya",
      option_b: "Paling lambat akhir bulan yang sama dengan bulan pembuatan buku ukur",
      option_c: "Paling lambat akhir bulan berikutnya dari bulan pembuatan buku ukur",
      option_d: "Paling lambat 20 hari setelah tanggal pembuatan buku ukur",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Laporan Hasil Pengujian (LHP)-Bukan Kayu dibuat paling lambat pada akhir bulan yang sama dengan bulan pembuatan buku ukur.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Bagi pemegang perizinan berusaha/pengumpul terdaftar yang belum memiliki GANISPH sesuai kompetensinya, kegiatan pengukuran dan pengujian dan pembuatan LHP-Bukan Kayu dapat dilakukan oleh, kecuali :",
      option_a: "GANISPH sesuai kompetensinya pada Dinas Kehutanan",
      option_b: "GANISPH sesuai kompetensinya pada BPHL",
      option_c: "GANISPH sesuai kompetensinya pada pemegang perizinan berusaha/pengumpul terdaftar lain",
      option_d: "Pimpinan pemegang perizinan berusaha/pengumpul terdaftar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Pembuatan LHP-Bukan Kayu mutlak membutuhkan kualifikasi tenaga teknis GANISPH (Dinas/BPHL/mitra), bukan pimpinan perusahaan tanpa kualifikasi GANISPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Setiap pengangkutan HHBK wajib dilengkapi bersama-sama :",
      option_a: "SKSHHBK",
      option_b: "SKSHHK",
      option_c: "Nota Angkutan",
      option_d: "SAKR",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Dokumen angkutan resmi untuk HHBK asal hutan negara adalah Surat Keterangan Sahnya Hasil Hutan Bukan Kayu (SKSHHBK).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengangkutan lanjutan hasil lelang HHBK dilengkapi bersama-sama :",
      option_a: "SAL Lanjutan",
      option_b: "Nota Perusahaan",
      option_c: "Nota Angkutan",
      option_d: "Nota Angkutan Lanjutan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pengangkutan lanjutan atas HHBK hasil lelang resmi dilengkapi dengan dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam hal SKSHHBK yang telah habis masa berlakunya dalam perjalanan sebagai akibat dari kerusakan alat angkut, maka hal berikut yang sudah memadai sesuai ketentuan untuk dilakukan adalah :",
      option_a: "Membuat Surat Keterangan bermaterai cukup kemudian disampaikan kepada petugas kehutanan agar diterbitkan SKSHHK lanjutan",
      option_b: "Pengemudi/nakhoda membuat Surat Keterangan bermaterai cukup yang menjelaskan kerusakan alat angkut",
      option_c: "Melaporkan kepada petugas kehutanan agar diterbitkan nota angkutan lanjutan",
      option_d: "Menunggu diterbitkannya SKSHHK dari perusahaan tujuan",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Dalam hal masa berlaku SKSHHBK habis akibat kendala/kerusakan armada pengangkut, pengemudi wajib membuat Surat Keterangan bermaterai cukup.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Langkah pertama yang harus dilakukan GANISPH sesuai kompetensinya di tempat tujuan yang ditunjuk sebagai penerima HHBK ketika menerima SKSHHBK yang menyertai pengangkutan rotan adalah :",
      option_a: "Melakukan pemeriksaan fisik sesuai dengan ketentuan",
      option_b: "Melakukan pencatatan penerimaan SKSHHBK melalui SIPUHH",
      option_c: "Membubuhkan stempel “TELAH DIGUNAKAN” pada halaman muka SKSHHBK",
      option_d: "Melakukan pencatatan dokumen SKSHHBK untuk disampaikan kepada instansi terkait",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Langkah pertama saat penerimaan SKSHHBK di lokasi tujuan adalah membubuhkan stempel 'TELAH DIGUNAKAN' pada bagian depan dokumen.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengumpul terdaftar yang melakukan kegiatan pengumpulan HHBK ditetapkan oleh :",
      option_a: "Perusahaan/perorangan/pemohon",
      option_b: "Kepala Dinas Kehutanan setempat",
      option_c: "Kepala KPH",
      option_d: "Kepala BPHL setempat",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Penetapan status Pengumpul Terdaftar HHBK diterbitkan oleh Kepala Dinas Kehutanan Provinsi setempat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penetapan Pengumpul terdaftar berlaku selama :",
      option_a: "Sesuai usulan perusahaan atau perorangan",
      option_b: "5 (lima) tahun",
      option_c: "3 (tiga) tahun",
      option_d: "Disesuaikan dengan berakhirnya masa berlaku izin perusahaan atau perorangan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Masa berlaku penetapan Pengumpul Terdaftar HHBK adalah selama 3 (tiga) tahun dan dapat diperpanjang.",
      status: "ACTIVE"
    },

    // --- BENAR / SALAH (13 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan lanjutan hasil lelang HHBK dilengkapi bersama-sama SAL - Lanjutan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengangkutan lanjutan hasil lelang HHBK tidak menggunakan SAL-Lanjutan melainkan dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam hal HHBK masih tercampur dengan unsur lain berupa kandungan air atau kotoran lainnya, LHP-Bukan Kayu dibuat dengan memperhitungkan faktor koreksi volume/berat",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengujian volume/bobot HHBK yang mengandung kadar air/kotoran harus memperhitungkan faktor koreksi persentase.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pencatatan LHP-Bukan Kayu dari Hutan Konservasi dilakukan oleh pengumpul terdaftar",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pembuatan LHP-Bukan Kayu asal Hutan Konservasi dilakukan oleh UPT Pengelola Hutan Konservasi (BKSDA/Taman Nasional).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Untuk pemegang persetujuan pengelolaan perhutanan sosial, pembuatan LHP-Bukan Kayu dapat dilakukan di pengumpul terdaftar",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Untuk lokasi Perhutanan Sosial, pembuatan LHP-Bukan Kayu dapat difasilitasi melalui Pengumpul Terdaftar.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dasar pembuatan LHP-Bukan Kayu adalah produksi HHBK yang dilakukan pengukuran dan pengujian yang dicatatkan ke dalam Daftar HHBK",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Buku Ukur / Daftar HHBK hasil pengukuran fisik menjadi dokumen sumber utama pembuatan LHP-Bukan Kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] LHP-Bukan Kayu terhadap hasil pengukuran dan pengujian yang tercatat pada buku ukur bulan tertentu dibuat paling lambat tanggal 10 bulan berikutnya",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. LHP-Bukan Kayu wajib dibuat paling lambat pada akhir bulan yang sama dengan bulan pembuatan buku ukur.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan lanjutan hasil lelang HHBK dilengkapi bersama-sama Nota Angkutan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengangkutan lanjutan HHBK hasil lelang resmi wajib disertai dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penerbitan SKSHHK dapat dilakukan terhadap HHBK yang belum lunas PNBP-nya sepanjang telah diterbitkan LHP-Bukan Kayu sesuai dengan ketentuan peraturan perundang-undangan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pelunasan kewajiban PNBP (PSDH/Rehabilitasi) bersifat mutlak sebelum penerbitan dokumen angkutan SKSHHBK.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] SKSHHBK yang melengkapi pengangkutan rotan hanya dapat diterbitkan dengan tujuan pengumpul terdaftar atau pemegang PBPHH yang terdaftar di SIPUHH",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengangkutan rotan dibatasi hanya ke tujuan pengumpul terdaftar atau industri PBPHH terregistrasi SIPUHH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] SKSHHBK yang melengkapi pengangkutan selain rotan dapat diterbitkan dengan tujuan perusahaan atau perorangan manapun",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. HHBK non-rotan dapat diangkut ke tujuan badan usaha maupun perorangan penerima.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Masa berlaku SKSHHBK ditetapkan oleh penerbit SKSHHBK dengan mempertimbangkan jarak dan waktu tempuh normal",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Masa berlaku dokumen SKSHHBK dihitung secara logis berdasar rute jarak dan estimasi waktu perjalanan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam hal terjadi perubahan alat angkut dalam perjalanan, SKSHHBK wajib dilengkapi dengan surat keterangan bermaterai cukup yang dibuat oleh pengemudi, yang berisi penjelasan mengenai penyebab yang mengakibatkan terjadinya perubahan alat angkut",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengalihan/perubahan moda alat angkut saat pengangkutan HHBK wajib melampirkan Surat Keterangan bermaterai dari pengemudi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan rotan dari lokasi penerbitan SKSHHBK ke pelabuhan muat wajib dilengkapi SKSHHBK",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengangkutan rotan menuju pelabuhan pengiriman wajib menyertakan dokumen SKSHHBK.",
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

  console.log("✅ Successfully inserted all 25 questions for PUHH-HHBK and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
