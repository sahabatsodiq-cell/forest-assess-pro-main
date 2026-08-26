import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 21; // Vol-KBB/S (Penetapan Isi (Volume) Kayu Bundar Besar dan Sedang)
  const competencyUnitId = 431; // A.02GNS01.022.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
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
      explanation: "Sesuai standar penggolongan sortimen kayu bundar, Kayu Bundar Besar (KBB) adalah kayu bundar yang memiliki diameter 30 cm atau lebih.",
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
      explanation: "Dalam klasifikasi/sortimen kayu bundar Jati, sortimen A.II dikategorikan sebagai Kayu Bundar Sedang (KBS) dengan diameter 20 cm - 29 cm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Standar Nasional Indonesia yang digunakan sebagai pedoman pengukuran kayu bundar selain jenis Jati adalah…",
      option_a: "SNI 7533.1:2010",
      option_b: "SNI 7533.2:2011",
      option_c: "SNI 7535.1:2010",
      option_d: "SNI 8911:2020",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "SNI 7533.2:2011 mengatur pengukuran dan penetapan isi kayu bundar rimba (selain jenis Jati).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.2:2011, yang dimaksud dengan panjang (p) kayu bundar adalah…",
      option_a: "Jarak terpanjang antara kedua bontos",
      option_b: "Jarak terpendek antara kedua bontos sejajar sumbu kayu",
      option_c: "Panjang rata-rata antara kedua bontos",
      option_d: "Panjang kayu diukur dari ujung ke ujung mengikuti lekuk kayu",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Panjang kayu bundar (p) diukur berdasarkan jarak terpendek antara permukaan kedua bontos yang sejajar dengan sumbu batang/kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Satuan isi (volume) kayu bundar dinyatakan dalam…",
      option_a: "Meter persegi (m²)",
      option_b: "Meter kubik (m³)",
      option_c: "Stapel meter (sm)",
      option_d: "Ton",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Volume/isi kayu bundar dinyatakan dalam satuan standar meter kubik (m³).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rumus umum untuk menghitung volume kayu bundar adalah…",
      option_a: "V = ¼ × π × d × p",
      option_b: "V = 0,7854 × d² × p / 10.000",
      option_c: "V = 0,7854 × d × p² / 10.000",
      option_d: "V = π × d² × p",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Rumus baku volume kayu bundar silinder adalah V = 0,7854 × d² × p / 10.000 (di mana d dalam cm dan p dalam m).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengukuran diameter kayu bundar rimba, diameter yang digunakan adalah…",
      option_a: "Diameter pangkal saja",
      option_b: "Diameter ujung saja",
      option_c: "Rata-rata diameter pangkal dan diameter ujung",
      option_d: "Diameter terkecil dari kedua bontos",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Diameter rata-rata (d) dihitung dari penjumlahan diameter bontos pangkal (dp) dan diameter bontos ujung (du) dibagi dua.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Alat yang digunakan untuk mengukur diameter kayu bundar adalah…",
      option_a: "Haga meter",
      option_b: "Pita diameter (diameter tape) atau scalestick",
      option_c: "Klinometer",
      option_d: "Theodolit",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengukuran diameter bontos/batang kayu bundar menggunakan alat pengukur khusus berupa phiband / pita diameter atau tongkat ukur (scalestick / caliper).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.2:2011, untuk kayu bundar yang panjangnya kurang dari 1 meter, volume dihitung dengan persamaan…",
      option_a: "V = 0,7854 × (1,0223du + 0,7962)² × p / 10.000",
      option_b: "V = 0,7854 × (1,0220dtu + 1,2534)² × p / 10.000",
      option_c: "V = 0,7854 × d² × p / 10.000",
      option_d: "V = 0,7854 × (1,0171dtu + 1,8493)² × p / 10.000",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Untuk kayu pendek (panjang kurang dari 1 meter), rumus volume yang digunakan adalah rumus silinder langsung tanpa faktor koreksi bentuk (V = 0,7854 × d² × p / 10.000).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Yang dimaksud dengan isi cacat (Ic) dalam penetapan volume kayu bundar adalah…",
      option_a: "Volume kayu yang tidak laku dijual",
      option_b: "Bagian kayu bundar yang mengandung cacat bontos dan/atau cacat gubal",
      option_c: "Volume kayu yang terkena serangan hama",
      option_d: "Volume kayu yang memiliki diameter tidak seragam",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Isi Cacat (Ic) / reduksi adalah akumulasi volume dari bagian-bagian kayu yang mengalami cacat bontos (seperti gerowong/hati busuk) dan/atau cacat gubal/kulit.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rumus untuk menghitung isi bersih (Ib) kayu bundar adalah…",
      option_a: "Ib = Ik + Ic",
      option_b: "Ib = Ik × Ic",
      option_c: "Ib = Ik - Ic",
      option_d: "Ib = Ik / Ic",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Isi Bersih (Ib) diperoleh dari pengurangan Isi Kotor (Ik) dikurangi total Isi Cacat (Ic).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Untuk kayu bundar jenis tertentu dengan panjang > 5 m sebagaimana terlampir dalam SNI 7534.1:2010, penetapan isi menggunakan…",
      option_a: "Rumus umum silinder",
      option_b: "Tabel A",
      option_c: "Tabel B",
      option_d: "Rumus dengan faktor koreksi panjang",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Untuk kayu bundar panjang (> 5 m) jenis tertentu, penetapan volumenya dipandu menggunakan Tabel A.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Reduksi adalah…",
      option_a: "Penambahan isi kayu bundar karena adanya cacat",
      option_b: "Penandaan mutu kayu bundar",
      option_c: "Perubahan bentuk kayu bundar",
      option_d: "Pengurangan isi kayu bundar yang disebabkan oleh adanya cacat yang mengurangi isi",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Reduksi adalah pengurangan/pemotongan volume kotor kayu akibat adanya cacat-cacat teknis yang mengurangi bagian kayu yang dapat dimanfaatkan.",
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
      explanation: "Kayu bundar diklasifikasikan menjadi 3 kelompok sortimen utama: KBK (Kayu Bundar Kecil), KBS (Kayu Bundar Sedang), dan KBB (Kayu Bundar Besar).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengukuran cacat bontos (Cb), diameter cacat yang dipergunakan adalah…",
      option_a: "Diameter cacat terbesar dari kedua bontos",
      option_b: "Diameter cacat terkecil dari kedua bontos",
      option_c: "Rata-rata Cb₁ dan Cb₂",
      option_d: "Jumlah Cb₁ dan Cb₂",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Diameter cacat bontos (Cb) dihitung dari nilai rata-rata pengukuran cacat bontos pangkal (Cb₁) dan bontos ujung (Cb₂).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Ukuran diameter cacat bontos (∅Cb) diukur dalam satuan cm penuh dengan cara…",
      option_a: "Pembulatan ke bawah (meringankan cacat)",
      option_b: "Pembulatan ke atas (memberatkan cacat)",
      option_c: "Pembulatan ke angka genap terdekat",
      option_d: "Pembulatan ke angka kelipatan 5 terdekat",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pengukuran diameter cacat dibulatkan ke atas dalam satuan cm penuh untuk memberikan toleransi pengamanan/penilaian cacat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Untuk kelompok panjang 3,10 m – 4,00 m, rumus volume kayu bundar menurut SNI 7533.2:2011 adalah…",
      option_a: "V = 0,7854 × d² × p / 10.000",
      option_b: "V = 0,7854 × (1,0220dtu + 1,2534)² × p / 10.000",
      option_c: "V = 0,7854 × (1,0171dtu + 1,8493)² × p / 10.000",
      option_d: "V = 0,7854 × (1,0223du + 0,7962)² × p / 10.000",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Untuk kayu bundar rimba kelompok panjang 3,10 m – 4,00 m, persamaan yang digunakan dalam SNI 7533.2:2011 adalah V = 0,7854 × (1,0220dtu + 1,2534)² × p / 10.000.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam penetapan isi kayu bundar, pengukuran panjang dilakukan dengan kelipatan…",
      option_a: "1 cm",
      option_b: "5 cm",
      option_c: "10 cm",
      option_d: "50 cm",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pengukuran panjang kayu bundar dilakukan dalam kelipatan 10 cm penuh (pembulatan ke bawah dalam kelipatan 10 cm).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Untuk kayu bundar eboni, selain dalam satuan isi (m³), dapat juga dinyatakan dalam satuan berat dengan konversi…",
      option_a: "1 ton = 0,500 m³",
      option_b: "1 ton = 0,833 m³",
      option_c: "1 ton = 1,000 m³",
      option_d: "1 ton = 1,200 m³",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Faktor konversi berat kayu eboni terhadap volume kayu bundar eboni adalah 1 ton setara dengan 0,833 m³ (atau 1 m³ ≈ 1,2 ton).",
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

  console.log("✅ Successfully inserted all 19 questions for Vol-KBB/S (A.02GNS01.022.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
