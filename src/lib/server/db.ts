import Database from 'better-sqlite3';
import path from 'path';

// On Vercel (serverless environment), the only writable directory is /tmp.
// For a production app with persistence, we'd use a real remote DB (Vercel Postgres/KV).
// For now, this will make it run without 500 errors, though data won't persist across cold boots.
const dbPath = process.env.VERCEL ? '/tmp/sqlite.db' : 'sqlite.db';
const db = new Database(dbPath, { verbose: console.log });

db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    message TEXT NOT NULL,
    dispatch_time INTEGER NOT NULL,
    arrival_time INTEGER NOT NULL
  )
`);

export default db;
