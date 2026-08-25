import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 51; // Mutu-KG
  const competencyUnitId = 466; // A.02GNS01.057.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- BENAR / SALAH (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Terpisahnya serat pada permukaan kayu yang lebar celahnya 4 mm dan tidak menembus permukaan lainnya, dikategorikan sebagai pecah terbuka.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Terpisahnya serat kayu dengan celah terbuka (lebar 4 mm) yang tidak menembus ke permukaan lain dikelompokkan sebagai cacat pecah terbuka.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Mata kayu sehat tergolong ke dalam Cacat Sedang (CS)",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Mata kayu sehat tergolong ke dalam kategori Cacat Sehat (Cs), bukan Cacat Sedang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Lgk gerombol, Lgs tembus dan Lgb tembus , semuanya termasuk kategori cacat sedang (Cs).",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Cacat lubang gerek tembus (Lgb tembus) dan lubang gubal tembus tergolong Cacat Berat (Cb), bukan Cacat Sedang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pada muka sehat (Ms) tidak diperkenankan adanya saluran getah.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pada kriteria Muka Sehat (Ms), cacat sehat seperti saluran getah berukuran tertentu masih diperbolehkan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Kayu yang mempunyai ukuran kurang dari ukuran baku, mutunya berdasarkan cacat.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Kayu gergajian yang ukurannya di bawah batas ukuran baku dikategori AFKUL (afkir ukuran) dan tidak dapat dinilai kelas mutunya berdasarkan cacat.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (5 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Lubang gerek tersebar adalah lubang gerek yang jumlahnya :",
      option_a: "Lebih dari 6 buah pada permukaan kayu yang luasnya 450 cm2",
      option_b: "Tidak Lebih dari 6 buah pada permukaan kayu yang luasnya 550 cm2",
      option_c: "Lebih dari 6 buah pada permukaan kayu yang luasnya 550 cm2",
      option_d: "Tidak Lebih dari 6 buah pada permukaan kayu yang luasnya 450 cm2",
      correct_answer: "D",
      difficulty: "MEDIUM",
      explanation: "Berdasarkan standar pengujian kayu gergajian, lubang gerek tersebar didefinisikan sebagai lubang gerek dengan kepadatan tidak lebih dari 6 buah per 450 cm² luas permukaan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Noda biru/blue stain adalah warna biru pada permukaan kayu yang disebabkan oleh :",
      option_a: "cuaca",
      option_b: "zat kimia",
      option_c: "jamur",
      option_d: "serangga",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Blue stain (noda biru) disebabkan oleh infeksi jamur pewarna kayu (sapstain fungi).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tidak sempurnanya sudut kayu gergajian, sehingga penampang lintangnya tidak segi empat disebut dengan istilah :",
      option_a: "potongan",
      option_b: "pingul",
      option_c: "salah potong",
      option_d: "serat putus",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Cacat pingul (wane) adalah tidak terbentuknya sudut siku/sempurna pada kayu gergajian akibat sisa kulit atau lengkungan kayu bulat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Syarat khusus sortimen papan lebar dan papan jeblosan kelas mutu P adalah sebagai berikut, kecuali :",
      option_a: "Pingul tidak diperkenankan",
      option_b: "Hati tidak diperkenankan",
      option_c: "Luas muka sehat (Ms) tidak dibatasi/tidak dipersyaratkan",
      option_d: "Cacat sehat (Cs) tidak diperkenankan",
      correct_answer: "C",
      difficulty: "MEDIUM",
      explanation: "Pada papan lebar kelas Mutu P (Prime/Utama), Muka Sehat dipersyaratkan secara ketat, sehingga 'Luas muka sehat tidak dibatasi/tidak dipersyaratkan' merupakan pernyataan pengecualian.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Syarat khusus sortimen broti/balok pendek kelas mutu T adalah sebagai berikut, kecuali :",
      option_a: "Muka bersih (Mb) tidak dibatasi/tidak dipersyaratkan",
      option_b: "Muka sehat (Ms) tidak dibatasi/tidak dipersyaratkan",
      option_c: "Cacat sehat (Cs) tidak dibatasi/tidak dipersyaratkan",
      option_d: "Cacat sehat (Cs) tidak diperkenankan",
      correct_answer: "C",
      difficulty: "MEDIUM",
      explanation: "Pada balok/broti kelas mutu T (Tersedia), batas toleransi cacat diatur secara spesifik sehingga 'Cacat sehat (Cs) tidak dibatasi/tidak dipersyaratkan' adalah pengecualian yang salah.",
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

  console.log("✅ Successfully inserted all 10 questions for Mutu-KG and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
