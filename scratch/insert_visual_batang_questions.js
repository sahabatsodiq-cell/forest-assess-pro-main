import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  const subjectId = 29; // Visual-Batang
  const competencyUnitId = 440; // A.02GNS01.030.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada Prinsipnya Uji Visual pada rotan yaitu memeriksa ciri rotan yang berhubungan dengan..............?",
      option_a: "Cacat",
      option_b: "Jenis",
      option_c: "Kadar Air",
      option_d: "Dimensi",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Uji visual pada rotan difokuskan untuk mengidentifikasi dan menguji ciri-ciri fisik organoleptik yang menentukan Jenis atau Kelompok Jenis rotan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam Prosedur Uji Visual pada rotan diperiksa ciri rotan, kemudian ditentukan..............?",
      option_a: "Jenis atau Kelompok Jenis",
      option_b: "Cacat",
      option_c: "Kadar Air",
      option_d: "Dimensi",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Tahapan awal pengujian visual rotan adalah mengidentifikasi ciri-ciri makroskopis batang rotan untuk menetapkan Jenis atau Kelompok Jenis rotan yang diuji.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Setiap sortimen rotan harus diuji mutunya melalui beberapa macam pengujian yaitu..............?",
      option_a: "Cacat",
      option_b: "Dimensi",
      option_c: "Kuantitas",
      option_d: "Visual dan Laboratoris",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Pengujian mutu sortimen rotan secara komprehensif dilakukan melalui pengujian Visual (pemeriksaan fisik/organoleptik, dimensi, dan cacat) serta pengujian Laboratoris (kadar air dan sifat mekanis).",
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

  console.log("✅ Successfully inserted all 3 questions for Visual-Batang and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
