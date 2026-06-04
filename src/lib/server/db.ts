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
// Initialize schema for the Social Platform
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS friends (
    user_id TEXT NOT NULL,
    friend_id TEXT NOT NULL,
    PRIMARY KEY (user_id, friend_id),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(friend_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    message TEXT NOT NULL,
    dispatch_time INTEGER NOT NULL,
    arrival_time INTEGER NOT NULL,
    email_sent INTEGER DEFAULT 0,
    FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

export default db;
