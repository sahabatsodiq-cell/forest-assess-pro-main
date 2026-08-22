import fs from 'fs';
import path from 'path';
import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";
const sql = postgres(connectionString, { ssl: 'require' });

async function setupMasterGanisph() {
  console.log("🚀 Setting up master_ganisph table in Supabase PostgreSQL Cloud...");

  // 1. Create master_ganisph table
  await sql`
    CREATE TABLE IF NOT EXISTS master_ganisph (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      qualification_name VARCHAR(255) NOT NULL,
      registration_number VARCHAR(100),
      email VARCHAR(255),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // Create indexes for fast lookup and search
  await sql`CREATE INDEX IF NOT EXISTS idx_mg_name ON master_ganisph(name);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mg_email ON master_ganisph(email);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mg_reg_no ON master_ganisph(registration_number);`;
  await sql`CREATE INDEX IF NOT EXISTS idx_mg_qual ON master_ganisph(qualification_name);`;

  console.log("✅ Table master_ganisph & indexes created successfully.");

  // 2. Read dataset from scratch/master_ganisph_data.json
  const dataPath = path.join(process.cwd(), "scratch", "master_ganisph_data.json");
  if (!fs.existsSync(dataPath)) {
    console.error("❌ File scratch/master_ganisph_data.json not found!");
    process.exit(1);
  }

  const items = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  console.log(`📥 Seeding ${items.length} records into master_ganisph...`);

  // Clear existing records
  await sql`TRUNCATE TABLE master_ganisph RESTART IDENTITY;`;

  // Batch insert items
  const chunkSize = 100;
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    await sql`
      INSERT INTO master_ganisph ${sql(
        chunk.map((item) => ({
          name: item.name,
          qualification_name: item.qualification_name,
          registration_number: item.registration_number,
          email: item.email,
        }))
      )}
    `;
    console.log(`   Inserted items ${i + 1} to ${Math.min(i + chunkSize, items.length)}...`);
  }

  const countRow = await sql`SELECT COUNT(*) as count FROM master_ganisph;`;
  console.log(`🎉 Master GANISPH setup complete! Total rows in database: ${countRow[0].count}`);

  await sql.end();
}

setupMasterGanisph().catch((err) => {
  console.error("❌ Setup failed:", err);
  process.exit(1);
});
