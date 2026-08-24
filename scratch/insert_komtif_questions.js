import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 6; // Kom-Tif
  const competencyUnitId = 415; // A.02GNS01.003.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN GANDA ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Komunikasi yang terjadi dalam diri seseorang dengan dirinya sendiri, disebut :",
      option_a: "Komunikasi interpersonal",
      option_b: "Komunikasi kelompok",
      option_c: "Komunikasi intrapersonal",
      option_d: "Komunikasi antar budaya",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Komunikasi intrapersonal adalah proses komunikasi yang terjadi di dalam diri individu sendiri (berpikir, merenung, berdialog dengan diri sendiri).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tips membangun komunikasi yang efektif dan efisien, kecuali :",
      option_a: "Mendengarkan lawan bicara",
      option_b: "Memberikan informasi dengan jelas",
      option_c: "Menjelaskan kelemahan lawan bicara",
      option_d: "Mengkombinasikan komunikasi verbal dan non verbal",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Menjelaskan kelemahan lawan bicara bukan merupakan tips komunikasi efektif, melainkan dapat memicu konflik dan sikap defensif.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu tujuan komunikasi yang efektif adalah :",
      option_a: "Memperuncing masalah",
      option_b: "Memotong pembicaraan orang lain",
      option_c: "Menjelaskan etika dalam penampilan kerja",
      option_d: "Membangun kepercayaan",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Komunikasi yang efektif bertujuan menciptakan pemahaman bersama dan membangun rasa percaya (trust) antar pihak.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Beberapa hal berikut yang dapat menjadi kendala dalam komunikasi, kecuali :",
      option_a: "Emosi yang terganggu/tidak stabil",
      option_b: "Status sosial yang sama",
      option_c: "Distorsi persepsi",
      option_d: "Perbedaan budaya",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Status sosial yang sama memudahkan komunikasi dan bukan merupakan kendala/hambatan komunikasi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu hambatan dalam komunikasi adalah hambatan media. Contoh berikut yang termasuk dalam hambatan media tersebut adalah :",
      option_a: "Gangguan suara radio sehingga pendengar tidak dapat mendengarkan pesan dengan jelas",
      option_b: "Pesan yang disampaikan pengirim pesan belum jelas baik bagi dirinya maupun penerima pesan",
      option_c: "Bahasa yang dipergunakan tidak jelas karena mempunyai atau mengandung makna lebih dari satu",
      option_d: "Kurangnya perhatian penerima pesan pada saat menerima/mendengarkan pesan",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Hambatan media/saluran terjadi akibat gangguan fisik atau teknis pada media transmisi sinyal/suara seperti suara derau/radio.",
      status: "ACTIVE"
    },

    // --- BENAR / SALAH ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Gangguan psikologis dalam komunikasi terjadi karena adanya gangguan yang disebabkan oleh persoalan-persoalan dalam diri individu. Contohnya adalah rasa curiga penerima pesan terhadap pengirim pesan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Hambatan psikologis timbul dari faktor intrinsik emosional/sikap mental individu seperti kecurigaan atau prasangka.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dalam komunikasi, hambatan perilaku disebut juga hambatan kemanusiaan. Hambatan perilaku ini tampak dalam berbagai bentuk seperti pandangan yang bersifat apriori.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Hambatan perilaku/kemanusiaan (human barrier) mencakup prasangka, sikap apriori, atau ketidakmauan mendengarkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Gangguan semantic dalam komunikasi adalah gangguan yang disebabkan karena kesalahan pada Bahasa yang digunakan. Salah satu penyebabnya adalah karena kata-kata yang digunakan terlalu banyak menggunakan jargon dalam Bahasa asing sehingga sulit dimengeti pendengar/khalayak.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Pernyataan BENAR. Hambatan semantik berkaitan dengan pemaknaan simbol/bahasa, termasuk penggunaan jargon teknis atau bahasa asing yang membingungkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Peranan Bahasa sangat penting dalam berkomunikasi karena Bahasa merupakan salah satu alat yang digunakan untuk berkomunikasi. Oleh karena itu dalam berkomunikasi kita dapat menggunakan Bahasa daerah masing-masing dengan lawan bicara yang berasal dari daerah yang berbeda.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Menggunakan bahasa daerah masing-masing dengan lawan bicara dari daerah berbeda akan menimbulkan hambatan komunikasi (mispersepsi/tidak paham). Harusnya menggunakan bahasa persatuan/nasional.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Gangguan semantic dalam komunikasi disebabkan karena kita salah dalam mengucapkan atau menuliskan suatu pernyataan sehingga menyebabkan kesalahpahaman atau kesalahan penafsiran yang berakibat pada tidak dipahaminya pesan dengan sempurna sebagaimana mestinya.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Hambatan semantik terjadi saat pemilihan kata, pengucapan, atau penulisan yang salah menimbulkan perbedaan persepsi makna.",
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

  console.log("✅ Successfully inserted all 10 questions and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
