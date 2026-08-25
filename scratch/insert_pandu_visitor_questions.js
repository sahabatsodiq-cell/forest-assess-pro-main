import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  const subjectId = 67; // Pandu-Visitor
  const competencyUnitId = 457; // KHT.PH02.033.01

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pemandu wisata alam bertanggung jawab terhadap Pengelolaan wisata alam secara keseluruhan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pengelolaan wisata alam secara keseluruhan merupakan tanggung jawab bersama seluruh pemangku kepentingan (pemerintah, swasta, masyarakat lokal), sedangkan pemandu wisata alam bertanggung jawab pada aspek pelayanan pemanduan dan keselamatan pengunjung selama tur berlangsung.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Proses identifikasi Obyek Daya Tarik Wisata alam menjadi dasar dalam menyusun program pemanduan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Proses identifikasi Obyek Daya Tarik Wisata (ODTW) alam dilakukan pada tahap studi kelayakan/potensi awal. Pemandu wisata menggunakan hasil observasi langsung dan interpretasi lapangan sebagai dasar menyusun rencana dan skenario program pemanduan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Polusi visual dan estetik akibat kesalahan pembangunan sarana-prasarana bisa menjadi program pemanduan atau paket wisata bergenre 'dark tourism' dengan tujuan memantik pemikiran kritis peserta",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pemandu wisata dapat berkreativitas mengemas dampak kerusakan visual/estetik infrastruktur menjadi materi edukasi berbasis kritik ekologis (dark tourism) untuk memancing kepekaan lingkungan para peserta.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Edukasi terhadap konservasi alam menjadi point penting dalam pemanduan wisata dan harus disampaikan secara merata tanpa terkecuali kepada pengunjung",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Materi edukasi konservasi harus disesuaikan dengan sasaran pengunjung (demografi). Misalnya, materi ekosistem mendalam tidak cocok disampaikan secara mentah-mentah kepada anak usia pra-sekolah karena melampaui daya tangkap mereka.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Denah hasil identifikasi jalur wisata merupakan hasil kreatif interpretasi dari pemandu wisata",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Denah jalur wisata merupakan luaran resmi dari studi potensi wisata di suatu kawasan. Pemandu wisata hanya memanfaatkan denah tersebut sebagai dasar melakukan observasi dan memandu rute perjalanan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Video merupakan alat bantu interpretasi paling efektif",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pemandu wisata itu sendiri adalah media interpretasi paling efektif melalui proses komunikasi dua arah, bahasa tubuh, dan teknik mendongeng (storytelling) yang menghidupkan suasana bagi pengunjung.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Satu destinasi wisata bisa memiliki lebih dari satu program wisata tergantung dari kreativitas pemandu",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Kualifikasi kreativitas pemandu wisata alam memungkinkannya mengemas satu destinasi ke dalam berbagai program wisata tematis yang berbeda (misalnya: paket petualangan, paket fotografi, atau paket pengamatan burung).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pada Peak Season daya tampung wisata bisa diabaikan untuk sementara agar jumlah kunjungan bisa dimaksimalkan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Daya tampung (carrying capacity) kawasan wisata alam mutlak dipatuhi demi kelestarian ekologi. Pengabaian daya tampung pada masa puncak liburan (peak season) akan mempercepat kerusakan ekosistem wisata.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Menciptakan cerita/interpretasi yang spektakuler lebih diutamakan agar pengunjung lebih tertarik",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Narasi cerita interpretasi harus mengutamakan keakuratan data sejarah, studi ilmiah, dan nilai kultural setempat. Melebih-lebihkan cerita demi hiburan semata berisiko menyebarkan informasi yang menyesatkan (misleading information).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Sikap tegas dan taat aturan wajib diterapkan saat melakukan pemanduan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pemandu wisata dituntut untuk mengedepankan keramahan, empati, dan komunikasi persuasif agar tercipta kedekatan emosional dan kenyamanan bagi pengunjung, bukan bersikap kaku atau tegas militeristik.",
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

  console.log("✅ Successfully inserted all 10 questions for Pandu-Visitor and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
