import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 47; // Monev-Dampak
  const competencyUnitId = 462; // A.02GNS01.050.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Bentuk-bentuk erosi, yaitu: erosi permukaan, erosi percikan, erosi alur, erosi parit, erosi tebing sungai, erosi tepi jalan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Jenis-jenis erosi tanah berdasarkan perkembangannya meliputi erosi percikan (splash), erosi permukaan (sheet), erosi alur (rill), erosi parit (gully), erosi tebing sungai, dan erosi tepi jalan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Metode konservasi tanah dan air yaitu metode vegetatif, metode mekanis dan metode kimiawi",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Metode konservasi tanah dan air secara umum diklasifikasikan menjadi tiga cara, yaitu metode vegetatif (tanaman), metode mekanis (fisik/sipil teknis), dan metode kimiawi (soil conditioner).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Prinsip dasar konservasi air adalah menyimpan air di saat berlebihan dan menggunakannya sebanyak mungkin untuk tujuan produktif",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Prinsip dasar konservasi air adalah memanfaatkan air yang jatuh ke tanah secara seefisien/sebijak mungkin dan menyimpan air yang berlebih, bukan menggunakannya sebanyak-banyaknya tanpa kontrol.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dampak pemanfaatan hutan bagi tanah antara lain pemadatan tanah akibat penyaradan",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Penyaradan kayu menggunakan alat berat (skidder/tractor) menyebabkan tekanan mekanis pada tanah yang memicu pemadatan tanah (soil compaction).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Dampak pemanfaatan hutan terhadap air yaitu menghilangkan peneduh/ pelindung tanah",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Menghilangkan tanaman peneduh/pelindung permukaan tanah adalah bentuk dampak fisik langsung terhadap tanah (kerusakan struktur tanah), bukan dampak langsung terhadap air.",
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

  console.log("✅ Successfully inserted all 5 questions for Monev-Dampak and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
