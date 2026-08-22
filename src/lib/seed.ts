import { hashPassword } from "./auth";

export async function seedDatabase(db: any) {
  // Check if already seeded
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get().count;
  if (userCount > 0) return;

  console.log("Seeding database with MVP data...");

  // 1. Seed Users
  const superadminHash = hashPassword("SuperAdmin123!");
  const adminHash = hashPassword("Admin123!");
  const participantHash = hashPassword("Peserta123!");

  db.prepare(`
    INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run("Super Admin", "superadmin@askganisph.id", superadminHash, "SUPER_ADMIN", "SA-001", 1);

  db.prepare(`
    INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run("Admin Pelaksana", "admin@askganisph.id", adminHash, "ADMIN", "A-001", 1);

  const participantId = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run("Budi Santoso", "peserta@askganisph.id", participantHash, "PESERTA", "REG-2026-001", 1).lastInsertRowid;

  // 2. Seed Qualifications
  const qualifications = [
    { code: "CANHUT", name: "Tenaga Teknis Perencanaan Hutan" },
    { code: "NENHUT", name: "Tenaga Teknis Pemanenan Hutan" },
    { code: "BINHUT", name: "Tenaga Teknis Pembinaan Hutan" },
    { code: "PKB", name: "Penguji Kayu Bulat" },
    { code: "PKG", name: "Penguji Kayu Gergajian" },
    { code: "PKL", name: "Penguji Kayu Lapis" },
    { code: "PCHIP", name: "Penguji Serpih Kayu (PChip)" },
    { code: "HHBK-GETAH", name: "Hasil Hutan Bukan Kayu Kelompok Getah" },
    { code: "HHBK-BATANG", name: "Hasil Hutan Bukan Kayu Kelompok Batang" },
  ];

  const qualMap: Record<string, number> = {};
  for (const q of qualifications) {
    const res = db.prepare(`
      INSERT INTO qualifications (code, name, description, status)
      VALUES (?, ?, ?, 'ACTIVE')
    `).run(q.code, q.name, `Kualifikasi untuk sertifikasi kompetensi ${q.name}`);
    qualMap[q.code] = res.lastInsertRowid;
  }

  // Assign CANHUT qualification to Budi Santoso (participant)
  const canhutId = qualMap["CANHUT"];
  db.prepare(`
    INSERT INTO user_qualifications (user_id, qualification_id)
    VALUES (?, ?)
  `).run(participantId, canhutId);

  // 3. Seed Subjects for CANHUT
  const subjects = [
    { qualificationId: canhutId, code: "CAN-INV", name: "Inventarisasi Hutan", weight: 40 },
    { qualificationId: canhutId, code: "CAN-MEB", name: "Pengukuran & Pemetaan", weight: 30 },
    { qualificationId: canhutId, code: "CAN-SIL", name: "Silvikultur & Pembinaan", weight: 30 },
  ];

  const subMap: Record<string, number> = {};
  for (const s of subjects) {
    const res = db.prepare(`
      INSERT INTO subjects (qualification_id, code, name, weight, status)
      VALUES (?, ?, ?, ?, 'ACTIVE')
    `).run(s.qualificationId, s.code, s.name, s.weight);
    subMap[s.code] = res.lastInsertRowid;
  }

  // 4. Seed Questions under CANHUT Subjects
  // Inventarisasi Hutan Questions
  const questionsList = [
    {
      qualId: canhutId,
      subId: subMap["CAN-INV"],
      text: "Inventarisasi hutan merupakan kegiatan untuk mengetahui potensi, kondisi, dan karakteristik...",
      a: "Hanya tegakan kayu komersial bernilai tinggi",
      b: "Sumber daya hutan secara menyeluruh beserta lingkungannya",
      c: "Kawasan hutan lindung yang terancam punah",
      d: "Satwa liar endemik di dalam area konservasi",
      correct: "B",
      level: "EASY",
      explanation: "Inventarisasi hutan dilakukan secara menyeluruh untuk mengumpulkan data potensi kayu, non-kayu, dan kondisi lingkungan.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-INV"],
      text: "Metode sampling yang paling umum digunakan dalam inventarisasi hutan dengan topografi homogen adalah...",
      a: "Stratified Random Sampling",
      b: "Systematic Line Plot Sampling",
      c: "Simple Random Sampling",
      d: "Cluster Sampling",
      correct: "C",
      level: "MEDIUM",
      explanation: "Untuk kondisi hutan yang seragam (homogen), Simple Random Sampling merupakan metode yang efektif dan sederhana.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-INV"],
      text: "Penerapan teknik penginderaan jauh (Remote Sensing) dalam perencanaan kehutanan terutama digunakan untuk...",
      a: "Menghitung volume kayu per pohon secara mikroskopis",
      b: "Klasifikasi tutupan lahan dan pemantauan deforestasi secara berkala",
      c: "Mengukur kadar air tanah pada kedalaman 5 meter",
      d: "Menentukan jenis pupuk yang cocok untuk tanaman jati",
      correct: "B",
      level: "EASY",
      explanation: "Remote sensing sangat efisien untuk memantau perubahan tutupan lahan skala luas secara dinamis.",
    },
    // Pengukuran & Pemetaan Questions
    {
      qualId: canhutId,
      subId: subMap["CAN-MEB"],
      text: "Pengukuran diameter pohon setinggi dada (Diameter at Breast Height / DBH) dilakukan pada ketinggian standar...",
      a: "1.00 meter dari permukaan tanah",
      b: "1.30 meter dari permukaan tanah",
      c: "1.50 meter dari permukaan tanah",
      d: "2.00 meter dari permukaan tanah",
      correct: "B",
      level: "EASY",
      explanation: "Standar internasional dan nasional untuk pengukuran DBH pohon adalah pada ketinggian 1.3 meter.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-MEB"],
      text: "Alat yang paling tepat digunakan untuk mengukur tinggi pohon secara tidak langsung dengan prinsip klinometer adalah...",
      a: "Pita diameter (phi-band)",
      b: "Haga Hypsometer",
      c: "Caliper kayu",
      d: "Kompas Bidik",
      correct: "B",
      level: "MEDIUM",
      explanation: "Haga Hypsometer merupakan alat pengukur tinggi pohon klasik yang menggunakan prinsip trigonometri/klinometer.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-MEB"],
      text: "Sistem proyeksi peta koordinat nasional yang saat ini digunakan secara resmi di Indonesia untuk pemetaan kehutanan adalah...",
      a: "Universal Transverse Mercator (UTM) WGS 84",
      b: "Conical Orthomorphic",
      c: "Polyeder projection",
      d: "Mercator Secant",
      correct: "A",
      level: "EASY",
      explanation: "UTM WGS 84 merupakan datum dan sistem proyeksi koordinat standar pemetaan nasional di Indonesia.",
    },
    // Silvikultur & Pembinaan Questions
    {
      qualId: canhutId,
      subId: subMap["CAN-SIL"],
      text: "Sistem silvikultur Tebang Pilih Tanam Indonesia (TPTI) terutama ditujukan untuk pengelolaan...",
      a: "Hutan hujan tropis dataran rendah bekas tebangan",
      b: "Hutan tanaman industri monokultur jati",
      c: "Hutan lindung pegunungan berlereng curam",
      d: "Hutan payau/mangrove di pesisir pantai",
      correct: "A",
      level: "EASY",
      explanation: "TPTI dirancang untuk hutan alam produksi bekas tebangan (logged-over forest) tipe hutan hujan tropis.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-SIL"],
      text: "Tujuan utama pelaksanaan penjarangan (thinning) pada tegakan hutan tanaman adalah...",
      a: "Memotong semak belukar yang mengganggu akses",
      b: "Membuka ruang tumbuh bagi pohon prima dengan menebang pohon inferior",
      c: "Merangsang pertumbuhan cabang samping pohon pelindung",
      d: "Memudahkan proses pemungutan hasil hutan non-kayu",
      correct: "B",
      level: "MEDIUM",
      explanation: "Penjarangan mengurangi kerapatan tegakan agar pohon-pohon terbaik mendapatkan nutrisi dan cahaya optimal.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-SIL"],
      text: "Kriteria pohon yang ditetapkan sebagai pohon inti dalam sistem silvikultur TPTI adalah...",
      a: "Pohon komersial berdiameter 20 cm ke atas dengan tajuk sehat",
      b: "Pohon pelindung jenis pioneer berdiameter bebas",
      c: "Pohon buah-buahan liar untuk pakan satwa hutan",
      d: "Semua pohon dengan tinggi minimal 5 meter",
      correct: "A",
      level: "HARD",
      explanation: "Pohon inti disiapkan sebagai tegakan masa depan, disyaratkan jenis komersial berdiameter ≥ 20 cm yang sehat.",
    },
  ];

  // Add extra filler questions to satisfy minimum blueprint size if needed
  // We'll add 3 more questions to CAN-INV, CAN-MEB, CAN-SIL
  const extraQuestions = [
    {
      qualId: canhutId,
      subId: subMap["CAN-INV"],
      text: "Dalam metode sampling sistematik dengan arah strip (line), jarak antar jalur rintisan ditentukan oleh...",
      a: "Kerapatan vegetasi semak belukar saja",
      b: "Luas kawasan hutan dan target sampling intensity",
      c: "Jenis satwa burung yang dominan",
      d: "Arah hembusan angin muson lokal",
      correct: "B",
      level: "MEDIUM",
      explanation: "Sampling intensity menentukan rasio luas area contoh dibanding luas total hutan, yang menentukan jarak antar jalur.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-INV"],
      text: "Kesalahan non-sampling dalam inventarisasi hutan umumnya disebabkan oleh...",
      a: "Jumlah plot sampel yang kurang banyak",
      b: "Ketidakakuratan alat ukur dan kesalahan entri data surveyor",
      c: "Kondisi cuaca hujan badai saat pengukuran",
      d: "Variabilitas alami antar jenis tegakan",
      correct: "B",
      level: "HARD",
      explanation: "Non-sampling error disebabkan oleh human error, kesalahan ukur, atau kalibrasi alat.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-MEB"],
      text: "Pada kompas silva, fungsi jarum penunjuk utara magnetis berwarna merah adalah...",
      a: "Mencatat kemiringan lereng lereng",
      b: "Menunjukkan arah kutub utara magnetik bumi",
      c: "Mengukur kedalaman sungai hutan",
      d: "Menghitung sudut deklinasi tahunan",
      correct: "B",
      level: "EASY",
      explanation: "Jarum merah kompas selalu berorientasi menunjuk arah kutub utara magnetis.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-MEB"],
      text: "Skala peta kehutanan 1:50.000 memiliki makna bahwa jarak 1 cm di peta sama dengan...",
      a: "50 meter di lapangan",
      b: "500 meter di lapangan",
      c: "5 kilometer di lapangan",
      d: "50 kilometer di lapangan",
      correct: "B",
      level: "MEDIUM",
      explanation: "1 cm pada peta skala 1:50.000 sama dengan 50.000 cm = 500 meter di lapangan.",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-SIL"],
      text: "Tindakan silvikultur berupa perintisan (pruning) cabang pohon tegakan ditujukan untuk...",
      a: "Mencegah kebakaran tajuk menjalar ke bawah",
      b: "Meningkatkan kualitas kayu bebas mata kayu pada batang bebas cabang",
      c: "Mempercepat proses pembungaan musiman",
      d: "Mengurangi kelembapan tanah di sekitar perakaran",
      correct: "B",
      level: "MEDIUM",
      explanation: "Pruning cabang bawah menghasilkan batang utama yang lurus, bersih, dan bebas mata kayu (knots).",
    },
    {
      qualId: canhutId,
      subId: subMap["CAN-SIL"],
      text: "Jenis tanaman kehutanan berikut yang dikenal sangat toleran (dapat tumbuh baik di bawah naungan) adalah...",
      a: "Meranti (Shorea spp.) pada stadia anakan/semai",
      b: "Sengon (Falcataria moluccana) pelopor cepat tumbuh",
      c: "Jati (Tectona grandis) dewasa berkayu keras",
      d: "Akasia (Acacia mangium) di padang ilalang terbuka",
      correct: "A",
      level: "HARD",
      explanation: "Semai meranti/dipterokarpa membutuhkan naungan parsial (toleran) di awal pertumbuhan sebelum tajuknya menembus kanopi.",
    },
  ];

  const allQuestions = [...questionsList, ...extraQuestions];

  for (const q of allQuestions) {
    db.prepare(`
      INSERT INTO questions (qualification_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', 1)
    `).run(q.qualId, q.subId, q.text, q.a, q.b, q.c, q.d, q.correct, q.level, q.explanation);
  }

  console.log(`Database seeded successfully! Generated ${allQuestions.length} questions.`);
}
