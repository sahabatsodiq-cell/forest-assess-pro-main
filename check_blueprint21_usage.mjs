import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

const rows = await sql.unsafe(`
  SELECT id, name, status, blueprint_id
  FROM exam_packages
  WHERE blueprint_id = 21
  ORDER BY id
`);

console.log(rows);

await sql.end();
