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

// Add phone_number column to existing reviews table
const addPhoneNumberColumn = async () => {
    try {
        console.log('🔄 Checking if phone_number column exists...');

        // Check if column already exists
        const checkColumn = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='reviews' AND column_name='phone_number'
    `);

        if (checkColumn.rows.length > 0) {
            console.log('✅ phone_number column already exists!');
        } else {
            console.log('📝 Adding phone_number column...');
            await pool.query(`
        ALTER TABLE reviews 
        ADD COLUMN phone_number VARCHAR(20)
      `);
            console.log('✅ phone_number column added successfully!');
        }

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
};

addPhoneNumberColumn();
