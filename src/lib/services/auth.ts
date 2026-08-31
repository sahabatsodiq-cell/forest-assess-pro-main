import { z } from "zod";
import { createServerFn } from "@tanstack/react-start";
import { getDb } from "../db";
import { hashPassword, verifyPassword, createSessionToken, getAuthenticatedUser, logAudit, hasPermission } from "../auth";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email atau Nomor Registrasi (Username) wajib diisi"),
  password: z.string().min(1, "Password wajib diisi"),
});

const registerSchema = z.object({
  name: z.string().trim().min(1, "Nama wajib diisi"),
  email: z.string().trim().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  participant_number: z.string().optional(),
});

const requestPasswordResetSchema = z.object({
  email: z.string().trim().email("Format email tidak valid"),
});

export async function generateRandomRegistrationCode(db: any): Promise<string> {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let attempts = 0;
  while (attempts < 100) {
    let code = "";
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    const fullCode = `REG-AK-${code}`;
    const existing = await db.prepare("SELECT id FROM users WHERE UPPER(participant_number) = UPPER(?)").get(fullCode);
    if (!existing) {
      return fullCode;
    }
    attempts++;
  }
  return `REG-AK-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export const loginFn = createServerFn({ method: "POST" })
  .validator((data) => loginSchema.parse(data))
  .handler(async ({ data }) => {
    const { email, password } = data;
    if (!email || !password) {
      return { success: false, error: "Email/Nomor Registrasi dan password wajib diisi." };
    }

    const db = await getDb();
    const loginIdentifier = email.trim();
    const user = await db.prepare(
      "SELECT * FROM users WHERE LOWER(email) = LOWER(?) OR UPPER(participant_number) = UPPER(?)"
    ).get(loginIdentifier, loginIdentifier);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return { success: false, error: "Email/Nomor Registrasi atau password salah." };
    }

    if (user.is_active !== 1) {
      return { success: false, error: "Akun Anda sedang dalam proses Verifikasi & Validasi oleh Admin." };
    }

    // Auto-sync name from master_ganisph if user name is empty or generic
    if (!user.name || user.name.trim() === "" || /^(Peserta|REG-)/i.test(user.name.trim())) {
      const masterRow = await db.prepare(`
        SELECT name FROM master_ganisph WHERE LOWER(email) = LOWER(?) LIMIT 1
      `).get(user.email);
      if (masterRow?.name) {
        await db.prepare("UPDATE users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(masterRow.name, user.id);
        user.name = masterRow.name;
      }
    }

    const token = createSessionToken(user.id, user.role, user.email);
    await logAudit(user.id, "LOGIN", "users", user.id, { role: user.role });

    try {
      const { setCookie } = await import("@tanstack/react-start/server");
      setCookie("session_token", token, {
        path: "/",
        httpOnly: true,
        secure: process.env["NODE_ENV"] === "production" || process.env["VERCEL"] === "1",
        sameSite: "lax",
        maxAge: 86400,
      });
    } catch (err) {
      console.error("Cookie set error:", err);
    }

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
  .validator((data) => registerSchema.parse(data))
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
    let masterRow: any = null;
    try {
      masterRow = await db.prepare(`
        SELECT registration_number, qualification_name FROM master_ganisph WHERE LOWER(email) = LOWER(?) LIMIT 1
      `).get(email);
    } catch (e) {
      // master_ganisph optional lookup fallback
    }

    const autoGenCode = isFirstUser ? "SA-001" : await generateRandomRegistrationCode(db);
    const defaultParticipantNumber = participant_number || masterRow?.registration_number || autoGenCode;

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
    if (masterRow?.qualification_name) {
      const qCodes = masterRow.qualification_name.split(",").map((c: string) => c.trim());
      for (const qc of qCodes) {
        const qObj = await db.prepare("SELECT id FROM qualifications WHERE code = ? OR name = ?").get(qc, qc);
        if (qObj?.id) {
          await db.prepare("INSERT INTO user_qualifications (user_id, qualification_id) VALUES (?, ?) ON CONFLICT DO NOTHING").run(userId, qObj.id);
        }
      }
    }

    const token = isActive ? createSessionToken(userId, role, email) : null;

    if (token) {
      try {
        const { setCookie } = await import("@tanstack/react-start/server");
        setCookie("session_token", token, {
          path: "/",
          httpOnly: true,
          secure: process.env["NODE_ENV"] === "production" || process.env["VERCEL"] === "1",
          sameSite: "lax",
          maxAge: 86400,
        });
      } catch (err) {
        console.error("Cookie set error:", err);
      }
    }

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

export const requestPasswordResetFn = createServerFn({ method: "POST" })
  .validator((data) => requestPasswordResetSchema.parse(data))
  .handler(async ({ data }) => {
    const { email } = data;
    if (!email) return { success: false, error: "Alamat email wajib diisi." };

    const db = await getDb();
    const user = await db.prepare("SELECT id, name, email FROM users WHERE LOWER(email) = LOWER(?)").get(email);
    if (!user) {
      // Don't leak user existence for security, return generic success message
      return {
        success: true,
        message: "Jika email terdaftar, instruksi reset kata sandi telah dikirimkan ke email Anda.",
      };
    }

    const { sendPasswordResetLinkEmail } = await import("./emailService");
    const resetLink = `http://localhost:3000/login?mode=reset&email=${encodeURIComponent(user.email)}`;

    await sendPasswordResetLinkEmail({
      email: user.email,
      name: user.name,
      resetLink,
    });

    await logAudit(user.id, "REQUEST_PASSWORD_RESET", "users", user.id, { email: user.email });

    return {
      success: true,
      message: "Instruksi reset kata sandi telah dikirimkan ke email Anda. Silakan periksa email Anda.",
    };
  });

export const logoutFn = createServerFn({ method: "POST" })
  .handler(async () => {
    try {
      const { deleteCookie } = await import("@tanstack/react-start/server");
      deleteCookie("session_token", { path: "/" });
    } catch (err) {
      console.error("Logout cookie error:", err);
    }
    return { success: true };
  });

export const getCurrentUserFn = createServerFn({ method: "GET" })
  .handler(async () => {
    try {
      const { getCookie } = await import("@tanstack/react-start/server");
      const token = getCookie("session_token");
      if (!token) return null;

      const { verifySessionToken } = await import("../auth");
      const session = verifySessionToken(token);
      if (!session) return null;

      const db = await getDb();
      const user = await db.prepare("SELECT id, name, email, role, participant_number, is_active FROM users WHERE id = ?").get(session.userId);
      if (!user || user.is_active !== 1) return null;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        participant_number: user.participant_number,
      };
    } catch {
      return null;
    }
  });
