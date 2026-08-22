import crypto from "crypto";
import { getDb } from "./db";

const SESSION_COOKIE_NAME = "session_token";
const JWT_SECRET = process.env.JWT_SECRET || "askganisph-secret-key-for-local-dev-2026";

const PBKDF2_ITERATIONS = 600000;

// OWASP 2026 Compliant PBKDF2 Hashing
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, 64, "sha512").toString("hex");
  return `${salt}:${hash}:${PBKDF2_ITERATIONS}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const parts = storedHash.split(":");
  if (parts.length < 2) return false;
  const salt = parts[0];
  const hash = parts[1];
  const iterations = parts[2] ? parseInt(parts[2], 10) : 1000;
  
  try {
    const verifyHash = crypto.pbkdf2Sync(password, salt, iterations, 64, "sha512").toString("hex");
    const hashBuf = Buffer.from(hash, "hex");
    const verifyBuf = Buffer.from(verifyHash, "hex");
    if (hashBuf.length !== verifyBuf.length) return false;
    return crypto.timingSafeEqual(hashBuf, verifyBuf);
  } catch {
    return false;
  }
}

// Encrypt and sign tokens (Simple AES-GCM secure encryption)
export function createSessionToken(userId: number, role: string, email: string): string {
  const payload = JSON.stringify({
    userId,
    role,
    email,
    expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
  });
  
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", crypto.scryptSync(JWT_SECRET, "salt", 32), iv);
  let encrypted = cipher.update(payload, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function verifySessionToken(token: string): { userId: number; role: string; email: string } | null {
  try {
    const [ivHex, encrypted, authTagHex] = token.split(":");
    if (!ivHex || !encrypted || !authTagHex) return null;
    
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    
    const decipher = crypto.createDecipheriv("aes-256-gcm", crypto.scryptSync(JWT_SECRET, "salt", 32), iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    
    const payload = JSON.parse(decrypted);
    if (payload.expiresAt < Date.now()) {
      return null;
    }
    
    return {
      userId: payload.userId,
      role: payload.role,
      email: payload.email,
    };
  } catch (error) {
    return null;
  }
}

// Extract cookies from a headers string or Request
export function getSessionTokenFromRequest(request: Request): string | null {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = cookieHeader.split(";").map((c) => c.trim());
  const sessionCookie = cookies.find((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`));
  if (!sessionCookie) return null;
  return sessionCookie.substring(SESSION_COOKIE_NAME.length + 1);
}

// Get authenticated user
export async function getAuthenticatedUser(request: Request) {
  const token = getSessionTokenFromRequest(request);
  if (!token) return null;
  
  const session = verifySessionToken(token);
  if (!session) return null;
  
  const db = await getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ? AND is_active = 1").get(session.userId);
  if (!user) return null;
  
  // Convert boolean/integer constraints
  user.is_active = user.is_active === 1;
  return user;
}

// Centralized permission check
const ROLE_PERMISSIONS: Record<string, string[]> = {
  SUPER_ADMIN: [
    "user.view", "user.create", "user.update", "user.delete",
    "qualification.view", "qualification.create", "qualification.update", "qualification.delete",
    "subject.view", "subject.create", "subject.update", "subject.delete",
    "question.view", "question.create", "question.update", "question.delete", "question.import",
    "blueprint.view", "blueprint.create", "blueprint.update", "blueprint.delete",
    "exam.view", "exam.create", "exam.update", "exam.delete", "exam.publish",
    "enrollment.view", "enrollment.create", "enrollment.delete",
    "result.view", "report.view", "audit.view"
  ],
  ADMIN: [
    "user.view", "user.create", "user.update",
    "qualification.view", "qualification.create", "qualification.update",
    "subject.view", "subject.create", "subject.update",
    "question.view", "question.create", "question.update", "question.import",
    "blueprint.view", "blueprint.create", "blueprint.update",
    "exam.view", "exam.create", "exam.update", "exam.publish",
    "enrollment.view", "enrollment.create", "enrollment.delete",
    "result.view", "report.view", "audit.view"
  ],
  PESERTA: [
    "exam.view",
    "result.view"
  ]
};

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
}

// Log audit trail
export async function logAudit(userId: number | null, action: string, entityType: string, entityId: number | null, metadata: any = null, request?: Request) {
  try {
    const db = await getDb();
    let ipAddress = null;
    let userAgent = null;
    
    if (request) {
      ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip");
      userAgent = request.headers.get("user-agent");
    }
    
    db.prepare(`
      INSERT INTO audit_logs (user_id, action, entity_type, entity_id, metadata, ip_address, user_agent)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      action,
      entityType,
      entityId,
      metadata ? JSON.stringify(metadata) : null,
      ipAddress,
      userAgent
    );
  } catch (error) {
    console.error("Audit log failed:", error);
  }
}
