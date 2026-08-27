import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  const subjectId = 22; // Vol-KBK (Penetapan Isi (Volume) Kayu Bundar Kecil)
  const competencyUnitId = 432; // A.02GNS01.023.2

  console.log(`Inserting questions for subject_id = ${subjectId}, competency_unit_id = ${competencyUnitId}...`);

  // Clean up any existing questions for this subject/unit first
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId} OR competency_unit_id = ${competencyUnitId}`;

  const questionsData = [
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
      explanation: "Kayu Bundar Kecil (KBK) diklasifikasikan sebagai kayu bundar dengan diameter kurang dari 20 cm.",
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
      explanation: "Dalam klasifikasi sortimen kayu bundar Jati, sortimen A.I dikategorikan sebagai Kayu Bundar Kecil (KBK) dengan diameter kurang dari 20 cm.",
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
      explanation: "SNI 01-5007.19-2003 mengatur secara khusus pengujian dan spesifikasi Kayu Bundar Rimba sortimen KBK.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Satuan isi tumpukan kayu bundar kecil disebut…",
      option_a: "Meter kubik (m³)",
      option_b: "Stapel meter (sm)",
      option_c: "Ton",
      option_d: "Meter persegi (m²)",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Satuan ukur untuk volume tumpukan/susu tumpuk kayu bundar kecil adalah Stapel Meter (sm).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Penggunaan Stapel Meter untuk Kayu Bulat Kecil (KBK) mengacu pada peraturan…",
      option_a: "Perdirjen Bina Produksi Kehutanan No. P.05/VI-BIKPHH/2008",
      option_b: "Perdirjen Bina Produksi Kehutanan No. P.07/VI-BIKPHH/2009",
      option_c: "Permen LHK No. 68 Tahun 2019",
      option_d: "SNI 7533.2:2011",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Perdirjen BPK No. P.05/VI-BIKPHH/2008 mengatur petunjuk teknis pengukuran volume tumpukan (stapel meter) dan angka konversinya untuk KBK.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan Perdirjen Bina Produksi Kehutanan No. P.05/VI-BIKPHH/2008, angka konversi dari stapel meter ke meter kubik untuk genus Acasia adalah…",
      option_a: "0,59 m³/sm",
      option_b: "0,63 m³/sm",
      option_c: "0,67 m³/sm",
      option_d: "0,71 m³/sm",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Faktor konversi dari stapel meter ke meter kubik padat untuk kelompok kayu genus Acacia adalah 0,59 m³/sm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Angka konversi dari stapel meter ke meter kubik untuk genus Eucalyptus berdasarkan Perdirjen Bina Produksi Kehutanan No. P.05/VI-BIKPHH/2008 adalah…",
      option_a: "0,59 m³/sm",
      option_b: "0,63 m³/sm",
      option_c: "0,67 m³/sm",
      option_d: "0,71 m³/sm",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Faktor konversi dari stapel meter ke meter kubik padat untuk genus Eucalyptus adalah 0,67 m³/sm.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Untuk kayu bundar kecil yang termasuk dalam kelompok Rimba Campuran, angka konversi dari stapel meter ke meter kubik adalah…",
      option_a: "0,59 m³/sm",
      option_b: "0,63 m³/sm",
      option_c: "0,67 m³/sm",
      option_d: "0,71 m³/sm",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Faktor konversi dari stapel meter ke meter kubik padat untuk kelompok kayu Rimba Campuran adalah 0,63 m³/sm.",
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
      explanation: "Panjang kayu bundar (p) didefinisikan sebagai jarak terpendek antara permukaan kedua bontos yang sejajar dengan sumbu batang/kayu.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Rumus untuk menghitung volume kayu bundar kecil per batang adalah…",
      option_a: "V = 0,7854 × (1,0223du + 0,7962)² × p / 10.000",
      option_b: "V = 0,7854 × (1,0220dtu + 1,2534)² × p / 10.000",
      option_c: "V = 0,7854 × d² × p / 10.000",
      option_d: "V = 0,7854 × (1,0171dtu + 1,8493)² × p / 10.000",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Perhitungan volume kayu bundar kecil (KBK) per batang dihitung menggunakan rumus baku silinder V = 0,7854 × d² × p / 10.000.",
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
      explanation: "Panjang kayu bundar diukur dan dicatat dalam kelipatan 10 cm penuh.",
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
      explanation: "Toleransi kelebihan/pengurangan panjang (trim allowance / spilasi) pada kayu bundar diberikan sebesar 10 cm.",
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
      explanation: "Isi cacat (Ic) adalah akumulasi volume bagian kayu yang mengandung cacat bontos (seperti gerowong) atau cacat gubal/luar yang mengurangi isi.",
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
      explanation: "Isi Bersih (Ib) dihitung dari Isi Kotor (Ik) dikurangi Isi Cacat (Ic).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berdasarkan SNI 7533.2:2011, reduksi adalah…",
      option_a: "Penambahan isi kayu bundar karena adanya cacat",
      option_b: "Penandaan mutu kayu bundar",
      option_c: "Perubahan bentuk kayu bundar",
      option_d: "Pengurangan isi kayu bundar yang disebabkan oleh adanya cacat yang mengurangi isi",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Reduksi adalah pemotongan/pengurangan volume kayu bundar yang disebabkan oleh cacat teknis yang mengurangi pemanfaatan kayu.",
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
      explanation: "Kayu bundar diklasifikasikan menjadi 3 kelompok sortimen utama: KBK, KBS, dan KBB.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Untuk kayu bundar kecil yang panjangnya kurang dari 1 meter, volume dihitung dengan persamaan…",
      option_a: "V = 0,7854 × (1,0223du + 0,7962)² × p / 10.000",
      option_b: "V = 0,7854 × d² × p / 10.000",
      option_c: "V = 0,7854 × (1,0220dtu + 1,2534)² × p / 10.000",
      option_d: "V = 0,7854 × (1,0171dtu + 1,8493)² × p / 10.000",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Untuk kayu bundar kecil dengan panjang kurang dari 1 meter, rumus volume yang digunakan adalah V = 0,7854 × d² × p / 10.000.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Jika terdapat 2 tumpukan kayu bundar kecil jenis Rimba Campuran dengan volume stapel meter 27,26 SM, maka volume dalam meter kubik adalah… (menggunakan angka konversi yang sesuai)",
      option_a: "20,44 m³",
      option_b: "17,17 m³",
      option_c: "18,26 m³",
      option_d: "19,35 m³",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Volume m³ = 27,26 SM × 0,63 m³/SM = 17,1738 m³ ≈ 17,17 m³.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Dalam pengukuran kayu bundar kecil dengan metode tumpukan (stapel meter), kayu harus ditumpuk secara…",
      option_a: "Acak",
      option_b: "Teratur",
      option_c: "Berdiri",
      option_d: "Menyilang",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Dalam pengukuran cara tumpukan (stapel meter), kayu bundar kecil wajib ditumpuk secara teratur, sejajar, dan rata di kedua permukaannya.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId,
      competency_unit_id: competencyUnitId,
      question_text: "Berikut yang BUKAN merupakan kelompok genus dalam pengaturan angka konversi stapel meter ke meter kubik berdasarkan Perdirjen Bina Produksi Kehutanan No. P.05/VI-BIKPHH/2008 adalah…",
      option_a: "Genus Acasia",
      option_b: "Genus Eucalyptus",
      option_c: "Rimba Campuran",
      option_d: "Genus Shorea",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Perdirjen P.05/2008 menetapkan konversi khusus untuk Genus Acacia (0,59), Genus Eucalyptus (0,67), dan Rimba Campuran (0,63); Genus Shorea tidak diatur terpisah.",
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

  console.log("✅ Successfully inserted all 20 questions for Vol-KBK (A.02GNS01.023.2)!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
