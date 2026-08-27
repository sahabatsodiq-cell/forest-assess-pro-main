import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 23; // Sort-KB (Penetapan Sortimen Kayu Bundar)
  const competencyUnitId = 433; // A.02GNS01.024.1

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Sortimen adalah penggolongan kayu bundar berdasarkan…",
      option_a: "Jenis kayu dan warna",
      option_b: "Ukuran diameter dan/atau kualitas",
      option_c: "Berat jenis kayu",
      option_d: "Kadar air kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Sortimen kayu bundar didefinisikan sebagai pengelompokan/penggolongan kayu bundar berdasarkan ukuran diameter dan/atau mutu kualitasnya.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan besarnya diameter, kayu bundar digolongkan menjadi berapa sortimen?",
      option_a: "2 sortimen",
      option_b: "3 sortimen",
      option_c: "4 sortimen",
      option_d: "5 sortimen",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Berdasarkan ukurannya (diameter), kayu bundar dibagi menjadi 3 kelas sortimen utama: KBK (Kecil), KBS (Sedang), dan KBB (Besar).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kayu Bundar Kecil (KBK) adalah kayu bundar dengan ukuran diameter…",
      option_a: "Kurang dari 10 cm",
      option_b: "Kurang dari 20 cm",
      option_c: "30 cm atau lebih",
      option_d: "20 - 29 cm",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Sortimen Kayu Bundar Kecil (KBK) mencakup kayu bundar berdiameter kurang dari 20 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kayu Bundar Sedang (KBS) dalam klasifikasi jati disebut sortimen…",
      option_a: "A.I",
      option_b: "A.II",
      option_c: "A.III",
      option_d: "A.IV",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Dalam klasifikasi sortimen kayu bundar Jati, sortimen A.II adalah untuk Kayu Bundar Sedang (KBS) dengan diameter 20 cm - 29 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam klasifikasi jati, Kayu Bundar Kecil (KBK) disebut sortimen…",
      option_a: "A.I",
      option_b: "A.II",
      option_c: "A.III",
      option_d: "A.IV",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Dalam penggolongan kayu bundar Jati, sortimen A.I menunjukkan Kayu Bundar Kecil (KBK) berdiameter < 20 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kayu Bundar Besar (KBB) adalah kayu bundar dengan diameter…",
      option_a: "50 cm atau lebih",
      option_b: "10 - 19 cm",
      option_c: "20 - 29 cm",
      option_d: "30 cm atau lebih",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Kayu Bundar Besar (KBB) adalah kelompok sortimen kayu bundar yang memiliki ukuran diameter 30 cm atau lebih.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Standar Nasional Indonesia yang secara khusus mengatur tentang Kayu Bundar rimba sortimen KBK adalah…",
      option_a: "SNI 7533.2:2011",
      option_b: "SNI 7535.1:2010",
      option_c: "SNI 01-5007.19-2003",
      option_d: "SNI 8911:2020",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Standar khusus mengenai pengujian dan spesifikasi Kayu Bundar Rimba sortimen KBK diatur dalam SNI 01-5007.19-2003.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengukuran diameter untuk penetapan sortimen, diameter diukur pada…",
      option_a: "Hanya bontos pangkal",
      option_b: "Hanya bontos ujung",
      option_c: "Kedua bontos (pangkal dan ujung)",
      option_d: "Bagian tengah batang",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pengukuran diameter kayu bundar dilakukan pada kedua bontos (bontos pangkal dan bontos ujung) untuk memperoleh diameter rata-rata.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam penetapan sortimen kayu bundar, hasil pengukuran diameter dibandingkan dengan…",
      option_a: "Tabel harga kayu",
      option_b: "Tabel klasifikasi sortimen",
      option_c: "Tabel kadar air",
      option_d: "Tabel berat jenis",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Hasil pengujian ukuran diameter dicocokkan dengan Tabel Klasifikasi Sortimen standar untuk menentukan kelas sortimen kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Kayu Bundar Sedang (KBS) adalah kayu bundar dengan diameter…",
      option_a: "Kurang dari 20 cm",
      option_b: "10 - 19 cm",
      option_c: "20 - 29 cm",
      option_d: "30 cm atau lebih",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Kayu Bundar Sedang (KBS) dikelompokkan berdasarkan diameter berkisar antara 20 cm sampai dengan 29 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, Kayu Bundar Besar (KBB) dalam klasifikasi jati disebut sortimen…",
      option_a: "A.I",
      option_b: "A.II",
      option_c: "A.III",
      option_d: "A.IV",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Dalam klasifikasi kayu bundar Jati menurut SNI 7535.1:2010, Kayu Bundar Besar (KBB, diameter ≥ 30 cm) disebut sortimen A.III.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Tujuan utama dari penetapan sortimen kayu bundar adalah…",
      option_a: "Menentukan harga jual kayu",
      option_b: "Menggolongkan kayu berdasarkan ukuran diameter untuk tujuan pemanfaatan tertentu",
      option_c: "Menentukan volume kayu",
      option_d: "Menentukan berat jenis kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Tujuan penetapan sortimen adalah untuk mengelompokkan kayu menurut dimensi ukurannya sehingga tepat sasaran dalam alokasi pemanfaatan dan industri pengolahan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Salah satu syarat dalam penetapan sortimen kayu bundar adalah pengukuran diameter dilakukan dengan alat ukur yang…",
      option_a: "Telah dikalibrasi",
      option_b: "Baru dibeli",
      option_c: "Berwarna cerah",
      option_d: "Terbuat dari kayu",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Seluruh alat ukur pengujian kayu wajib terkalibrasi secara sah untuk menjamin akurasi dan keabsahan hasil pengukuran.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.2:2011, yang dimaksud dengan panjang (p) kayu bundar adalah…",
      option_a: "Jarak terpanjang antara kedua bontos",
      option_b: "Panjang kayu diukur dari ujung ke ujung mengikuti lekuk kayu",
      option_c: "Panjang total kayu termasuk kulit",
      option_d: "Jarak terpendek antara kedua bontos sejajar sumbu kayu",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Panjang kayu bundar (p) diukur dari jarak terpendek antara permukaan kedua bontos yang sejajar sumbu utama batang kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Pengukuran panjang kayu bundar dilakukan dengan kelipatan…",
      option_a: "1 cm",
      option_b: "5 cm",
      option_c: "10 cm",
      option_d: "50 cm",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Panjang kayu bundar ditetapkan dan dicatat dalam kelipatan 10 cm penuh.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Ukuran panjang kayu bundar diberikan spilasi (pengurangan ukuran/pilasi) atau trim allowance sebesar…",
      option_a: "5 cm",
      option_b: "10 cm",
      option_c: "15 cm",
      option_d: "20 cm",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Spilasi atau trim allowance (batas toleransi kelonggaran panjang kayu bundar) ditetapkan sebesar 10 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7535.1:2010, kayu bundar berdasarkan sortimen digolongkan menjadi…",
      option_a: "2 sortimen (KBS dan KBB)",
      option_b: "Tidak ada penggolongan sortimen",
      option_c: "3 sortimen (KBK, KBS, KBB)",
      option_d: "5 sortimen berdasarkan diameter",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Berdasarkan SNI 7535.1:2010, kayu bundar dibagi menjadi 3 sortimen utama: KBK (Kayu Bundar Kecil), KBS (Kayu Bundar Sedang), dan KBB (Kayu Bundar Besar).",
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

  console.log("✅ Successfully inserted all 17 questions for Sort-KB (A.02GNS01.024.1)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
