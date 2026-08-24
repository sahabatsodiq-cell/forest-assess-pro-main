import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 7; // Ren-Kurpet
  const competencyUnitId = 416; // A.02GNS01.005.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "GPS adalah suatu sistem yang didesain untuk dapat menentukan/mencari hal di bawah ini kecuali…..",
      option_a: "Posisi",
      option_b: "kecepatan tiga-dimensi",
      option_c: "waktu",
      option_d: "tinggi objek",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "GPS secara langsung menentukan posisi (3D), kecepatan (3D), dan waktu (timing precision). Tinggi objek bukan parameter dasar pengukuran sinyal GPS.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kelebihan dari sistem GPS ini antara lain adalah seperti di bawah ini, kecuali",
      option_a: "Pemakaian sistem GPS sampai saat ini tidak dikenakan biaya/gratis",
      option_b: "Cara pengoperasiannya mudah, dan cepat",
      option_c: "Tidak tergantung cuaca & dapat digunakan secara simultan",
      option_d: "Dapat digunakan dibawah tegakan atau di dalam bangunan",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Sinyal GPS terhalang oleh struktur bangunan padat dan kanopi tegakan hutan lebat (multipath/attenuation), sehingga bukan kelebihan GPS.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kelemahan GPS diantaranya:",
      option_a: "Relatif sulit memanipulasi data pengamatan",
      option_b: "Cakupan wilayah pengukuran cukup luas",
      option_c: "Ada kecenderungan ukuran receiver semakin kecil",
      option_d: "Diperlukan proses transformasi koordinat apabila penentuan posisi harus dipresentasikan dalam datum lainnya",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "GPS menghasilkan koordinat acuan WGS84, sehingga memerlukan transformasi datum (misal ke DGN95 / TM-3°) bila ingin dipresentasikan dalam sistem peta lokal.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Secara umum GPS terdiri atas tiga segmen utama, kecuali:",
      option_a: "segmen satelit (space segment)",
      option_b: "segmen kontrol (Control Segment)",
      option_c: "segmen pemakai (user segment)",
      option_d: "segmen data (data segment)",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Tiga segmen utama sistem navigasi GPS adalah Segmen Satelit (space), Segmen Kontrol (control), dan Segmen Pengguna/Pemakai (user).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam segmen sistem kontrol GPS, yang bertugas mengamati secara kontinyu satelit GPS yang terlihat, mengirimkan data pseudorange serta pesan navigasi yang dikumpulkan ke MCS untuk diproses secara realtime adalah:",
      option_a: "MS (Monitor Station)",
      option_b: "Ground Antena Stations (GAS),",
      option_c: "Preplaunch Compability Station (PCS)",
      option_d: "Master Control Station",
      correct_answer: "A",
      difficulty: "MEDIUM",
      explanation: "Stasiun Pemantau (Monitor Station/MS) bertugas terus menerus memantau sinyal satelit yang nampak, mengukur pseudorange, dan meneruskan data tersebut ke Master Control Station (MCS).",
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

  console.log("✅ Successfully inserted all 5 questions for Ren-Kurpet and updated competency unit question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
