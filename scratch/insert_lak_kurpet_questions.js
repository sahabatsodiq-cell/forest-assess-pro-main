import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 8; // Lak-Kurpet (Pengukuran Perpetaan Hutan)
  const competencyUnitId = 417; // A.02GNS01.006.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Alat ukur sederhana yang digunakan untuk pengukuran areal hutan dalam praktik lapangan antara lain….",
      option_a: "Theodolit dan total station",
      option_b: "Pita ukur, kompas, dan klinometer",
      option_c: "Drone dan LiDAR",
      option_d: "Altimeter dan barometer",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Alat ukur tanah sederhana yang umum digunakan dalam pemetaan hutan lapangan meliputi pita ukur (jarak), kompas (azimuth/arah), dan klinometer (beda tinggi/kelerengan).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pemetaan digital hutan, Sistem Informasi Geografis (SIG) berfungsi untuk…",
      option_a: "Hanya untuk menyimpan data spasial",
      option_b: "Mengelola, menganalisis, dan menyajikan data spasial untuk pemetaan areal hutan",
      option_c: "Mengganti seluruh pekerjaan lapangan",
      option_d: "Mengukur diameter pohon secara otomatis",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Sistem Informasi Geografis (SIG/GIS) berfungsi untuk mengumpulkan, mengelola, menganalisis, dan menyajikan data spasial serta non-spasial dalam pemetaan kawasan hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pembuatan peta hutan, sistem koordinat yang umum digunakan di Indonesia adalah…",
      option_a: "Koordinat spherical",
      option_b: "Koordinat UTM (Universal Transverse Mercator)",
      option_c: "Koordinat polar",
      option_d: "Koordinat kartesian 2D",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Sistem koordinat proyeksi baku yang digunakan dalam pemetaan kawasan hutan di Indonesia adalah UTM (Universal Transverse Mercator).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Alat ukur yang digunakan untuk mengukur sudut horizontal dan vertikal dalam pemetaan hutan adalah…",
      option_a: "Haga meter",
      option_b: "Pita ukur",
      option_c: "Klinometer",
      option_d: "Theodolit",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Theodolit merupakan alat presisi yang dirancang khusus untuk mengukur sudut horizontal (azimuth) dan sudut vertikal dalam pemetaan lapangan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada Permen LHK No. 7 Tahun 2021, yang dimaksud dengan Pemetaan Kawasan Hutan adalah…",
      option_a: "Pemetaan seluruh tutupan lahan di Indonesia",
      option_b: "Pemetaan hasil Pengukuhan Kawasan Hutan sesuai dengan tahapannya",
      option_c: "Pemetaan batas administrasi desa di sekitar hutan",
      option_d: "Pemetaan jalur transportasi di dalam kawasan hutan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Berdasarkan Permen LHK No. 7 Tahun 2021, Pemetaan Kawasan Hutan adalah kegiatan pembuatan peta dari hasil pelaksanaan tata batas/pengukuhan kawasan hutan sesuai tahapan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 19-6728.2-2002, untuk penyusunan neraca sumber daya hutan spasial disyaratkan bahwa…",
      option_a: "Inventarisasi sumber daya hutan telah dilakukan minimal untuk 1 periode",
      option_b: "Inventarisasi sumber daya hutan telah dilakukan minimal untuk 2 periode",
      option_c: "Data/peta harus menggunakan skala 1:100.000",
      option_d: "Hanya menggunakan data penginderaan jauh",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "SNI 19-6728.2-2002 mensyaratkan inventarisasi dilakukan minimal untuk 2 periode agar dapat dihitung perubahan (neraca) sumber daya hutan secara spasial.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Teknologi penginderaan jauh yang mampu menembus awan dan kabut untuk pemetaan hutan adalah…",
      option_a: "Citra optik resolusi tinggi",
      option_b: "Citra inframerah termal",
      option_c: "Synthetic Aperture Radar (SAR)",
      option_d: "Citra Landsat multispektral",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Radar aktif seperti Synthetic Aperture Radar (SAR) memanfaatkan gelombang mikro yang mampu menembus awan, kabut, dan kondisi atmosfer dalam pemetaan penginderaan jauh.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengukuran batas kawasan hutan di lapangan, alat yang digunakan untuk menentukan arah/azimuth adalah…",
      option_a: "Pita ukur",
      option_b: "Klinometer",
      option_c: "Kompas",
      option_d: "Altimeter",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Kompas adalah alat lapangan utama yang digunakan untuk menentukan arah atau sudut azimuth terhadap utara magnitoda.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penggunaan GPS Navigasi untuk pengukuran titik di lapangan dilakukan dengan metode…",
      option_a: "Diferensial",
      option_b: "Real-time kinematic (RTK)",
      option_c: "Absolut dengan averaging",
      option_d: "Statis",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "GPS genggam (navigasi) menggunakan metode penentuan posisi absolut (Single Point Positioning) yang dapat ditingkatkan ketelitiannya menggunakan fitur penjelasan (averaging).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut ini yang BUKAN merupakan alat ukur tanah sederhana untuk pengukuran areal hutan adalah…",
      option_a: "Pita ukur",
      option_b: "Kompas",
      option_c: "Klinometer",
      option_d: "Total station",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Total station tergolong ke dalam kategori alat ukur optik digital modern / presisi tinggi (elektronis), bukan alat ukur tanah sederhana.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada pemetaan digital hutan, teknologi yang mampu menghasilkan data struktur tegakan 3D adalah…",
      option_a: "Citra Landsat multispektral",
      option_b: "Foto udara konvensional",
      option_c: "LiDAR",
      option_d: "Citra inframerah termal",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "LiDAR (Light Detection and Ranging) memancarkan pulsa laser yang mampu merekam struktur kanopi dan permukaan tanah secara 3 dimensi (3D).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pembuatan Peta Tutupan Lahan, standar yang digunakan sebagai acuan klasifikasi adalah…",
      option_a: "SNI 7724:2011",
      option_b: "SNI 7725:2011",
      option_c: "SNI 7645:2010",
      option_d: "SNI 19-6728.2-2002",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "SNI 7645:2010 adalah Standar Nasional Indonesia mengenai Klasifikasi Tutupan Lahan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tahapan dalam prosedur teknis pengukuran dan pemetaan hutan yang benar adalah…",
      option_a: "Persiapan → Pembuatan peta → Pengambilan data lapangan → Pengolahan data",
      option_b: "Persiapan → Pengambilan data lapangan → Pengolahan data → Pembuatan peta",
      option_c: "Pembuatan peta → Pengambilan data lapangan → Pengolahan data → Persiapan",
      option_d: "Pengambilan data lapangan → Persiapan → Pengolahan data → Pembuatan peta",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Tahapan alur pemetaan yang benar dimulai dari Persiapan (perencanaan), Pengambilan data lapangan (survei), Pengolahan data, hingga Pembuatan peta akhir (kartografi).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Alat ukur tanah presisi yang digunakan untuk mengukur sudut horizontal dan vertikal dalam pemetaan hutan adalah…",
      option_a: "Haga meter",
      option_b: "GPS",
      option_c: "Klinometer",
      option_d: "Theodolit",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Theodolit adalah alat ukur tanah tingkat presisi tinggi yang digunakan untuk mengukur sudut horizontal dan sudut vertikal.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut yang merupakan keluaran (output) dari kegiatan Pemetaan Kawasan Hutan adalah…",
      option_a: "Tabel volume tegakan per hektar",
      option_b: "Surat keterangan hasil pengukuran kayu",
      option_c: "Peta kawasan hutan yang memuat posisi, batas, dan luasan",
      option_d: "Jumlah pohon per petak ukur",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Output utama pemetaan kawasan hutan adalah dokumen spatial berupa Peta Kawasan Hutan yang menyajikan informasi posisi geografis, batas kawasan, dan luasan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Perbedaan mendasar antara Pengukuran dan Pemetaan Hutan dengan Inventarisasi Hutan terletak pada…",
      option_a: "Alat yang digunakan",
      option_b: "Objek kerja dan keluaran yang dihasilkan",
      option_c: "Tempat pelaksanaan",
      option_d: "Jumlah tenaga yang dibutuhkan",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Perbedaan mendasar terletak pada objek dan outputnya; Pemetaan menghasilkan informasi spasial (peta batas dan luasan), sedangkan Inventarisasi menghasilkan data potensi (pohon, volume, tegakan).",
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

  console.log("✅ Successfully inserted all 16 questions for Lak-Kurpet (A.02GNS01.006.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
