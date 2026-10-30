import { randomBytes, randomUUID } from "node:crypto";
import { chmodSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import Database from "better-sqlite3";
import { defaultContent, parseContent } from "./content";

const databasePath = resolve(
  process.env.DATABASE_PATH ?? "./data/ae-turns.sqlite",
);
const setupKeyPath = resolve(process.env.ADMIN_SETUP_KEY_PATH ?? "./data/admin-setup-key.txt");
mkdirSync(dirname(databasePath), { recursive: true });

export const db = new Database(databasePath);
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    content_json TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admins (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS admin_sessions (
    id TEXT PRIMARY KEY,
    admin_id TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL
  );
`);

export const initialSetupKey = process.env.ADMIN_SETUP_KEY ?? (() => {
  const existing = db.prepare("SELECT 1 FROM admins LIMIT 1").get();
  if (existing) return undefined;
  const key = randomBytes(32).toString("base64url");
  mkdirSync(dirname(setupKeyPath), { recursive: true });
  writeFileSync(setupKeyPath, `${key}\n`, { mode: 0o600 });
  chmodSync(setupKeyPath, 0o600);
  return key;
})();

const stored = db
  .prepare("SELECT content_json FROM site_content WHERE id = 1")
  .get() as { content_json: string } | undefined;

if (!stored) {
  db.prepare(
    "INSERT INTO site_content (id, content_json, updated_at) VALUES (1, ?, ?)",
  ).run(JSON.stringify(defaultContent), new Date().toISOString());
} else {
  parseContent(stored.content_json);
}

db.prepare("DELETE FROM admin_sessions WHERE expires_at <= ?").run(
  new Date().toISOString(),
);

export function getContent() {
  const row = db
    .prepare("SELECT content_json, updated_at FROM site_content WHERE id = 1")
    .get() as { content_json: string; updated_at: string };
  return {
    content: parseContent(row.content_json),
    updatedAt: row.updated_at,
  };
}

export function saveContent(content: unknown) {
  const validatedAt = new Date().toISOString();
  const result = db
    .prepare(
      "UPDATE site_content SET content_json = ?, updated_at = ? WHERE id = 1",
    )
    .run(JSON.stringify(content), validatedAt);

  if (result.changes !== 1) {
    throw new Error("Unable to persist website content.");
  }

  return getContent();
}

export function createAdminSession(adminId: string, tokenHash: string) {
  const id = randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();

  db.prepare(
    `INSERT INTO admin_sessions (id, admin_id, token_hash, expires_at, created_at)
     VALUES (?, ?, ?, ?, ?)`,
  ).run(id, adminId, tokenHash, expiresAt, now.toISOString());

  return expiresAt;
}

export function removeInitialSetupKey() {
  if (process.env.ADMIN_SETUP_KEY) return;
  rmSync(setupKeyPath, { force: true });
}
