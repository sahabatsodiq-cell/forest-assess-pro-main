import postgres from "postgres";

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: "require" });

const PDF_SUBJECT_DATA = [
  { unitCode: "A.02GNS01.001.1", name: "Keselamatan, dan Kesehatan Kerja (K3)", code: "K3" },
  { unitCode: "A.02GNS01.002.1", name: "Mengorganisasikan Pekerjaan", code: "Org-Job" },
  { unitCode: "A.02GNS01.003.1", name: "Komunikasi Efektif", code: "Kom-Tif" },
  { unitCode: "A.02GNS01.005.1", name: "Penyusunan Rencana Kerja Pengukuran Perpetaan Hutan", code: "Ren-Kurpet" },
  { unitCode: "A.02GNS01.006.1", name: "Pengukuran Perpetaan Hutan", code: "Lak-Kurpet" },
  { unitCode: "A.02GNS01.007.1", name: "Penyusunan Laporan Hasil Pengukuran Perpetaan Hutan", code: "Lap-Kurpet" },
  { unitCode: "A.02GNS01.008.1", name: "Penyusunan Rencana Kerja Inventarisasi Tegakan Hutan", code: "Ren-Inven" },
  { unitCode: "A.02GNS01.009.1", name: "Pelaksanaan Inventarisasi Tegakan Hutan", code: "Lak-Inven" },
  { unitCode: "A.02GNS01.010.1", name: "Penyusunan Laporan Hasil Inventarisasi Tegakan Hutan", code: "Lap-Inven" },
  { unitCode: "A.02GNS01.011.1", name: "Penyusunan Rencana Pengelolaan Jangka Panjang Pemanfaatan Hasil Hutan Kayu", code: "RPHJP-Kayu" },
  { unitCode: "A.02GNS01.012.1", name: "Penyusunan Rencana Kerja Tahunan Pemanfaatan Hasil Hutan Kayu", code: "RKTPH-Kayu" },
  { unitCode: "A.02GNS01.015.1", name: "Penyusunan Rancangan Pembukaan Wilayah Hutan", code: "Ren-PWH" },
  { unitCode: "A.02GNS01.016.1", name: "Pengendalian Pelaksanaan Pembukaan Wilayah Hutan", code: "Lak-PWH" },
  { unitCode: "A.02GNS01.017.1", name: "Perencanaan Pemanenan Hasil Hutan Kayu", code: "Ren-Tebang" },
  { unitCode: "A.02GNS01.018.1", name: "Pengawasan Kegiatan Penebangan Pohon", code: "Was-Tebang" },
  { unitCode: "A.02GNS01.019.1", name: "Pengawasan Pelaksanaan Penyaradan Kayu Bundar", code: "Was-Sarad" },
  { unitCode: "A.02GNS01.021.1", name: "Penetapan Nama Jenis Kayu", code: "Jenis-Kayu" },
  { unitCode: "A.02GNS01.022.2", name: "Penetapan Isi (Volume) Kayu Bundar Besar dan Sedang", code: "Vol-KBB/S" },
  { unitCode: "A.02GNS01.023.2", name: "Penetapan Isi (Volume) Kayu Bundar Kecil", code: "Vol-KBK" },
  { unitCode: "A.02GNS01.024.1", name: "Penetapan Sortimen Kayu Bundar", code: "Sort-KB" },
  { unitCode: "A.02GNS01.025.1", name: "Penetapan Mutu Penampilan Kayu Bundar", code: "Mutu-KB" },
  { unitCode: "A.02GNS01.026.1", name: "Pelaksanaan Penatausahaan Hasil Hutan (PUHH) Kayu Bundar", code: "PUHH-KB" },
  { unitCode: "A.02GNS01.027.2", name: "Penetapan Nama Jenis Kelompok Batang", code: "Jenis-Batang" },
  { unitCode: "A.02GNS01.028.2", name: "Penetapan Berat atau Jumlah Batang", code: "Berat-Batang" },
  { unitCode: "A.02GNS01.029.1", name: "Persiapan Uji Visual dan Laboratoris HHBK", code: "Uji-HHBK" },
  { unitCode: "A.02GNS01.030.1", name: "Pelaksanaan Uji Visual Kelompok Batang", code: "Visual-Batang" },
  { unitCode: "A.02GNS01.031.2", name: "Penetapan Mutu Hasil Hutan Bukan Kayu (HHBK)", code: "Mutu-HHBK" },
  { unitCode: "A.02GNS01.032.1", name: "Pelaksanaan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu", code: "PUHH-HHBK" },
  { unitCode: "A.02GNS01.033.2", name: "Penetapan Nama Jenis Kelompok Resin", code: "Jenis-Resin" },
  { unitCode: "A.02GNS01.034.2", name: "Penetapan Berat Resin", code: "Berat-Resin" },
  { unitCode: "A.02GNS01.035.1", name: "Pelaksanaan Uji Visual Kelompok Resin", code: "Visual-Resin" },
  { unitCode: "A.02GNS01.036.2", name: "Penetapan Nama Jenis Kelompok Getah", code: "Jenis-Getah" },
  { unitCode: "A.02GNS01.037.2", name: "Penetapan Berat Getah", code: "Berat-Getah" },
  { unitCode: "A.02GNS01.038.1", name: "Pelaksanaan Uji Visual Kelompok Getah", code: "Visual-Getah" },
  { unitCode: "A.02GNS01.039.2", name: "Penetapan Nama Jenis Kelompok Kulit", code: "Jenis-Kulit" },
  { unitCode: "A.02GNS01.040.2", name: "Penetapan Berat Kulit", code: "Berat-Kulit" },
  { unitCode: "A.02GNS01.041.1", name: "Pelaksanaan Uji Visual Kelompok Kulit", code: "Visual-Kulit" },
  { unitCode: "A.02GNS01.042.1", name: "Penyusunan Desain Tapak Pembangunan Sarana dan Prasarana Wisata Alam", code: "Desain-Tapak" },
  { unitCode: "A.02GNS01.044.1", name: "Penyusunan Rencana Kerja Usaha (RKU) pada Pemanfaatan Jasa Lingkungan Wisata Alam", code: "RKU-JaslingWA" },
  { unitCode: "A.02GNS01.045.1", name: "Penyusunan Rencana Kerja Tahunan (RKT) pada Pemanfaatan Jasa Lingkungan Wisata Alam", code: "RKT-JaslingWA" },
  { unitCode: "A.02GNS01.046.1", name: "Perencanaan Kegiatan Pembinaan Hutan", code: "Ren-Binhut" },
  { unitCode: "A.02GNS01.047.1", name: "Pengawasan Kegiatan Pembinaan Hutan", code: "Was-Binhut" },
  { unitCode: "A.02GNS01.049.2", name: "Pengawasan kegiatan perlindungan dan pengamanan hutan", code: "Was-Linkamhut" },
  { unitCode: "A.02GNS01.050.2", name: "Pelaksanaan pemantauan dampak terhadap tanah dan air akibat pemanfaatan hutan", code: "Monev-Dampak" },
  { unitCode: "A.02GNS01.052.1", name: "Pelaksanaan Pemetaan Potensi Konflik Sosial", code: "Mapping-Konflik" },
  { unitCode: "A.02GNS01.054.1", name: "Penyusunan Rencana Program Pemberdayaan Masyarakat Melalui Kemitraan", code: "Ren-Comdev" },
  { unitCode: "A.02GNS01.056.1", name: "Penetapan Volume Kayu Gergajian", code: "Vol-KG" },
  { unitCode: "A.02GNS01.057.1", name: "Penetapan Mutu Penampilan Kayu Gergajian", code: "Mutu-KG" },
  { unitCode: "A.02GNS01.058.1", name: "Pelaksanaan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan", code: "PUHH-KO" },
  { unitCode: "A.02GNS01.059.1", name: "Penetapan Dimensi dan Volume Kayu Lapis", code: "Vol-KL" },
  { unitCode: "A.02GNS01.060.1", name: "Penetapan Mutu Penampilan Kayu Lapis", code: "Mutu-KL" },
  { unitCode: "A.02GNS01.061.2", name: "Penetapan Dimensi dan Berat Serpih Kayu (Chip)", code: "Berat-Serpih" },
  { unitCode: "A.02GNS01.062.2", name: "Penetapan Mutu Penampilan Serpih Kayu (Chip)", code: "Mutu-Serpih" },
  { unitCode: "A.02GNS01.063.2", name: "Penetapan Nama Jenis Kelompok Minyak", code: "Jenis-Minyak" },
  { unitCode: "A.02GNS01.064.2", name: "Penetapan Berat Minyak", code: "Berat-Minyak" },
  { unitCode: "A.02GNS01.065.1", name: "Pelaksanaan Uji Visual Kelompok Minyak", code: "Visual-Minyak" },
  { unitCode: "A.02GNS01.066.2", name: "Penetapan Berat Arang Kayu", code: "Berat-Arang" },
  { unitCode: "A.02GNS01.067.2", name: "Pelaksanaan Uji Visual Arang Kayu", code: "Mutu-Arang" },
  { unitCode: "A.02GNS01.068.1", name: "Pelaksanaan Penatausahaan Bahan Baku Arang Kayu", code: "PUHH-Arang" },
  { unitCode: "KHT.IK02.053.01", name: "Penghitungan Cadangan Karbon", code: "Cad-Karbon" },
  { unitCode: "KHT.IK02.056.01", name: "Penghitungan Emisi Karbon Hutan", code: "Emisi-Karbon" },
  { unitCode: "KHT.IK02.059.01", name: "Penghitungan Serapan Karbon Hutan", code: "Serap-Karbon" },
  { unitCode: "KHT.IK02.060.01", name: "Penghitungan Selisih Emisi dan serapan Karbon", code: "Selisih-Karbon" },
  { unitCode: "KHT.PH02.033.01", name: "Memandu Pengunjung Wisata Alam", code: "Pandu-Visitor" },
  { unitCode: "KHT.PH02.036.01", name: "Perencanaan pemanfaatan produk jasa lingkungan", code: "Ren-Jasling" },
  { unitCode: "KHT.PH02.037.01", name: "Pengadministrasian produk jasa lingkungan", code: "Adm-Jasling" },
  { unitCode: "KHT.WM03.002.01", name: "Pengolahan dan analisis data debit aliran", code: "Debit-Air" },
  { unitCode: "KHT.WM03.003.01", name: "Pengolahan dan analisis data sedimentasi", code: "Sedimen" },
  { unitCode: "KHT.WM03.004.01", name: "Pengolahan dan analisis data curah hujan", code: "Curah-Hujan" },
  { unitCode: "PAR.PE.03.006.01", name: "Berkomunikasi secara lisan dalam bahasa Inggris pada tingkat operasional dasar.", code: "Speak-English" },
  { unitCode: "KAW-001.01", name: "Identifikasi potensi kawasan", code: "Iden-Potensi" },
  { unitCode: "KAW-001.02", name: "Analisis kemampuan lahan", code: "Kemampuan-Lahan" },
  { unitCode: "KAW-001.03", name: "Analisis kesesuaian lahan (mencakup sifat fisik, kimia, biologi tanah, dan curah hujan)", code: "Sesuai-Lahan" },
  { unitCode: "KAW-001.04", name: "Perencanaan usaha pemanfaatan kawasan", code: "RU-PemanKawasan" },
  { unitCode: "KAW-001.05", name: "Pengadministrasian produksi dan pemasaran hasil kawasan", code: "Adm-ProdPasar" },
  { unitCode: "KAW-001.06", name: "Pengukuran dan pengujian potensi kawasan", code: "Ukur-Uji" }
];

async function syncSubjects() {
  try {
    console.log("=== SYNCHRONIZING SUBJECTS TABLE WITH UPLOADED PDF DATA ===");

    // 1. Add competency_unit_id to subjects table if not present
    await sql`ALTER TABLE subjects ADD COLUMN IF NOT EXISTS competency_unit_id INTEGER REFERENCES competency_units(id) ON DELETE CASCADE;`;

    // 2. Make qualification_id nullable in subjects table
    await sql`ALTER TABLE subjects ALTER COLUMN qualification_id DROP NOT NULL;`;

    // 3. Delete old test subjects requested by user: Inventarisasi Hutan (CAN-INV), Pengukuran & Pemetaan (CAN-MEB), Silvikultur & Pembinaan (CAN-SIL)
    const deleted = await sql`
      DELETE FROM subjects
      WHERE code IN ('CAN-INV', 'CAN-MEB', 'CAN-SIL');
    `;
    console.log(`Deleted ${deleted.count} legacy subjects (CAN-INV, CAN-MEB, CAN-SIL).`);

    // Fetch all competency units to map codes to IDs
    const compUnits = await sql`SELECT id, code, title FROM competency_units;`;
    const cuMap = new Map();
    for (const cu of compUnits) {
      cuMap.set(cu.code, cu.id);
    }

    // 4. Insert or update each of the 76 subject rows
    let insertedCount = 0;
    let updatedCount = 0;

    for (const item of PDF_SUBJECT_DATA) {
      const cuId = cuMap.get(item.unitCode) || null;

      // Check if subject exists by code
      const existing = await sql`SELECT id FROM subjects WHERE code = ${item.code};`;

      if (existing.length > 0) {
        await sql`
          UPDATE subjects
          SET name = ${item.name},
              competency_unit_id = ${cuId},
              status = 'ACTIVE',
              updated_at = CURRENT_TIMESTAMP
          WHERE id = ${existing[0].id};
        `;
        updatedCount++;
      } else {
        await sql`
          INSERT INTO subjects (competency_unit_id, code, name, status, weight)
          VALUES (${cuId}, ${item.code}, ${item.name}, 'ACTIVE', 0);
        `;
        insertedCount++;
      }
    }

    console.log(`Synchronization complete! Inserted: ${insertedCount}, Updated: ${updatedCount}`);

    // Update questions subject_id links if needed
    const k3Subject = await sql`SELECT id FROM subjects WHERE code = 'K3' LIMIT 1;`;
    if (k3Subject.length > 0) {
      const qUpdate = await sql`
        UPDATE questions
        SET subject_id = ${k3Subject[0].id}
        WHERE subject_id IS NULL OR subject_id NOT IN (SELECT id FROM subjects);
      `;
      console.log(`Updated ${qUpdate.count} questions to valid subject_id.`);
    }

    // Audit verify subjects table count
    const totalSubjects = await sql`
      SELECT s.id, cu.code as competency_unit_code, s.name as materi_subjek, s.code as kode_materi, s.status
      FROM subjects s
      LEFT JOIN competency_units cu ON s.competency_unit_id = cu.id
      ORDER BY s.id ASC;
    `;
    console.log(`\n=== TOTAL SUBJECTS IN DB: ${totalSubjects.length} ===`);
    console.log(totalSubjects.slice(0, 15));

  } catch (err) {
    console.error("Error synchronizing subjects:", err);
  } finally {
    await sql.end();
  }
}

syncSubjects();
