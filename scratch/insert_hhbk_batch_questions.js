import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString, { ssl: "require" });

  // -------------------------------------------------------------------------
  // UNIT 1: A.02GNS01.029.1 / Uji-HHBK (subject_id = 28, competency_unit_id = 439)
  // -------------------------------------------------------------------------
  const subjectId1 = 28;
  const cuId1 = 439;

  console.log(`Inserting questions for Uji-HHBK (subject_id = ${subjectId1}, competency_unit_id = ${cuId1})...`);
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId1}`;

  const questionsData1 = [
    // PG (5 Soal)
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "Untuk keperluan pengujian rotan dilakukan secara sensus …… % !",
      option_a: "70 %",
      option_b: "80 %",
      option_c: "90 %",
      option_d: "100 %",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Berdasarkan pedoman teknis pengujian rotan, pemeriksaan fisik dan sensus mutu dilakukan 100% untuk menguji kesesuaian persyaratan partai rotan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "Dalam hal pemeriksaan pengambilan contoh dilakukan …………………….. sedemikian sehingga mewakili partai yang diuji.",
      option_a: "Purposive Sampling",
      option_b: "Snowball Sampling",
      option_c: "Accidental Sampling",
      option_d: "Quota Sampling",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Metode Purposive Sampling digunakan dalam pengambilan sampel uji rotan agar contoh yang diambil benar-benar representatif/mewakili seluruh sifat partai barang.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "Berikut ini yang bukan Pengujian Visual adalah !",
      option_a: "Jenis Rotan",
      option_b: "Cacat",
      option_c: "Dimensi",
      option_d: "Kadar Air",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Pemeriksaan Kadar Air (KA) dilakukan menggunakan alat uji kelembaban / pengovenan di laboratorium, sehingga termasuk Pengujian Laboratoris, bukan pengujian Visual.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "Berikut ini yang bukan Pengujian Laboratoris adalah !",
      option_a: "Beban Tarik",
      option_b: "Kelenturan",
      option_c: "Dimensi",
      option_d: "Kadar Air",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Pengukuran Dimensi (diameter dan panjang) dilakukan secara fisik/visual menggunakan pita ukur atau jangka sorong (pengujian Visual).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "Dibawah ini yang bukan pengelompokkan cacat pada rotan yaitu !",
      option_a: "Cacat lubang",
      option_b: "Cacat ringan",
      option_c: "Cacat sedang",
      option_d: "Cacat berat",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Klasifikasi mutu cacat rotan dibagi menjadi 3 tingkatan: Cacat Ringan, Cacat Sedang, dan Cacat Berat. 'Cacat lubang' merupakan nama jenis kecacatan fisik, bukan nama tingkatan pengelompokan.",
      status: "ACTIVE"
    },

    // B/S (5 Soal)
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "[Benar / Salah] Alur kulit, lubang gerek dan kulit mengelupas merupakan cacat ringan pada sortimen rotan asalan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Cacat permukaan dangkal seperti alur kulit, lubang gerek kecil, dan kulit mengelupas tergolong cacat ringan pada rotan asalan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "[Benar / Salah] Cacat ringan, cacat sedang dan cacat berat merupakan pengelompokan cacat pada rotan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengelompokan batas toleransi kecacatan rotan secara resmi diklasifikasikan menjadi tiga tingkatan: ringan, sedang, dan berat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "[Benar / Salah] Perubahan warna, lubang gerek kecil dan serat terlepas merupakan cacat ringan pada sortimen rotan bentukan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Pernyataan SALAH. Pada rotan bentukan (yang telah mengalami proses pemesinan), serat terlepas dan lubang gerek berpengaruh pada kekuatan struktur sehingga termasuk cacat sedang hingga berat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "[Benar / Salah] Pengujian Visual pada rotan antara lain Jenis Rotan, Cacat dan Dimensi.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Tiga parameter utama dalam pengujian visual rotan adalah identifikasi Jenis, pengukuran Dimensi, dan pengamatan Cacat.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId1,
      competency_unit_id: cuId1,
      question_text: "[Benar / Salah] Pengujian Laboratoris pada rotan antara Kadar Air, Beban Tarik dan Kelenturan.",
      option_a: "Benar",
      option_b: "Salah",
      option_c: "-",
      option_d: "-",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Pernyataan BENAR. Pengujian mekanis dan fisik di laboratorium mencakup penentuan persentase Kadar Air, uji Beban Tarik, dan uji Kelenturan/Lengkung.",
      status: "ACTIVE"
    }
  ];

  for (const q of questionsData1) {
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
    console.log(`[Uji-HHBK] Inserted question ID: ${res[0].id}`);
  }

  await sql`
    UPDATE competency_units
    SET question_count = (SELECT COUNT(*) FROM questions WHERE competency_unit_id = ${cuId1})
    WHERE id = ${cuId1}
  `;

  // -------------------------------------------------------------------------
  // UNIT 2: A.02GNS01.031.2 / Mutu-HHBK (subject_id = 30, competency_unit_id = 441)
  // -------------------------------------------------------------------------
  const subjectId2 = 30;
  const cuId2 = 441;

  console.log(`Inserting questions for Mutu-HHBK (subject_id = ${subjectId2}, competency_unit_id = ${cuId2})...`);
  await sql`DELETE FROM questions WHERE subject_id = ${subjectId2}`;

  const questionsData2 = [
    {
      subject_id: subjectId2,
      competency_unit_id: cuId2,
      question_text: "Batang harus relatif lurus dan relatif keras dan Tidak diperkenankan adanya keriput merupakan syarat umum untuk menentukan mutu rotan……….!",
      option_a: "Bentukan",
      option_b: "Bundar W & S",
      option_c: "Asalan",
      option_d: "Bundar Pendek",
      correct_answer: "C",
      difficulty: "EASY",
      explanation: "Karakteristik batang relatif lurus, keras, dan bebas keriput tanpa pengolahan kimia adalah persyarat umum penentuan mutu Rotan Asalan.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId2,
      competency_unit_id: cuId2,
      question_text: "Batang lurus; memiliki kelenturan; panjang ruas, bentuk buku dan arah buku menurutkarakteristik tiap jenis rotan, bontos dipotong siku, Panjang ≥1 m dan Kadar air ≤ 20 % merupakan syarat umum untuk menentukan mutu rotan……….!",
      option_a: "Bentukan",
      option_b: "Bundar W & S",
      option_c: "Asalan",
      option_d: "Bundar Pendek",
      correct_answer: "B",
      difficulty: "EASY",
      explanation: "Persyaratan panjang ≥ 1 m, bontos dipotong siku, dan kadar air ≤ 20% adalah standar mutu mutu umum untuk Rotan Bundar W&S (Washed & Sulfurized).",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId2,
      competency_unit_id: cuId2,
      question_text: "Batang lurus; memiliki kelenturan; panjang ruas, bentuk buku dan arah buku menurutkarakteristik tiap jenis rotan, bontos dipotong siku dan Tidak diperkenankan adanya keriput merupakan syarat umum untuk menentukan mutu rotan……….!",
      option_a: "Bentukan",
      option_b: "Bundar W & S",
      option_c: "Asalan",
      option_d: "Bundar Pendek",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Persyaratan bontos dipotong siku dan bebas keriput pada potongan rotan bundar berukuran pendek adalah standar syarat umum Rotan Bundar Pendek.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId2,
      competency_unit_id: cuId2,
      question_text: "Kedua ujung dipotong siku, Warna dasar menurut karakteristik tiap jenis rotan dan Diameter 3 – 5 mm merupakan syarat umum untuk menentukan mutu rotan……….!",
      option_a: "Bentukan",
      option_b: "Bundar W & S",
      option_c: "Asalan",
      option_d: "Bentukan Filtrit",
      correct_answer: "D",
      difficulty: "EASY",
      explanation: "Rotan bentukan olahan dengan spesifikasi diameter halus 3 – 5 mm diklasifikasikan sebagai Rotan Bentukan Filtrit.",
      status: "ACTIVE"
    },
    {
      subject_id: subjectId2,
      competency_unit_id: cuId2,
      question_text: "Kedua ujung dipotong siku, Warna dasar menurut karakteristik tiap jenis rotan dan Diameter > 5 mm merupakan syarat umum untuk menentukan mutu rotan……….!",
      option_a: "Bentukan Hati Rotan",
      option_b: "Bundar W & S",
      option_c: "Asalan",
      option_d: "Bundar Pendek",
      correct_answer: "A",
      difficulty: "EASY",
      explanation: "Rotan bentukan dari bagian dalam batang (core) dengan diameter > 5 mm dikelompokkan sebagai Rotan Bentukan Hati Rotan.",
      status: "ACTIVE"
    }
  ];

  for (const q of questionsData2) {
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
    console.log(`[Mutu-HHBK] Inserted question ID: ${res[0].id}`);
  }

  await sql`
    UPDATE competency_units
    SET question_count = (SELECT COUNT(*) FROM questions WHERE competency_unit_id = ${cuId2})
    WHERE id = ${cuId2}
  `;

  console.log("✅ Successfully inserted all questions for both HHBK units and updated competency_units question_count!");
  await sql.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
