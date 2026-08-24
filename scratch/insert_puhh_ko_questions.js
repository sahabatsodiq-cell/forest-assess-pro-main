import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 52; // PUHH-KO
  const competencyUnitId = 467; // A.02GNS01.058.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA (10 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Setiap pengangkutan kayu olahan berikut ini dari dan/atau ke tempat pengolahan hasil hutan wajib dilengkapi bersama dokumen SKSHHK, kecuali :",
      option_a: "Kayu gergajian",
      option_b: "Kayu Lapis",
      option_c: "Veneer",
      option_d: "Serpih kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kayu lapis berasal dari kayu olahan yang menggunakan dokumen Nota Perusahaan/dokumen angkutan tersendiri, bukan SKSHHK.",
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
      explanation: "Penatausahaan Hasil Hutan (PUHH) adalah serangkaian kegiatan pencatatan dan pelaporan sejak perencanaan hingga pemasaran hasil hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini adalah kayu olahan pada tempat pengolahan hasil hutan kayu yang merupakan obyek penatausahaan hasil hutan kayu, kecuali :",
      option_a: "Moulding",
      option_b: "Kayu gergajian",
      option_c: "Veneer",
      option_d: "Serpih",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Moulding tergolong sebagai produk olahan lanjutan (downstream finished product), bukan produk kayu olahan primer obyek utama PUHH.",
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
      explanation: "Jika SKSHHK habis masa berlakunya akibat kendala teknis/kerusakan alat angkut dalam perjalanan, pengemudi/nakhoda wajib membuat Surat Keterangan bermaterai cukup.",
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
      difficulty: "EASY",
      explanation: "Saat menerima SKSHHK di tempat tujuan, langkah awal penerima kayu adalah membubuhkan stempel 'TELAH DIGUNAKAN' pada halaman depan dokumen.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengolahan kayu olahan berupa kayu gergajian, veneer dan serpih pada pemegang PBPHH menjadi olahan lanjutan yang berada dalam 1 (satu) lokasi dan merupakan satu kesatuan proses produksi dicatat sebagai penggunaan sendiri pada SIPUHH melalui :",
      option_a: "DKDS",
      option_b: "SKSHHK",
      option_c: "LHP-Kayu",
      option_d: "DKB",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Penggunaan sendiri kayu olahan dalam 1 lokasi terpadu dicatat di SIPUHH melalui daftar laporan DKDS.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengangkutan kayu olahan dari tempat kegiatan pengolahan hasil hutan yang bahan bakunya berasal dari kayu budidaya dari hutan hak dilengkapi bersama-sama :",
      option_a: "Nota perusahaan",
      option_b: "Nota Angkutan",
      option_c: "Surat Angkutan Kayu Rakyat (SAKR)",
      option_d: "Surat Angkutan Kayu Rakyat (SAKR) Lanjutan",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Hasil pengolahan kayu dari bahan baku hutan hak/kayu rakyat diangkut menggunakan dokumen Nota Perusahaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengangkutan arang kayu menggunakan dokumen :",
      option_a: "SKSHHK",
      option_b: "Nota perusahaan",
      option_c: "Nota Angkutan",
      option_d: "DKDS",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pengangkutan arang kayu dilengkapi dengan dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penggunaan dokumen angkutan kayu olahan yang tidak diperkenankan dalam PUHH, adalah :",
      option_a: "1 (satu) kali pengangkutan dengan 1 (satu) tujuan",
      option_b: "1 (satu) kali pengangkutan dengan 1 (satu) alat angkut",
      option_c: "1 (satu) kali pengangkutan dengan 2 (dua) tujuan",
      option_d: "1 (satu) alat angkut dengan 1 (satu) tujuan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Dokumen angkutan kayu hanya berlaku untuk 1 kali pengangkutan ke 1 lokasi tujuan. Tidak diperkenankan 1 dokumen untuk 2 tujuan sekaligus.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "SKSHHK yang menyertai pengangkutan kayu olahan dengan tujuan selain pemegang PBPHH dapat diterima oleh, kecuali :",
      option_a: "Harus diterima oleh GANISPH sesuai kompetensinya",
      option_b: "Boleh diterima oleh GANISPH lainnya yang tidak sesuai kompetensinya",
      option_c: "Boleh diterima oleh pimpinan pemegang PBPHH",
      option_d: "Boleh diterima oleh petugas pemegang PBPHH yang ditunjuk sebagai penerima kayu",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Untuk tujuan selain pemegang PBPHH (penerima non-PBPHH), penerima kayu tidak diwajibkan khusus GANISPH berijazah spesifik.",
      status: "ACTIVE"
    },

    // --- BENAR / SALAH (10 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Sebuah truck fuso DA 1234 BSF mengangkut kayu lapis dan disertai dokumen Nota Perusahaan dari perusahaan A ke perusahaan X. Pada saat yang sama, truck fuso tersebut mengangkut veneer dan disertai dokumen SKSHHK dari Perusahaan B ke perusahaan X. Berdasarkan PUHH, pengangkutan tersebut sah",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Pernyataan BENAR. Pengangkutan gabungan produk kayu olahan dengan dokumen sah masing-masing ke satu tempat tujuan yang sama diperbolehkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan kayu olahan secara bertahap dari tempat pengolahan hasil hutan yang merupakan lokasi penerbitan SKSHHK ke pelabuhan muat harus menggunakan dokumen SKSHHK",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengangkutan kayu olahan bertahap dari lokasi penerbitan ke pelabuhan muat dapat menggunakan dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengangkutan kayu impor dari pelabuhan ke tempat pengolahan hasil hutan menggunakan dokumen Nota Angkutan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengangkutan kayu impor dari pelabuhan menuju tempat pengolahan disertai dokumen Nota Angkutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Hasil hutan kayu olahan berupa kayu gergajian, veneer dan serpih yang berasal dari bahan baku kayu bulat yang berasal dari hutan hak diangkut dari dan/atau ke tempat pengolahan hasil hutan menggunakan dokumen Nota Angkutan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Pernyataan SALAH. Kayu olahan dari bahan baku hutan hak diangkut dari/ke tempat pengolahan menggunakan dokumen Nota Perusahaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam hal tidak memungkinkan dilakukan pengangkutan kayu olahan langsung dari lokasi pengolahan, pemegang PBPHH dapat menetapkan sendiri lokasi tempat penampungan kayu olahan di luar lokasi pengolahannya",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Penampungan kayu olahan di luar lokasi industri wajib mendapatkan penetapan/izin dari instansi kehutanan berwenang (Kepala Dinas Kehutanan).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Tempat penampungan kayu olahan dari pemegang PBPHH dapat digunakan untuk menampung kayu olahan dari lokasi pengolahan PBPHH yang bersangkutan sekaligus mengolah kayu olahan di tempat penampungan tersebut dan PUHH menjadi bagian tidak terpisahkan dari pemegang PBPHH",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Tempat penampungan kayu olahan hanya berfungsi menampung dan menimbun, tidak diperkenankan melakukan kegiatan pengolahan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] SKSHHK yang menyertai pengangkutan kayu olahan diterima oleh GANISPH sesuai kompetensinya dengan membubuhkan stempel “TELAH DIGUNAKAN” pada halaman muka SKSHHK",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penerimaan dokumen SKSHHK oleh GANISPH diwajibkan pembubuhan stempel 'TELAH DIGUNAKAN' pada halaman muka dokumen.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] SKSHHK yang menyertai pengangkutan kayu olahan dengan tujuan selain pemegang PBPHH hanya boleh diterima dan dicatat oleh GANISPH",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengangkutan dengan tujuan selain PBPHH dapat diterima oleh pimpinan atau petugas penerima yang ditunjuk.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] SKSHHK kayu olahan diterbitkan oleh penerbit SKSHHK yang berkualifikasi GANISPH sesuai kompetensinya",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penerbitan SKSHHK kayu olahan dilakukan oleh Petugas Penerbit SKSHHK berkualifikasi GANISPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengolahan kayu olahan berupa kayu gergajian pada pemegang PBPHH menjadi olahan lanjutan yang berada dalam 1 (satu) lokasi dan merupakan satu kesatuan proses produksi dicatat sebagai penggunaan sendiri pada SIPUHH",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengolahan lanjutan kayu gergajian dalam 1 lokasi terpadu dicatat sebagai penggunaan sendiri pada SIPUHH.",
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

  console.log("✅ Successfully inserted all 20 questions for PUHH-KO and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
