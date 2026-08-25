import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 54; // Mutu-KL
  const competencyUnitId = 469; // A.02GNS01.060.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- BENAR / SALAH (4 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Cacat akibat proses pembuatan kayu lapis yang mempengaruhi mutu kayu lapis adalah Sambungan terbuka, tumpang tindih, lepuh, lekuk, kekasaran, penetrasi perekat.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Cacat pengolahan (manufacturing defects) meliputi sambungan terbuka, tumpang tindih, lepuh, lekuk, kekasaran, dan penetrasi lem.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pada Kayu Lapis daun lebar, untuk kelas penampilan I, syarat untuk adanya mata kayu jarum adalah diperkenankan dengan jumlah 3/m2",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pada kelas penampilan I kayu lapis daun lebar, mata kayu jarum (pin knots) diperbolehkan hingga 3 buah per m².",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pada Kayu Lapis daun lebar, untuk kelas penampilan III, diperkenankan adanya Lepuh asal sedikit",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Cacat lepuh (blister) mutlak tidak diperkenankan pada seluruh kelas penampilan kayu lapis karena menyebabkan kegagalan perekatan/delaminasi.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pada Kayu Lapis daun lebar, untuk kelas penampilan II, diperkenankan adanya Lekuk asal sedikit",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pada kelas penampilan II, cacat lekuk (indentation) skala kecil/sedikit diperbolehkan.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (4 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada Kayu Lapis daun lebar, untuk kelas penampilan I diperkenankan adaya pecah terbuka dengan persyaratan :",
      option_a: "Kurang dari 1/10 panjang panel, dengan lebar masing-masing maksimum 3 mm",
      option_b: "Kurang dari 1/5 panjang panel, dengan lebar masing-masing maksimum 5 mm",
      option_c: "Kurang dari 1/3 panjang panel, dengan lebar masing-masing maksimum 20 mm",
      option_d: "Diperkenankan",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Berdasarkan standar mutu penampilan kayu lapis Mutu I, pecah terbuka (open splits) dibatasi kurang dari 1/10 panjang panel dengan lebar maksimum 3 mm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada Kayu Lapis daun lebar, untuk kelas penampilan I syarat untuk adanya mata kayu sehat adalah :",
      option_a: "Tidak diperkenankan",
      option_b: "Diperkenankan, masing-masing dengan diameter maksimum 15 mm asalkan total diamternya tidak lebih dari 30 mm/m2",
      option_c: "Diperkenankan, masing-masing dengan diameter maksimum 35 mm",
      option_d: "Diperkenankan, masing-masing dengan diameter maksimum 50 mm",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Untuk kelas penampilan I, mata kayu sehat (sound knots) diperbolehkan dengan diameter individual maksimal 15 mm dan akumulasi diameter tidak melebihi 30 mm/m².",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada Kayu Lapis daun lebar, untuk kelas penampilan II syarat untuk adanya cacat sambungan terbuka adalah :",
      option_a: "Tidak diperkenankan",
      option_b: "Diperkenankan dengan lebar maksimum 3 mm dan jumlah maksimum 1/m lebar panel",
      option_c: "Diperkenankan dengan lebar maksimum 5 mm dan jumlah maksimum 2/m lebar panel",
      option_d: "Diperkenankan dengan lebar maksimum 25 mm dan jumlah tidak dibatasi",
      correct_answer: "B",
      difficulty: "MEDIUM",
      explanation: "Pada kelas penampilan II, sambungan terbuka (open joints) diperbolehkan dengan lebar maksimal 3 mm dan frekuensi maksimum 1 per meter lebar panel.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pada Kayu Lapis daun lebar, untuk kelas penampilan I syarat untuk adanya cacat tumpang tindih adalah :",
      option_a: "Tidak diperkenankan",
      option_b: "Diperkenankan maksimum 1/m2 dan panjang maksimum 100 mm",
      option_c: "Diperkenankan maksimum 2/m2",
      option_d: "Diperkenankan",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pada kelas penampilan I (Mutu I Utama), cacat tumpang tindih (overlap) mutlak tidak diperkenankan.",
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

  console.log("✅ Successfully inserted all 8 questions for Mutu-KL and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
