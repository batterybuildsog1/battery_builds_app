// test-connection.js
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful! Current time:', result.rows[0].now);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    pool.end();
  }
}

testConnection();

