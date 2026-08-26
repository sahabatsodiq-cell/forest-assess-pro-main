import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 32; // Jenis-Resin (Penetapan Nama Jenis Kelompok Resin)
  const competencyUnitId = 442; // A.02GNS01.033.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Resin yang merupakan hasil olahan dari getah batang pohon tusam disebut:",
      option_a: "Gaharu",
      option_b: "Damar Mata Kucing",
      option_c: "Gondorukem",
      option_d: "Kemenyan",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Gondorukem adalah hasil olahan dari getah batang pohon tusam (Pinus merkusii).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kopal adalah hasil olahan getah (resin) yang disadap dari batang pohon:",
      option_a: "Pinus",
      option_b: "Agathis",
      option_c: "Medang",
      option_d: "Gaharu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kopal diperoleh dari olahan getah/resin pohon damar (Agathis loranthifolia / Agathis spp.).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kelompok Meranti-merantian, khususnya meranti putih dapat menghasilkan resin yang disebut:",
      option_a: "Kopal",
      option_b: "Gondorukem",
      option_c: "Kamedangan",
      option_d: "Damar Mata Kucing",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Resin Damar Mata Kucing dihasilkan dari pohon kelompok Dipterocarpaceae (meranti-merantian), khususnya jenis meranti putih (Shorea javanica).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Resin yang lazim digunakan sebagai bahan dupa, pewarna dan obat tradisional adalah:",
      option_a: "Jernang",
      option_b: "Kemenyan",
      option_c: "Kamedangan",
      option_d: "Gaharu",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Jernang (dragon's blood) adalah resin dari buah rotan jernang (Daemonorops spp.) yang lazim digunakan sebagai pewarna alami, obat tradisional, dan bahan dupa.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Resin yang digunakan sebagai lapisan pelindung perabot yang terbuat dari kayu adalah :",
      option_a: "Shellac",
      option_b: "Kopal",
      option_c: "Gondorukem",
      option_d: "Kemenyan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Shellac (lak) merupakan resin alami yang diolah dan digunakan secara luas sebagai lapisan pelindung (vernis/finishing) perabot kayu.",
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

  console.log("✅ Successfully inserted all 5 questions for Jenis-Resin (A.02GNS01.033.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
