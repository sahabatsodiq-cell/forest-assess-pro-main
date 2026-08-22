import postgres from "postgres";
import crypto from "crypto";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 600000, 64, "sha512").toString("hex");
  return `${salt}:${hash}:600000`;
}

console.log("Seeding Supabase PostgreSQL Cloud...");
const sql = postgres(connectionString, { ssl: "require" });

async function seed() {
  try {
    const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM users`;
    if (count > 0) {
      console.log(`Supabase database already contains ${count} users. Skipping seed.`);
      return;
    }

    console.log("Seeding initial data into Supabase...");

    // 1. Seed Users
    const superadminHash = hashPassword("SuperAdmin123!");
    const adminHash = hashPassword("Admin123!");
    const participantHash = hashPassword("Peserta123!");

    await sql`
      INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
      VALUES ('Super Admin', 'superadmin@askganisph.id', ${superadminHash}, 'SUPER_ADMIN', 'SA-001', 1)
    `;

    await sql`
      INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
      VALUES ('Admin Pelaksana', 'admin@askganisph.id', ${adminHash}, 'ADMIN', 'A-001', 1)
    `;

    const [{ id: participantId }] = await sql`
      INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
      VALUES ('Budi Santoso', 'peserta@askganisph.id', ${participantHash}, 'PESERTA', 'REG-2026-001', 1)
      RETURNING id
    `;

    // 2. Qualifications
    const qualifications = [
      { code: "CANHUT", name: "Tenaga Teknis Perencanaan Hutan" },
      { code: "NENHUT", name: "Tenaga Teknis Pemanenan Hutan" },
      { code: "BINHUT", name: "Tenaga Teknis Pembinaan Hutan" },
      { code: "PKB", name: "Penguji Kayu Bulat" },
      { code: "PKG", name: "Penguji Kayu Gergajian" },
      { code: "PKL", name: "Penguji Kayu Lapis" },
      { code: "PCHIP", name: "Penguji Serpih Kayu (PChip)" },
      { code: "HHBK-GETAH", name: "Hasil Hutan Bukan Kayu Kelompok Getah" },
      { code: "HHBK-BATANG", name: "Hasil Hutan Bukan Kayu Kelompok Batang" },
    ];

    const qualMap = {};
    for (const q of qualifications) {
      const [{ id }] = await sql`
        INSERT INTO qualifications (code, name, description, status)
        VALUES (${q.code}, ${q.name}, ${`Kualifikasi untuk sertifikasi kompetensi ${q.name}`}, 'ACTIVE')
        RETURNING id
      `;
      qualMap[q.code] = id;
    }

    const canhutId = qualMap["CANHUT"];
    await sql`
      INSERT INTO user_qualifications (user_id, qualification_id)
      VALUES (${participantId}, ${canhutId})
    `;

    // 3. Subjects for CANHUT
    const subjects = [
      { code: "CAN-01", name: "Inventarisasi Hutan & Peta Tutupan Lahan", weight: 25 },
      { code: "CAN-02", name: "Penyusunan Rencana Kerja Usaha (RKU/RKT)", weight: 25 },
      { code: "CAN-03", name: "Sistem Informasi Geografis (SIG) Kehutanan", weight: 25 },
      { code: "CAN-04", name: "Perhitungan Jatah Tebangan Tahunan (JTT)", weight: 25 },
    ];

    const subMap = {};
    for (const s of subjects) {
      const [{ id }] = await sql`
        INSERT INTO subjects (qualification_id, code, name, description, weight, status)
        VALUES (${canhutId}, ${s.code}, ${s.name}, ${`Materi kompetensi ${s.name}`}, ${s.weight}, 'ACTIVE')
        RETURNING id
      `;
      subMap[s.code] = id;
    }

    // 4. Questions Bank
    const questions = [
      {
        sub: "CAN-01",
        text: "Metode mana yang paling efisien untuk mengestimasi tutupan kanopi hutan primer secara luas?",
        a: "Sensitivitas citra satelit multispektral high-resolution",
        b: "Pengukuran manual tiap pohon dengan kompas",
        c: "Wawancara dengan warga lokal",
        d: "Pengamatan kasat mata dari darat",
        ans: "A",
        diff: "EASY",
      },
      {
        sub: "CAN-01",
        text: "Skala peta kerja minimum yang dipersyaratkan untuk penataan batas areal RKT adalah...",
        a: "1:10.000",
        b: "1:50.000",
        c: "1:100.000",
        d: "1:250.000",
        ans: "A",
        diff: "MEDIUM",
      },
      {
        sub: "CAN-02",
        text: "Dokumen perencanaan 10 tahunan izin pemanfaatan hutan dinamakan...",
        a: "Rencana Kerja Usaha (RKU)",
        b: "Rencana Kerja Tahunan (RKT)",
        c: "Analisis Dampak Lingkungan (AMDAL)",
        d: "Rencana Kelola Lingkungan (RKL)",
        ans: "A",
        diff: "EASY",
      },
      {
        sub: "CAN-02",
        text: "Dalam RKT, penetapan petak tebangan didasarkan pada pertimbangan...",
        a: "Topografi, kecukupan regenerasi, dan batas sungai",
        b: "Harga kayu di pasar global",
        c: "Permintaan dari pemegang saham",
        d: "Jarak terdekat dari perkotaan",
        ans: "A",
        diff: "HARD",
      },
      {
        sub: "CAN-03",
        text: "Sistem koordinat standar nasional yang digunakan dalam pemetaan kawasan hutan Indonesia adalah...",
        a: "UTM (Universal Transverse Mercator) WGS 84",
        b: "Mercator Standar Pasifik",
        c: "Kordinat Lokal Jawa-Sumatera",
        d: "USGS Topo Grid",
        ans: "A",
        diff: "MEDIUM",
      },
      {
        sub: "CAN-04",
        text: "Faktor utama yang membatasi besarnya Jatah Tebangan Tahunan (JTT) adalah...",
        a: "Laju pertumbuhan tahunan (RIAP) dan ketersediaan luasan efektif tebangan",
        b: "Kapasitas mesin pabrik pengolahan",
        c: "Jumlah Tenaga Teknis yang dimiliki perusahaan",
        d: "Target pendapatan daerah",
        ans: "A",
        diff: "HARD",
      },
    ];

    for (const q of questions) {
      await sql`
        INSERT INTO questions (qualification_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, status, created_by)
        VALUES (${canhutId}, ${subMap[q.sub]}, ${q.text}, ${q.a}, ${q.b}, ${q.c}, ${q.d}, ${q.ans}, ${q.diff}, 'ACTIVE', 1)
      `;
    }

    // 5. Blueprint
    const [{ id: blueprintId }] = await sql`
      INSERT INTO exam_blueprints (qualification_id, name, description, total_questions)
      VALUES (${canhutId}, 'Blueprint Ujian Teori GANISPH CANHUT 2026', 'Blueprint standar 6 soal uji kompetensi perencanaan', 6)
      RETURNING id
    `;

    for (const subCode of Object.keys(subMap)) {
      await sql`
        INSERT INTO blueprint_items (blueprint_id, subject_id, difficulty, question_count)
        VALUES (${blueprintId}, ${subMap[subCode]}, 'MEDIUM', 1)
      `;
    }

    // 6. Exam Package
    const now = new Date();
    const future = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const [{ id: examId }] = await sql`
      INSERT INTO exam_packages (qualification_id, blueprint_id, name, code, description, instructions, duration_minutes, passing_grade, start_at, end_at, status, created_by)
      VALUES (${canhutId}, ${blueprintId}, 'Ujian Sertifikasi Kompetensi GANISPH Perencanaan Hutan 2026', 'EXAM-CANHUT-2026-01', 'Paket ujian kompetensi resmi', 'Kerjakan seluruh soal dengan jujur dan teliti.', 60, 70, ${now.toISOString()}, ${future.toISOString()}, 'PUBLISHED', 1)
      RETURNING id
    `;

    // 7. Enrollment
    await sql`
      INSERT INTO exam_enrollments (exam_id, user_id)
      VALUES (${examId}, ${participantId})
    `;

    console.log("✓ Supabase database successfully seeded with MVP data!");
  } catch (err) {
    console.error("Seed error:", err);
  } finally {
    await sql.end();
  }
}

seed();
