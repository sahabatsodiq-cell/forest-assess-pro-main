import Database from "better-sqlite3";
import postgres from "postgres";
import path from "path";

const dbPath = path.resolve(process.cwd(), "db.sqlite");
const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

console.log("Reading data from local SQLite database:", dbPath);
const sqlite = new Database(dbPath);

console.log("Connecting to target Supabase PostgreSQL Cloud...");
const pg = postgres(connectionString, { ssl: "require" });

async function migrateData() {
  try {
    // 1. Fetch data from SQLite
    const users = sqlite.prepare("SELECT * FROM users").all();
    const qualifications = sqlite.prepare("SELECT * FROM qualifications").all();
    const userQuals = sqlite.prepare("SELECT * FROM user_qualifications").all();
    const subjects = sqlite.prepare("SELECT * FROM subjects").all();
    const questions = sqlite.prepare("SELECT * FROM questions").all();
    const blueprints = sqlite.prepare("SELECT * FROM exam_blueprints").all();
    const blueprintItems = sqlite.prepare("SELECT * FROM blueprint_items").all();
    const examPackages = sqlite.prepare("SELECT * FROM exam_packages").all();
    const enrollments = sqlite.prepare("SELECT * FROM exam_enrollments").all();
    const attempts = sqlite.prepare("SELECT * FROM exam_attempts").all();
    const attemptQuestions = sqlite.prepare("SELECT * FROM attempt_questions").all();
    const auditLogs = sqlite.prepare("SELECT * FROM audit_logs").all();

    console.log(`Found in SQLite:
    - Users: ${users.length}
    - Qualifications: ${qualifications.length}
    - User Qualifications: ${userQuals.length}
    - Subjects: ${subjects.length}
    - Questions: ${questions.length}
    - Blueprints: ${blueprints.length}
    - Blueprint Items: ${blueprintItems.length}
    - Exam Packages: ${examPackages.length}
    - Enrollments: ${enrollments.length}
    - Attempts: ${attempts.length}
    - Attempt Questions: ${attemptQuestions.length}
    - Audit Logs: ${auditLogs.length}
    `);

    // Clean Supabase destination tables safely in reverse foreign key order
    console.log("Clearing destination tables in Supabase...");
    await pg`TRUNCATE audit_logs, attempt_questions, exam_attempts, exam_enrollments, exam_packages, blueprint_items, exam_blueprints, questions, subjects, user_qualifications, qualifications, users RESTART IDENTITY CASCADE;`;

    // 2. Insert Users
    console.log("Migrating Users...");
    for (const u of users) {
      await pg`
        INSERT INTO users (id, name, email, password_hash, role, participant_number, is_active, created_at, updated_at)
        VALUES (${u.id}, ${u.name}, ${u.email}, ${u.password_hash}, ${u.role}, ${u.participant_number || null}, ${u.is_active}, ${u.created_at}, ${u.updated_at})
      `;
    }

    // 3. Insert Qualifications
    console.log("Migrating Qualifications...");
    for (const q of qualifications) {
      await pg`
        INSERT INTO qualifications (id, code, name, description, status, created_at, updated_at)
        VALUES (${q.id}, ${q.code}, ${q.name}, ${q.description || null}, ${q.status}, ${q.created_at}, ${q.updated_at})
      `;
    }

    // 4. Insert User Qualifications
    console.log("Migrating User Qualifications...");
    for (const uq of userQuals) {
      await pg`
        INSERT INTO user_qualifications (user_id, qualification_id)
        VALUES (${uq.user_id}, ${uq.qualification_id})
      `;
    }

    // 5. Insert Subjects
    console.log("Migrating Subjects...");
    for (const s of subjects) {
      await pg`
        INSERT INTO subjects (id, qualification_id, code, name, description, weight, status, created_at, updated_at)
        VALUES (${s.id}, ${s.qualification_id}, ${s.code}, ${s.name}, ${s.description || null}, ${s.weight}, ${s.status}, ${s.created_at}, ${s.updated_at})
      `;
    }

    // 6. Insert Questions
    console.log("Migrating Questions...");
    for (const q of questions) {
      await pg`
        INSERT INTO questions (id, qualification_id, subject_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, status, created_by, created_at, updated_at)
        VALUES (${q.id}, ${q.qualification_id}, ${q.subject_id}, ${q.question_text}, ${q.option_a}, ${q.option_b}, ${q.option_c}, ${q.option_d}, ${q.correct_answer}, ${q.difficulty}, ${q.explanation || null}, ${q.status}, ${q.created_by || null}, ${q.created_at}, ${q.updated_at})
      `;
    }

    // 7. Insert Exam Blueprints
    console.log("Migrating Exam Blueprints...");
    for (const b of blueprints) {
      await pg`
        INSERT INTO exam_blueprints (id, qualification_id, name, description, total_questions, created_at, updated_at)
        VALUES (${b.id}, ${b.qualification_id}, ${b.name}, ${b.description || null}, ${b.total_questions}, ${b.created_at}, ${b.updated_at})
      `;
    }

    // 8. Insert Blueprint Items
    console.log("Migrating Blueprint Items...");
    for (const bi of blueprintItems) {
      await pg`
        INSERT INTO blueprint_items (id, blueprint_id, subject_id, difficulty, question_count)
        VALUES (${bi.id}, ${bi.blueprint_id}, ${bi.subject_id}, ${bi.difficulty}, ${bi.question_count})
      `;
    }

    // 9. Insert Exam Packages
    console.log("Migrating Exam Packages...");
    for (const p of examPackages) {
      await pg`
        INSERT INTO exam_packages (id, qualification_id, blueprint_id, name, code, description, instructions, duration_minutes, passing_grade, start_at, end_at, status, created_by, created_at, updated_at)
        VALUES (${p.id}, ${p.qualification_id}, ${p.blueprint_id}, ${p.name}, ${p.code}, ${p.description || null}, ${p.instructions || null}, ${p.duration_minutes}, ${p.passing_grade}, ${p.start_at}, ${p.end_at}, ${p.status}, ${p.created_by || null}, ${p.created_at}, ${p.updated_at})
      `;
    }

    // 10. Insert Enrollments
    console.log("Migrating Enrollments...");
    for (const e of enrollments) {
      await pg`
        INSERT INTO exam_enrollments (id, exam_id, user_id, enrolled_at)
        VALUES (${e.id}, ${e.exam_id}, ${e.user_id}, ${e.enrolled_at})
      `;
    }

    // 11. Insert Attempts
    console.log("Migrating Exam Attempts...");
    for (const a of attempts) {
      await pg`
        INSERT INTO exam_attempts (id, exam_id, user_id, started_at, ended_at, submitted_at, status, score, correct_count, incorrect_count, unanswered_count, created_at, updated_at)
        VALUES (${a.id}, ${a.exam_id}, ${a.user_id}, ${a.started_at}, ${a.ended_at}, ${a.submitted_at || null}, ${a.status}, ${a.score}, ${a.correct_count}, ${a.incorrect_count}, ${a.unanswered_count}, ${a.created_at}, ${a.updated_at})
      `;
    }

    // 12. Insert Attempt Questions
    console.log("Migrating Attempt Questions...");
    for (const aq of attemptQuestions) {
      await pg`
        INSERT INTO attempt_questions (id, attempt_id, question_id, display_order, option_mapping, selected_answer)
        VALUES (${aq.id}, ${aq.attempt_id}, ${aq.question_id}, ${aq.display_order}, ${aq.option_mapping}, ${aq.selected_answer || null})
      `;
    }

    // 13. Insert Audit Logs
    console.log("Migrating Audit Logs...");
    for (const l of auditLogs) {
      await pg`
        INSERT INTO audit_logs (id, user_id, action, entity_type, entity_id, metadata, ip_address, user_agent, created_at)
        VALUES (${l.id}, ${l.user_id || null}, ${l.action}, ${l.entity_type}, ${l.entity_id || null}, ${l.metadata || null}, ${l.ip_address || null}, ${l.user_agent || null}, ${l.created_at})
      `;
    }

    // Reset Postgres auto-increment serial sequences so new inserts don't conflict with existing IDs
    console.log("Resetting PostgreSQL primary key sequences...");
    const tables = [
      "users", "qualifications", "subjects", "questions", 
      "exam_blueprints", "blueprint_items", "exam_packages", 
      "exam_enrollments", "exam_attempts", "attempt_questions", "audit_logs"
    ];

    for (const tbl of tables) {
      await pg`SELECT setval(pg_get_serial_sequence(${tbl}, 'id'), COALESCE((SELECT MAX(id) FROM ${pg(tbl)}), 1));`;
    }

    console.log("🎉 SUCCESS! All local SQLite data has been fully migrated to Supabase Cloud PostgreSQL!");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    sqlite.close();
    await pg.end();
  }
}

migrateData();
