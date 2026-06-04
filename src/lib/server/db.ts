import Database from 'better-sqlite3';
import path from 'path';

// On Vercel (serverless environment), the only writable directory is /tmp.
// For a production app with persistence, we'd use a real remote DB (Vercel Postgres/KV).
// For now, this will make it run without 500 errors, though data won't persist across cold boots.
const dbPath = process.env.VERCEL ? '/tmp/sqlite.db' : 'sqlite.db';
const db = new Database(dbPath, { verbose: console.log });

db.pragma('journal_mode = WAL');

// Ensure the table exists. Note: on Vercel this is ephemeral.
// For true persistence a cloud DB is needed, but this allows the code to run.
db.exec(`
  CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    sender TEXT NOT NULL,
    recipient TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    message TEXT NOT NULL,
    dispatch_time INTEGER NOT NULL,
    arrival_time INTEGER NOT NULL,
    email_sent INTEGER DEFAULT 0
  )
`);

export default db;
