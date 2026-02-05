import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize database table
export const initDatabase = async () => {
  try {
    // Create table only if it doesn't exist (preserves existing data)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        customer_name VARCHAR(255) NOT NULL,
        phone_number VARCHAR(20),
        ambience_rating INTEGER NOT NULL CHECK (ambience_rating >= 1 AND ambience_rating <= 10),
        management_rating INTEGER NOT NULL CHECK (management_rating >= 1 AND management_rating <= 10),
        food_rating INTEGER NOT NULL CHECK (food_rating >= 1 AND food_rating <= 10),
        dishes_tried TEXT,
        heard_from VARCHAR(100) NOT NULL,
        overall_rating INTEGER NOT NULL CHECK (overall_rating >= 1 AND overall_rating <= 10),
        additional_comments TEXT,
        visit_type VARCHAR(50) DEFAULT 'First-time',
        is_deleted BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Database table ready (existing data preserved)');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    throw error;
  }
};

export default pool;
