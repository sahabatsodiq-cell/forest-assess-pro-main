import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 20; // Jenis-Kayu
  const competencyUnitId = 430; // A.02GNS01.021.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sifat kayu yang menunjukkan ukuran relatif dari sel-sel kayu yang menyolok besarnya dalam suatu jenis kayu tertentu disebut :",
      option_a: "Serat",
      option_b: "Gambar",
      option_c: "Tekstur",
      option_d: "Jari-jari",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Tekstur kayu adalah sifat yang menunjukkan ukuran relatif sel-sel kayu (kasar, halus, atau sedang) yang menyolok besarnya dalam jenis kayu tertentu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dibawah ini jenis kayu yang tidak berpori :",
      option_a: "Pulai",
      option_b: "Melur",
      option_c: "Rengas",
      option_d: "Balau",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kayu Melur (Podocarpus spp.) merupakan jenis kayu daun jarum (non-conifer/gymnospermae) yang tidak memiliki pori (pembuluh).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dibawah ini jenis kayu yang memiliki nama Botanis Dipterocarpus spp adalah :",
      option_a: "Keruing",
      option_b: "Ulin",
      option_c: "Merbau",
      option_d: "Kapur",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Keruing adalah nama perdagangan/lokal untuk kelompok jenis kayu dari genus Dipterocarpus spp.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penggolongan parenkim terbagi atas 2 (dua) yaitu :",
      option_a: "Paratrakeal",
      option_b: "Apotrakeal",
      option_c: "Jawaban a dan b salah",
      option_d: "Jawaban a dan b benar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Secara umum sel parenkim aksial pada kayu daun lebar dibagi menjadi 2 kelompok utama: Paratrakeal (berhubungan dengan pori) dan Apotrakeal (tidak berhubungan dengan pori).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Hal-hal yang dipelajari tentang pori adalah :",
      option_a: "Penyebaran pori dan susunan pori",
      option_b: "Jumlah pori",
      option_c: "Ukuran pori dan Isi Pori",
      option_d: "Semua jawaban benar",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Identifikasi makroskopis pori meliputi pengamatan terhadap penyebaran & susunan pori, jumlah/kerapatan pori, serta ukuran dan isi pori (tilosis/endapan).",
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

  console.log("✅ Successfully inserted all 5 questions for Jenis-Kayu and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
