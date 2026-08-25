import { hashPassword, verifyPassword, createSessionToken, verifySessionToken } from "../src/lib/auth.ts";
import { getDb } from "../src/lib/db.ts";

async function runAuthAuditTest() {
  console.log("=== FULLSTACK GUARDIAN: AUTHENTICATION CODE & SECURITY AUDIT ===");

  // 1. Test Password Hashing & Verification
  console.log("\n[1] Testing Hashing (PBKDF2 SHA-512)...");
  const rawPass = "TestPassword123!";
  const hashed = hashPassword(rawPass);
  console.log("   Generated Hash format:", hashed.substring(0, 30) + "...");
  const isValid = verifyPassword(rawPass, hashed);
  const isWrongInvalid = verifyPassword("WrongPassword123!", hashed);
  console.log("   Password match check:", isValid ? "PASSED (true)" : "FAILED");
  console.log("   Wrong password check:", !isWrongInvalid ? "PASSED (false)" : "FAILED");

  // 2. Test Token Encryption (AES-256-GCM)
  console.log("\n[2] Testing Session Token AES-256-GCM Encryption...");
  const token = createSessionToken(999, "PESERTA", "test.user@example.com");
  console.log("   Encrypted Token:", token.substring(0, 35) + "...");
  const decoded = verifySessionToken(token);
  console.log("   Decrypted Payload:", decoded);
  if (decoded && decoded.userId === 999 && decoded.role === "PESERTA") {
    console.log("   Token Integrity Check: PASSED");
  } else {
    console.log("   Token Integrity Check: FAILED");
  }

  // 3. Database User & Audit Log Check
  console.log("\n[3] Checking Database Connection & User Table Schema...");
  try {
    const db = await getDb();
    const usersCount = db.prepare("SELECT COUNT(*)::int as count FROM users").get();
    console.log("   Current Total Registered Users in DB:", usersCount?.count ?? 0);

    const auditCount = db.prepare("SELECT COUNT(*)::int as count FROM audit_logs WHERE action IN ('LOGIN', 'REGISTER_PESERTA', 'REGISTER_FIRST_ADMIN')").get();
    console.log("   Auth Audit Logs Recorded:", auditCount?.count ?? 0);
  } catch (err) {
    console.error("   DB check error:", err.message);
  }

  console.log("\n=== AUDIT TEST COMPLETED SUCCESSFULLY ===");
}

runAuthAuditTest().catch(console.error);
