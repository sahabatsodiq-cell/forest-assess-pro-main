import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";

export interface LandingPreviewData {
  dashboard: {
    totalPeserta: number;
    totalQuals: number;
    totalExamPackages: number;
    activeExams: number;
    recentActivities: Array<{
      id: number;
      time: string;
      user: string;
      action: string;
      score: string;
    }>;
  };
  bankSoal: Array<{
    id: number;
    text: string;
    code: string;
    topic: string;
    level: string;
  }>;
  examBuilder: {
    packageName: string;
    qualCode: string;
    durationMinutes: number;
    passingGrade: number;
    totalQuestions: number;
    blueprintDistribution: Array<{
      topic: string;
      count: string;
      percent: string;
    }>;
  } | null;
  peserta: Array<{
    id: number;
    name: string;
    reg: string;
    code: string;
    session: string;
    status: string;
  }>;
  hasil: Array<{
    id: number;
    name: string;
    code: string;
    count: string;
    score: number;
    status: string;
  }>;
}

export async function getLandingPreviewDataRaw(): Promise<LandingPreviewData> {
  const db = await getDb();

  // 1. Dashboard Stats & Recent Activities
  const totalPesertaRow = await db.prepare(
    "SELECT COUNT(*) as count FROM users WHERE role = 'PESERTA'"
  ).get();
  const totalPeserta = totalPesertaRow?.count || 0;

  const totalQualsRow = await db.prepare(
    "SELECT COUNT(*) as count FROM qualifications WHERE status = 'ACTIVE'"
  ).get();
  const totalQuals = totalQualsRow?.count || 0;

  const totalExamPackagesRow = await db.prepare(
    "SELECT COUNT(*) as count FROM exam_packages"
  ).get();
  const totalExamPackages = totalExamPackagesRow?.count || 0;

  const activeExamsRow = await db.prepare(
    "SELECT COUNT(*) as count FROM exam_packages WHERE status IN ('PUBLISHED', 'ACTIVE')"
  ).get();
  const activeExams = activeExamsRow?.count || 0;

  // Fetch real audit logs or recent attempts for activities
  const auditLogs = await db.prepare(`
    SELECT a.id, a.action, a.created_at, u.name as user_name
    FROM audit_logs a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.id DESC LIMIT 5
  `).all();

  const recentActivities = (auditLogs || []).map((log: any) => {
    let timeAgo = "Baru saja";
    if (log.created_at) {
      const diffMin = Math.round((Date.now() - new Date(log.created_at).getTime()) / (1000 * 60));
      if (diffMin < 60) timeAgo = `${Math.max(1, diffMin)} menit lalu`;
      else if (diffMin < 1440) timeAgo = `${Math.round(diffMin / 60)} jam lalu`;
      else timeAgo = `${Math.round(diffMin / 1440)} hari lalu`;
    }
    return {
      id: log.id,
      time: timeAgo,
      user: log.user_name || "Sistem",
      action: log.action || "Aktivitas sistem",
      score: "",
    };
  });

  // 2. Bank Soal
  const questionRows = await db.prepare(`
    SELECT q.id, q.question_text, qual.code as qual_code, s.name as subject_name, q.difficulty
    FROM questions q
    JOIN qualifications qual ON q.qualification_id = qual.id
    LEFT JOIN subjects s ON q.subject_id = s.id
    ORDER BY q.id ASC
    LIMIT 10
  `).all();

  const bankSoal = (questionRows || []).map((q: any) => ({
    id: q.id,
    text: q.question_text,
    code: q.qual_code || "GANIS",
    topic: q.subject_name || "Umum",
    level: q.difficulty === "EASY" ? "Easy" : q.difficulty === "MEDIUM" ? "Medium" : "Hard",
  }));

  // 3. Exam Builder
  const latestPackage = await db.prepare(`
    SELECT ep.id, ep.name, ep.duration_minutes, ep.passing_grade, ep.blueprint_id, qual.code as qual_code
    FROM exam_packages ep
    JOIN qualifications qual ON ep.qualification_id = qual.id
    ORDER BY ep.id DESC
    LIMIT 1
  `).get();

  let examBuilderData = null;
  if (latestPackage) {
    let blueprintItems: any[] = [];
    let totalBlueprintCount = 0;

    if (latestPackage.blueprint_id) {
      blueprintItems = await db.prepare(`
        SELECT bi.question_count, bi.difficulty, s.name as subject_name
        FROM blueprint_items bi
        JOIN subjects s ON bi.subject_id = s.id
        WHERE bi.blueprint_id = ?
      `).all(latestPackage.blueprint_id);

      totalBlueprintCount = blueprintItems.reduce((acc: number, curr: any) => acc + (curr.question_count || 0), 0);
    }

    if (blueprintItems.length === 0) {
      const subjects = await db.prepare(`
        SELECT name FROM subjects WHERE qualification_id = (
          SELECT qualification_id FROM exam_packages WHERE id = ?
        )
      `).all(latestPackage.id);

      blueprintItems = (subjects || []).map((s: any) => ({
        subject_name: s.name,
        question_count: 10,
      }));
      totalBlueprintCount = blueprintItems.length * 10;
    }

    examBuilderData = {
      packageName: latestPackage.name,
      qualCode: latestPackage.qual_code,
      durationMinutes: latestPackage.duration_minutes,
      passingGrade: latestPackage.passing_grade,
      totalQuestions: totalBlueprintCount || 50,
      blueprintDistribution: blueprintItems.map((bi: any) => {
        const count = bi.question_count || 0;
        const pct = totalBlueprintCount > 0 ? Math.round((count / totalBlueprintCount) * 100) : 0;
        return {
          topic: bi.subject_name || "Materi Ujian",
          count: `${count} Soal`,
          percent: `${pct}%`,
        };
      }),
    };
  }

  // 4. Peserta
  const participants = await db.prepare(`
    SELECT u.id, u.name, u.participant_number, u.is_active,
           (SELECT q.code FROM user_qualifications uq JOIN qualifications q ON uq.qualification_id = q.id WHERE uq.user_id = u.id LIMIT 1) as qual_code,
           (SELECT ea.status FROM exam_attempts ea WHERE ea.user_id = u.id ORDER BY ea.id DESC LIMIT 1) as attempt_status
    FROM users u
    WHERE u.role = 'PESERTA'
    ORDER BY u.id ASC
    LIMIT 10
  `).all();

  const peserta = (participants || []).map((p: any) => {
    let statusText = "Belum Mulai";
    if (p.attempt_status === "IN_PROGRESS") statusText = "Sedang Ujian";
    else if (p.attempt_status === "SUBMITTED" || p.attempt_status === "AUTO_SUBMITTED") statusText = "Selesai";

    return {
      id: p.id,
      name: p.name,
      reg: p.participant_number || `REG-2026-00${p.id}`,
      code: p.qual_code || "CANHUT",
      session: "Sesi Mandiri",
      status: statusText,
    };
  });

  // 5. Hasil Ujian
  const attempts = await db.prepare(`
    SELECT ea.id, ea.score, ea.status, ea.correct_count, ea.incorrect_count, ea.unanswered_count,
           u.name as participant_name, qual.code as qual_code, ep.passing_grade
    FROM exam_attempts ea
    JOIN users u ON ea.user_id = u.id
    JOIN exam_packages ep ON ea.exam_id = ep.id
    JOIN qualifications qual ON ep.qualification_id = qual.id
    WHERE ea.status IN ('SUBMITTED', 'AUTO_SUBMITTED')
    ORDER BY ea.id DESC
    LIMIT 10
  `).all();

  const hasil = (attempts || []).map((a: any) => {
    const totalQ = (a.correct_count || 0) + (a.incorrect_count || 0) + (a.unanswered_count || 0);
    const isPassed = a.score >= (a.passing_grade || 70);

    return {
      id: a.id,
      name: a.participant_name,
      code: a.qual_code,
      count: `${totalQ || 50} Soal`,
      score: a.score || 0,
      status: isPassed ? "Lulus" : "Tidak Lulus",
    };
  });

  return {
    dashboard: {
      totalPeserta,
      totalQuals,
      totalExamPackages,
      activeExams,
      recentActivities,
    },
    bankSoal,
    examBuilder: examBuilderData,
    peserta,
    hasil,
  };
}

export const getLandingPreviewDataFn = createServerFn({ method: "GET" }).handler(
  async (): Promise<LandingPreviewData> => {
    return getLandingPreviewDataRaw();
  }
);
