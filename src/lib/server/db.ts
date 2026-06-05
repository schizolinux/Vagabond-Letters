import { neon } from '@neondatabase/serverless';

// The DATABASE_URL is automatically populated by Vercel Postgres / Neon
// We use a dummy connection string during Vercel build time if the env variable isn't loaded yet
// to prevent SvelteKit from crashing during its static analysis phase.
const sql = neon(process.env.DATABASE_URL || 'postgresql://dummy:dummy@dummy.neon.tech/dummy?sslmode=require');

// Initialize schema for the Social Platform
async function initDb() {
  if (!process.env.DATABASE_URL) return; // Prevent crashing during build time if no DB is connected yet

  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at BIGINT NOT NULL,
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
      dispatch_time BIGINT NOT NULL,
      arrival_time BIGINT NOT NULL,
      email_sent INTEGER DEFAULT 0,
      FOREIGN KEY(sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(recipient_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
}

// Fire and forget init script (runs once per serverless boot)
initDb().catch(console.error);

export default sql;
