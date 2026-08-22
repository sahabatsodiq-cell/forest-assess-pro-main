import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

console.log("Connecting to Supabase PostgreSQL Cloud to insert K3 questions for unit A.02GNS01.001.1...");
const sql = postgres(connectionString, { ssl: "require" });

const questionsData = [
  // Pilihan Ganda (1-10)
  {
    question_text: "Alat pelindung diri (APD) yang berguna untuk melindungi pekerja dari debu atau aroma bau yang menyengat dan tidak sedap adalah :",
    option_a: "Masker",
    option_b: "Sarung tangan",
    option_c: "Full body harness",
    option_d: "Safety glasses",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Masker berfungsi melindungi saluran pernapasan dari hirupan debu, partikel micro, dan bau kimia/organik menyengat."
  },
  {
    question_text: "Pernyataan berikut yang bukan merupakan karakteristik dari risiko adalah :",
    option_a: "Merupakan suatu kejadian",
    option_b: "Kejadian tersebut mengandung kemungkinan akan terjadi",
    option_c: "Jika terjadi akan menimbulkan kerugian",
    option_d: "Menimbulkan kehilangan nyawa",
    correct_answer: "D",
    difficulty: "MEDIUM",
    explanation: "Risiko adalah probabilitas terjadinya kejadian yang merugikan. Kehilangan nyawa merupakan salah satu dampak ekstrem, bukan karakteristik definisi risiko secara umum."
  },
  {
    question_text: "Suatu usaha untuk menemukan atau mengetahui risiko-risiko yang mungkin timbul dalam kegiatan yang dilakukan oleh perusahaan atau perorangan disebut :",
    option_a: "Penilaian risiko",
    option_b: "Identifikasi risiko",
    option_c: "Penanganan risiko",
    option_d: "Pengendalian risiko",
    correct_answer: "B",
    difficulty: "EASY",
    explanation: "Identifikasi risiko adalah tahapan menemukan, mengenali, dan mencatat bahaya serta kemungkinan risiko dalam lokasi/kegiatan kerja."
  },
  {
    question_text: "Berdasarkan gambar area kerja berbahaya, penandaan atau pemasangan tanda alat-alat keselamatan yang seharusnya dipasang pada lokasi tersebut kecuali :",
    option_a: "Tanda daerah terbatas",
    option_b: "Tanda selain petugas dilarang masuk",
    option_c: "Barrier gate",
    option_d: "Tanda dilarang masuk",
    correct_answer: "C",
    difficulty: "MEDIUM",
    explanation: "Pemasangan tanda keselamatan mencakup rambu larangan dan batasan akses (tanda daerah terbatas, selain petugas dilarang masuk, dilarang masuk)."
  },
  {
    question_text: "Beberapa masalah K3 ketika GANISPH bekerja di lingkungan perkantoran antara lain, kecuali :",
    option_a: "Pengelolaan instalasi listrik dan sumber api yang tidak aman",
    option_b: "Penempatan APAR yang tidak strategis",
    option_c: "Penataan dokumen dan peralatan yang rapi",
    option_d: "Posisi kerja yang tidak ergonomis",
    correct_answer: "C",
    difficulty: "EASY",
    explanation: "Penataan dokumen dan peralatan yang rapi merupakan tindakan pencegahan kecelakaan kerja (penerapan 5R/5S), bukan masalah K3."
  },
  {
    question_text: "Potensi risiko yang mungkin terjadi dalam kegiatan pengukuran dan pengujian kayu bundar di air, kecuali :",
    option_a: "Scale stick nyempung sungai",
    option_b: "Terlindas alat berat",
    option_c: "Terpeleset di atas batang kayu",
    option_d: "Bahaya tenggelam",
    correct_answer: "B",
    difficulty: "MEDIUM",
    explanation: "Pengukuran kayu di badan air/sungai berisiko tergelincir, alat jatuh, dan tenggelam. Terlindas alat berat terjadi pada pengujian darat/TPN."
  },
  {
    question_text: "Secara umum terdapat 5 faktor bahaya K3 di tempat kerja yaitu :",
    option_a: "Bahaya biologis, kimia, fisik/mekanik, biomekanik/ergonomi dan sosial-psikologis",
    option_b: "Bahaya biologis, kimia, fisik/mekanik, sosio-kultural dan ergonomic",
    option_c: "Bahaya biologis, kimia, fisik/mekanik, fisiologis dan sosial-psikologis",
    option_d: "Bahaya biologis, kimia, fisik/mekanik, religi dan sosial-psikologis",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "5 Faktor bahaya K3 standar tempat kerja adalah Biologis, Kimia, Fisik/Mekanik, Biomekanik/Ergonomi, dan Sosial-Psikologis."
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
    explanation: "Material berbahaya termasuk faktor bahaya Kimia, bukan faktor bahaya Ergonomi/Biomekanik."
  },
  {
    question_text: "Siapa saja yang seharusnya terlibat dalam penerapan atau pelaksanaan K3 :",
    option_a: "Semua personil",
    option_b: "Penanggung jawab K3",
    option_c: "Pekerja lapangan",
    option_d: "Bagian administrasi",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Penerapan K3 adalah tanggung jawab bersama yang wajib dilaksanakan oleh seluruh personil tanpa kecuali."
  },

  // Soal Benar/Salah (1-7)
  {
    question_text: "[Benar/Salah] Salah satu Alat Pelindung Diri (APD) yang diperlukan pada saat bekerja di tempat ketinggian adalah full body harness.",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Pernyataan Benar. Full body harness merupakan APD utama untuk mencegah bahaya jatuh dari ketinggian."
  },
  {
    question_text: "[Benar/Salah] Salah satu hak tenaga kerja menurut Pasal 12 UU Nomor 1 Tahun 1970 adalah meminta kepada pengurus atau pimpinan agar dilaksanakan semua syarat-syarat K3 yang diwajibkan sesuai kondisi lingkungan kerja.",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Pernyataan Benar. Pasal 12 UU No. 1/1970 menjamin hak pekerja untuk meminta pemenuhan seluruh syarat K3 di tempat kerja."
  },
  {
    question_text: "[Benar/Salah] Potensi bahaya yang mungkin terjadi pada saat melakukan kegiatan penebangan pohon dengan menggunakan chainsaw salah satunya adalah gangguan stabilitas tanah dan lereng.",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Pernyataan Benar. Penebangan pohon di wilayah berlereng mempengaruhi stabilitas tanah dan lereng sekitarnya."
  },
  {
    question_text: "[Benar/Salah] Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3) wajib dilaksanakan oleh perusahaan yang mempekerjakan minimal 100 tenaga kerja.",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Pernyataan Benar. Berdasarkan PP No. 50 Tahun 2012, perusahaan yang mempekerjakan minimal 100 orang wajib menerapkan SMK3."
  },
  {
    question_text: "[Benar/Salah] Sistem Manajemen Keselamatan dan Kesehatan Kerja (SMK3) wajib dilaksanakan oleh perusahaan yang memiliki tingkat potensi kecelakaan kerja yang lebih tinggi akibat karakteristik proses.",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Pernyataan Benar. Perusahaan dengan tingkat potensi bahaya tinggi wajib menerapkan SMK3 tanpa memandang jumlah pekerja."
  },
  {
    question_text: "[Benar/Salah] Semua sumber, situasi ataupun aktivitas yang berpotensi menimbulkan cedera (kecelakaan kerja) dan/atau penyakit akibat kerja disebut bahaya (hazard).",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "EASY",
    explanation: "Pernyataan Benar. Hazard (bahaya) didefinisikan sebagai segala sesuatu yang berpotensi menyebabkan kerugian/cedera."
  },
  {
    question_text: "[Benar/Salah] Beberapa faktor yang umum dan berpotensi besar terjadi dan menyebabkan kecelakaan bagi GANISPH yang bekerja di pertambangan terbuka adalah risiko ledakan (blasting), kecelakaan alat berat dan genangan di lubang tambang.",
    option_a: "Benar",
    option_b: "Salah",
    option_c: "-",
    option_d: "-",
    correct_answer: "A",
    difficulty: "MEDIUM",
    explanation: "Pernyataan Benar. Lingkungan tambang terbuka memiliki potensi bahaya tinggi dari peledakan, lalu lintas alat berat, dan genangan air tambang."
  }
];

async function insertK3Questions() {
  try {
    // 1. Get Unit Kompetensi ID for A.02GNS01.001.1
    const unitRows = await sql`SELECT id FROM competency_units WHERE code = 'A.02GNS01.001.1'`;
    if (unitRows.length === 0) {
      console.error("Error: Unit Kompetensi A.02GNS01.001.1 tidak ditemukan!");
      process.exit(1);
    }
    const competencyUnitId = unitRows[0].id;

    // 2. Get default subject ID and qualification ID
    const subjectRows = await sql`SELECT id FROM subjects ORDER BY id ASC LIMIT 1`;
    const subjectId = subjectRows.length > 0 ? subjectRows[0].id : null;

    const qualRows = await sql`SELECT id FROM qualifications ORDER BY id ASC LIMIT 1`;
    const qualificationId = qualRows.length > 0 ? qualRows[0].id : null;

    console.log(`Found Competency Unit ID: ${competencyUnitId}, Subject ID: ${subjectId}, Qualification ID: ${qualificationId}`);

    let insertedCount = 0;
    await sql.begin(async (tx) => {
      for (const q of questionsData) {
        await tx`
          INSERT INTO questions (
            qualification_id,
            subject_id,
            competency_unit_id,
            question_text,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_answer,
            difficulty,
            explanation,
            status
          ) VALUES (
            ${qualificationId},
            ${subjectId},
            ${competencyUnitId},
            ${q.question_text},
            ${q.option_a},
            ${q.option_b},
            ${q.option_c},
            ${q.option_d},
            ${q.correct_answer},
            ${q.difficulty},
            ${q.explanation},
            'ACTIVE'
          );
        `;
        insertedCount++;
      }
    });

    const [{ totalQuestions }] = await sql`
      SELECT COUNT(*)::int as "totalQuestions" 
      FROM questions 
      WHERE competency_unit_id = ${competencyUnitId}
    `;

    console.log(`✓ Inserted ${insertedCount} questions! Total questions for unit A.02GNS01.001.1 in Supabase: ${totalQuestions}`);
    process.exit(0);
  } catch (err) {
    console.error("Error inserting K3 questions:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

insertK3Questions();
