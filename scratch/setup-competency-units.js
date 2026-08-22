import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

console.log("Connecting to Supabase PostgreSQL Cloud to setup Unit Kompetensi tables & data...");
const sql = postgres(connectionString, { ssl: "require" });

const competencyData = [
  // KURPET
  {
    qualCode: "KURPET",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.004.1", title: "Menerapkan Teknologi Informasi" },
      { code: "A.02GNS01.005.1", title: "Menyusun Rencana Kerja Pengukuran Perpetaan Hutan" },
      { code: "A.02GNS01.006.1", title: "Melaksanakan Pengukuran Perpetaan Hutan" },
      { code: "A.02GNS01.007.1", title: "Menyusun Laporan Hasil Pengukuran Perpetaan Hutan" },
    ]
  },
  // CANHUT
  {
    qualCode: "CANHUT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.008.1", title: "Menyusun Rencana Kerja Inventarisasi Tegakan Hutan" },
      { code: "A.02GNS01.009.1", title: "Melaksanakan Inventarisasi Tegakan Hutan" },
      { code: "A.02GNS01.010.1", title: "Menyusun Laporan Hasil Inventarisasi Tegakan Hutan" },
      { code: "A.02GNS01.011.1", title: "Menyusun Rencana Pengelolaan Jangka Panjang Pemanfaatan Hasil Hutan Kayu" },
      { code: "A.02GNS01.012.1", title: "Menyusun Rencana Kerja Tahunan Pemanfaatan Hasil Hutan Kayu" },
    ]
  },
  // NENHUT
  {
    qualCode: "NENHUT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.013.1", title: "Membuat Peta Trase Jalan Hutan" },
      { code: "A.02GNS01.014.1", title: "Melaksanakan Pembuatan Trase Jalan Hutan di Lapangan" },
      { code: "A.02GNS01.015.1", title: "Menyusun Rancangan Pembukaan Wilayah Hutan" },
      { code: "A.02GNS01.016.1", title: "Mengendalikan Pelaksanaan Pembukaan Wilayah Hutan" },
      { code: "A.02GNS01.017.1", title: "Merencanakan Pemanenan Hasil Hutan Kayu" },
      { code: "A.02GNS01.018.1", title: "Mengawasi Kegiatan Penebangan Pohon" },
      { code: "A.02GNS01.019.1", title: "Mengawasi Pelaksanaan Penyaradan Kayu Bundar" },
      { code: "A.02GNS01.020.1", title: "Mengawasi Pengangkutan Kayu Hasil Tebangan" },
    ]
  },
  // PKB
  {
    qualCode: "PKB",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.021.1", title: "Menetapkan Nama Jenis Kayu" },
      { code: "A.02GNS01.022.2", title: "Menetapkan Isi (Volume) Kayu Bundar Besar dan Sedang" },
      { code: "A.02GNS01.023.2", title: "Menetapkan Isi (Volume) Kayu Bundar Kecil" },
      { code: "A.02GNS01.024.1", title: "Menetapkan Sortimen Kayu Bundar" },
      { code: "A.02GNS01.025.1", title: "Menetapkan Mutu Penampilan Kayu Bundar" },
      { code: "A.02GNS01.026.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Bundar" },
    ]
  },
  // HHBK-BATANG
  {
    qualCode: "HHBK-BATANG",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu" },
      { code: "A.02GNS01.027.2", title: "Menetapkan Nama Jenis Kelompok Batang" },
      { code: "A.02GNS01.028.2", title: "Menetapkan Berat atau Jumlah Batang" },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK" },
      { code: "A.02GNS01.030.1", title: "Melakukan Uji Visual Kelompok Batang" },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)" },
    ]
  },
  // HHBK-RESIN
  {
    qualCode: "HHBK-RESIN",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu" },
      { code: "A.02GNS01.033.2", title: "Menetapkan Nama Jenis Kelompok Resin" },
      { code: "A.02GNS01.034.2", title: "Menetapkan Berat Resin" },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK" },
      { code: "A.02GNS01.035.1", title: "Melakukan Uji Visual Kelompok Resin" },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)" },
    ]
  },
  // HHBK-GETAH
  {
    qualCode: "HHBK-GETAH",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu" },
      { code: "A.02GNS01.036.2", title: "Menetapkan Nama Jenis Kelompok Getah" },
      { code: "A.02GNS01.037.2", title: "Menetapkan Berat Getah" },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK" },
      { code: "A.02GNS01.038.1", title: "Melakukan Uji Visual Kelompok Getah" },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)" },
    ]
  },
  // HHBK-KULIT
  {
    qualCode: "HHBK-KULIT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu" },
      { code: "A.02GNS01.039.2", title: "Menetapkan Nama Jenis Kelompok Kulit" },
      { code: "A.02GNS01.040.2", title: "Menetapkan Berat Kulit" },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK" },
      { code: "A.02GNS01.041.1", title: "Melakukan Uji Visual Kelompok Kulit" },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)" },
    ]
  },
  // HHBK-MINYAK
  {
    qualCode: "HHBK-MINYAK",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu" },
      { code: "A.02GNS01.063.2", title: "Menetapkan Nama Jenis Kelompok Minyak" },
      { code: "A.02GNS01.064.2", title: "Menetapkan Berat Minyak" },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK" },
      { code: "A.02GNS01.065.1", title: "Melakukan Uji Visual Kelompok Minyak" },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)" },
    ]
  },
  // CAN-WA
  {
    qualCode: "CAN-WA",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.042.1", title: "Menyusun Desain Tapak Pembangunan Sarana dan Prasarana Wisata Alam" },
      { code: "A.02GNS01.043.1", title: "Menyusun Desain Fisik Pembangunan Sarana dan Prasarana Wisata Alam" },
      { code: "A.02GNS01.044.1", title: "Menyusun Rencana Kerja Usaha (RKU) Pada Pemanfaatan Jasa Lingkungan Wisata Alam" },
      { code: "A.02GNS01.045.1", title: "Menyusun Rencana Kerja Tahunan (RKT) Pada Pemanfaatan Jasa Lingkungan Wisata Alam" },
    ]
  },
  // BINHUT
  {
    qualCode: "BINHUT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.046.1", title: "Merencanakan Kegiatan Pembinaan Hutan" },
      { code: "A.02GNS01.047.1", title: "Mengawasi Kegiatan Pembinaan Hutan" },
      { code: "A.02GNS01.048.2", title: "Melaksanakan Monitoring Keberadaan, Kemantapan dan Kondisi Kawasan Dilindungi Pada Setiap Tipe Hutan" },
      { code: "A.02GNS01.049.2", title: "Mengawasi Kegiatan Perlindungan dan Pengamanan Hutan" },
      { code: "A.02GNS01.050.2", title: "Melaksanakan pemantauan dampak terhadap tanah dan air akibat pemanfaatan hutan" },
      { code: "A.02GNS01.051.2", title: "Melaksanakan Pemantauan Flora dan Fauna yang Dilindungi" },
      { code: "A.02GNS01.052.1", title: "Melakukan Pemetaan Potensi Konflik Sosial" },
      { code: "A.02GNS01.053.1", title: "Melakukan Kegiatan Inventarisasi Sosial, Ekonomi dan Budaya Masyarakat" },
      { code: "A.02GNS01.054.1", title: "Menyusun Rencana Program Pemberdayaan Masyarakat Melalui Kemitraan" },
      { code: "A.02GNS01.055.1", title: "Melaksanakan Kegiatan Pemberdayaan Masyarakat" },
    ]
  },
  // PKG
  {
    qualCode: "PKG",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.021.1", title: "Menetapkan Nama Jenis Kayu" },
      { code: "A.02GNS01.056.1", title: "Menetapkan Volume Kayu Gergajian" },
      { code: "A.02GNS01.057.1", title: "Menetapkan Mutu Penampilan Kayu Gergajian" },
      { code: "A.02GNS01.058.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan" },
    ]
  },
  // PKL
  {
    qualCode: "PKL",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.021.1", title: "Menetapkan Nama Jenis Kayu" },
      { code: "A.02GNS01.059.1", title: "Menetapkan Dimensi dan Volume Kayu Lapis" },
      { code: "A.02GNS01.060.1", title: "Menetapkan Mutu Penampilan Kayu Lapis" },
      { code: "A.02GNS01.058.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan" },
    ]
  },
  // PCHIP
  {
    qualCode: "PCHIP",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.061.2", title: "Menetapkan Dimensi dan Berat Serpih Kayu (Chip)" },
      { code: "A.02GNS01.062.2", title: "Menetapkan Mutu Penampilan Serpih Kayu (Chip)" },
      { code: "A.02GNS01.058.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan" },
    ]
  },
  // PAK
  {
    qualCode: "PAK",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "A.02GNS01.066.2", title: "Menetapkan Berat Arang Kayu" },
      { code: "A.02GNS01.067.2", title: "Melakukan Uji Visual Arang Kayu" },
      { code: "A.02GNS01.068.1", title: "Melaksanakan Penatausahaan Bahan Baku Arang Kayu" },
    ]
  },
  // JASLING-KARBON
  {
    qualCode: "JASLING-KARBON",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)" },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan" },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif." },
      { code: "KHT.IK02.053.1", title: "Menghitung Cadangan Karbon" },
      { code: "KHT.IK02.056.1", title: "Menghitung Emisi Karbon Hutan" },
      { code: "KHT.IK02.058.1", title: "Menghitung Serapan Karbon Hutan" },
      { code: "KHT.IK02.059.1", title: "Menghitung Selisih Emisi dan serapan Karbon" },
      { code: "KHT.PH02.060.1", title: "Merencanakan pemanfaatan produk jasa lingkungan" },
      { code: "KHT.PH02.058.1", title: "Mengadministrasikan produk jasa lingkungan" },
    ]
  }
];

async function setupCompetencyUnits() {
  try {
    // 1. Create competency_units table if not exists
    await sql`
      CREATE TABLE IF NOT EXISTS competency_units (
        id SERIAL PRIMARY KEY,
        code VARCHAR(100) NOT NULL UNIQUE,
        title TEXT NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'ACTIVE',
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. Create qualification_competency_units junction table
    await sql`
      CREATE TABLE IF NOT EXISTS qualification_competency_units (
        id SERIAL PRIMARY KEY,
        qualification_id INTEGER NOT NULL REFERENCES qualifications(id) ON DELETE CASCADE,
        competency_unit_id INTEGER NOT NULL REFERENCES competency_units(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT unique_qual_comp UNIQUE (qualification_id, competency_unit_id)
      );
    `;

    // Create Indexes according to Supabase Postgres Best Practices (rule: query-missing-indexes)
    await sql`CREATE INDEX IF NOT EXISTS idx_qcu_qual_id ON qualification_competency_units(qualification_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_qcu_comp_id ON qualification_competency_units(competency_unit_id);`;

    // 3. Add competency_unit_id to questions table if not exists
    await sql`
      ALTER TABLE questions ADD COLUMN IF NOT EXISTS competency_unit_id INTEGER REFERENCES competency_units(id) ON DELETE SET NULL;
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_questions_comp_unit_id ON questions(competency_unit_id);`;

    // Fetch existing qualifications map
    const qualRows = await sql`SELECT id, code FROM qualifications`;
    const qualMap = new Map();
    for (const r of qualRows) qualMap.set(r.code, r.id);

    // Upsert units & links inside transaction
    await sql.begin(async (tx) => {
      for (const group of competencyData) {
        const qualId = qualMap.get(group.qualCode);
        if (!qualId) continue;

        for (const u of group.units) {
          const [insertedUnit] = await tx`
            INSERT INTO competency_units (code, title, status)
            VALUES (${u.code}, ${u.title}, 'ACTIVE')
            ON CONFLICT (code) DO UPDATE SET title = EXCLUDED.title, updated_at = CURRENT_TIMESTAMP
            RETURNING id;
          `;
          
          const unitId = insertedUnit.id;

          await tx`
            INSERT INTO qualification_competency_units (qualification_id, competency_unit_id)
            VALUES (${qualId}, ${unitId})
            ON CONFLICT (qualification_id, competency_unit_id) DO NOTHING;
          `;
        }
      }
    });

    const [{ totalUnits }] = await sql`SELECT COUNT(*)::int as "totalUnits" FROM competency_units`;
    const [{ totalLinks }] = await sql`SELECT COUNT(*)::int as "totalLinks" FROM qualification_competency_units`;

    console.log(`✓ Setup Complete! Total Unit Kompetensi: ${totalUnits}, Total Kualifikasi Links: ${totalLinks}`);
    process.exit(0);
  } catch (err) {
    console.error("Error setting up Unit Kompetensi:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

setupCompetencyUnits();
