import { getDb } from './db';

async function run() {
  const db = await getDb();

  console.log("=== USERS LIKE 'Adit' OR 'Akbar' ===");
  const users = await db.prepare("SELECT id, name, email, participant_number FROM users WHERE LOWER(name) LIKE '%adit%' OR LOWER(name) LIKE '%akbar%'").all();
  console.log("Users:", users);

  const userList = Array.isArray(users) ? users : [];
  for (const u of userList) {
    console.log(`\n=== DATA FOR USER ID ${u.id} (${u.name}) ===`);
    const uq = await db.prepare("SELECT * FROM user_qualifications WHERE user_id = ?").all(u.id);
    console.log("user_qualifications:", uq);

    const uga = await db.prepare("SELECT * FROM user_ganisph_assignments WHERE user_id = ?").all(u.id);
    console.log("user_ganisph_assignments:", uga);

    const ee = await db.prepare("SELECT * FROM exam_enrollments WHERE user_id = ?").all(u.id);
    console.log("exam_enrollments:", ee);
  }

  console.log("\n=== MASTER GANISPH LIKE 'Adit' OR 'Akbar' ===");
  const master = await db.prepare("SELECT id, name, registration_number, qualification_name FROM master_ganisph WHERE LOWER(name) LIKE '%adit%' OR LOWER(name) LIKE '%akbar%'").all();
  console.log("Master GANISPH:", master);

  console.log("\n=== ORPHANED USER_GANISPH_ASSIGNMENTS ===");
  const orphans = await db.prepare("SELECT * FROM user_ganisph_assignments WHERE master_ganisph_id NOT IN (SELECT id FROM master_ganisph)").all();
  console.log("Orphaned user_ganisph_assignments:", orphans);

  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
