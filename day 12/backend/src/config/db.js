import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

let poolConfig;

if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'expense_haven',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
  };
}

export const pool = new Pool(poolConfig);

let isDbConnected = false;

export const initDb = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ PostgreSQL connected successfully to:', poolConfig.database || 'database');
    isDbConnected = true;

    // Run schema creation automatically
    const createTablesQuery = `
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(100),
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        display_name VARCHAR(100),
        avatar_url TEXT,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
        title VARCHAR(255) NOT NULL,
        amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
        category VARCHAR(100) NOT NULL,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        notes TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_transactions_user_date ON transactions(user_id, date DESC, created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;

    await client.query(createTablesQuery);
    console.log('✅ PostgreSQL tables verified and ready.');
    client.release();
  } catch (error) {
    console.warn('⚠️ PostgreSQL Connection Warning:', error.message);
    console.warn('👉 Please verify your PostgreSQL connection in .env (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)');
  }
};

export const query = (text, params) => pool.query(text, params);
