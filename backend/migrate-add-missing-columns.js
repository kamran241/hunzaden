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

// Add missing columns to existing reviews table
const addMissingColumns = async () => {
    try {
        console.log('🔄 Checking and adding missing columns...\n');

        // Check and add is_deleted column
        const checkIsDeleted = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='reviews' AND column_name='is_deleted'
    `);

        if (checkIsDeleted.rows.length > 0) {
            console.log('✅ is_deleted column already exists!');
        } else {
            console.log('📝 Adding is_deleted column...');
            await pool.query(`
        ALTER TABLE reviews 
        ADD COLUMN is_deleted BOOLEAN DEFAULT FALSE
      `);
            console.log('✅ is_deleted column added successfully!');
        }

        // Check and add phone_number column
        const checkPhoneNumber = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='reviews' AND column_name='phone_number'
    `);

        if (checkPhoneNumber.rows.length > 0) {
            console.log('✅ phone_number column already exists!');
        } else {
            console.log('📝 Adding phone_number column...');
            await pool.query(`
        ALTER TABLE reviews 
        ADD COLUMN phone_number VARCHAR(20)
      `);
            console.log('✅ phone_number column added successfully!');
        }

        // Check and add updated_at column
        const checkUpdatedAt = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='reviews' AND column_name='updated_at'
    `);

        if (checkUpdatedAt.rows.length > 0) {
            console.log('✅ updated_at column already exists!');
        } else {
            console.log('📝 Adding updated_at column...');
            await pool.query(`
        ALTER TABLE reviews 
        ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      `);
            console.log('✅ updated_at column added successfully!');
        }

        console.log('\n🎉 All columns checked and updated!');
        console.log('✅ Your database is now up to date!');

        await pool.end();
    } catch (error) {
        console.error('❌ Error:', error);
        await pool.end();
        process.exit(1);
    }
};

addMissingColumns();
