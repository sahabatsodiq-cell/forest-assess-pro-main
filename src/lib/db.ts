import path from "path";

// DB initialization is server-only.
let dbInstance: any = null;

function convertSql(sqlStr: string): string {
  let idx = 1;
  let converted = sqlStr.replace(/\?/g, () => `$${idx++}`);
  return converted;
}

class PostgresAdapter {
  private sql: any;

  constructor(sql: any) {
    this.sql = sql;
  }

  prepare(sqlStr: string) {
    const adapter = this;
    const converted = convertSql(sqlStr);

    return {
      async all(...args: any[]) {
        const flatArgs = args.flat();
        const rows = await adapter.sql.unsafe(converted, flatArgs);
        return Array.from(rows);
      },
      async get(...args: any[]) {
        const flatArgs = args.flat();
        const rows = await adapter.sql.unsafe(converted, flatArgs);
        return rows[0] || null;
      },
      async run(...args: any[]) {
        const flatArgs = args.flat();
        let insertSql = converted;
        if (/^\s*INSERT\s+INTO/i.test(insertSql) && !/RETURNING/i.test(insertSql)) {
          insertSql += " RETURNING id";
        }
        const rows = await adapter.sql.unsafe(insertSql, flatArgs);
        return {
          lastInsertRowid: rows[0]?.id || 0,
          changes: rows.count || 0,
        };
      },
    };
  }

  transaction(fn: Function) {
    return fn();
  }
}

export async function getDb() {
  if (typeof window !== "undefined") {
    throw new Error("getDb() cannot be called on the client side");
  }

  if (dbInstance) return dbInstance;

  const databaseUrl = process.env["DATABASE_URL"] || "postgresql://postgres.lfuzlvmytjbxuakpanfo:bobbY_%23%24%25%5E%26123456789%2B-%2A%2F@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres";

  if (databaseUrl) {
    console.log("Initializing Supabase PostgreSQL adapter...");
    const postgres = (await import("postgres")).default;
    const sql = postgres(databaseUrl, { ssl: "require" });
    dbInstance = new PostgresAdapter(sql);
    return dbInstance;
  }

  // Fallback to better-sqlite3 for local file database if no DATABASE_URL
  console.log("Initializing local SQLite database...");
  // @ts-ignore
  const Database = (await import("better-sqlite3")).default;
  const dbPath = path.resolve(process.cwd(), "db.sqlite");
  const db = new Database(dbPath);
  
  db.pragma("foreign_keys = ON");
  dbInstance = db;

  const { seedDatabase } = await import("./seed");
  await seedDatabase(db);

  return dbInstance;
}
