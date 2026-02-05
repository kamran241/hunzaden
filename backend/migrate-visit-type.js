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

const migrateVisitType = async () => {
    try {
        console.log('🔄 Adding visit_type column to reviews table...\n');

        // Check if visit_type column exists
        const checkResult = await pool.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='reviews' AND column_name='visit_type'
        `);

        if (checkResult.rows.length > 0) {
            console.log('✅ visit_type column already exists!');
        } else {
            console.log('📝 Adding visit_type column...');
            await pool.query(`
                ALTER TABLE reviews 
                ADD COLUMN visit_type VARCHAR(50) DEFAULT 'First-time'
            `);
            console.log('✅ visit_type column added successfully!');
        }

        console.log('\n🎉 Migration complete!');
        await pool.end();
    } catch (error) {
        console.error('❌ Migration failed:', error);
        await pool.end();
        process.exit(1);
    }
};

migrateVisitType();
