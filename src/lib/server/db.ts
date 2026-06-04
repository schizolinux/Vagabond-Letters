import Database from 'better-sqlite3';

const db = new Database('sqlite.db', { verbose: console.log });

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
