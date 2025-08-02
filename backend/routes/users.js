const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validateProfileUpdate } = require('../middleware/validation');

const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'Invalid or expired token'
        });
    }
};

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update user profile
router.put('/profile', authenticateToken, validateProfileUpdate, async (req, res) => {
    try {
        const { name } = req.body;

        const result = await pool.query(
            'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, email, name, created_at',
            [name, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });

    } catch (error) {
        console.error('Update user profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        // Get user's health records count and date range
        const healthStats = await pool.query(
            `SELECT 
                COUNT(*) as total_records,
                MIN(date) as first_record_date,
                MAX(date) as last_record_date,
                AVG(weight) as avg_weight,
                MIN(weight) as min_weight,
                MAX(weight) as max_weight
            FROM health_records 
            WHERE user_id = $1`,
            [req.user.userId]
        );

        // Get user's account info
        const userInfo = await pool.query(
            'SELECT created_at FROM users WHERE id = $1',
            [req.user.userId]
        );

        const stats = {
            ...healthStats.rows[0],
            account_created: userInfo.rows[0]?.created_at,
            days_since_first_record: healthStats.rows[0].first_record_date 
                ? Math.floor((new Date() - new Date(healthStats.rows[0].first_record_date)) / (1000 * 60 * 60 * 24))
                : 0
        };

        res.json({
            stats
        });

    } catch (error) {
        console.error('Get user stats error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router; 