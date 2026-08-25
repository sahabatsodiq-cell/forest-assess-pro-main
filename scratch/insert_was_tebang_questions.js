import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 18; // Was-Tebang
  const competencyUnitId = 428; // A.02GNS01.018.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    // --- PILIHAN BENAR ATAU SALAH (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Pemotongan ujung batang utama dilakukan sedekat mungkin dengan cabang pertama untuk memperoleh efisiensi pemanfaatan kayu maksimal.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Bagian ujung batang utama (sebelum percabangan tajuk) harus dipotong mepet ke cabang pertama agar bagian kayu bebas cabang termanfaatkan secara utuh tanpa terbuang sebagai limbah pemanenan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "[Benar / Salah] Bagi pemegang PBPH dengan kegiatan Pemanfaatan Hasil Hutan Kayu tumbuh alami (Hutan alam) yang sudah RIL atau RIL-C tidak dapat mengajukan permohonan peningkatan efisiensi penebangan khususnya faktor eksploitasi serta pemanfaatan limbah kepada Menteri.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pemegang PBPH di hutan alam yang menerapkan sistem pemanenan berdampak rendah (RIL/RIL-C) justru diberikan hak mengajukan peningkatan angka faktor eksploitasi (FE) yang lebih tinggi kepada Menteri karena terbukti menghasilkan limbah penebangan minimal.",
      status: "ACTIVE"
    },

    // --- PILIHAN GANDA (2 Soal) ---
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Setiap pohon yang akan ditebang akan dipasangi label QR Code. Berikut ADALAH hal-hal yang termuat dalam Barcode / QR Code tersebut, kecuali :",
      option_a: "Jenis pohon",
      option_b: "Nomor petak kerja",
      option_c: "Nomor pohon",
      option_d: "Tahun tanam pohon",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Dalam penatausahaan hasil hutan (PUHH) khususnya lacak balak digital (SIPUHH), label barcode pohon tebangan memuat identitas jenis, nomor pohon, dan nomor petak/blok tebangan. Informasi tahun tanam pohon tidak ada karena merupakan hutan alam (tumbuh alami).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Arah rebah pada penebangan terkontrol (directional felling) disarankan pada posisi membentuk sudut ......... terhadap jalan sarad (pola sirip tulang ikan)",
      option_a: "30° - 60°",
      option_b: "5° - 20°",
      option_c: "45° - 60°",
      option_d: "75° - 90°",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Arah rebah tebangan terkendali idealnya membentuk sudut lancip antara 30° s.d. 60° terhadap rute jalan sarad. Pola rebah menyerupai sirip tulang ikan ini bertujuan agar proses penarikan log (winching/skidding) oleh traktor menjadi sangat mudah dan meminimalkan kerusakan tanah dan tegakan tinggal.",
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

  console.log("✅ Successfully inserted all 4 questions for Was-Tebang and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
