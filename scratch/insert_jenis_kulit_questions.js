import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 38; // Jenis-Kulit (Penetapan Nama Jenis Kelompok Kulit)
  const competencyUnitId = 448; // A.02GNS01.039.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Nama ilmiah dari kulit gemor dengan warna kulit kuning pucat adalah…..",
      option_a: "Nothophoebe umbelliflora Blume",
      option_b: "Nothophoebe coriacea Kosterm",
      option_c: "Nothophoebe Blume Kosterm",
      option_d: "Nothophoebe lauraceae",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kulit gemor dengan warna kulit kuning pucat memiliki nama ilmiah Nothophoebe coriacea Kosterm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan standar nasional Indonesia nomer berapa penentuan syarat mutu kulit gemor?",
      option_a: "SNI 8891 : 2020",
      option_b: "SNI 7098 : 2013",
      option_c: "SNI 7898 : 2013",
      option_d: "SNI 7941 : 2013",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penentuan syarat mutu kulit gemor diatur berdasarkan Standar Nasional Indonesia SNI 7898 : 2013.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sesuai dengan SNI 7898 : 2013 hasil syarat mutu berdasarkan penampilan (visual) parameter ketebalan kulit dalam satuan milimeter dengan mutu A nilai minimal 3, warna kulit merah kehitam-hitaman, dan kadar kotoran maksimal 2% adalah jenis …..",
      option_a: "Nothophoebe coriacea Kosterm",
      option_b: "Nothophoebe Blume Kosterm",
      option_c: "kulit gemor",
      option_d: "Nothophoebe umbelliflora Blume",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Berdasarkan SNI 7898 : 2013, kriteria mutu A dengan ketebalan kulit min 3 mm, warna merah kehitam-hitaman, dan kadar kotoran maks 2% merupakan jenis Nothophoebe umbelliflora Blume.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kulit kayu berdasarkan SNI 8891 : 2020 yang mempunyai bau khas aromatik (rasa agak manis, agak pedas, kelat) dan berwarna coklat kekuningan merupakan jenis kulit ……",
      option_a: "Kayu manis",
      option_b: "Kayu masohi",
      option_c: "Kayu gemor",
      option_d: "Kayu bodi",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Berdasarkan SNI 8891 : 2020, kulit kayu dengan bau khas aromatik (rasa manis, pedas, kelat) dan berwarna coklat kekuningan adalah jenis kayu manis.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7941 : 2013 kulit kayu yang mempunyai aroma seperti kelapa, rasa kulit apabila digigit terasa getir, warna kulit coklat kekuningan, dan kulit bagian dalam jika digores akan timbul minyak merupakan jenis kulit …..",
      option_a: "gemor",
      option_b: "masohi",
      option_c: "kayumanis",
      option_d: "matoa",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Berdasarkan SNI 7941 : 2013, kulit kayu beraroma kelapa, terasa getir saat digigit, berwarna coklat kekuningan, dan mengeluarkan minyak jika digores adalah jenis kulit masohi.",
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

  console.log("✅ Successfully inserted all 5 questions for Jenis-Kulit (A.02GNS01.039.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
