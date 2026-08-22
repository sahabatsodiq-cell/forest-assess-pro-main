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
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return { success: false, error: "Email atau password salah." };
    }

    if (user.is_active !== 1) {
      return { success: false, error: "Akun Anda telah dinonaktifkan." };
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

export const getCurrentUserFn = createServerFn({ method: "GET" })
  .handler(async () => {
    // In server functions, we can check authenticated state
    // But since server functions need access to request headers to read cookie,
    // let's accept token as input parameter or pass token from client storage/cookie
    return null;
  });
