import postgres from "postgres";

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: "require" });

// Complete master dataset matching uploaded document (11 pages)
const pdfData = [
  // 1. KURPET
  {
    qualCode: "KURPET",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.005.1", title: "Menyusun Rencana Kerja Pengukuran Perpetaan Hutan", subjectCode: "Ren-Kurpet", questionCount: 5 },
      { code: "A.02GNS01.006.1", title: "Melaksanakan Pengukuran Perpetaan Hutan", subjectCode: "Lak-Kurpet", questionCount: 5 },
      { code: "A.02GNS01.007.1", title: "Menyusun Laporan Hasil Pengukuran Perpetaan Hutan", subjectCode: "Lap-Kurpet", questionCount: 5 },
    ]
  },
  // 2. CANHUT
  {
    qualCode: "CANHUT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan", subjectCode: "Org-Job", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.008.1", title: "Menyusun Rencana Kerja Inventarisasi Tegakan Hutan", subjectCode: "Ren-Inven", questionCount: 5 },
      { code: "A.02GNS01.009.1", title: "Melaksanakan Inventarisasi Tegakan Hutan", subjectCode: "Lak-Inven", questionCount: 5 },
      { code: "A.02GNS01.010.1", title: "Menyusun Laporan Hasil Inventarisasi Tegakan Hutan", subjectCode: "Lap-Inven", questionCount: 5 },
      { code: "A.02GNS01.011.1", title: "Menyusun Rencana Pengelolaan Jangka Panjang Pemanfaatan Hasil Hutan Kayu", subjectCode: "RPHJP-Kayu", questionCount: 5 },
      { code: "A.02GNS01.012.1", title: "Menyusun Rencana Kerja Tahunan Pemanfaatan Hasil Hutan Kayu", subjectCode: "RKTPH-Kayu", questionCount: 5 },
    ]
  },
  // 3. NENHUT
  {
    qualCode: "NENHUT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan", subjectCode: "Org-Job", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.015.1", title: "Menyusun Rancangan Pembukaan Wilayah Hutan", subjectCode: "Ren-PWH", questionCount: 5 },
      { code: "A.02GNS01.016.1", title: "Mengendalikan Pelaksanaan Pembukaan Wilayah Hutan", subjectCode: "Lak-PWH", questionCount: 5 },
      { code: "A.02GNS01.017.1", title: "Merencanakan Pemanenan Hasil Hutan Kayu", subjectCode: "Ren-Tebang", questionCount: 5 },
      { code: "A.02GNS01.018.1", title: "Mengawasi Kegiatan Penebangan Pohon", subjectCode: "Was-Tebang", questionCount: 5 },
      { code: "A.02GNS01.019.1", title: "Mengawasi Pelaksanaan Penyaradan Kayu Bundar", subjectCode: "Was-Sarad", questionCount: 5 },
    ]
  },
  // 4. PKB
  {
    qualCode: "PKB",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.021.1", title: "Menetapkan Nama Jenis Kayu", subjectCode: "Jenis-Kayu", questionCount: 5 },
      { code: "A.02GNS01.022.2", title: "Menetapkan Isi (Volume) Kayu Bundar Besar dan Sedang", subjectCode: "Vol-KBB/S", questionCount: 5 },
      { code: "A.02GNS01.023.2", title: "Menetapkan Isi (Volume) Kayu Bundar Kecil", subjectCode: "Vol-KBK", questionCount: 5 },
      { code: "A.02GNS01.024.1", title: "Menetapkan Sortimen Kayu Bundar", subjectCode: "Sort-KB", questionCount: 5 },
      { code: "A.02GNS01.025.1", title: "Menetapkan Mutu Penampilan Kayu Bundar", subjectCode: "Mutu-KB", questionCount: 5 },
      { code: "A.02GNS01.026.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Bundar", subjectCode: "PUHH-KB", questionCount: 5 },
    ]
  },
  // 5. HHBK-BATANG
  {
    qualCode: "HHBK-BATANG",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu", subjectCode: "PUHH-HHBK", questionCount: 5 },
      { code: "A.02GNS01.027.2", title: "Menetapkan Nama Jenis Kelompok Batang", subjectCode: "Jenis-Batang", questionCount: 5 },
      { code: "A.02GNS01.028.2", title: "Menetapkan Berat atau Jumlah Batang", subjectCode: "Berat-Batang", questionCount: 5 },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK", subjectCode: "Uji-HHBK", questionCount: 5 },
      { code: "A.02GNS01.030.1", title: "Melakukan Uji Visual Kelompok Batang", subjectCode: "Visual-Batang", questionCount: 5 },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)", subjectCode: "Mutu-HHBK", questionCount: 5 },
    ]
  },
  // 6. HHBK-RESIN
  {
    qualCode: "HHBK-RESIN",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu", subjectCode: "PUHH-HHBK", questionCount: 5 },
      { code: "A.02GNS01.033.2", title: "Menetapkan Nama Jenis Kelompok Resin", subjectCode: "Jenis-Resin", questionCount: 5 },
      { code: "A.02GNS01.034.2", title: "Menetapkan Berat Resin", subjectCode: "Berat-Resin", questionCount: 5 },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK", subjectCode: "Uji-HHBK", questionCount: 5 },
      { code: "A.02GNS01.035.1", title: "Melakukan Uji Visual Kelompok Resin", subjectCode: "Visual-Resin", questionCount: 5 },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)", subjectCode: "Mutu-HHBK", questionCount: 5 },
    ]
  },
  // 7. HHBK-GETAH
  {
    qualCode: "HHBK-GETAH",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu", subjectCode: "PUHH-HHBK", questionCount: 5 },
      { code: "A.02GNS01.036.2", title: "Menetapkan Nama Jenis Kelompok Getah", subjectCode: "Jenis-Getah", questionCount: 5 },
      { code: "A.02GNS01.037.2", title: "Menetapkan Berat Getah", subjectCode: "Berat-Getah", questionCount: 5 },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK", subjectCode: "Uji-HHBK", questionCount: 5 },
      { code: "A.02GNS01.038.1", title: "Melakukan Uji Visual Kelompok Getah", subjectCode: "Visual-Getah", questionCount: 5 },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)", subjectCode: "Mutu-HHBK", questionCount: 5 },
    ]
  },
  // 8. HHBK-KULIT
  {
    qualCode: "HHBK-KULIT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu", subjectCode: "PUHH-HHBK", questionCount: 5 },
      { code: "A.02GNS01.039.2", title: "Menetapkan Nama Jenis Kelompok Kulit", subjectCode: "Jenis-Kulit", questionCount: 5 },
      { code: "A.02GNS01.040.2", title: "Menetapkan Berat Kulit", subjectCode: "Berat-Kulit", questionCount: 5 },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK", subjectCode: "Uji-HHBK", questionCount: 5 },
      { code: "A.02GNS01.041.1", title: "Melakukan Uji Visual Kelompok Kulit", subjectCode: "Visual-Kulit", questionCount: 5 },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)", subjectCode: "Mutu-HHBK", questionCount: 5 },
    ]
  },
  // 9. HHBK-MINYAK
  {
    qualCode: "HHBK-MINYAK",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.032.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Bukan Kayu", subjectCode: "PUHH-HHBK", questionCount: 5 },
      { code: "A.02GNS01.063.2", title: "Menetapkan Nama Jenis Kelompok Minyak", subjectCode: "Jenis-Minyak", questionCount: 5 },
      { code: "A.02GNS01.064.2", title: "Menetapkan Berat Minyak", subjectCode: "Berat-Minyak", questionCount: 5 },
      { code: "A.02GNS01.029.1", title: "Melakukan Persiapan Uji Visual dan Laboratoris HHBK", subjectCode: "Uji-HHBK", questionCount: 5 },
      { code: "A.02GNS01.065.1", title: "Melakukan Uji Visual Kelompok Minyak", subjectCode: "Visual-Minyak", questionCount: 5 },
      { code: "A.02GNS01.031.2", title: "Menetapkan Mutu Hasil Hutan Bukan Kayu (HHBK)", subjectCode: "Mutu-HHBK", questionCount: 5 },
    ]
  },
  // 10. CAN-WA
  {
    qualCode: "CAN-WA",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan", subjectCode: "Org-Job", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.042.1", title: "Menyusun Desain Tapak Pembangunan Sarana dan Prasarana Wisata Alam", subjectCode: "Desain-Tapak", questionCount: 5 },
      { code: "A.02GNS01.044.1", title: "Menyusun Rencana Kerja Usaha (RKU) Pada Pemanfaatan Jasa Lingkungan Wisata Alam", subjectCode: "RKU-JaslingWA", questionCount: 5 },
      { code: "A.02GNS01.045.1", title: "Menyusun Rencana Kerja Tahunan (RKT) Pada Pemanfaatan Jasa Lingkungan Wisata Alam", subjectCode: "RKT-JaslingWA", questionCount: 5 },
    ]
  },
  // 11. PAN-WA
  {
    qualCode: "PAN-WA",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "KHT.PH02.033.01", title: "Memandu Pengunjung Wisata Alam", subjectCode: "Pandu-Visitor", questionCount: 5 },
      { code: "PAR.PE.03.006.01", title: "Berkomunikasi secara lisan dalam bahasa inggris pada tingkat operasional dasar.", subjectCode: "Speak-English", questionCount: 5 },
    ]
  },
  // 12. BINHUT
  {
    qualCode: "BINHUT",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan", subjectCode: "Org-Job", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.046.1", title: "Merencanakan Kegiatan Pembinaan Hutan", subjectCode: "Ren-Binhut", questionCount: 5 },
      { code: "A.02GNS01.047.1", title: "Mengawasi Kegiatan Pembinaan Hutan", subjectCode: "Was-Binhut", questionCount: 5 },
      { code: "A.02GNS01.049.2", title: "Mengawasi kegiatan perlindungan dan pengamanan hutan", subjectCode: "Was-Linkamhut", questionCount: 5 },
      { code: "A.02GNS01.050.2", title: "Melaksanakan pemantauan dampak terhadap tanah dan air akibat pemanfaatan hutan", subjectCode: "Monev-Dampak", questionCount: 5 },
      { code: "A.02GNS01.052.1", title: "Melakukan Pemetaan Potensi Konflik Sosial", subjectCode: "Mapping-Konflik", questionCount: 5 },
      { code: "A.02GNS01.054.1", title: "Menyusun Rencana Program Pemberdayaan Masyarakat Melalui Kemitraan", subjectCode: "Ren-Comdev", questionCount: 5 },
    ]
  },
  // 13. PKG
  {
    qualCode: "PKG",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.021.1", title: "Menetapkan Nama Jenis Kayu", subjectCode: "Jenis-Kayu", questionCount: 5 },
      { code: "A.02GNS01.056.1", title: "Menetapkan Volume Kayu Gergajian", subjectCode: "Vol-KG", questionCount: 5 },
      { code: "A.02GNS01.057.1", title: "Menetapkan Mutu Penampilan Kayu Gergajian", subjectCode: "Mutu-KG", questionCount: 5 },
      { code: "A.02GNS01.058.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan", subjectCode: "PUHH-KO", questionCount: 5 },
    ]
  },
  // 14. PKL
  {
    qualCode: "PKL",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.021.1", title: "Menetapkan Nama Jenis Kayu", subjectCode: "Jenis-Kayu", questionCount: 5 },
      { code: "A.02GNS01.059.1", title: "Menetapkan Dimensi dan Volume Kayu Lapis", subjectCode: "Vol-KL", questionCount: 5 },
      { code: "A.02GNS01.060.1", title: "Menetapkan Mutu Penampilan Kayu Lapis", subjectCode: "Mutu-KL", questionCount: 5 },
      { code: "A.02GNS01.058.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan", subjectCode: "PUHH-KO", questionCount: 5 },
    ]
  },
  // 15. PCHIP
  {
    qualCode: "PCHIP",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.061.2", title: "Menetapkan Dimensi dan Berat Serpih Kayu (Chip)", subjectCode: "Berat-Serpih", questionCount: 5 },
      { code: "A.02GNS01.062.2", title: "Menetapkan Mutu Penampilan Serpih Kayu (Chip)", subjectCode: "Mutu-Serpih", questionCount: 5 },
      { code: "A.02GNS01.058.1", title: "Melaksanakan Penatausahaan Hasil Hutan (PUHH) Kayu Olahan", subjectCode: "PUHH-KO", questionCount: 5 },
    ]
  },
  // 16. PAK
  {
    qualCode: "PAK",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "A.02GNS01.066.2", title: "Menetapkan Berat Arang Kayu", subjectCode: "Berat-Arang", questionCount: 5 },
      { code: "A.02GNS01.067.2", title: "Melakukan Uji Visual Arang Kayu", subjectCode: "Mutu-Arang", questionCount: 5 },
      { code: "A.02GNS01.068.1", title: "Melaksanakan Penatausahaan Bahan Baku Arang Kayu", subjectCode: "PUHH-Arang", questionCount: 5 },
    ]
  },
  // 17. JASLING-KARBON
  {
    qualCode: "JASLING-KARBON",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan", subjectCode: "Org-Job", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "KHT.IK02.053.01", title: "Menghitung Cadangan Karbon", subjectCode: "Cad-Karbon", questionCount: 5 },
      { code: "KHT.IK02.056.01", title: "Menghitung Emisi Karbon Hutan", subjectCode: "Emisi-Karbon", questionCount: 5 },
      { code: "KHT.IK02.059.01", title: "Menghitung Serapan Karbon Hutan", subjectCode: "Serap-Karbon", questionCount: 5 },
      { code: "KHT.IK02.060.01", title: "Menghitung Selisih Emisi dan serapan Karbon", subjectCode: "Selisih-Karbon", questionCount: 5 },
      { code: "KHT.PH02.036.01", title: "Merencanakan pemanfaatan produk jasa lingkungan", subjectCode: "Ren-Jasling", questionCount: 5 },
      { code: "KHT.PH02.037.01", title: "Mengadministrasikan produk jasa lingkungan", subjectCode: "Adm-Jasling", questionCount: 5 },
    ]
  },
  // 18. JASLING-AIR
  {
    qualCode: "JASLING-AIR",
    units: [
      { code: "A.02GNS01.001.1", title: "Menerapkan Keselamatan, dan Kesehatan Kerja (K3)", subjectCode: "K3", questionCount: 5 },
      { code: "A.02GNS01.002.1", title: "Mengorganisasikan Pekerjaan", subjectCode: "Org-Job", questionCount: 5 },
      { code: "A.02GNS01.003.1", title: "Melakukan komunikasi efektif.", subjectCode: "Kom-Tif", questionCount: 5 },
      { code: "KHT.WM03.002.01", title: "Melakukan pengolahan dan analisis data debit aliran", subjectCode: "Debit-Air", questionCount: 5 },
      { code: "KHT.WM03.003.01", title: "Melakukan pengolahan dan analisis data sedimentasi", subjectCode: "Sedimen", questionCount: 5 },
      { code: "KHT.WM03.004K.01", title: "Melakukan pengolahan dan analisis data curah hujan", subjectCode: "Curah-Hujan", questionCount: 5 },
      { code: "KHT.PH02.036.01", title: "Merencanakan pemanfaatan produk jasa lingkungan", subjectCode: "Ren-Jasling", questionCount: 5 },
      { code: "KHT.PH02.037.01", title: "Mengadministrasikan produk jasa lingkungan", subjectCode: "Adm-Jasling", questionCount: 5 },
    ]
  },
  // 19. KAW
  {
    qualCode: "KAW",
    units: [
      { code: "KAW-001.01", title: "Mengidentifikasi potensi", subjectCode: "Iden-Potensi", questionCount: 5 },
      { code: "KAW-001.02", title: "Menganalisis kemampuan lahan", subjectCode: "Kemampuan-Lahan", questionCount: 5 },
      { code: "KAW-001.03", title: "Menganalisis kesesuaian lahan (mencakup sifat fisik, kimia, biologi tanah, dan curah hujan)", subjectCode: "Sesuai-Lahan", questionCount: 5 },
      { code: "KAW-001.04", title: "Merencanakan usaha pemanfaatan kawasan", subjectCode: "RU-PemanKawasan", questionCount: 5 },
      { code: "KAW-001.05", title: "Mengadministrasikan produksi dan pemasaran", subjectCode: "Adm-ProdPasar", questionCount: 5 },
      { code: "KAW-001.06", title: "Melakukan pengukuran dan pengujian", subjectCode: "Ukur-Uji", questionCount: 5 },
    ]
  }
];

async function fixMasterData() {
  try {
    console.log("1. Adding missing columns to competency_units table if needed...");
    await sql`
      ALTER TABLE competency_units 
      ADD COLUMN IF NOT EXISTS subject_code VARCHAR(100),
      ADD COLUMN IF NOT EXISTS question_count INTEGER DEFAULT 5;
    `;

    // Map existing qualifications in DB
    const qualRows = await sql`SELECT id, code FROM qualifications`;
    const qualMap = new Map();
    for (const r of qualRows) qualMap.set(r.code, r.id);

    // Build unique set of valid unit codes from PDF
    const pdfUnitCodes = new Set();
    const uniquePdfUnits = new Map(); // code -> { title, subjectCode, questionCount }

    for (const group of pdfData) {
      for (const u of group.units) {
        pdfUnitCodes.add(u.code);
        if (!uniquePdfUnits.has(u.code)) {
          uniquePdfUnits.set(u.code, u);
        }
      }
    }

    console.log(`2. Total unique units in PDF dataset: ${uniquePdfUnits.size}`);

    console.log("3. Inserting clean master unit kompetensi data...");
    await sql.begin(async (tx) => {
      await tx`DELETE FROM qualification_competency_units;`;
      await tx`DELETE FROM competency_units;`;

      const unitIdMap = new Map();

      for (const [code, u] of uniquePdfUnits.entries()) {
        const [inserted] = await tx`
          INSERT INTO competency_units (code, title, subject_code, question_count, status)
          VALUES (${u.code}, ${u.title}, ${u.subjectCode}, ${u.questionCount}, 'ACTIVE')
          RETURNING id;
        `;
        unitIdMap.set(code, inserted.id);
      }

      console.log("4. Rebuilding qualification_competency_units junction links...");
      for (const group of pdfData) {
        const qualId = qualMap.get(group.qualCode);
        if (!qualId) {
          console.warn(`Warning: Qualification code ${group.qualCode} not found in DB!`);
          continue;
        }

        for (const u of group.units) {
          const unitId = unitIdMap.get(u.code);
          if (unitId) {
            await tx`
              INSERT INTO qualification_competency_units (qualification_id, competency_unit_id)
              VALUES (${qualId}, ${unitId})
              ON CONFLICT (qualification_id, competency_unit_id) DO NOTHING;
            `;
          }
        }
      }
    });

    const [{ totalUnits }] = await sql`SELECT COUNT(*)::int as "totalUnits" FROM competency_units`;
    const [{ totalLinks }] = await sql`SELECT COUNT(*)::int as "totalLinks" FROM qualification_competency_units`;

    console.log(`\n✅ FIX COMPLETE! Total Unit Kompetensi: ${totalUnits}, Total Qualification Links: ${totalLinks}`);
  } catch (err) {
    console.error("❌ Error fixing master data:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

fixMasterData();
