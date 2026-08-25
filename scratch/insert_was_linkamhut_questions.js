import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 46; // Was-Linkamhut
  const competencyUnitId = 461; // A.02GNS01.049.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut prinsip perlindungan dan pengamanan hutan, kecuali:",
      option_a: "Pengendalian hama dan penyakit atau Organisme Pengganggu Tanaman (OPT)",
      option_b: "Pengendalian terhadap perubahan kondisi fisik sumber daya hutan",
      option_c: "Perlindungan hutan dari kebakaran hutan, perambahan hutan, dan pencurian hasil hutan",
      option_d: "Memberikan kepastian usaha dalam pengelolaan hutan produksi",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengendalian terhadap perubahan kondisi fisik sumber daya hutan bukan merupakan prinsip dalam penyelenggaraan perlindungan dan pengamanan hutan yang diatur oleh undang-undang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tidak melaksanakan perlindungan hutan di areal kerjanya, PBPH dikenakan sanksi:",
      option_a: "Sanksi denda",
      option_b: "Sanksi administratif berupa teguran tertulis",
      option_c: "Sanksi administratif berupa pembekuan PBPH",
      option_d: "Sanksi penghentian pelayanan",
      correct_answer: "C",
      difficulty: "MEDIUM",
      explanation: "Berdasarkan peraturan perundangan-undangan kehutanan, pemegang PBPH yang lalai dalam menjaga dan melakukan upaya perlindungan hutan di areal kerjanya dikenakan sanksi administratif berupa pembekuan PBPH.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Perlindungan hutan wajib dilaksanakan, kecuali oleh:",
      option_a: "Persetujuan Penggunaan Kawasan Hutan",
      option_b: "Hutan adat",
      option_c: "Perizinan Berusaha Pemanfatan Hutan",
      option_d: "Pemegang persetujuan Hutan Desa, Hutan Kemasyarakatan, dan HTR",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Penyelanggaran perlindungan hutan di hutan adat dilakukan oleh masyarakat hukum adat yang bersangkutan berdasarkan kearifan lokal mereka sendiri, bukan kewajiban mutlak administratif dari pemegang hak kelola eksternal negara.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut adalah upaya dalam rangka penyelenggaraan Perlindungan Hutan, kecuali:",
      option_a: "Melakukan inventarisasi hutan",
      option_b: "Melakukan inventarisasi permasalahan",
      option_c: "Melakukan sosialisasi dan penyuluhan peraturan perundang-undangan di bidang kehutanan",
      option_d: "Mendorong peningkatan produktivitas masyarakat",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Melakukan inventarisasi hutan merupakan bagian dari kegiatan perencanaan kehutanan makro, sedangkan perlindungan hutan berfokus pada penanganan masalah lapangan seperti inventarisasi permasalahan, sosialisasi hukum, dan pemberdayaan ekonomi sekitar hutan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Faktor penyebab kerusakan hutan yaitu:",
      option_a: "Kebakaran hutan",
      option_b: "Manusia, hewan, alam,",
      option_c: "Hama dan penyakit",
      option_d: "Semuanya benar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Kerusakan hutan dapat dipicu oleh intervensi faktor manusia (perambahan, illegal logging), aktivitas alam (gunung meletus, longsor), hama dan penyakit tanaman, serta kebakaran hutan.",
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

  console.log("✅ Successfully inserted all 5 questions for Was-Linkamhut and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
