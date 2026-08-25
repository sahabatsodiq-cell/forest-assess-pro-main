import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 16; // Lak-PWH
  const competencyUnitId = 426; // A.02GNS01.016.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN BENAR ATAU SALAH (3 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Perencanaan, pembuatan dan pemeliharaan jalan angkutan adalah pekerjaan khusus yang harus dilakukan oleh tenaga ahli yang sesuai dengan bidangnya dan para pekerja khusus yang terlatih.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Konstruksi dan perawatan jalan angkutan hutan merupakan rekayasa sipil kehutanan yang membutuhkan keahlian teknis khusus dan tenaga kerja terlatih agar konstruksi jalan kuat dan tahan lama.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pembuatan trase jalan sarad dilakukan dengan penandaan jalur sarad di lapangan melalui pencatatan koordinat setiap titik untuk memudahkan operator traktor melihat dan mengikutinya saat membuka jalan sarad dan sebagai dasar pembuatan peta trase jalan sarad.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penandaan rute jalan sarad secara fisik di lapangan disertai pencatatan koordinat GPS sangat membantu operator alat berat agar terarah dalam pembukaan lahan, meminimalkan kerusakan tegakan tinggal, dan menjadi data digital peta trase.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Saat pengangkutan kayu di dalam hutan, yang harus lebih diperhatikan adalah muatan kendaraan bukan kecepatannya; namun jika di luar lokasi hutan, baik kecepatan kendaraan dan muatan keduanya harus diperhatikan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Di dalam hutan (jalan sarad/jalan cabang), kecepatan kendaraan secara alami sangat lambat karena medan yang berat, sehingga muatan (tonase) yang aman adalah faktor kritis. Sedangkan di luar hutan (jalan umum), batas kecepatan dan muatan sama-sama krusial untuk keselamatan publik dan pemeliharaan jalan.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dibawah ini merupakan faktor-faktor yang mempengaruhi intensitas dan pemilihan peralatan pembukaan wilayah hutan kecuali :",
      option_a: "Jumlah personil operator",
      option_b: "Jumlah kayu yang akan dipanen",
      option_c: "Topografi",
      option_d: "Luas hutan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Intensitas PWH and pemilihan alat dipengaruhi oleh volume panenan kayu, topografi (kelerengan), serta luas wilayah hutan. Jumlah personil operator adalah faktor turunan/kebutuhan tenaga kerja, bukan penentu intensitas/peralatan utama.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Jarak angkut dalam hutan lebih pendek dibanding jarak angkut di luar hutan, sehingga yang wajib diperhatikan oleh operator kendaraan adalah muatannya. Kecepatan kendaraan di jalan utama yang harus dipatuhi adalah :",
      option_a: "4 – 8 km/jam",
      option_b: "10 – 15 km/jam",
      option_c: "30 – 40 km/jam",
      option_d: "40 – 50 km/jam",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Batas kecepatan aman untuk kendaraan angkutan log kayu di jalan utama (koridor utama) di dalam kawasan hutan berkisar antara 30 s.d. 40 km/jam untuk menjaga stabilitas muatan berat dan meminimalkan kerusakan permukaan jalan.",
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

  console.log("✅ Successfully inserted all 5 questions for Lak-PWH and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
