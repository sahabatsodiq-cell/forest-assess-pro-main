import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { verifySessionToken, logAudit } from "../auth";

function verifyParticipantSession(token: string) {
  if (!token) throw new Error("Unauthorized");
  const session = verifySessionToken(token);
  if (!session) throw new Error("Unauthorized");
  return session;
}

// Option Shuffling Helpers
function generateOptionMapping(): string {
  const keys = ["A", "B", "C", "D"];
  const shuffled = [...keys].sort(() => Math.random() - 0.5);
  return keys.map((k, i) => `${k}:${shuffled[i]}`).join(",");
}

function parseOptionMapping(mappingStr: string): Record<string, string> {
  const map: Record<string, string> = { A: "A", B: "B", C: "C", D: "D" };
  if (!mappingStr) return map;
  mappingStr.split(",").forEach((pair) => {
    const [display, orig] = pair.split(":");
    if (display && orig) map[display] = orig;
  });
  return map;
}

function getReverseMapping(mappingStr: string): Record<string, string> {
  const map: Record<string, string> = {};
  const forward = parseOptionMapping(mappingStr);
  Object.entries(forward).forEach(([display, orig]) => {
    map[orig] = display;
  });
  return map;
}

async function syncMasterGanisphQualifications(db: any, userId: number) {
  const user = await db.prepare("SELECT id, name, email, participant_number FROM users WHERE id = ?").get(userId);
  if (!user) return;

  // Collect registration numbers already attached to this user's qualifications
  const userQualsRegs = await db.prepare(`
    SELECT registration_number FROM user_qualifications 
    WHERE user_id = ? AND registration_number IS NOT NULL AND registration_number != ''
  `).all(userId);
  const userRegList = Array.isArray(userQualsRegs) ? userQualsRegs.map((r: any) => r.registration_number) : [];

  let query = `
    SELECT * FROM master_ganisph
    WHERE
      (email IS NOT NULL AND email != '' AND LOWER(email) = LOWER(?))
      OR (registration_number IS NOT NULL AND registration_number != '' AND registration_number = ?)
  `;
  const params: any[] = [user.email || '', user.participant_number || ''];

  if (userRegList.length > 0) {
    const placeholders = userRegList.map(() => '?').join(',');
    query += ` OR (registration_number IS NOT NULL AND registration_number IN (${placeholders}))`;
    params.push(...userRegList);
  }

  const masterRows = await db.prepare(query).all(...params);
  const masterList = Array.isArray(masterRows) ? masterRows : [];
  if (masterList.length === 0) return;

  // Auto-set name from master_ganisph if user's name is empty or generic
  const masterName = masterList[0]?.name;
  if (masterName && (!user.name || user.name.trim() === '' || /^(Peserta|REG-)/i.test(user.name.trim()))) {
    await db.prepare("UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(masterName, userId);
  }

  const firstReg = masterList.find((m: any) => m.registration_number)?.registration_number;
  if (firstReg && (!user.participant_number || user.participant_number.trim() === '')) {
    await db.prepare("UPDATE users SET participant_number = ? WHERE id = ?").run(firstReg, userId);
  }

  const allQuals = await db.prepare("SELECT id, code, name FROM qualifications").all();
  const qualArray = Array.isArray(allQuals) ? allQuals : [];

  for (const mItem of masterList) {
    // Populate bridge table: user_ganisph_assignments
    await db.prepare(`
      INSERT INTO user_ganisph_assignments (user_id, master_ganisph_id, synced_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT (user_id, master_ganisph_id) DO UPDATE SET synced_at = CURRENT_TIMESTAMP
    `).run(userId, mItem.id);

    // Sync qualification to user_qualifications
    const mQualNameUpper = (mItem.qualification_name || '').toUpperCase();
    const matchedQual = qualArray.find((q: any) => {
      const qCodeUpper = (q.code || '').toUpperCase();
      const qNameUpper = (q.name || '').toUpperCase();
      return (
        mQualNameUpper.includes(qCodeUpper) ||
        mQualNameUpper.includes(qNameUpper) ||
        qNameUpper.includes(mQualNameUpper.replace('GANISPH ', ''))
      );
    });

    if (matchedQual) {
      await db.prepare(`
        INSERT INTO user_qualifications (user_id, qualification_id, registration_number)
        VALUES (?, ?, ?)
        ON CONFLICT (user_id, qualification_id) DO UPDATE SET
          registration_number = COALESCE(user_qualifications.registration_number, EXCLUDED.registration_number)
      `).run(userId, matchedQual.id, mItem.registration_number || null);
    }
  }
}

// ------------------------------------------------------------------
// PARTICIPANT DASHBOARD & EXAM LIST
// ------------------------------------------------------------------
export const getParticipantDashboardFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    // Auto-sync qualifications from master_ganisph first!
    await syncMasterGanisphQualifications(db, session.userId);

    // Get user details & qualification
    const user = await db.prepare(`
      SELECT u.id, u.name, u.email, u.participant_number, q.code as qualification_code, q.name as qualification_name
      FROM users u
      LEFT JOIN user_qualifications uq ON u.id = uq.user_id
      LEFT JOIN qualifications q ON uq.qualification_id = q.id
      WHERE u.id = ?
    `).get(session.userId);

    // Get published exams for matching user qualifications OR explicit enrollment
    const enrolledExams = await db.prepare(`
      SELECT DISTINCT p.*, q.code as qualification_code, q.name as qualification_name, COALESCE(b.total_questions, 50) as total_questions,
             a.id as attempt_id, a.status as attempt_status, a.score as attempt_score
      FROM exam_packages p
      JOIN qualifications q ON p.qualification_id = q.id
      LEFT JOIN exam_blueprints b ON p.blueprint_id = b.id
      LEFT JOIN exam_attempts a ON (a.exam_id = p.id AND a.user_id = ?)
      WHERE (p.status = 'PUBLISHED' OR p.status = 'ACTIVE')
        AND (
          p.qualification_id IN (SELECT qualification_id FROM user_qualifications WHERE user_id = ?)
          OR p.id IN (SELECT exam_id FROM exam_enrollments WHERE user_id = ?)
        )
      ORDER BY p.id DESC
    `).all(session.userId, session.userId, session.userId);

    return {
      user,
      enrolledExams: Array.isArray(enrolledExams) ? enrolledExams : [],
    };
  });

// ------------------------------------------------------------------
// SELF-ENROLLMENT: Get available exams matching user's qualification
// ------------------------------------------------------------------
export const getAvailableExamsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    // Auto-sync qualifications from master_ganisph first
    await syncMasterGanisphQualifications(db, session.userId);

    // Get published exams that match the user's qualifications
    // but are NOT yet enrolled (either manually or already visible via qual match)
    const available = await db.prepare(`
      SELECT DISTINCT p.*, q.code as qualification_code, q.name as qualification_name,
             COALESCE(b.total_questions, 50) as total_questions
      FROM exam_packages p
      JOIN qualifications q ON p.qualification_id = q.id
      LEFT JOIN exam_blueprints b ON p.blueprint_id = b.id
      WHERE (p.status = 'PUBLISHED' OR p.status = 'ACTIVE')
        AND p.qualification_id IN (
          SELECT qualification_id FROM user_qualifications WHERE user_id = ?
        )
        AND p.id NOT IN (
          SELECT exam_id FROM exam_enrollments WHERE user_id = ?
        )
      ORDER BY p.id DESC
    `).all(session.userId, session.userId);

    return Array.isArray(available) ? available : [];
  });

// ------------------------------------------------------------------
// SELF-ENROLLMENT: Participant registers themselves to an exam
// ------------------------------------------------------------------
export const selfEnrollFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; exam_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    // 1. Verify exam is published/active
    const exam = await db.prepare("SELECT * FROM exam_packages WHERE id = ?").get(data.exam_id) as any;
    if (!exam || (exam.status !== "PUBLISHED" && exam.status !== "ACTIVE")) {
      return { success: false, error: "Paket ujian tidak aktif atau belum dipublikasikan." };
    }

    // 2. Verify user's qualification matches exam qualification
    const userQual = await db.prepare(
      "SELECT id FROM user_qualifications WHERE user_id = ? AND qualification_id = ?"
    ).get(session.userId, exam.qualification_id);

    if (!userQual) {
      return { success: false, error: "Kualifikasi Anda tidak sesuai dengan paket ujian ini." };
    }

    // 3. Check if already enrolled or already has access via qualification
    const existing = await db.prepare(
      "SELECT id FROM exam_enrollments WHERE exam_id = ? AND user_id = ?"
    ).get(data.exam_id, session.userId);
    if (existing) {
      return { success: false, error: "Anda sudah terdaftar pada paket ujian ini." };
    }

    // 4. Enroll
    try {
      const res = await db.prepare(
        "INSERT INTO exam_enrollments (exam_id, user_id) VALUES (?, ?)"
      ).run(data.exam_id, session.userId);
      await logAudit(session.userId, "SELF_ENROLL", "exam_enrollments", res.lastInsertRowid as number, {
        exam_id: data.exam_id,
        user_id: session.userId,
      });
      return { success: true };
    } catch {
      return { success: false, error: "Gagal mendaftar. Anda mungkin sudah terdaftar." };
    }
  });

// ------------------------------------------------------------------
// START ATTEMPT (SERVER-CONTROLLED)
// ------------------------------------------------------------------
export const startExamAttemptFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; exam_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    // 1. Check exam package status
    const exam = await db.prepare("SELECT * FROM exam_packages WHERE id = ?").get(data.exam_id);
    if (!exam || (exam.status !== "PUBLISHED" && exam.status !== "ACTIVE")) {
      return { success: false, error: "Ujian tidak aktif atau belum dipublikasikan." };
    }

    // 2. Check enrollment or matching qualification
    const userQual = await db.prepare("SELECT qualification_id FROM user_qualifications WHERE user_id = ? AND qualification_id = ?").get(session.userId, exam.qualification_id);
    const enrollment = await db.prepare("SELECT id FROM exam_enrollments WHERE exam_id = ? AND user_id = ?").get(data.exam_id, session.userId);

    if (!userQual && !enrollment) {
      return { success: false, error: "Anda tidak terdaftar atau tidak memiliki kualifikasi untuk ujian ini." };
    }

    // 3. Check existing attempt
    const existingAttempt = await db.prepare("SELECT * FROM exam_attempts WHERE exam_id = ? AND user_id = ?").get(data.exam_id, session.userId);
    if (existingAttempt) {
      if (existingAttempt.status === "SUBMITTED" || existingAttempt.status === "AUTO_SUBMITTED") {
        return { success: false, error: "Anda sudah menyelesaikan ujian ini." };
      }
      // Resume existing IN_PROGRESS attempt
      return { success: true, attemptId: existingAttempt.id };
    }

    // 4. Create new attempt & select questions from blueprint
    const now = new Date();
    const endedAt = new Date(now.getTime() + exam.duration_minutes * 60 * 1000).toISOString();

    const res = await db.prepare(`
      INSERT INTO exam_attempts (exam_id, user_id, started_at, ended_at, status)
      VALUES (?, ?, ?, ?, 'IN_PROGRESS')
    `).run(data.exam_id, session.userId, now.toISOString(), endedAt);

    const attemptId = res.lastInsertRowid as number;

    // Fetch blueprint items
    const items = await db.prepare("SELECT * FROM blueprint_items WHERE blueprint_id = ?").all(exam.blueprint_id);
    let order = 1;

    for (const item of items) {
      // Select random ACTIVE questions matching subject & difficulty
      const questions = await db.prepare(`
        SELECT id FROM questions 
        WHERE subject_id = ? AND difficulty = ? AND status = 'ACTIVE' 
        ORDER BY RANDOM() LIMIT ?
      `).all(item.subject_id, item.difficulty, item.question_count);

      for (const q of questions) {
        const optionMapping = generateOptionMapping();
        await db.prepare(`
          INSERT INTO attempt_questions (attempt_id, question_id, display_order, option_mapping)
          VALUES (?, ?, ?, ?)
        `).run(attemptId, q.id, order++, optionMapping);
      }
    }

    // Fallback: If no questions were selected from blueprint_items, pull active questions for this qualification or linked competency units
    const currentQuestionCount = await db.prepare("SELECT COUNT(*) as count FROM attempt_questions WHERE attempt_id = ?").get(attemptId);
    if (Number(currentQuestionCount?.count || 0) === 0) {
      const fallbackQuestions = await db.prepare(`
        SELECT DISTINCT q.id 
        FROM questions q
        LEFT JOIN qualification_competency_units qcu ON q.competency_unit_id = qcu.competency_unit_id
        WHERE q.status = 'ACTIVE'
          AND (q.qualification_id = ? OR qcu.qualification_id = ?)
        ORDER BY RANDOM() LIMIT 50
      `).all(exam.qualification_id, exam.qualification_id);

      const finalQuestions = (Array.isArray(fallbackQuestions) && fallbackQuestions.length > 0)
        ? fallbackQuestions
        : await db.prepare("SELECT id FROM questions WHERE status = 'ACTIVE' ORDER BY RANDOM() LIMIT 50").all();

      for (const q of finalQuestions) {
        const optionMapping = generateOptionMapping();
        await db.prepare(`
          INSERT INTO attempt_questions (attempt_id, question_id, display_order, option_mapping)
          VALUES (?, ?, ?, ?)
        `).run(attemptId, q.id, order++, optionMapping);
      }
    }

    await logAudit(session.userId, "START_EXAM", "exam_attempts", attemptId, { exam_id: data.exam_id });
    return { success: true, attemptId };
  });

// ------------------------------------------------------------------
// GET ATTEMPT DETAILS (SAFE — NO CORRECT ANSWERS LEAKED!)
// ------------------------------------------------------------------
export const getAttemptDetailsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; attempt_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    const attempt = await db.prepare(`
      SELECT a.*, p.name as exam_name, p.instructions, p.duration_minutes, p.passing_grade, q.code as qualification_code
      FROM exam_attempts a
      JOIN exam_packages p ON a.exam_id = p.id
      JOIN qualifications q ON p.qualification_id = q.id
      WHERE a.id = ?
    `).get(data.attempt_id);

    if (!attempt) return { success: false, error: "Sesi ujian tidak ditemukan." };

    // Object-level authorization check
    if (attempt.user_id !== session.userId) {
      return { success: false, error: "Akses ditolak. Ini bukan sesi ujian Anda." };
    }

    // Check if time has expired
    const nowIso = new Date().toISOString();
    if (attempt.status === "IN_PROGRESS" && attempt.ended_at < nowIso) {
      // Auto submit expired attempt
      await executeScoring(db, attempt.id, true, session.userId);
      attempt.status = "AUTO_SUBMITTED";
    }

    // Fetch attempt questions WITHOUT correct_answer!
    const questions = await db.prepare(`
      SELECT aq.id as attempt_question_id, aq.display_order, aq.selected_answer, aq.option_mapping,
             q.id as question_id, q.question_text, q.option_a, q.option_b, q.option_c, q.option_d,
             s.name as subject_name
      FROM attempt_questions aq
      JOIN questions q ON aq.question_id = q.id
      JOIN subjects s ON q.subject_id = s.id
      WHERE aq.attempt_id = ?
      ORDER BY aq.display_order ASC
    `).all(data.attempt_id);

    const questionsList = Array.isArray(questions) ? questions : [];

    // Apply option mapping so participant receives randomized display choices
    const transformedQuestions = questionsList.map((q: any) => {
      const forwardMap = parseOptionMapping(q.option_mapping);
      const reverseMap = getReverseMapping(q.option_mapping);

      const origOptions: Record<string, string> = {
        A: q.option_a,
        B: q.option_b,
        C: q.option_c,
        D: q.option_d,
      };

      const displaySelected = q.selected_answer && reverseMap[q.selected_answer] ? reverseMap[q.selected_answer] : q.selected_answer;

      const keyA = forwardMap["A"] || "A";
      const keyB = forwardMap["B"] || "B";
      const keyC = forwardMap["C"] || "C";
      const keyD = forwardMap["D"] || "D";

      return {
        ...q,
        option_a: origOptions[keyA] || q.option_a,
        option_b: origOptions[keyB] || q.option_b,
        option_c: origOptions[keyC] || q.option_c,
        option_d: origOptions[keyD] || q.option_d,
        selected_answer: displaySelected,
      };
    });

    return {
      success: true,
      attempt,
      questions: transformedQuestions,
      serverNow: nowIso,
    };
  });

// ------------------------------------------------------------------
// SAVE ANSWER (AUTO-SAVE)
// ------------------------------------------------------------------
export const saveAnswerFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; attempt_id: number; attempt_question_id: number; selected_answer: "A" | "B" | "C" | "D" | null }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    const attempt = await db.prepare("SELECT * FROM exam_attempts WHERE id = ?").get(data.attempt_id);
    if (!attempt || attempt.user_id !== session.userId) {
      return { success: false, error: "Akses ditolak." };
    }

    if (attempt.status !== "IN_PROGRESS") {
      return { success: false, error: "Ujian sudah selesai." };
    }

    // Check timeout
    const nowIso = new Date().toISOString();
    if (attempt.ended_at < nowIso) {
      await executeScoring(db, attempt.id, true, session.userId);
      return { success: false, error: "Waktu ujian telah habis. Jawaban Anda telah dikumpulkan secara otomatis." };
    }

    // Get option mapping to convert display answer to original option key
    const aq = await db.prepare("SELECT option_mapping FROM attempt_questions WHERE id = ? AND attempt_id = ?").get(data.attempt_question_id, data.attempt_id);
    let realAnswer = data.selected_answer;
    if (data.selected_answer && aq?.option_mapping) {
      const forwardMap = parseOptionMapping(aq.option_mapping);
      realAnswer = (forwardMap[data.selected_answer] as any) || data.selected_answer;
    }

    await db.prepare("UPDATE attempt_questions SET selected_answer = ? WHERE id = ? AND attempt_id = ?").run(realAnswer, data.attempt_question_id, data.attempt_id);

    return { success: true };
  });

// ------------------------------------------------------------------
// SUBMIT EXAM ATTEMPT & SERVER-SIDE SCORING
// ------------------------------------------------------------------
export const submitExamAttemptFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; attempt_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    const attempt = await db.prepare("SELECT * FROM exam_attempts WHERE id = ?").get(data.attempt_id);
    if (!attempt || attempt.user_id !== session.userId) {
      return { success: false, error: "Akses ditolak." };
    }

    if (attempt.status === "SUBMITTED" || attempt.status === "AUTO_SUBMITTED") {
      return { success: true, message: "Ujian telah dikumpulkan sebelumnya." };
    }

    const result = await executeScoring(db, data.attempt_id, false, session.userId);
    return { success: true, result };
  });

// Helper function to evaluate answers and score server-side
async function executeScoring(db: any, attemptId: number, isAuto: boolean, userId: number) {
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const attemptQuestions = await db.prepare(`
    SELECT aq.selected_answer, q.correct_answer
    FROM attempt_questions aq
    JOIN questions q ON aq.question_id = q.id
    WHERE aq.attempt_id = ?
  `).all(attemptId);

  const qList = Array.isArray(attemptQuestions) ? attemptQuestions : [];
  const totalQuestions = qList.length;

  for (const aq of qList) {
    if (!aq.selected_answer) {
      unansweredCount++;
    } else if (aq.selected_answer === aq.correct_answer) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  }

  score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const status = isAuto ? "AUTO_SUBMITTED" : "SUBMITTED";

  await db.prepare(`
    UPDATE exam_attempts 
    SET status = ?, score = ?, correct_count = ?, incorrect_count = ?, unanswered_count = ?, submitted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(status, score, correctCount, incorrectCount, unansweredCount, attemptId);

  await logAudit(userId, status, "exam_attempts", attemptId, { score, correctCount, totalQuestions });

  return {
    score,
    correctCount,
    incorrectCount,
    unansweredCount,
    totalQuestions,
  };
}

// ------------------------------------------------------------------
// PARTICIPANT RESULT DETAIL
// ------------------------------------------------------------------
export const getParticipantResultDetailFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; attempt_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    const result = await db.prepare(`
      SELECT a.*, p.name as exam_name, p.code as exam_code, p.passing_grade, q.code as qualification_code, q.name as qualification_name,
             u.name as user_name, u.participant_number
      FROM exam_attempts a
      JOIN exam_packages p ON a.exam_id = p.id
      JOIN qualifications q ON p.qualification_id = q.id
      JOIN users u ON a.user_id = u.id
      WHERE a.id = ?
    `).get(data.attempt_id);

    if (!result) return { success: false, error: "Hasil tidak ditemukan." };

    // Object level security check
    if (result.user_id !== session.userId && session.role !== "SUPER_ADMIN" && session.role !== "ADMIN") {
      return { success: false, error: "Akses ditolak." };
    }

    return {
      success: true,
      result,
    };
  });

// ------------------------------------------------------------------
// LOG EXAM WARNING (ANTI-CHEATING)
// ------------------------------------------------------------------
export const logExamWarningFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; attempt_id: number; warning_type: string; details?: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    await logAudit(session.userId, `WARNING_${data.warning_type.toUpperCase()}`, "exam_attempts", data.attempt_id, {
      warning_type: data.warning_type,
      details: data.details || "Peserta meninggalkan layar/tab ujian.",
    });
    return { success: true };
  });

// ------------------------------------------------------------------
// PARTICIPANT PROFILE & QUALIFICATIONS MANAGEMENT
// ------------------------------------------------------------------
export const getParticipantProfileDetailsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    let user = await db.prepare(`
      SELECT id, name, email, role, participant_number, is_active, created_at
      FROM users WHERE id = ?
    `).get(session.userId);

    if (user && user.email) {
      // 1. Auto-sync from master_ganisph by matching email or participant_number
      const masterRows = await db.prepare(`
        SELECT * FROM master_ganisph
        WHERE LOWER(email) = LOWER(?) OR (registration_number IS NOT NULL AND registration_number = ?)
      `).all(user.email, user.participant_number || "");

      const masterList = Array.isArray(masterRows) ? masterRows : [];

      if (masterList.length > 0) {
        // Auto-set name from master_ganisph if user's name is empty or generic
        const masterName = masterList[0]?.name;
        if (masterName && (!user.name || user.name.trim() === "" || /^(Peserta|REG-)/i.test(user.name.trim()))) {
          await db.prepare("UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(masterName, session.userId);
          user.name = masterName;
        }

        // Auto-set participant_number if missing
        const firstReg = masterList.find((m: any) => m.registration_number)?.registration_number;
        if (firstReg && (!user.participant_number || user.participant_number.trim() === "")) {
          await db.prepare("UPDATE users SET participant_number = ? WHERE id = ?").run(firstReg, session.userId);
          user.participant_number = firstReg;
        }

        // Fetch all active qualifications in system
        const allQuals = await db.prepare("SELECT id, code, name FROM qualifications").all();
        const qualArray = Array.isArray(allQuals) ? allQuals : [];

        for (const mItem of masterList) {
          const mQualNameUpper = (mItem.qualification_name || "").toUpperCase();
          // Find matching qualification by code or name
          const matchedQual = qualArray.find((q: any) => {
            const qCodeUpper = (q.code || "").toUpperCase();
            const qNameUpper = (q.name || "").toUpperCase();
            return (
              mQualNameUpper.includes(qCodeUpper) ||
              mQualNameUpper.includes(qNameUpper) ||
              qNameUpper.includes(mQualNameUpper.replace("GANISPH ", ""))
            );
          });

          if (matchedQual) {
            await db.prepare(`
              INSERT INTO user_qualifications (user_id, qualification_id, registration_number)
              VALUES (?, ?, ?)
              ON CONFLICT (user_id, qualification_id) DO UPDATE SET
                registration_number = COALESCE(user_qualifications.registration_number, EXCLUDED.registration_number)
            `).run(session.userId, matchedQual.id, mItem.registration_number || null);
          }
        }
      }
    }

    const userQuals = await db.prepare(`
      SELECT uq.qualification_id, q.id as qualification_id, q.code, q.name, q.description, uq.registration_number
      FROM user_qualifications uq
      JOIN qualifications q ON uq.qualification_id = q.id
      WHERE uq.user_id = ?
      ORDER BY q.code ASC
    `).all(session.userId);

    const allQuals = await db.prepare(`
      SELECT id, code, name, description FROM qualifications WHERE status = 'ACTIVE' ORDER BY code ASC
    `).all();

    // Fetch complete assignment data from master_ganisph via bridge table
    const ganisphAssignments = await db.prepare(`
      SELECT
        mg.id as master_id,
        mg.company_name,
        mg.assignment_type,
        mg.name as ganisph_name,
        mg.qualification_name,
        mg.registration_number,
        mg.register_active_end,
        mg.assignment_active_end,
        mg.regency_city,
        mg.email,
        uga.synced_at
      FROM user_ganisph_assignments uga
      JOIN master_ganisph mg ON uga.master_ganisph_id = mg.id
      WHERE uga.user_id = ?
      ORDER BY mg.qualification_name ASC
    `).all(session.userId);

    return {
      user,
      qualifications: Array.isArray(userQuals) ? userQuals : [],
      allQualifications: Array.isArray(allQuals) ? allQuals : [],
      ganisphAssignments: Array.isArray(ganisphAssignments) ? ganisphAssignments : [],
    };
  });

export const updateParticipantProfileDetailsFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; name: string; participant_number?: string | undefined; password?: string | undefined }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    if (data.password && data.password.trim() !== "") {
      const { hashPassword } = await import("../auth");
      const passHash = hashPassword(data.password);
      await db.prepare(`
        UPDATE users SET name = ?, participant_number = ?, password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(data.name, data.participant_number || null, passHash, session.userId);
    } else {
      await db.prepare(`
        UPDATE users SET name = ?, participant_number = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?
      `).run(data.name, data.participant_number || null, session.userId);
    }

    await syncMasterGanisphQualifications(db, session.userId);
    return { success: true, error: undefined as string | undefined };
  });

export const addParticipantQualificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id: number; registration_number?: string | undefined }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    await db.prepare(`
      INSERT INTO user_qualifications (user_id, qualification_id, registration_number)
      VALUES (?, ?, ?)
      ON CONFLICT (user_id, qualification_id) DO UPDATE SET
        registration_number = EXCLUDED.registration_number
    `).run(session.userId, data.qualification_id, data.registration_number || null);

    await syncMasterGanisphQualifications(db, session.userId);
    return { success: true, error: undefined as string | undefined };
  });

export const updateParticipantQualificationRegNoFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id: number; registration_number: string }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    await db.prepare(`
      UPDATE user_qualifications SET registration_number = ?
      WHERE user_id = ? AND qualification_id = ?
    `).run(data.registration_number, session.userId, data.qualification_id);

    await syncMasterGanisphQualifications(db, session.userId);
    return { success: true };
  });

export const removeParticipantQualificationFn = createServerFn({ method: "POST" })
  .validator((data: { token: string; qualification_id: number }) => data)
  .handler(async ({ data }) => {
    const session = verifyParticipantSession(data.token);
    const db = await getDb();

    await db.prepare(`
      DELETE FROM user_qualifications
      WHERE user_id = ? AND qualification_id = ?
    `).run(session.userId, data.qualification_id);

    return { success: true };
  });
