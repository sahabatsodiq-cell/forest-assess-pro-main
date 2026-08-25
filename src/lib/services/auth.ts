import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { hashPassword, verifyPassword, createSessionToken, getAuthenticatedUser, logAudit, hasPermission } from "../auth";

export const loginFn = createServerFn({ method: "POST" })
  .validator((data: { email?: string; password?: string }) => data)
  .handler(async ({ data }) => {
    const { email, password } = data;
    if (!email || !password) {
      return { success: false, error: "Email dan password wajib diisi." };
    }

    const db = await getDb();
    const user = await db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return { success: false, error: "Email atau password salah." };
    }

    if (user.is_active !== 1) {
      return { success: false, error: "Akun Anda sedang dalam proses Verifikasi & Validasi oleh Admin." };
    }

    // Auto-sync name from master_ganisph if user name is empty or generic
    if (!user.name || user.name.trim() === "" || /^(Peserta|REG-)/i.test(user.name.trim())) {
      const masterRow = await db.prepare(`
        SELECT name FROM master_ganisph WHERE LOWER(email) = LOWER(?) LIMIT 1
      `).get(email);
      if (masterRow?.name) {
        await db.prepare("UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(masterRow.name, user.id);
        user.name = masterRow.name;
      }
    }

    const token = createSessionToken(user.id, user.role, user.email);
    await logAudit(user.id, "LOGIN", "users", user.id, { role: user.role });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        participant_number: user.participant_number,
      },
    };
  });

export const checkFirstUserFn = createServerFn({ method: "GET" })
  .handler(async () => {
    const db = await getDb();
    const countRes = await db.prepare("SELECT COUNT(*)::int as count FROM users").get();
    const userCount = Number(countRes?.count ?? countRes?.["COUNT(*)"] ?? 0);
    return { isFirstUser: userCount === 0, userCount };
  });

export const registerFn = createServerFn({ method: "POST" })
  .validator((data: { name?: string; email?: string; password?: string; participant_number?: string }) => data)
  .handler(async ({ data }) => {
    const { name, email, password, participant_number } = data;
    if (!name || !email || !password) {
      return { success: false, error: "Nama, email, dan password wajib diisi." };
    }

    if (password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    const db = await getDb();

    // Check unique email
    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").get(email);
    if (existing) {
      return { success: false, error: "Email sudah terdaftar. Silakan login." };
    }

    // Check total users count to determine role: FIRST REGISTERED USER -> AUTOMATIC SUPER_ADMIN / ADMIN
    const countRes = await db.prepare("SELECT COUNT(*)::int as count FROM users").get();
    const userCount = Number(countRes?.count ?? countRes?.["COUNT(*)"] ?? 0);
    const isFirstUser = userCount === 0;
    const role = isFirstUser ? "SUPER_ADMIN" : "PESERTA";
    const isActive = isFirstUser ? 1 : 0;

    // Check if email matches master_ganisph data for pre-verification auto-fill
    const masterRow = await db.prepare(`
      SELECT ktp_number, qualification_code FROM master_ganisph WHERE LOWER(email) = LOWER(?) LIMIT 1
    `).get(email);

    const defaultParticipantNumber = participant_number || masterRow?.ktp_number || (isFirstUser ? "SA-001" : `REG-${Date.now().toString().slice(-4)}`);

    const passHash = hashPassword(password);
    const res = await db.prepare(`
      INSERT INTO users (name, email, password_hash, role, participant_number, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      name,
      email,
      passHash,
      role,
      defaultParticipantNumber,
      isActive
    );

    const userId = Number(res.lastInsertRowid);

    // Auto-associate qualification from master_ganisph if found
    if (masterRow?.qualification_code) {
      const qCodes = masterRow.qualification_code.split(",").map((c: string) => c.trim());
      for (const qc of qCodes) {
        const qObj = await db.prepare("SELECT id FROM qualifications WHERE code = ?").get(qc);
        if (qObj?.id) {
          await db.prepare("INSERT INTO user_qualifications (user_id, qualification_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(userId, qObj.id);
        }
      }
    }

    const token = isActive ? createSessionToken(userId, role, email) : null;

    await logAudit(userId, isFirstUser ? "REGISTER_FIRST_ADMIN" : "REGISTER_PESERTA", "users", userId, { role, isFirstUser, is_active: isActive });

    return {
      success: true,
      isFirstUser,
      isPendingVerification: !isFirstUser,
      role,
      token,
      user: {
        id: userId,
        name,
        email,
        role,
        is_active: isActive,
        participant_number: defaultParticipantNumber,
      },
    };
  });

export const getCurrentUserFn = createServerFn({ method: "GET" })
  .handler(async () => {
    return null;
  });
