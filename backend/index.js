import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool, { initDatabase } from './db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
await initDatabase();

// ==================== ROUTES ====================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Get all reviews
app.get('/api/reviews', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM reviews ORDER BY created_at DESC'
        );
        res.json({
            success: true,
            data: result.rows,
            count: result.rows.length
        });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch reviews',
            error: error.message
        });
    }
});

// Get single review by ID
app.get('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'SELECT * FROM reviews WHERE id = $1',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error fetching review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch review',
            error: error.message
        });
    }
});

// Create new review
app.post('/api/reviews', async (req, res) => {
    try {
        const {
            customer_name,
            ambience_rating,
            management_rating,
            food_rating,
            dishes_tried,
            heard_from,
            overall_rating,
            additional_comments
        } = req.body;

        // Validation
        if (!customer_name || !ambience_rating || !management_rating || !food_rating || !heard_from || !overall_rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (ambience_rating < 1 || ambience_rating > 10 ||
            management_rating < 1 || management_rating > 10 ||
            food_rating < 1 || food_rating > 10 ||
            overall_rating < 1 || overall_rating > 10) {
            return res.status(400).json({
                success: false,
                message: 'All ratings must be between 1 and 10'
            });
        }

        const result = await pool.query(
            `INSERT INTO reviews (customer_name, ambience_rating, management_rating, food_rating, dishes_tried, heard_from, overall_rating, additional_comments) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       RETURNING *`,
            [customer_name, ambience_rating, management_rating, food_rating, dishes_tried, heard_from, overall_rating, additional_comments]
        );

        res.status(201).json({
            success: true,
            message: 'Review created successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error creating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create review',
            error: error.message
        });
    }
});

// Update review
app.put('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            customer_name,
            ambience_rating,
            management_rating,
            food_rating,
            dishes_tried,
            heard_from,
            overall_rating,
            additional_comments
        } = req.body;

        // Validation
        if (!customer_name || !ambience_rating || !management_rating || !food_rating || !heard_from || !overall_rating) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (ambience_rating < 1 || ambience_rating > 10 ||
            management_rating < 1 || management_rating > 10 ||
            food_rating < 1 || food_rating > 10 ||
            overall_rating < 1 || overall_rating > 10) {
            return res.status(400).json({
                success: false,
                message: 'All ratings must be between 1 and 10'
            });
        }

        const result = await pool.query(
            `UPDATE reviews 
       SET customer_name = $1, ambience_rating = $2, management_rating = $3, food_rating = $4, 
           dishes_tried = $5, heard_from = $6, overall_rating = $7, additional_comments = $8, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $9 
       RETURNING *`,
            [customer_name, ambience_rating, management_rating, food_rating, dishes_tried, heard_from, overall_rating, additional_comments, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review updated successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update review',
            error: error.message
        });
    }
});

// Delete review
app.delete('/api/reviews/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            'DELETE FROM reviews WHERE id = $1 RETURNING *',
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        res.json({
            success: true,
            message: 'Review deleted successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete review',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
