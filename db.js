// db.js
import pkg from 'pg';
const { Pool } = pkg;
import config from './config.js';

const pool = new Pool({
  connectionString: config.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS memories (
      id SERIAL PRIMARY KEY,
      chat_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
}

export async function saveMemory(chatId, role, content) {
  await pool.query(
    'INSERT INTO memories (chat_id, role, content) VALUES ($1, $2, $3)',
    [chatId, role, content]
  );
}

export async function getMemory(chatId, limit = 50) {
  const res = await pool.query(
    'SELECT role, content FROM memories WHERE chat_id = $1 ORDER BY created_at DESC LIMIT $2',
    [chatId, limit]
  );
  return res.rows.reverse();
}
