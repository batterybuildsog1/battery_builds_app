require('dotenv').config();
const { Pool } = require('pg');

async function testConnection() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false // Required for Supabase SSL
    }
  });

  try {
    const res = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful! Current time:', res.rows[0].now);
  } catch (err) {
    console.error('❌ Connection failed:', err);
  } finally {
    pool.end();
  }
}

testConnection();
