import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 24; // Mutu-KB (Penetapan Mutu Penampilan Kayu Bundar)
  const competencyUnitId = 434; // A.02GNS01.025.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, sortimen kayu bundar kecil (A.I) dan kayu bundar sedang (A.II) memiliki kelas mutu…",
      option_a: "Mutu Utama (U), Pertama (P), Kedua (D), Ketiga (T)",
      option_b: "Mutu Pertama (P), Kedua (D), Ketiga (T), Keempat (M)",
      option_c: "Mutu Utama (U), Pertama (P), Kedua (D), Ketiga (T), Keempat (M), Kelima (L)",
      option_d: "Mutu Pertama (P), Kedua (D), Ketiga (T)",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Untuk sortimen A.I (KBK) dan A.II (KBS) menurut SNI 7535.1:2010, kelas mutu yang berlaku terdiri dari 4 kelas mutu: Pertama (P), Kedua (D), Ketiga (T), dan Keempat (M).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sortimen kayu bundar besar (A.III) berdasarkan SNI 7535.1:2010 memiliki kelas mutu sebanyak…",
      option_a: "4 kelas (P, D, T, M)",
      option_b: "5 kelas (U, P, D, T, M)",
      option_c: "6 kelas (U, P, D, T, M, L)",
      option_d: "3 kelas (P, D, T)",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Untuk sortimen A.III (KBB) pada kayu jati menurut SNI 7535.1:2010 terdiri dari 6 kelas mutu: Utama (U), Pertama (P), Kedua (D), Ketiga (T), Keempat (M), dan Lokal/Kelima (L).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Cacat yang terdapat pada bontos kayu bundar disebut…",
      option_a: "Cacat bentuk",
      option_b: "Cacat permukaan",
      option_c: "Cacat gubal",
      option_d: "Cacat bontos",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Cacat pada permukaan potong ujung/pangkal kayu bundar dinamakan Cacat Bontos.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.1:2010, retak pada kayu bundar didefinisikan sebagai celah dengan lebar…",
      option_a: "≤ 1 mm",
      option_b: "≤ 2 mm",
      option_c: "≤ 3 mm",
      option_d: "≤ 5 mm",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Retak didefinisikan sebagai terpisahnya serat kayu secara memanjang dengan lebar celah ≤ 2 mm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kayu bundar daun lebar dianggap mempunyai benjolan apabila tinggi tonjolan dari badan kayu yang normal adalah…",
      option_a: "≥ 5 cm",
      option_b: "≥ 2 cm",
      option_c: "≥ 3 cm",
      option_d: "≥ 4 cm",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Benjolan diakui sebagai cacat badan kayu apabila tonjolan dari permukaan kayu normal memiliki tinggi ≥ 3 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.1:2010, arah serat pada kayu bundar dinyatakan dengan cara membandingkan penyimpangan serat terhadap…",
      option_a: "Arah vertikal",
      option_b: "Arah horizontal",
      option_c: "Arah sumbu kayu",
      option_d: "Garis lintang",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penyimpangan/kelurusan arah serat diukur dengan membandingkan sudut penyimpangan serat terhadap arah sumbu utama batang kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "SNI 7534.1:2010 memuat persyaratan mutu untuk berbagai jenis kayu daun lebar, KECUALI…",
      option_a: "Kayu eboni (Diospyros spp.)",
      option_b: "Kayu jati (Tectona grandis)",
      option_c: "Kayu gmelina dan akasia",
      option_d: "Kayu mahoni",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Mutu kayu bundar Jati diatur secara khusus dalam SNI 7535.1:2010, sedangkan SNI 7534.1:2010 mengatur kayu bundar rimba/daun lebar selain Jati.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Parameter kesilindrisan (Hsi) dalam penetapan mutu penampilan kayu bundar mengukur…",
      option_a: "Tingkat kebundaran penampang lintang",
      option_b: "Tingkat kebulatan/kesilindrisan kayu",
      option_c: "Penyimpangan arah serat",
      option_d: "Tingkat kelurusan kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kesilindrisan (Hsi) mengukur kelancipan atau tingkat kesilindrisan/kebulatan batang kayu dari pangkal ke ujung.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Parameter kebundaran (Hbr) dalam penetapan mutu penampilan kayu bundar mengukur…",
      option_a: "Tingkat kebulatan/kesilindrisan kayu",
      option_b: "Tingkat kebundaran penampang lintang",
      option_c: "Penyimpangan arah serat",
      option_d: "Tingkat kelurusan kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Kebundaran (Hbr) menilai tingkat kebulatan penampang melintang/bontos kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, ketentuan kelurusan untuk mutu P (Pertama) adalah…",
      option_a: "1 bh ≤ 1 % p",
      option_b: "1 bh ≤ 3 % p",
      option_c: "1 bh ≤ 5 % p",
      option_d: "2 bh ≤ 3 % p",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Toleransi cacat bengkok/kelurusan untuk Mutu P (Pertama) pada kayu Jati adalah maksimal 1 buah kelengkungan dengan kedalaman ≤ 1% dari panjang kayu (p).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, ketentuan kelurusan untuk mutu D (Kedua) adalah…",
      option_a: "1 bh ≤ 1 % p",
      option_b: "1 bh ≤ 3 % p",
      option_c: "1 bh ≤ 5 % p",
      option_d: "2 bh ≤ 3 % p",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Toleransi kelurusan untuk Mutu D (Kedua) pada kayu Jati adalah maksimal 1 buah kelengkungan dengan kedalaman ≤ 3% dari panjang kayu (p).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu tujuan penetapan mutu penampilan kayu bundar adalah…",
      option_a: "Menentukan volume kayu",
      option_b: "Menentukan harga jual kayu",
      option_c: "Menilai kualitas kayu berdasarkan cacat yang tampak secara visual",
      option_d: "Menentukan berat jenis kayu",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Tujuan pengujian mutu penampilan (visual) adalah mengidentifikasi dan menilai kelas kualitas kayu berdasarkan keberadaan cacat-cacat fisik yang tampak secara visual.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7534.1:2010, cacat bontos (Gr/Tb) untuk mutu tertentu dinyatakan dalam…",
      option_a: "% terhadap panjang kayu (p)",
      option_b: "% terhadap diameter (d)",
      option_c: "Jumlah absolut (bh)",
      option_d: "% terhadap volume kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Persyaratan cacat bontos seperti gerowong (Gr) atau Teras Busuk (Tb) diukur dan dinyatakan dalam persentase (%) terhadap diameter rata-rata (d) bontos.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, untuk sortimen KBB (A.III), kelas mutu Utama (U) hanya berlaku untuk…",
      option_a: "Kayu bundar kecil",
      option_b: "Kayu bundar sedang",
      option_c: "Kayu bundar besar",
      option_d: "Semua sortimen",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Kelas Mutu Utama (U) pada kayu Jati secara khusus hanya ditetapkan bagi sortimen A.III (Kayu Bundar Besar / KBB).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "SNI 7534.1:2010 memuat persyaratan mutu untuk jenis kayu rasamala dan puspa dalam lampiran…",
      option_a: "Lampiran A",
      option_b: "Lampiran D",
      option_c: "Lampiran E",
      option_d: "Lampiran F",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Persyaratan khusus pengujian mutu kayu Rasamala dan Puspa dicantumkan pada Lampiran E SNI 7534.1:2010.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, cacat gubal pada kayu jati dinilai berdasarkan…",
      option_a: "Jumlah lubang gubal (Lgb)",
      option_b: "Ketebalan gubal (Gb)",
      option_c: "Kedua parameter di atas (Gb dan Lgb)",
      option_d: "Warna gubal",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Penilaian gubal pada kayu Jati memperhitungkan batas toleransi ketebalan gubal (Gb) dan/atau cacat akibat lubang gubal (Lgb).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam penetapan mutu penampilan kayu bundar, penandaan mutu pada kayu dilakukan setelah…",
      option_a: "Pengukuran volume selesai",
      option_b: "Penetapan mutu selesai",
      option_c: "Penetapan jenis kayu selesai",
      option_d: "Pengujian kadar air selesai",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Penandaan/labeling simbol kelas mutu pada kayu bundar fisik dilakukan segera setelah seluruh proses pemeriksaan dan pengujian mutu selesai dilakukan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "SNI 7534.1:2010 memuat persyaratan mutu untuk jenis kayu sonokeling dalam lampiran…",
      option_a: "Lampiran D",
      option_b: "Lampiran E",
      option_c: "Lampiran F",
      option_d: "Lampiran G",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Persyaratan mutu kayu Sonokeling diatur dalam Lampiran G SNI 7534.1:2010.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.1:2010, alur didefinisikan sebagai…",
      option_a: "Tonjolan pada badan kayu",
      option_b: "Luka bekas penyadapan getah",
      option_c: "Lekuk memanjang pada permukaan kayu",
      option_d: "Penyimpangan arah serat",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Alur adalah cacat bentuk badan kayu berupa lekukan memanjang pada permukaan badan kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.1:2010, bekas sadapan didefinisikan sebagai…",
      option_a: "Lekuk memanjang pada permukaan kayu",
      option_b: "Luka atau cacat di badan yang disebabkan oleh bekas penyadapan getah",
      option_c: "Tonjolan pada badan kayu",
      option_d: "Cacat pada bontos",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Bekas sadapan didefinisikan sebagai cacat pada badan kayu akibat penorehan/bekas luka penyadapan getah.",
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

  console.log("✅ Successfully inserted all 20 questions for Mutu-KB (A.02GNS01.025.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
