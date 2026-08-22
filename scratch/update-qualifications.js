import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

console.log("Connecting to Supabase PostgreSQL Cloud to update Qualifications...");
const sql = postgres(connectionString, { ssl: "require" });

const fullQualifications = [
  { code: "KAW", name: "Pemanfaatan Kawasan", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Kawasan" },
  { code: "JASLING-AIR", name: "Pemanfaatan Jasa Lingkungan Air dan Aliran Air", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Jasa Lingkungan Air dan Aliran Air" },
  { code: "JASLING-KARBON", name: "Pemanfaatan Jasa Lingkungan Karbon", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Jasa Lingkungan Karbon" },
  { code: "PAN-WA", name: "Pemandu Wisata Alam", description: "Tenaga Teknis Pengelolaan Hutan Pemandu Wisata Alam" },
  { code: "CAN-WA", name: "Perencana Wisata Alam", description: "Tenaga Teknis Pengelolaan Hutan Perencana Wisata Alam" },
  { code: "PAK", name: "Pengujian Arang Kayu", description: "Tenaga Teknis Pengelolaan Hutan Pengujian Arang Kayu" },
  { code: "PKL", name: "Pengujian Kayu Lapis", description: "Tenaga Teknis Pengelolaan Hutan Pengujian Kayu Lapis" },
  { code: "PKG", name: "Pengujian Kayu Gergajian", description: "Tenaga Teknis Pengelolaan Hutan Pengujian Kayu Gergajian" },
  { code: "PKB", name: "Pengujian Kayu Bulat", description: "Tenaga Teknis Pengelolaan Hutan Pengujian Kayu Bulat" },
  { code: "HHBK-MINYAK", name: "HHBK Kelompok Minyak", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Hasil Hutan Bukan Kayu Kelompok Minyak" },
  { code: "HHBK-RESIN", name: "HHBK Kelompok Resin", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Hasil Hutan Bukan Kayu Kelompok Resin" },
  { code: "KURPET", name: "Pengukuran dan Perpetaan Hutan", description: "Tenaga Teknis Pengelolaan Hutan Pengukuran dan Perpetaan Hutan" },
  { code: "HHBK-KULIT", name: "HHBK Kelompok Kulit", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Hasil Hutan Bukan Kayu Kelompok Kulit" },
  { code: "HHBK-BATANG", name: "HHBK Kelompok Batang", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Hasil Hutan Bukan Kayu Kelompok Batang" },
  { code: "HHBK-GETAH", name: "HHBK Kelompok Getah", description: "Tenaga Teknis Pengelolaan Hutan Pemanfaatan Hasil Hutan Bukan Kayu Kelompok Getah" },
  { code: "PCHIP", name: "Pengujian Serpih Kayu", description: "Tenaga Teknis Pengelolaan Hutan Pengujian Serpih Kayu" },
  { code: "BINHUT", name: "Pembinaan Hutan", description: "Tenaga Teknis Pengelolaan Hutan Pembinaan Hutan" },
  { code: "NENHUT", name: "Pemanenan Hutan", description: "Tenaga Teknis Pengelolaan Hutan Pemanenan Hutan" },
  { code: "CANHUT", name: "Perencanaan Hutan", description: "Tenaga Teknis Pengelolaan Hutan Perencanaan Hutan" },
];

async function updateQualifications() {
  try {
    let inserted = 0;
    let updated = 0;

    for (const q of fullQualifications) {
      const existing = await sql`SELECT id FROM qualifications WHERE code = ${q.code}`;
      if (existing.length > 0) {
        await sql`
          UPDATE qualifications 
          SET name = ${q.name}, description = ${q.description}, status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP
          WHERE code = ${q.code}
        `;
        updated++;
      } else {
        await sql`
          INSERT INTO qualifications (code, name, description, status)
          VALUES (${q.code}, ${q.name}, ${q.description}, 'ACTIVE')
        `;
        inserted++;
      }
    }

    const [{ count }] = await sql`SELECT COUNT(*)::int as count FROM qualifications`;
    console.log(`✓ Qualifications update complete! Inserted: ${inserted}, Updated: ${updated}. Total in Supabase: ${count}`);
  } catch (err) {
    console.error("Error updating qualifications:", err);
  } finally {
    await sql.end();
  }
}

updateQualifications();
