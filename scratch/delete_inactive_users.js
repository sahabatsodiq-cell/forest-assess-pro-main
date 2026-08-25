import { getDb } from "../src/lib/db.ts";

async function deleteInactiveUsers() {
  console.log("=== DELETING INACTIVE USERS ON LOCALHOST DB ===");
  const db = await getDb();

  // 1. Fetch inactive users (is_active = 0)
  const inactiveUsers = await db.prepare(`
    SELECT id, name, email, role, participant_number, is_active, created_at 
    FROM users 
    WHERE is_active = 0
  `).all();

  console.log(`Found ${inactiveUsers.length} inactive user(s):`);
  console.table(inactiveUsers.map(u => ({
    ID: u.id,
    Name: u.name,
    Email: u.email,
    Role: u.role,
    ParticipantNo: u.participant_number
  })));

  if (inactiveUsers.length === 0) {
    console.log("No inactive users found to delete.");
    return;
  }

  const inactiveIds = inactiveUsers.map(u => u.id);
  const placeholders = inactiveIds.map(() => "?").join(",");

  // 2. Delete related records in child tables
  console.log("\nCleaning up related records in child tables...");

  const delQuals = await db.prepare(`DELETE FROM user_qualifications WHERE user_id IN (${placeholders})`).run(...inactiveIds);
  console.log(`- Deleted from user_qualifications: ${delQuals.changes ?? 0} row(s)`);

  const delAssignments = await db.prepare(`DELETE FROM user_ganisph_assignments WHERE user_id IN (${placeholders})`).run(...inactiveIds);
  console.log(`- Deleted from user_ganisph_assignments: ${delAssignments.changes ?? 0} row(s)`);

  const delEnrollments = await db.prepare(`DELETE FROM exam_enrollments WHERE user_id IN (${placeholders})`).run(...inactiveIds);
  console.log(`- Deleted from exam_enrollments: ${delEnrollments.changes ?? 0} row(s)`);

  const delAttempts = await db.prepare(`DELETE FROM exam_attempts WHERE user_id IN (${placeholders})`).run(...inactiveIds);
  console.log(`- Deleted from exam_attempts: ${delAttempts.changes ?? 0} row(s)`);

  // 3. Delete from users table
  const delUsers = await db.prepare(`DELETE FROM users WHERE id IN (${placeholders})`).run(...inactiveIds);
  console.log(`\nSuccessfully deleted ${delUsers.changes ?? 0} inactive user(s) from 'users' table.`);

  // 4. Verify remaining users
  const remainingUsers = await db.prepare(`SELECT id, name, email, role, is_active FROM users ORDER BY id ASC`).all();
  console.log(`\nRemaining users in database (${remainingUsers.length}):`);
  console.table(remainingUsers);

  console.log("\n=== PROCESS COMPLETED SUCCESSFULLY ===");
}

deleteInactiveUsers().catch(console.error);
