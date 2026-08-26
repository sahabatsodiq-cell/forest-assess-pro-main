import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 5; // Org-Job (Mengorganisasikan Pekerjaan)
  const competencyUnitId = 419; // A.02GNS01.002.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kode unit kompetensi untuk \"Mengorganisasikan Pekerjaan\" bagi GANISPH adalah…",
      option_a: "A.02GNS01.001.1",
      option_b: "A.02GNS01.002.1",
      option_c: "A.02GNS01.003.1",
      option_d: "A.02GNS01.004.1",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kode unit kompetensi baku untuk Mengorganisasikan Pekerjaan bagi GANISPH adalah A.02GNS01.002.1.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Peraturan Menteri yang mengatur tentang Profesi dan Kompetensi Tenaga Teknis Pengelolaan Hutan (GANISPH) adalah…",
      option_a: "Permen LHK No. 7 Tahun 2021",
      option_b: "Permen LHK No. 11 Tahun 2022",
      option_c: "Permen LHK No. 68 Tahun 2019",
      option_d: "Permenhut P.45/MENHUTII/2011",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Permen LHK Nomor 11 Tahun 2022 mengatur tentang Tata Cara Pembinaan dan Pengawasan serta Penilaian Kompetensi Tenaga Teknis Pengelolaan Hutan (GANISPH).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam mengorganisasikan pekerjaan, langkah pertama yang harus dilakukan oleh GANISPH adalah…",
      option_a: "Mengevaluasi hasil pekerjaan",
      option_b: "Mengidentifikasi dan merumuskan tujuan pekerjaan",
      option_c: "Mengatur pembagian tugas tim",
      option_d: "Menyiapkan alat dan bahan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Langkah awal pengorganisasian pekerjaan adalah mengidentifikasi dan merumuskan tujuan pekerjaan secara jelas sebelum pembagian tugas dan pengalokasian sumber daya.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini yang BUKAN merupakan elemen dalam pengorganisasian pekerjaan adalah…",
      option_a: "Penetapan struktur organisasi tim",
      option_b: "Pembagian tugas dan tanggung jawab",
      option_c: "Penentuan harga jual hasil hutan",
      option_d: "Pengalokasian sumber daya",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penentuan harga jual merupakan kegiatan bisnis/pemasaran, bukan elemen pengorganisasian teknis pekerjaan lapangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam konteks GANISPH, pengorganisasian pekerjaan yang efektif bertujuan untuk…",
      option_a: "Meningkatkan keuntungan perusahaan",
      option_b: "Memastikan pekerjaan selesai tepat waktu, sesuai target, dan efisien",
      option_c: "Menentukan kebijakan pemerintah di bidang kehutanan",
      option_d: "Mengurangi jumlah tenaga kerja",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Tujuan pengorganisasian pekerjaan adalah tercapainya hasil kerja yang tepat waktu, efisien, dan memenuhi standar/target yang ditetapkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu kompetensi yang harus dimiliki GANISPH dalam mengorganisasikan pekerjaan adalah kemampuan…",
      option_a: "Menebang pohon secara manual",
      option_b: "Mengoperasikan alat berat",
      option_c: "Melakukan koordinasi dan komunikasi efektif dengan tim",
      option_d: "Menentukan jenis tanah",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Kemampuan berkoordinasi dan berkomunikasi efektif dengan tim merupakan kompetensi manajerial kunci dalam mengorganisasikan pekerjaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam menyusun rencana kerja untuk pengorganisasian suatu kegiatan, GANISPH perlu memperhatikan aspek sumber daya yang meliputi…",
      option_a: "Manusia (tenaga kerja), materi (alat/bahan), dan waktu",
      option_b: "Modal dan keuntungan",
      option_c: "Pemasaran dan distribusi",
      option_d: "Harga dan biaya produksi",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Tiga elemen utama sumber daya operasional kegiatan mencakup Manusia (SDM), Materi (peralatan & bahan), serta Waktu (jadwal pelaksanaan).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dokumen yang berisi uraian tugas, wewenang, dan tanggung jawab masing-masing anggota tim dalam suatu kegiatan disebut…",
      option_a: "Rencana kerja",
      option_b: "Pembagian tugas (job description)",
      option_c: "Laporan kegiatan",
      option_d: "Surat perintah tugas",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Job description (uraian/pembagian tugas) memuat secara rinci rincian tugas, fungsi, wewenang, dan tanggung jawab tiap personel.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengorganisasian pekerjaan di lapangan, GANISPH bertanggung jawab untuk…",
      option_a: "Hanya melaksanakan perintah atasan",
      option_b: "Mengoordinasikan seluruh aspek teknis dan administratif kegiatan",
      option_c: "Menentukan kebijakan perusahaan",
      option_d: "Melakukan penjualan hasil hutan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "GANISPH bertanggung jawab memimpin, mengoordinasikan, dan mengendalikan aspek teknis operasional serta kelengkapan administrasi kegiatan di lapangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Indikator keberhasilan pengorganisasian pekerjaan yang dilakukan GANISPH adalah…",
      option_a: "Pekerjaan selesai sesuai jadwal dengan kualitas yang ditentukan",
      option_b: "Biaya operasional serendah mungkin",
      option_c: "Jumlah tenaga kerja sebanyak-banyaknya",
      option_d: "Penggunaan alat secanggih mungkin",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Keberhasilan pengorganisasian diukur dari ketepatan waktu (jadwal) dan kesesuaian mutu/kualitas hasil pekerjaan terhadap standar.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Perencanaan sumber daya manusia dalam organisasi pekerjaan GANISPH mencakup…",
      option_a: "Penentuan jumlah dan kualifikasi tenaga kerja yang dibutuhkan",
      option_b: "Penentuan gaji dan upah pekerja",
      option_c: "Rekrutmen tenaga kerja tetap",
      option_d: "Penilaian kinerja tahunan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Perencanaan SDM operasional berfokus pada penghitungan kebutuhan kuantitas (jumlah) serta kualifikasi/kompetensi tenaga kerja.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan Kepmenaker No. 21 Tahun 2019, SKKNI GANISPH termasuk dalam kategori…",
      option_a: "Pertanian, Kehutanan dan Perikanan",
      option_b: "Industri Pengolahan",
      option_c: "Jasa Kehutanan",
      option_d: "Konservasi Sumber Daya Alam",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Sektor utama SKKNI GANISPH dalam Klasifikasi Baku Lapangan Usaha Indonesia (KBLI) tergolong pada Kategori Pertanian, Kehutanan dan Perikanan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam mengorganisasikan pekerjaan, GANISPH perlu membuat matriks penjadwalan yang berfungsi untuk…",
      option_a: "Menentukan harga pokok produksi",
      option_b: "Mengatur urutan dan waktu pelaksanaan setiap kegiatan",
      option_c: "Menentukan lokasi kegiatan",
      option_d: "Memilih jenis pohon yang akan ditebang",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Matriks penjadwalan (seperti Time Schedule / Bar Chart) berfungsi menyusun urutan logis dan alokasi durasi waktu pelaksanaan tiap tahapan kegiatan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Komunikasi efektif dalam organisasi pekerjaan GANISPH sangat penting untuk…",
      option_a: "Menghindari kesalahpahaman dan meningkatkan koordinasi tim",
      option_b: "Meningkatkan gaji anggota tim",
      option_c: "Mengurangi beban kerja",
      option_d: "Mempercepat proses pensiun",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Komunikasi yang jelas dan efektif mencegah miskomunikasi antarpetugas serta memastikan koordinasi kerja di lapangan berjalan lancar.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu prinsip dasar dalam mengorganisasikan pekerjaan adalah prinsip kesatuan komando (unity of command), yang berarti…",
      option_a: "Setiap pekerja hanya menerima perintah dari satu atasan",
      option_b: "Semua pekerja harus kompak",
      option_c: "Pekerjaan dilakukan secara bersama-sama",
      option_d: "Tidak ada hierarki dalam tim",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Prinsip Unity of Command menegaskan bahwa setiap bawahan/petugas hanya menerima instruksi dan bertanggung jawab kepada satu atasan langsung.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam menyusun rencana organisasi pekerjaan, GANISPH perlu mempertimbangkan faktor lingkungan kerja yang meliputi…",
      option_a: "Kondisi lapangan, cuaca, dan aksesibilitas lokasi",
      option_b: "Harga kayu di pasar internasional",
      option_c: "Kebijakan moneter pemerintah",
      option_d: "Tingkat inflasi",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Faktor lingkungan teknis yang memengaruhi pekerjaan hutan di lapangan meliputi topografi/kondisi medan, iklim/cuaca, dan kemudahan akses.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam mengorganisasikan pekerjaan, GANISPH harus mampu melakukan delegasi tugas dengan memperhatikan…",
      option_a: "Kemampuan dan kompetensi masing-masing anggota tim",
      option_b: "Senioritas dan masa kerja",
      option_c: "Kedekatan hubungan personal",
      option_d: "Status sosial anggota tim",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Penyerahan/delegasi tugas harus disesuaikan dengan kapasitas, keterampilan, dan kualifikasi kompetensi anggota tim.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu output dari kegiatan mengorganisasikan pekerjaan adalah tersusunnya…",
      option_a: "Rencana kerja yang terstruktur dan sistematis",
      option_b: "Laporan keuangan perusahaan",
      option_c: "Kontrak kerja dengan pembeli",
      option_d: "Surat izin usaha kehutanan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Hasil konkret dari tahap pengorganisasian kerja adalah terwujudnya Rencana Kerja Operasional yang terstruktur, jelas, dan sistematis.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut yang merupakan tahapan dalam mengorganisasikan pekerjaan adalah…",
      option_a: "Perencanaan → Pengorganisasian → Pelaksanaan → Pengendalian → Evaluasi",
      option_b: "Pelaksanaan → Perencanaan → Evaluasi → Pengorganisasian → Pengendalian",
      option_c: "Evaluasi → Perencanaan → Pelaksanaan → Pengorganisasian → Pengendalian",
      option_d: "Pengorganisasian → Perencanaan → Pelaksanaan → Evaluasi → Pengendalian",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Urutan alur siklus manajemen pekerjaan yang standar dan rinci dimulai dari Perencanaan, Pengorganisasian, Pelaksanaan, Pengendalian, dan Evaluasi (POACE).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam mengorganisasikan pekerjaan di bidang kehutanan, GANISPH harus memahami standar operasional prosedur (SOP) yang bertujuan untuk…",
      option_a: "Memperpanjang waktu pengerjaan",
      option_b: "Meningkatkan biaya operasional",
      option_c: "Menjamin konsistensi dan kualitas pelaksanaan pekerjaan",
      option_d: "Mengurangi jumlah tenaga kerja",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penerapan SOP bertujuan memastikan seluruh prosedur teknis dilaksanakan secara konsisten, aman, dan memenuhi standar mutu yang ditetapkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu tantangan dalam mengorganisasikan pekerjaan di lapangan kehutanan adalah…",
      option_a: "Kondisi medan yang sulit dan cuaca yang tidak menentu",
      option_b: "Ketersediaan modal yang melimpah",
      option_c: "Tenaga kerja yang berpendidikan tinggi",
      option_d: "Peralatan yang selalu tersedia",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Tantangan fisik terbesar pekerjaan hutan adalah dinamika cuaca yang sering berubah-ubah serta kondisi geografis/medan hutan yang berat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam melakukan pengorganisasian pekerjaan, GANISPH perlu menyusun uraian kegiatan yang mencakup…",
      option_a: "Langkah-langkah teknis pelaksanaan setiap tugas",
      option_b: "Harga jual hasil hutan",
      option_c: "Rencana ekspansi usaha",
      option_d: "Analisis pesaing",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Uraian kegiatan teknis memuat tahapan dan instruksi kerja langkah demi langkah untuk setiap jenis tugas yang akan dilaksanakan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kemampuan manajemen waktu dalam mengorganisasikan pekerjaan sangat penting karena…",
      option_a: "Waktu hanya penting untuk pekerjaan kantor",
      option_b: "Waktu dapat dibeli dengan uang",
      option_c: "Waktu merupakan sumber daya yang terbatas dan tidak dapat diperbarui",
      option_d: "Waktu selalu tersedia cukup",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Waktu merupakan sumber daya kritis yang terbatas, sehingga pengelolaan target waktu yang presisi sangat menentukan keberhasilan proyek.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam organisasi pekerjaan, GANISPH berperan sebagai…",
      option_a: "Pelaksana tunggal semua pekerjaan",
      option_b: "Pengelola dan koordinator kegiatan teknis di lapangan",
      option_c: "Pengawas yang hanya memantau dari kantor",
      option_d: "Staf administrasi",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Peran profesional GANISPH adalah sebagai penanggung jawab teknis, pengelola, dan koordinator eksekusi kegiatan pengelolaan hutan di lapangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam mengorganisasikan pekerjaan, GANISPH harus mampu mengidentifikasi potensi risiko yang dapat menghambat pekerjaan, seperti…",
      option_a: "Kebijakan perdagangan internasional",
      option_b: "Fluktuasi harga kayu",
      option_c: "Persaingan pasar",
      option_d: "Cuaca ekstrem, akses terbatas, dan ketersediaan alat",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Risiko operasional langsung di lapangan meliputi gangguan cuaca ekstrem, hambatan aksesibilitas transportasi, dan keterbatasan alat kerja.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tujuan akhir dari pengorganisasian pekerjaan yang baik oleh GANISPH adalah…",
      option_a: "Tercapainya tujuan kegiatan secara efektif dan efisien",
      option_b: "Mendapatkan keuntungan sebesar-besarnya",
      option_c: "Menyelesaikan pekerjaan dengan biaya termahal",
      option_d: "Menggunakan tenaga kerja sebanyak mungkin",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Goal akhir pengorganisasian kerja yang baik adalah terwujudnya efektivitas (tercapainya sasaran) dan efisiensi (optimalisasi sumber daya).",
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

  console.log("✅ Successfully inserted all 26 questions for Org-Job (A.02GNS01.002.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
