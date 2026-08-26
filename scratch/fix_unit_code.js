import postgres from 'postgres';

const connectionString = "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

async function main() {
  const sql = postgres(connectionString);

  console.log("--- Searching for KHT.WM03.004K.01 in competency_units ---");
  const units = await sql`
    SELECT * FROM competency_units WHERE code ILIKE '%WM03.004%'
  `;
  console.log("Found units:", units);

  if (units.length > 0) {
    const res = await sql`
      UPDATE competency_units 
      SET code = 'KHT.WM03.004.01' 
      WHERE code = 'KHT.WM03.004K.01'
      RETURNING *
    `;
    console.log("Updated unit:", res);
  } else {
    console.log("No matching unit found in DB.");
  }

  await sql.end();
}

main().catch(console.error);
