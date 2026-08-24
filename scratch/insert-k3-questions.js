import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

console.log("Connecting to Supabase PostgreSQL Cloud to update K3 questions...");
const sql = postgres(connectionString, { ssl: "require" });

const questionsData = [
  // SOAL A: PILIHAN GANDA (1 - 10)
  {
    question_text: "Alat pelindung diri (APD) yang berguna untuk melindungi pekerja dari debu atau aroma bau yang menyengat dan tidak sedap adalah :",
    option_a: "Masker",
    option_b: "Sarung tangan",
    option_c: "Full body harness",
    option_d: "Safety glasses",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Masker berfungsi melindungi saluran pernapasan dari hirupan debu, partikel mikro, dan bau menyengat."
  },
  {
    question_text: "Pernyataan berikut yang bukan merupakan karateristik dari risiko adalah :",
    option_a: "Merupakan suatu kejadian",
    option_b: "Kejadian tersebut mengandung kemungkinan akan terjadi",
    option_c: "Jika terjadi akan menimbulkan kerugian",
    option_d: "Menimbulkan kehilangan nyawa",
    correct_answer: "D",
    difficulty: "MEDIUM",
    explanation: "Risiko adalah probabilitas terjadinya kejadian yang merugikan. Kehilangan nyawa merupakan salah satu dampak ekstrem, bukan definisi karakteristik umum."
  },
  {
    question_text: "Suatu usaha untuk menemukan atau mengetahui risiko-risiko yang mungkin timbul dalam kegiatan yang dilakukan oleh perusahaan atau perorangan disebut :",
    option_a: "Penilaian risiko",
    option_b: "Identifikasi risiko",
    option_c: "Penanganan risiko",
    option_d: "Pengendalian risiko",
    correct_answer: "B",
    difficulty: "EASY",
    explanation: "Identifikasi risiko adalah proses menemukan, mengenali, dan mencatat risiko-risiko dalam kegiatan kerja."
  },
  {
    question_text: "Berdasarkan gambar area kerja berbahaya, penandaan atau pemasangan tanda alat-alat keselamatan yang seharusnya dipasang pada lokasi tersebut kecuali :",
    option_a: "Tanda daerah terbatas",
    option_b: "Tanda selain petugas dilarang masuk",
    option_c: "Barrier gate",
    option_d: "Tanda dilarang masuk",
    correct_answer: "C",
    difficulty: "MEDIUM",
    explanation: "Penandaan alat keselamatan meliputi rambu larangan/akses (Tanda daerah terbatas, selain petugas dilarang masuk, dilarang masuk)."
  },
  {
    question_text: "Beberapa masalah K3 ketika GANISPH bekerja di lingkungan perkantoran antara lain, kecuali :",
    option_a: "Pengelolaan instalasi listrik dan sumber api yang tidak aman",
    option_b: "Penempatan APAR yang tidak strategis",
    option_c: "Penataan dokumen dan peralatan yang rapi",
    option_d: "Posisi kerja yang tidak ergonomis",
    correct_answer: "C",
    difficulty: "EASY",
    explanation: "Penataan dokumen dan peralatan yang rapi merupakan penerapan 5R/5S pencegahan kecelakaan, bukan masalah K3."
  },
  {
    question_text: "Potensi risiko yang mungkin terjadi dalam kegiatan timber cruising, kecuali :",
    option_a: "Diserang binatang buas",
    option_b: "Terpapar bahan berbahaya",
    option_c: "Topografi lapangan / medan yang berat",
    option_d: "Jalan licin dan bergelombang",
    correct_answer: "B",
    difficulty: "MEDIUM",
    explanation: "Kegiatan timber cruising di hutan rawan serangan binatang buas, medan berat, dan jalan licin. Terpapar bahan berbahaya bukan risiko utama cruising."
  },
  {
    question_text: "Secara umum terdapat 5 faktor bahaya K3 di tempat kerja yaitu :",
    option_a: "Bahaya biologis, kimia, fisik/mekanik, biomekanik/ergonomi dan sosial-psikologis",
    option_b: "Bahaya biologis, kimia, fisik/mekanik, sosio-kultural dan ergonomic",
    option_c: "Bahaya biologis, kimia, fisik/mekanik, fisiologis dan sosial-psikologis",
    option_d: "Bahaya biologis, kimia, fisik/mekanik, religi dan sosial-psikologis",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "5 Faktor bahaya K3 tempat kerja: Biologis, Kimia, Fisik/Mekanik, Biomekanik/Ergonomi, dan Sosial-Psikologis."
  },
  {
    question_text: "Faktor bahaya kimia dalam K3 adalah kecuali :",
    option_a: "Beracun",
    option_b: "Radioaktif",
    option_c: "Korosif",
    option_d: "Tekanan",
    correct_answer: "D",
    difficulty: "EASY",
    explanation: "Tekanan merupakan faktor bahaya Fisik/Mekanik, sedangkan Beracun, Radioaktif, dan Korosif adalah faktor bahaya Kimia."
  },
  {
    question_text: "Faktor bahaya biomekanik/ergonomic dalam K3 adalah kecuali :",
    option_a: "Postur/posisi kerja",
    option_b: "Pengangkutan manual",
    option_c: "Material berbahaya",
    option_d: "Desain tempat kerja/alat/mesin",
    correct_answer: "C",
    difficulty: "EASY",
    explanation: "Material berbahaya termasuk faktor bahaya Kimia."
  },
  {
    question_text: "Siapa saja yang seharusnya terlibat dalam penerapan atau pelaksanaan K3 :",
    option_a: "Semua personil",
    option_b: "Penanggung jawab K3",
    option_c: "Pekerja lapangan",
    option_d: "Bagian administrasi",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Penerapan K3 merupakan kewajiban dan tanggung jawab seluruh personil dalam organisasi."
  },

  // SOAL B: PILIHAN BENAR ATAU SALAH (1 - 7)
  {
    question_text: "[Benar/Salah] Salah satu Alat Pelindung Diri yang diperlukan pada saat bekerja di tempat ketinggian adalah full body harness",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Full body harness adalah APD wajib pencegah jatuh saat bekerja di ketinggian."
  },
  {
    question_text: "[Benar/Salah] Salah satu hak tenaga kerja menurut Pasal 12 UU Nomor 1 Tahun 1970 adalah meminta kepada pengurus atau pimpinan agar dilaksanakan semua syarat-syarat K3 yang diwajibkan sesuai kondisi lingkungan kerja",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Pasal 12 UU No. 1/1970 menjamin hak pekerja meminta pelaksanaan syarat K3 yang diwajibkan."
  },
  {
    question_text: "[Benar/Salah] Potensi bahaya yang mungkin terjadi pada saat melakukan kegiatan penebangan pohon dengan menggunakan chainsaw salah satunya adalah gangguan stabilitas tanah dan lereng",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Penebangan pohon di kelerengan dapat memicu erosi dan stabilitas tanah."
  },
  {
    question_text: "[Benar/Salah] Sistem manajemen keselamatan dan kesehatan kerja (SMK3) wajib dilaksanakan oleh perusahaan yang mempekerjakan minimal 100 tenaga kerja",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Wajib SMK3 berlaku bagi perusahaan dengan minimal 100 tenaga kerja atau tingkat potensi bahaya tinggi."
  },
  {
    question_text: "[Benar/Salah] Sistem manajemen keselamatan dan kesehatan kerja (SMK3) wajib dilaksanakan oleh perusahaan yang memiliki tingkat potensi kecelakaan kerja yang lebih tinggi akobat karateristik proses",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Potensi bahaya tinggi mewajibkan penerapkan SMK3 sesuai PP No. 50 Tahun 2012."
  },
  {
    question_text: "[Benar/Salah] Semua sumber, situasi ataupun aktivitas yang berpotensi menimbulkan cedera (kecelakaan kerja) dana tau penyakit akibat kerja disebut bahaya (hazard)",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Definisi bahaya (hazard) adalah sumber, situasi, atau tindakan yang berpotensi cedera/sakit."
  },
  {
    question_text: "[Benar/Salah] Beberapa factor yang umum dan berpotensi besar terjadi dan menyebabkan kecelakaan bagi GANISPH yang bekerja di pertambangan terbuka adalah risiko ledakan (blasting), kecelakaan alat berat dan genangan di lubang tambang",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Area tambang terbuka memiliki potensi risiko tinggi ledakan, pergerakan alat berat, dan genangan air."
  }
];

async function insertOrUpdateQuestions() {
  // Ensure K3 qualification exists
  let qual = await sql`SELECT id FROM qualifications WHERE code = 'GANISPH-K3' OR code = 'K3' LIMIT 1`;
  if (qual.length === 0) {
    qual = await sql`SELECT id FROM qualifications ORDER BY id ASC LIMIT 1`;
  }
  const qualificationId = qual[0].id;

  // Ensure K3 subject exists
  let sub = await sql`SELECT id FROM subjects WHERE name ILIKE '%K3%' LIMIT 1`;
  if (sub.length === 0) {
    sub = await sql`SELECT id FROM subjects WHERE qualification_id = ${qualificationId} LIMIT 1`;
  }
  const subjectId = sub[0].id;

  console.log(`Using qualification_id = ${qualificationId}, subject_id = ${subjectId}`);

  // Clean old versions of these questions (ID 17 to 33 or matching text)
  await sql`
    DELETE FROM questions 
    WHERE qualification_id = ${qualificationId} 
       OR question_text ILIKE 'Alat pelindung diri%'
       OR question_text ILIKE 'Pernyataan berikut yang bukan merupakan%'
       OR question_text ILIKE 'Potensi risiko yang mungkin terjadi dalam kegiatan timber cruising%';
  `;

  for (const q of questionsData) {
    const inserted = await sql`
      INSERT INTO questions (
        qualification_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, status
      ) VALUES (
        ${qualificationId}, ${subjectId}, ${q.question_text}, ${q.option_a}, ${q.option_b}, ${q.option_c}, ${q.option_d}, ${q.correct_answer}, ${q.difficulty}, ${q.explanation}, 'ACTIVE'
      ) RETURNING id;
    `;
    console.log(`Inserted question ID ${inserted[0].id}: ${q.question_text.slice(0, 50)}...`);
  }

  console.log("All K3 questions updated successfully!");
  await sql.end();
}

insertOrUpdateQuestions().catch(console.error);
