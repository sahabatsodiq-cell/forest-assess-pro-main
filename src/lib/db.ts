import path from "path";

// DB initialization is server-only.
let dbInstance: any = null;

export async function getDb() {
  if (typeof window !== "undefined") {
    throw new Error("getDb() cannot be called on the client side");
  }

  if (dbInstance) return dbInstance;

  // Dynamically require better-sqlite3 to prevent client-side bundle issues in Vite
  const Database = (await import("better-sqlite3")).default;
  const dbPath = path.resolve(process.cwd(), "db.sqlite");
  const db = new Database(dbPath);
  
  // Enable foreign keys
  db.pragma("foreign_keys = ON");

  // Create tables if they do not exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('SUPER_ADMIN', 'ADMIN', 'PESERTA')),
      participant_number TEXT,
      is_active INTEGER NOT NULL DEFAULT 1 CHECK(is_active IN (0, 1)),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS qualifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_qualifications (
      user_id INTEGER NOT NULL,
      qualification_id INTEGER NOT NULL,
      PRIMARY KEY (user_id, qualification_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qualification_id INTEGER NOT NULL,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      weight INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qualification_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      question_text TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_answer TEXT NOT NULL CHECK(correct_answer IN ('A', 'B', 'C', 'D')),
      difficulty TEXT NOT NULL CHECK(difficulty IN ('EASY', 'MEDIUM', 'HARD')),
      explanation TEXT,
      status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK(status IN ('ACTIVE', 'INACTIVE')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS exam_blueprints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qualification_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      total_questions INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS blueprint_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      blueprint_id INTEGER NOT NULL,
      subject_id INTEGER NOT NULL,
      difficulty TEXT NOT NULL CHECK(difficulty IN ('EASY', 'MEDIUM', 'HARD')),
      question_count INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (blueprint_id) REFERENCES exam_blueprints(id) ON DELETE CASCADE,
      FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS exam_packages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      qualification_id INTEGER NOT NULL,
      blueprint_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      code TEXT UNIQUE NOT NULL,
      description TEXT,
      instructions TEXT,
      duration_minutes INTEGER NOT NULL,
      passing_grade REAL NOT NULL,
      start_at DATETIME NOT NULL,
      end_at DATETIME NOT NULL,
      status TEXT NOT NULL DEFAULT 'DRAFT' CHECK(status IN ('DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'ARCHIVED')),
      created_by INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (qualification_id) REFERENCES qualifications(id) ON DELETE CASCADE,
      FOREIGN KEY (blueprint_id) REFERENCES exam_blueprints(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS exam_enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_packages(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(exam_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS exam_attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      ended_at DATETIME NOT NULL,
      submitted_at DATETIME,
      status TEXT NOT NULL DEFAULT 'IN_PROGRESS' CHECK(status IN ('NOT_STARTED', 'IN_PROGRESS', 'SUBMITTED', 'AUTO_SUBMITTED')),
      score REAL DEFAULT 0,
      correct_count INTEGER DEFAULT 0,
      incorrect_count INTEGER DEFAULT 0,
      unanswered_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (exam_id) REFERENCES exam_packages(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS attempt_questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      attempt_id INTEGER NOT NULL,
      question_id INTEGER NOT NULL,
      display_order INTEGER NOT NULL,
      option_mapping TEXT NOT NULL, -- e.g. "A:A,B:B,C:C,D:D" or shuffled
      selected_answer TEXT CHECK(selected_answer IN ('A', 'B', 'C', 'D', NULL)),
      FOREIGN KEY (attempt_id) REFERENCES exam_attempts(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      action TEXT NOT NULL,
      entity_type TEXT NOT NULL,
      entity_id INTEGER,
      metadata TEXT, -- JSON payload
      ip_address TEXT,
      user_agent TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );
  `);

  // Create indexes for optimization
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_questions_qual_subj ON questions(qualification_id, subject_id);
    CREATE INDEX IF NOT EXISTS idx_exam_packages_code ON exam_packages(code);
    CREATE INDEX IF NOT EXISTS idx_attempts_user_exam ON exam_attempts(user_id, exam_id);
    CREATE INDEX IF NOT EXISTS idx_attempt_questions_attempt ON attempt_questions(attempt_id);
  `);

  dbInstance = db;
  return dbInstance;
}
