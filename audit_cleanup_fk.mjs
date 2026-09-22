import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

const rows = await sql.unsafe(`
  SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
   AND tc.constraint_schema = kcu.constraint_schema
  JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
   AND ccu.constraint_schema = tc.constraint_schema
  JOIN information_schema.referential_constraints rc
    ON rc.constraint_name = tc.constraint_name
   AND rc.constraint_schema = tc.constraint_schema
  WHERE tc.constraint_type = 'FOREIGN KEY'
    AND (
      tc.table_name IN (
        'attempt_questions',
        'exam_attempts',
        'exam_enrollments',
        'exam_packages',
        'blueprint_items'
      )
      OR ccu.table_name IN (
        'exam_attempts',
        'exam_packages',
        'exam_blueprints'
      )
    )
  ORDER BY foreign_table_name, table_name
`);

console.log(rows);

await sql.end();
