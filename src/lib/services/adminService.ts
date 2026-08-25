import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { hashPassword, verifySessionToken, logAudit, hasPermission } from "../auth";

function verifyAdminSession(token: string) {
  if (!token) throw new Error("Unauthorized");
  const session = verifySessionToken(token);
  if (!session || !hasPermission(session.role, "user.view")) {
    throw new Error("Forbidden: Admin access required");
  }
  return session;
}

// ------------------------------------------------------------------
// DASHBOARD STATS
// ------------------------------------------------------------------
export const getAdminStatsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();

    const totalUsers = (await db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'PESERTA'").get())?.count || 0;
    const totalQuals = (await db.prepare("SELECT COUNT(*) as count FROM qualifications WHERE status = 'ACTIVE'").get())?.count || 0;
    const totalQuestions = (await db.prepare("SELECT COUNT(*) as count FROM questions WHERE status = 'ACTIVE'").get())?.count || 0;
    const totalExams = (await db.prepare("SELECT COUNT(*) as count FROM exam_packages").get())?.count || 0;
    const activeExams = (await db.prepare("SELECT COUNT(*) as count FROM exam_packages WHERE status = 'PUBLISHED' OR status = 'ACTIVE'").get())?.count || 0;
    const totalAttempts = (await db.prepare("SELECT COUNT(*) as count FROM exam_attempts WHERE status IN ('SUBMITTED', 'AUTO_SUBMITTED')").get())?.count || 0;
    const passedAttempts = (await db.prepare("SELECT COUNT(*) as count FROM exam_attempts a JOIN exam_packages p ON a.exam_id = p.id WHERE a.status IN ('SUBMITTED', 'AUTO_SUBMITTED') AND a.score >= p.passing_grade").get())?.count || 0;

    return {
      totalUsers,
      totalQuals,
      totalQuestions,
      totalExams,
      activeExams,
      totalAttempts,
      passedAttempts,
    };
  });

// ------------------------------------------------------------------
// USERS CRUD
// ------------------------------------------------------------------
// ------------------------------------------------------------------
// USERS CRUD
// ------------------------------------------------------------------
export const getUsersFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    const users = await db.prepare(`
      SELECT u.id, u.name, u.email, u.role, u.participant_number, u.is_active, u.created_at,
             string_agg(q.code, '; ') as qualification_codes
      FROM users u
      LEFT JOIN user_qualifications uq ON u.id = uq.user_id
      LEFT JOIN qualifications q ON uq.qualification_id = q.id
      GROUP BY u.id
      ORDER BY u.id DESC
    `).all();
    const userList = Array.isArray(users) ? users : [];
    return userList.map((u: any) => ({ ...u, is_active: u.is_active === 1 || u.is_active === true }));
  });

export const createUserFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; name: string; email: string; password: string; role: string; participant_number?: string | undefined; qualification_ids?: number[] | undefined }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    // Check unique email
    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").get(data.email);
    if (existing) return { success: false, error: "Email sudah terdaftar." };

    const passHash = hashPassword(data.password);
    const res = await db.prepare(`
      INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
      VALUES (?, ?, ?, ?, ?, 1)
      RETURNING id
    `).run(data.name, data.email, passHash, data.role, data.participant_number || null);

    const userId = (res as any).lastInsertRowid;

    if (Array.isArray(data.qualification_ids) && data.qualification_ids.length > 0) {
      for (const qId of data.qualification_ids) {
        await db.prepare("INSERT INTO user_qualifications (user_id, qualification_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(userId, qId);
      }
    }

    await logAudit(session.userId, "CREATE_USER", "users", userId as number, { email: data.email, role: data.role });
    return { success: true, error: undefined as string | undefined };
  });

export const updateUserFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; name: string; role: string; participant_number?: string | undefined; password?: string | undefined; qualification_ids?: number[] | undefined }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    if (data.password) {
      const passHash = hashPassword(data.password);
      await db.prepare("UPDATE users SET name = ?, role = ?, participant_number = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data.name, data.role, data.participant_number || null, passHash, data.id);
    } else {
      await db.prepare("UPDATE users SET name = ?, role = ?, participant_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data.name, data.role, data.participant_number || null, data.id);
    }

    if (Array.isArray(data.qualification_ids)) {
      await db.prepare("DELETE FROM user_qualifications WHERE user_id = ?").run(data.id);
      for (const qId of data.qualification_ids) {
        await db.prepare("INSERT INTO user_qualifications (user_id, qualification_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(data.id, qId);
      }
    }

    await logAudit(session.userId, "UPDATE_USER", "users", data.id, { name: data.name, role: data.role });
    return { success: true };
  });

export const toggleUserStatusFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; is_active: boolean }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare("UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data.is_active ? 1 : 0, data.id);
    await logAudit(session.userId, "TOGGLE_USER_STATUS", "users", data.id, { is_active: data.is_active });
    return { success: true };
  });

export const verifyUserFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare("UPDATE users SET is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data.id);
    await logAudit(session.userId, "VERIFY_USER", "users", data.id, { is_active: 1 });
    return { success: true };
  });

export const deleteUserFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    // Clean up dependent foreign keys
    await db.prepare("DELETE FROM user_qualifications WHERE user_id = ?").run(data.id);
    await db.prepare("DELETE FROM user_ganisph_assignments WHERE user_id = ?").run(data.id);
    await db.prepare("DELETE FROM exam_enrollments WHERE user_id = ?").run(data.id);
    await db.prepare("DELETE FROM exam_attempts WHERE user_id = ?").run(data.id);

    // Delete user record
    await db.prepare("DELETE FROM users WHERE id = ?").run(data.id);

    await logAudit(session.userId, "DELETE_USER", "users", data.id, { id: data.id });
    return { success: true };
  });

// ------------------------------------------------------------------
// QUALIFICATIONS CRUD
// ------------------------------------------------------------------
export const getQualificationsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    const res = await db.prepare("SELECT * FROM qualifications ORDER BY id ASC").all();
    return Array.isArray(res) ? res : [];
  });

// ------------------------------------------------------------------
// MASTER GANISPH CRUD
// ------------------------------------------------------------------
export const getMasterGanisphFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_name?: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    let query = `
      SELECT id, company_name, assignment_type, name, qualification_name, email, registration_number, register_active_end, assignment_active_end, regency_city, created_at
      FROM master_ganisph
    `;
    const params: any[] = [];
    if (data.qualification_name && data.qualification_name !== "ALL") {
      query += " WHERE qualification_name = ?";
      params.push(data.qualification_name);
    }
    query += " ORDER BY id ASC";
    const res = await db.prepare(query).all(...params);
    return Array.isArray(res) ? res : [];
  });

export const createMasterGanisphFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    company_name?: string | undefined;
    assignment_type?: string | undefined;
    name: string;
    qualification_name: string;
    email?: string | undefined;
    registration_number?: string | undefined;
    register_active_end?: string | undefined;
    assignment_active_end?: string | undefined;
    regency_city?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    const res = await db.prepare(`
      INSERT INTO master_ganisph (company_name, assignment_type, name, qualification_name, email, registration_number, register_active_end, assignment_active_end, regency_city)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.company_name || null,
      data.assignment_type || null,
      data.name,
      data.qualification_name,
      data.email || null,
      data.registration_number || null,
      data.register_active_end || null,
      data.assignment_active_end || null,
      data.regency_city || null
    );

    await logAudit(session.userId, "CREATE_MASTER_GANISPH", "master_ganisph", res.lastInsertRowid as number, { name: data.name });
    return { success: true, error: undefined as string | undefined };
  });

export const updateMasterGanisphFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    id: number;
    company_name?: string | undefined;
    assignment_type?: string | undefined;
    name: string;
    qualification_name: string;
    email?: string | undefined;
    registration_number?: string | undefined;
    register_active_end?: string | undefined;
    assignment_active_end?: string | undefined;
    regency_city?: string | undefined;
  }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare(`
      UPDATE master_ganisph
      SET company_name = ?, assignment_type = ?, name = ?, qualification_name = ?, email = ?, registration_number = ?, register_active_end = ?, assignment_active_end = ?, regency_city = ?
      WHERE id = ?
    `).run(
      data.company_name || null,
      data.assignment_type || null,
      data.name,
      data.qualification_name,
      data.email || null,
      data.registration_number || null,
      data.register_active_end || null,
      data.assignment_active_end || null,
      data.regency_city || null,
      data.id
    );

    await logAudit(session.userId, "UPDATE_MASTER_GANISPH", "master_ganisph", data.id, { name: data.name });
    return { success: true, error: undefined as string | undefined };
  });

export const deleteMasterGanisphFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare("DELETE FROM master_ganisph WHERE id = ?").run(data.id);
    await logAudit(session.userId, "DELETE_MASTER_GANISPH", "master_ganisph", data.id);
    return { success: true, error: undefined as string | undefined };
  });

export const createQualificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; code: string; name: string; description?: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const existing = await db.prepare("SELECT id FROM qualifications WHERE code = ?").get(data.code);
    if (existing) return { success: false, error: "Kode kualifikasi sudah ada." };

    const res = await db.prepare(`
      INSERT INTO qualifications (code, name, description, status)
      VALUES (?, ?, ?, 'ACTIVE')
    `).run(data.code.toUpperCase(), data.name, data.description || null);

    await logAudit(session.userId, "CREATE_QUALIFICATION", "qualifications", res.lastInsertRowid as number, { code: data.code });
    return { success: true, error: undefined as string | undefined };
  });

export const updateQualificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; name: string; description?: string; status: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare("UPDATE qualifications SET name = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data.name, data.description || null, data.status, data.id);
    await logAudit(session.userId, "UPDATE_QUALIFICATION", "qualifications", data.id, { name: data.name });
    return { success: true, error: undefined as string | undefined };
  });

export const deleteQualificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare("DELETE FROM qualifications WHERE id = ?").run(data.id);
    await logAudit(session.userId, "DELETE_QUALIFICATION", "qualifications", data.id);
    return { success: true, error: undefined as string | undefined };
  });

// ------------------------------------------------------------------
// COMPETENCY UNITS (UNIT KOMPETENSI) CRUD
// ------------------------------------------------------------------
export const getCompetencyUnitsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id?: number }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();

    if (data.qualification_id) {
      const rows = await db.prepare(`
        SELECT cu.*, string_agg(q.code, ', ') as qualification_codes
        FROM competency_units cu
        JOIN qualification_competency_units qcu ON cu.id = qcu.competency_unit_id
        JOIN qualifications q ON qcu.qualification_id = q.id
        WHERE qcu.qualification_id = $1
        GROUP BY cu.id
        ORDER BY cu.code ASC
      `).all(data.qualification_id);
      return Array.from(rows) as any[];
    } else {
      const rows = await db.prepare(`
        SELECT cu.*, string_agg(q.code, ', ') as qualification_codes
        FROM competency_units cu
        LEFT JOIN qualification_competency_units qcu ON cu.id = qcu.competency_unit_id
        LEFT JOIN qualifications q ON qcu.qualification_id = q.id
        GROUP BY cu.id
        ORDER BY cu.code ASC
      `).all();
      return Array.from(rows) as any[];
    }
  });

export const createCompetencyUnitFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; code: string; title: string; subject_code?: string; question_count?: number; description?: string; qualification_ids?: number[] }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const existing = await db.prepare("SELECT id FROM competency_units WHERE code = $1").get(data.code);
    if (existing) {
      return { success: false, error: "Kode unit kompetensi sudah terdaftar." };
    }

    const res = await db.prepare(`
      INSERT INTO competency_units (code, title, subject_code, question_count, description, status)
      VALUES ($1, $2, $3, $4, $5, 'ACTIVE')
      RETURNING id
    `).run(data.code, data.title, data.subject_code || null, data.question_count || 5, data.description || null);

    const unitId = (res as any).lastInsertRowid;

    if (Array.isArray(data.qualification_ids) && data.qualification_ids.length > 0) {
      for (const qId of data.qualification_ids) {
        await db.prepare("INSERT INTO qualification_competency_units (qualification_id, competency_unit_id) VALUES ($1, $2) ON CONFLICT DO NOTHING").run(qId, unitId);
      }
    }

    await logAudit(session.userId, "CREATE_COMPETENCY_UNIT", "competency_units", unitId, { code: data.code });
    return { success: true, error: undefined as string | undefined };
  });

export const updateCompetencyUnitFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; title: string; subject_code?: string; question_count?: number; description?: string; status: string; qualification_ids?: number[] }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    await db.prepare("UPDATE competency_units SET title = $1, subject_code = $2, question_count = $3, description = $4, status = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6").run(
      data.title,
      data.subject_code || null,
      data.question_count || 5,
      data.description || null,
      data.status,
      data.id
    );

    if (Array.isArray(data.qualification_ids)) {
      await db.prepare("DELETE FROM qualification_competency_units WHERE competency_unit_id = $1").run(data.id);
      for (const qId of data.qualification_ids) {
        await db.prepare("INSERT INTO qualification_competency_units (qualification_id, competency_unit_id) VALUES ($1, $2) ON CONFLICT DO NOTHING").run(qId, data.id);
      }
    }

    await logAudit(session.userId, "UPDATE_COMPETENCY_UNIT", "competency_units", data.id, { title: data.title });
    return { success: true, error: undefined as string | undefined };
  });

export const deleteCompetencyUnitFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    await db.prepare("DELETE FROM competency_units WHERE id = $1").run(data.id);
    await logAudit(session.userId, "DELETE_COMPETENCY_UNIT", "competency_units", data.id);
    return { success: true, error: undefined as string | undefined };
  });

// ------------------------------------------------------------------
// SUBJECTS CRUD
// ------------------------------------------------------------------
export const getSubjectsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id?: number }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    let query = `
      SELECT s.*, 
             COALESCE(cu.code, cu_sub.code) as competency_unit_code, 
             COALESCE(cu.title, cu_sub.title) as competency_unit_title,
             (
               SELECT string_agg(DISTINCT q.code, '; ')
               FROM qualification_competency_units qcu
               JOIN qualifications q ON qcu.qualification_id = q.id
               WHERE qcu.competency_unit_id = COALESCE(s.competency_unit_id, cu_sub.id)
             ) as qualification_codes
      FROM subjects s
      LEFT JOIN competency_units cu ON s.competency_unit_id = cu.id
      LEFT JOIN competency_units cu_sub ON s.code = cu_sub.subject_code
      WHERE 1=1
    `;
    const params: any[] = [];
    if (data.qualification_id) {
      query += ` AND (
        s.qualification_id = ? 
        OR s.competency_unit_id IN (SELECT competency_unit_id FROM qualification_competency_units WHERE qualification_id = ?)
        OR cu_sub.id IN (SELECT competency_unit_id FROM qualification_competency_units WHERE qualification_id = ?)
      )`;
      params.push(data.qualification_id, data.qualification_id, data.qualification_id);
    }
    query += " ORDER BY s.id ASC";
    const res = await db.prepare(query).all(...params);
    return Array.isArray(res) ? res : [];
  });

export const createSubjectFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id?: number; competency_unit_id?: number; code: string; name: string; description?: string; weight?: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    let compUnitId: number | null = data.competency_unit_id || null;
    if (!compUnitId && data.code) {
      const cuRow = await db.prepare("SELECT id FROM competency_units WHERE subject_code = ? LIMIT 1").get(data.code) as any;
      if (cuRow) compUnitId = cuRow.id;
    }

    const res = await db.prepare(`
      INSERT INTO subjects (qualification_id, competency_unit_id, code, name, description, weight, status)
      VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE')
    `).run(data.qualification_id || null, compUnitId, data.code, data.name, data.description || null, data.weight || 0);

    await logAudit(session.userId, "CREATE_SUBJECT", "subjects", res.lastInsertRowid as number, { code: data.code });
    return { success: true, error: undefined as string | undefined };
  });

export const updateSubjectFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number; name: string; description?: string; weight?: number; status: string; competency_unit_id?: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    let compUnitId: number | null = data.competency_unit_id || null;

    await db.prepare("UPDATE subjects SET name = ?, description = ?, weight = ?, status = ?, competency_unit_id = COALESCE(?, competency_unit_id), updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
      data.name,
      data.description || null,
      data.weight || 0,
      data.status,
      compUnitId,
      data.id
    );
    await logAudit(session.userId, "UPDATE_SUBJECT", "subjects", data.id, { name: data.name });
    return { success: true, error: undefined as string | undefined };
  });

// ------------------------------------------------------------------
// QUESTIONS BANK & CSV IMPORT
// ------------------------------------------------------------------
export const getQuestionsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id?: number; subject_id?: number; difficulty?: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();

    let query = `
      SELECT q.*, qual.code as qualification_code, sub.name as subject_name, sub.code as subject_code,
             COALESCE(cu.code, cu_sub.code) as competency_unit_code,
             COALESCE(cu.title, cu_sub.title) as competency_unit_title,
             (
               SELECT string_agg(DISTINCT q_sub.code, '; ')
               FROM qualification_competency_units qcu
               JOIN qualifications q_sub ON qcu.qualification_id = q_sub.id
               WHERE qcu.competency_unit_id = COALESCE(q.competency_unit_id, cu_sub.id)
             ) as linked_qualification_codes
      FROM questions q 
      LEFT JOIN qualifications qual ON q.qualification_id = qual.id 
      LEFT JOIN subjects sub ON q.subject_id = sub.id 
      LEFT JOIN competency_units cu ON q.competency_unit_id = cu.id
      LEFT JOIN competency_units cu_sub ON sub.code = cu_sub.subject_code
      WHERE 1=1
    `;
    const params: any[] = [];

    if (data.qualification_id) {
      query += " AND (q.qualification_id = ? OR q.competency_unit_id IN (SELECT competency_unit_id FROM qualification_competency_units WHERE qualification_id = ?) OR cu_sub.id IN (SELECT competency_unit_id FROM qualification_competency_units WHERE qualification_id = ?))";
      params.push(data.qualification_id, data.qualification_id, data.qualification_id);
    }
    if (data.subject_id) {
      query += " AND q.subject_id = ?";
      params.push(data.subject_id);
    }
    if (data.difficulty) {
      query += " AND q.difficulty = ?";
      params.push(data.difficulty);
    }

    query += " ORDER BY q.id DESC";
    const res = await db.prepare(query).all(...params);
    return Array.isArray(res) ? res : [];
  });

export const createQuestionFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    qualification_id: number;
    subject_id: number;
    competency_unit_id?: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: "A" | "B" | "C" | "D";
    difficulty: "EASY" | "MEDIUM" | "HARD";
    explanation?: string;
  }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    let compUnitId: number | null = data.competency_unit_id || null;
    if (!compUnitId && data.subject_id) {
      const subRow = await db.prepare("SELECT code FROM subjects WHERE id = ?").get(data.subject_id) as any;
      if (subRow && subRow.code) {
        const cuRow = await db.prepare("SELECT id FROM competency_units WHERE subject_code = ? LIMIT 1").get(subRow.code) as any;
        if (cuRow) compUnitId = cuRow.id;
      }
    }

    const res = await db.prepare(`
      INSERT INTO questions (qualification_id, subject_id, competency_unit_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
    `).run(
      data.qualification_id,
      data.subject_id,
      compUnitId,
      data.question_text,
      data.option_a,
      data.option_b,
      data.option_c,
      data.option_d,
      data.correct_answer,
      data.difficulty,
      data.explanation || null,
      session.userId
    );

    await logAudit(session.userId, "CREATE_QUESTION", "questions", res.lastInsertRowid as number, { text: data.question_text });
    return { success: true, error: undefined as string | undefined };
  });

export const importQuestionsCsvFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id: number; subject_id: number; csvContent: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const lines = data.csvContent.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
    if (lines.length <= 1) {
      return { success: false, error: "File CSV kosong atau tidak memiliki baris data." };
    }

    let compUnitId: number | null = null;
    if (data.subject_id) {
      const subRow = await db.prepare("SELECT code FROM subjects WHERE id = ?").get(data.subject_id) as any;
      if (subRow && subRow.code) {
        const cuRow = await db.prepare("SELECT id FROM competency_units WHERE subject_code = ? LIMIT 1").get(subRow.code) as any;
        if (cuRow) compUnitId = cuRow.id;
      }
    }

    const dataLines = lines[0]?.toLowerCase().includes("question") ? lines.slice(1) : lines;

    let importedCount = 0;
    const errors: string[] = [];

    for (let idx = 0; idx < dataLines.length; idx++) {
      const line = dataLines[idx];
      if (!line) continue;
      const parts = line.split(",").map((p) => p.trim().replace(/^"|"$/g, ""));
      if (parts.length < 6) {
        errors.push(`Baris ${idx + 1}: Format tidak lengkap.`);
        continue;
      }

      const [question_text, option_a, option_b, option_c, option_d, correct_answer, difficultyStr, explanation] = parts;
      const correct = correct_answer?.toUpperCase() as "A" | "B" | "C" | "D";
      const difficulty = (difficultyStr?.toUpperCase() || "MEDIUM") as "EASY" | "MEDIUM" | "HARD";

      if (!["A", "B", "C", "D"].includes(correct)) {
        errors.push(`Baris ${idx + 1}: Jawaban benar ('${correct_answer}') harus A, B, C, atau D.`);
        continue;
      }

      await db.prepare(`
        INSERT INTO questions (qualification_id, subject_id, competency_unit_id, question_text, option_a, option_b, option_c, option_d, correct_answer, difficulty, explanation, status, created_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ACTIVE', ?)
      `).run(
        data.qualification_id,
        data.subject_id,
        compUnitId,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct,
        ["EASY", "MEDIUM", "HARD"].includes(difficulty) ? difficulty : "MEDIUM",
        explanation || null,
        session.userId
      );
      importedCount++;
    }

    await logAudit(session.userId, "IMPORT_QUESTIONS", "questions", null, { importedCount });
    return { success: true, importedCount, errors };
  });

// ------------------------------------------------------------------
// EXAM BLUEPRINTS & ITEMS
// ------------------------------------------------------------------
export const getBlueprintsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id?: number }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    let query = "SELECT b.*, q.code as qualification_code FROM exam_blueprints b JOIN qualifications q ON b.qualification_id = q.id";
    const params: any[] = [];
    if (data.qualification_id) {
      query += " WHERE b.qualification_id = ?";
      params.push(data.qualification_id);
    }
    const res = await db.prepare(query).all(...params);
    const blueprints = Array.isArray(res) ? res : [];

    for (const b of blueprints) {
      const itemsRes = await db.prepare("SELECT i.*, s.name as subject_name FROM blueprint_items i JOIN subjects s ON i.subject_id = s.id WHERE i.blueprint_id = ?").all(b.id);
      b.items = Array.isArray(itemsRes) ? itemsRes : [];
    }

    return blueprints;
  });

export const createBlueprintFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    qualification_id: number;
    name: string;
    description?: string;
    items: Array<{ subject_id: number; difficulty: "EASY" | "MEDIUM" | "HARD"; question_count: number }>;
  }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    // Verify question counts available in database
    for (const item of data.items) {
      const availRow = await db.prepare("SELECT COUNT(*) as count FROM questions WHERE subject_id = ? AND difficulty = ? AND status = 'ACTIVE'").get(item.subject_id, item.difficulty);
      const avail = Number(availRow?.count || 0);
      if (avail < item.question_count) {
        const sub = await db.prepare("SELECT name FROM subjects WHERE id = ?").get(item.subject_id);
        return {
          success: false,
          error: `Bank soal tidak mencukupi untuk materi ${sub?.name || item.subject_id} (${item.difficulty}). Dibutuhkan: ${item.question_count}, Tersedia: ${avail}.`,
        };
      }
    }

    const totalQuestions = data.items.reduce((sum, i) => sum + i.question_count, 0);

    const res = await db.prepare(`
      INSERT INTO exam_blueprints (qualification_id, name, description, total_questions)
      VALUES (?, ?, ?, ?)
    `).run(data.qualification_id, data.name, data.description || null, totalQuestions);

    const blueprintId = res.lastInsertRowid as number;

    for (const item of data.items) {
      await db.prepare(`
        INSERT INTO blueprint_items (blueprint_id, subject_id, difficulty, question_count)
        VALUES (?, ?, ?, ?)
      `).run(blueprintId, item.subject_id, item.difficulty, item.question_count);
    }

    await logAudit(session.userId, "CREATE_BLUEPRINT", "exam_blueprints", blueprintId, { name: data.name, totalQuestions });
    return { success: true, blueprintId };
  });

// ------------------------------------------------------------------
// EXAM PACKAGES CRUD & PUBLISH
// ------------------------------------------------------------------
export const getExamsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    const res = await db.prepare(`
      SELECT p.*, q.code as qualification_code, COALESCE(b.name, 'Default Blueprint') as blueprint_name, COALESCE(b.total_questions, 50) as total_questions
      FROM exam_packages p
      JOIN qualifications q ON p.qualification_id = q.id
      LEFT JOIN exam_blueprints b ON p.blueprint_id = b.id
      ORDER BY p.id DESC
    `).all();
    return Array.isArray(res) ? res : [];
  });

export const createExamFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    qualification_id: number;
    blueprint_id?: number;
    name: string;
    code: string;
    description?: string;
    instructions?: string;
    duration_minutes: number;
    passing_grade: number;
    start_at?: string;
    end_at?: string;
  }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const existing = await db.prepare("SELECT id FROM exam_packages WHERE code = ?").get(data.code);
    if (existing) return { success: false, error: "Kode paket ujian sudah digunakan." };

    let bpId = data.blueprint_id;
    if (!bpId) {
      const existingBp = await db.prepare("SELECT id FROM exam_blueprints WHERE qualification_id = ? ORDER BY id ASC").get(data.qualification_id);
      if (existingBp) {
        bpId = existingBp.id;
      } else {
        const qual = await db.prepare("SELECT code, name FROM qualifications WHERE id = ?").get(data.qualification_id);
        const newBp = await db.prepare(`
          INSERT INTO exam_blueprints (qualification_id, name, description, total_questions)
          VALUES (?, ?, 'Blueprint Otomatis', 50)
          RETURNING id
        `).run(data.qualification_id, `Blueprint ${qual?.code || 'Kualifikasi'}`);
        bpId = (newBp as any).lastInsertRowid;
      }
    }

    const nowIso = new Date().toISOString();
    const startAt = data.start_at || nowIso;
    const endAt = data.end_at || new Date(Date.now() + 10 * 365 * 86400000).toISOString();

    const res = await db.prepare(`
      INSERT INTO exam_packages (qualification_id, blueprint_id, name, code, description, instructions, duration_minutes, passing_grade, start_at, end_at, status, created_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'DRAFT', ?)
      RETURNING id
    `).run(
      data.qualification_id,
      bpId,
      data.name,
      data.code.toUpperCase(),
      data.description || null,
      data.instructions || null,
      data.duration_minutes,
      data.passing_grade,
      startAt,
      endAt,
      session.userId
    );

    await logAudit(session.userId, "CREATE_EXAM", "exam_packages", (res as any).lastInsertRowid as number, { code: data.code });
    return { success: true };
  });

export const publishExamFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; exam_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const exam = await db.prepare("SELECT * FROM exam_packages WHERE id = ?").get(data.exam_id);
    if (!exam) return { success: false, error: "Paket ujian tidak ditemukan." };

    // Verify blueprint and question availability
    const items = await db.prepare("SELECT * FROM blueprint_items WHERE blueprint_id = ?").all(exam.blueprint_id);
    const itemsList = Array.isArray(items) ? items : [];

    for (const item of itemsList) {
      const availRow = await db.prepare("SELECT COUNT(*) as count FROM questions WHERE subject_id = ? AND difficulty = ? AND status = 'ACTIVE'").get(item.subject_id, item.difficulty);
      const avail = Number(availRow?.count || 0);
      if (avail < item.question_count) {
        return { success: false, error: "Tidak dapat mempublikasikan ujian. Soal dalam bank soal tidak mencukupi untuk blueprint." };
      }
    }

    await db.prepare("UPDATE exam_packages SET status = 'PUBLISHED', updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(data.exam_id);
    await logAudit(session.userId, "PUBLISH_EXAM", "exam_packages", data.exam_id, { code: exam.code });
    return { success: true };
  });

export const updateExamFn = createServerFn({ method: "POST" })
  .validator((data: {
    token: string;
    id: number;
    qualification_id: number;
    name: string;
    code: string;
    description?: string;
    instructions?: string;
    duration_minutes: number;
    passing_grade: number;
    status?: string;
  }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const exam = await db.prepare("SELECT * FROM exam_packages WHERE id = ?").get(data.id);
    if (!exam) return { success: false, error: "Paket ujian tidak ditemukan." };

    await db.prepare(`
      UPDATE exam_packages SET
        qualification_id = ?,
        name = ?,
        code = ?,
        description = ?,
        instructions = ?,
        duration_minutes = ?,
        passing_grade = ?,
        status = COALESCE(?, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.qualification_id,
      data.name,
      data.code.toUpperCase(),
      data.description || null,
      data.instructions || null,
      data.duration_minutes,
      data.passing_grade,
      data.status || null,
      data.id
    );

    await logAudit(session.userId, "UPDATE_EXAM", "exam_packages", data.id, { code: data.code });
    return { success: true };
  });

export const deleteExamFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    const exam = await db.prepare("SELECT * FROM exam_packages WHERE id = ?").get(data.id);
    if (!exam) return { success: false, error: "Paket ujian tidak ditemukan." };

    await db.prepare("DELETE FROM exam_packages WHERE id = ?").run(data.id);
    await logAudit(session.userId, "DELETE_EXAM", "exam_packages", data.id, { code: exam.code });
    return { success: true };
  });

// ------------------------------------------------------------------
// ENROLLMENTS
// ------------------------------------------------------------------
export const getEnrollmentsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; exam_id?: number }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    let query = `
      SELECT e.*, u.name as user_name, u.email as user_email, u.participant_number, p.name as exam_name, p.code as exam_code
      FROM exam_enrollments e
      JOIN users u ON e.user_id = u.id
      JOIN exam_packages p ON e.exam_id = p.id
    `;
    const params: any[] = [];
    if (data.exam_id) {
      query += " WHERE e.exam_id = ?";
      params.push(data.exam_id);
    }
    const res = await db.prepare(query).all(...params);
    return Array.isArray(res) ? res : [];
  });

export const enrollParticipantFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; exam_id: number; user_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();

    // Verify participant qualification matches exam qualification
    const exam = await db.prepare("SELECT qualification_id FROM exam_packages WHERE id = ?").get(data.exam_id);
    const userQual = await db.prepare("SELECT qualification_id FROM user_qualifications WHERE user_id = ? AND qualification_id = ?").get(data.user_id, exam.qualification_id);

    if (!userQual) {
      return { success: false, error: "Peserta tidak memiliki kualifikasi yang sesuai dengan paket ujian ini." };
    }

    try {
      const res = await db.prepare("INSERT INTO exam_enrollments (exam_id, user_id) VALUES (?, ?)").run(data.exam_id, data.user_id);
      await logAudit(session.userId, "ENROLL_PARTICIPANT", "exam_enrollments", res.lastInsertRowid as number, { exam_id: data.exam_id, user_id: data.user_id });
      return { success: true };
    } catch (e: any) {
      return { success: false, error: "Peserta sudah terdaftar dalam ujian ini." };
    }
  });

export const deleteEnrollmentFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyAdminSession(data.token);
    const db = await getDb();
    await db.prepare("DELETE FROM exam_enrollments WHERE id = ?").run(data.id);
    await logAudit(session.userId, "DELETE_ENROLLMENT", "exam_enrollments", data.id);
    return { success: true };
  });

// ------------------------------------------------------------------
// RESULTS & AUDIT LOGS
// ------------------------------------------------------------------
export const getAdminResultsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    const res = await db.prepare(`
      SELECT a.*, u.name as user_name, u.email as user_email, u.participant_number,
             p.name as exam_name, p.code as exam_code, p.passing_grade, b.total_questions,
             q.code as qualification_code
      FROM exam_attempts a
      JOIN users u ON a.user_id = u.id
      JOIN exam_packages p ON a.exam_id = p.id
      JOIN exam_blueprints b ON p.blueprint_id = b.id
      JOIN qualifications q ON p.qualification_id = q.id
      WHERE a.status IN ('SUBMITTED', 'AUTO_SUBMITTED')
      ORDER BY a.submitted_at DESC
    `).all();
    return Array.isArray(res) ? res : [];
  });

export const getAuditLogsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    verifyAdminSession(data.token);
    const db = await getDb();
    const res = await db.prepare(`
      SELECT l.*, u.name as user_name, u.email as user_email
      FROM audit_logs l
      LEFT JOIN users u ON l.user_id = u.id
      ORDER BY l.id DESC LIMIT 100
    `).all();
    return Array.isArray(res) ? res : [];
  });
