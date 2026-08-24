import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: 'require' });

async function deleteNonPkbPkg() {
  console.log("🔥 Starting deletion of non-PKB and non-PKG data from master_ganisph in Supabase Postgres Cloud...");

  // Count before deletion
  const totalBefore = await sql`SELECT COUNT(*) as count FROM master_ganisph;`;
  console.log(`📊 Total rows before deletion: ${totalBefore[0].count}`);

  // Delete all records except GANISPH PENGUJIAN KAYU BULAT (PKB) and GANISPH PENGUJIAN KAYU GERGAJIAN (PKG)
  const deleteResult = await sql`
    DELETE FROM master_ganisph
    WHERE NOT (
      qualification_name ILIKE '%PKB%' 
      OR qualification_name ILIKE '%PKG%' 
      OR qualification_name ILIKE '%KAYU BULAT%' 
      OR qualification_name ILIKE '%KAYU GERGAJIAN%'
    );
  `;

  console.log(`✅ Deleted rows from database.`);

  // Count after deletion
  const totalAfter = await sql`SELECT COUNT(*) as count FROM master_ganisph;`;
  console.log(`📊 Total rows after deletion: ${totalAfter[0].count}`);

  const breakdown = await sql`
    SELECT qualification_name, COUNT(*) as count 
    FROM master_ganisph 
    GROUP BY qualification_name;
  `;
  console.log("\n📋 Remaining records in database:");
  console.table(breakdown);

  // Sync scratch/master_ganisph_data.json
  const jsonPath = path.join(process.cwd(), "scratch", "master_ganisph_data.json");
  if (fs.existsSync(jsonPath)) {
    const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const filteredData = rawData.filter((item) => {
      const q = item.qualification_name || '';
      return (
        q.includes('PKB') ||
        q.includes('PKG') ||
        q.toLowerCase().includes('kayu bulat') ||
        q.toLowerCase().includes('kayu gergajian')
      );
    });
    fs.writeFileSync(jsonPath, JSON.stringify(filteredData, null, 2), 'utf8');
    console.log(`\n📁 Updated scratch/master_ganisph_data.json from ${rawData.length} to ${filteredData.length} records.`);
  }

  await sql.end();
}

deleteNonPkbPkg().catch((err) => {
  console.error("❌ Deletion failed:", err);
  process.exit(1);
});
