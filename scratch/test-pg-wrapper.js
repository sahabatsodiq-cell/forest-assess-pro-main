import postgres from "postgres";

const connectionString = process.env.DATABASE_URL || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

const sql = postgres(connectionString, { ssl: "require" });

function convertSql(sqlStr) {
  let idx = 1;
  let converted = sqlStr.replace(/\?/g, () => `$${idx++}`);
  // Replace SQLite specific functions
  converted = converted.replace(/CURRENT_TIMESTAMP/gi, "CURRENT_TIMESTAMP");
  converted = converted.replace(/RANDOM\(\)/gi, "RANDOM()");
  return converted;
}

class PostgresAdapter {
  constructor(sql) {
    this.sql = sql;
  }

  prepare(sqlStr) {
    const adapter = this;
    const converted = convertSql(sqlStr);

    return {
      all(...args) {
        return adapter.sql.unsafe(converted, args);
      },
      get(...args) {
        const res = adapter.sql.unsafe(converted, args);
        return res.then((rows) => rows[0] || null);
      },
      run(...args) {
        let insertSql = converted;
        if (/^\s*INSERT\s+INTO/i.test(insertSql) && !/RETURNING/i.test(insertSql)) {
          insertSql += " RETURNING id";
        }
        const res = adapter.sql.unsafe(insertSql, args);
        return res.then((rows) => ({
          lastInsertRowid: rows[0]?.id || 0,
          changes: rows.count || 0,
        }));
      },
    };
  }

  transaction(fn) {
    return fn();
  }
}

async function test() {
  console.log("Testing PostgresAdapter with Supabase...");
  const db = new PostgresAdapter(sql);

  const users = await db.prepare("SELECT * FROM users WHERE email = ?").get("superadmin@askganisph.id");
  console.log("Found user from Supabase:", users.name, users.email, users.role);

  const qualCount = await db.prepare("SELECT COUNT(*)::int as count FROM qualifications").get();
  console.log("Total qualifications in Supabase:", qualCount.count);

  await sql.end();
}

test();
