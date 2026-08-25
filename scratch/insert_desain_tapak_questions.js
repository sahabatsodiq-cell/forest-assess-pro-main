import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 41; // Desain-Tapak
  const competencyUnitId = 454; // A.02GNS01.042.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Desain Tapak disusun sebagai awal perencanaan pembangunan dan bisa digunakan sebagai acuan arsitektur pembangunan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Desain tapak disusun untuk menentukan pembagian ruang publik dan ruang usaha, sedangkan untuk desain rancangan arsitektur fisik bangunan menggunakan DED (Detail Engineering Design).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Obyek Daya Tarik Wisata (ODTW) Utama dalam kawasan hutan harus menjadi bagian dari ruang usaha dalam desain tapak",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Berdasarkan Permen LHK No. 13 Tahun 2020, Permen LHK No. 8 Tahun 2019, dan SNI Pengelolaan Wisata Alam, ODTW utama harus ditetapkan sebagai ruang publik.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penentuan dan pembagian ruang dalam desain tapak bisa digunakan untuk menentukan peran pengelolaan wisata alam",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pembagian ruang pada desain tapak dilakukan untuk memberikan keleluasaan serta memperjelas peran dan partisipasi para pihak.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pengelola Kawasan (KPH) adalah pihak yang harus menjadi pelaksana pembangunan ruang usaha",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pembangunan ruang usaha dilaksanakan oleh pihak ketiga (investor/mitra) yang memiliki minat dan izin perizinan pemanfaatan jasa lingkungan wisata alam (PBPH/PHPB Jasling).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Batasan ruang usaha dan ruang publik harus bersifat tegas dan mandiri",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Ruang usaha dan ruang publik merupakan satu kesatuan yang terintegrasi dan saling mendukung dalam zona pemanfaatan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pemahaman terhadap lanskap menjadi penting agar pembangunan sarana – prasarana mewah",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pemahaman lanskap sangat dibutuhkan agar pembangunan sarpras menyatu dan sesuai dengan daya dukung ekologi, geologi, serta nilai sosial budaya.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Air terjun yang menjadi daya tarik utama harus menjadi ruang publik",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Berdasarkan Permen LHK No. 13 Tahun 2020 dan SNI Pengelolaan Wisata Alam, daya tarik wisata (ODTW) utama seperti air terjun harus dialokasikan sebagai ruang publik.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pembangunan sarana – prasarana yang menunjang aktivitas wisata alam bisa dilakukan selama pembiayaan atau modal tersedia",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Pernyataan SALAH. Pembangunan sarpras harus taat mengikuti dokumen perencanaan (Desain Tapak/RPW) yang telah disahkan. Pembangunan di luar peruntukan zona melanggar hukum dan berpotensi merusak ekosistem.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Zona lindung pada wilayah pengelolaan wisata alam bisa dimanfaatkan oleh pihak ketiga sesuai dengan pembagian tata ruang",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pemanfaatan sarana prasarana wisata alam hanya diperbolehkan pada Zona Pemanfaatan yang telah ditetapkan dan disahkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Jalur jelajah satwa yang sangat menarik harus menjadi ruang usaha agar investor tertarik untuk melakukan investasi",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Jalur koridor/jelajah satwa merupakan zona perlindungan yang wajib dilindungi dan diamankan, bukan dikomersialkan menjadi ruang usaha.",
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

  console.log("✅ Successfully inserted all 10 questions for Desain-Tapak and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
