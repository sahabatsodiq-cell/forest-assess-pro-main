import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL);

console.log("=== ENROLLMENTS ===");
console.log(await sql.unsafe(`
  SELECT *
  FROM exam_enrollments
  WHERE exam_id = 21 AND user_id = 43
`));

console.log("\n=== ATTEMPTS ===");
console.log(await sql.unsafe(`
  SELECT *
  FROM exam_attempts
  WHERE exam_id = 21 AND user_id = 43
  ORDER BY id
`));

console.log("\n=== ATTEMPT QUESTIONS ===");
console.log(await sql.unsafe(`
  SELECT aq.*
  FROM attempt_questions aq
  JOIN exam_attempts a ON a.id = aq.attempt_id
  WHERE a.exam_id = 21
    AND a.user_id = 43
`));

console.log("\n=== REGISTRATION REQUESTS ===");
console.log(await sql.unsafe(`
  SELECT *
  FROM exam_registration_requests
  WHERE user_id = 43
`));

await sql.end();
