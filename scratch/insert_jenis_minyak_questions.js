import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 57; // Jenis-Minyak (Penetapan Nama Jenis Kelompok Minyak)
  const competencyUnitId = 451; // A.02GNS01.063.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kelompok minyak sesuai dengan Keputusan Menteri Tenaga Kerja dan Transmigrasi RI Nomor 144 Tahun 2013 adalah Resin, Minyak Atsiri, dan Minyak Lemak.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Berdasarkan Kepmenakertrans RI No. 144 Tahun 2013, kelompok minyak dibagi menjadi Kelompok Minyak Atsiri dan Kelompok Minyak Lemak.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Jenis minyak yang tidak termasuk dalam kelompok minyak atsiri adalah :",
      option_a: "Minyak Cendana",
      option_b: "Minyak Kemiri",
      option_c: "Minyak Sereh",
      option_d: "Minyak Ylang-ylang",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Minyak kemiri termasuk dalam kelompok minyak lemak, bukan kelompok minyak atsiri.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Minyak kayu putih masuk dalam family ?",
      option_a: "Myrtaceae",
      option_b: "Orchidaceae",
      option_c: "Arecaceae",
      option_d: "Euphorbiaceae",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Minyak kayu putih (Melaleuca cajuputi) tergolong dalam suku/famili Myrtaceae.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Minyak Atsiri adalah minyak yang diperoleh dari tumbuhan melalui proses distilasi. Dapat diperoleh dari akar, kulit, batang, bunga, biji, dan bagian kelenjar daun atau seluruh bagian tanaman lain tergantung pada jenis tumbuhannya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Minyak atsiri diperoleh dari berbagai bagian tumbuhan melalui proses distilasi (penyulingan).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Minyak terpentin merupakan minyak atsiri yang diperoleh dari getah Pinus (Pinus sp.) dengan cara penyulingan uap pada suhu dibawah 180 °C dengan senyawa utama alfa pinena.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Minyak terpentin diperoleh dari hasil penyulingan uap getah Pinus (Pinus sp.) pada suhu di bawah 180 °C dengan senyawa utama alfa pinena.",
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

  console.log("✅ Successfully inserted all 5 questions for Jenis-Minyak (A.02GNS01.063.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
