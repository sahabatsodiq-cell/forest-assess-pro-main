import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 42; // RKU-JaslingWA
  const competencyUnitId = 455; // A.02GNS01.044.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Setiap Perizinan Berusaha Pemanfaatan Hutan wajib menyusun Rencana Kerja Usaha per 10 tahunan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Setiap pemegang PHBP (baik PS maupun korporat) berkewajiban menyusun Rencana Kerja Usaha (RKU) per jangka waktu 10 tahunan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKU disusun oleh pimpinan pemegang PHBP untuk memenuhi kewajiban perizinan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. RKU wajib disusun oleh tenaga teknis berkualifikasi GANISPH sesuai dengan kompetensi yang dipersyaratkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKU menjadi dasar dalam penyusunan Desain Tapak",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Dokumen Desain Tapak justru disusun sebelum izin PHBP terbit dan hasilnya menjadi salah satu acuan dasar yang dicantumkan dalam RKU.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKU tidak perlu mencantumkan proyeksi keuntungan Pemegang PHBP karena bersifat privat",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Proyeksi finansial/keuntungan wajib dicantumkan secara rinci di RKU sebagai bahan evaluasi pertimbangan kelayakan investasi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Penyusunan RKU Wisata Alam bersifat khusus sehingga perlu menyesuaikan trend viral sebagai penarik minat wisatawan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pencantuman suatu tren di RKU harus melalui proses kajian/studi kelayakan agar tidak menjadi bentuk investasi yang justru merusak lingkungan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Program/paket wisata yang akan dilaksanakan tidak perlu dijabarkan dalam RKU",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Rincian program/paket wisata operasional dijabarkan secara terpisah dalam dokumen program wisata yang disusun oleh GANISPH-Pemandu Wisata Alam.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Identifikasi konflik harus dijabarkan dalam RKU termasuk rencana resolusi konflik",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Identifikasi potensi konflik sosial/tenurial serta skenario resolusi konflik merupakan bagian krusial yang wajib dituangkan dalam RKU.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKU wisata alam mengulas dan memberikan data mendetail seluruh master plan yang telah disahkan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. RKU menjabarkan tahapan rencana kegiatan usaha per 10 tahunan. Menjabarkan seluruh masterplan sekaligus akan menyebabkan pengerjaan usaha tidak fokus, tidak efektif, dan tidak efisien.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RPHJP (Rencana Pengelolaan Hutan Jangka Panjang) yang telah disusun oleh KPH selaku pengelola kawasan bisa digunakan juga sebagai RKU Wisata Alam",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. RPHJP KPH bersifat makro/umum untuk seluruh wilayah pengelolaan, sedangkan pemegang izin PHBP tetap berwajib menyusun RKU tersendiri.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] RKU disahkan oleh Gubernur selaku Pejabat Daerah yang membawahi KPH",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. RKU disahkan oleh Menteri LHK melalui sistem informasi setelah dinilai dan dievaluasi oleh Direktur Jenderal.",
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

  console.log("✅ Successfully inserted all 10 questions for RKU-JaslingWA and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
