const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();

// Simple authentication middleware
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({
            error: 'Access token required'
        });
    }

    try {
        const decoded = jwt.verify(token, 'health-tracker-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'Invalid or expired token'
        });
    }
};

// Get specific user profile by ID (for admin use)
router.get('/:id/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if current user is admin
        const currentUserResult = await pool.query(
            'SELECT get_user_role(id) as role FROM users WHERE id = $1',
            [req.user.userId]
        );
        
        if (currentUserResult.rows.length === 0 || currentUserResult.rows[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }
        
        // Get the target user's profile
        const result = await pool.query(
            'SELECT id, email, name, address, tax_id, height, TO_CHAR(birthday, \'YYYY-MM-DD\') as birthday, phone, created_at, get_user_role(id) as role FROM users WHERE id = $1',
            [userId]
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
        console.error('Get specific user profile error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update specific user profile by ID (admin only)
router.put('/:id/profile', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;

        // Check if current user is admin
        const currentUserResult = await pool.query(
            'SELECT get_user_role(id) as role FROM users WHERE id = $1',
            [req.user.userId]
        );

        if (currentUserResult.rows.length === 0 || currentUserResult.rows[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }

        // Accept all possible fields from frontend
        const { name, email, address, taxId, height, birthday, phone } = req.body;

        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        if (name) { updateFields.push(`name = $${paramCount}`); updateValues.push(name); paramCount++; }
        if (email) { updateFields.push(`email = $${paramCount}`); updateValues.push(email); paramCount++; }
        if (address) { updateFields.push(`address = $${paramCount}`); updateValues.push(address); paramCount++; }
        if (taxId) { updateFields.push(`tax_id = $${paramCount}`); updateValues.push(taxId); paramCount++; }
        if (height) { updateFields.push(`height = $${paramCount}`); updateValues.push(height); paramCount++; }
        if (birthday) { updateFields.push(`birthday = $${paramCount}`); updateValues.push(birthday); paramCount++; }
        if (phone) { updateFields.push(`phone = $${paramCount}`); updateValues.push(phone); paramCount++; }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }

        updateValues.push(userId);

        const query = `
            UPDATE users 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING id, email, name, address, tax_id, height, TO_CHAR(birthday, 'YYYY-MM-DD') as birthday, phone, created_at, updated_at
        `;

        const result = await pool.query(query, updateValues);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            message: 'Profile updated successfully',
            user: result.rows[0]
        });
    } catch (error) {
        console.error('Update specific user profile error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get specific user's health records (for admin use)
router.get('/:id/health-records', authenticateToken, async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if current user is admin
        const currentUserResult = await pool.query(
            'SELECT get_user_role(id) as role FROM users WHERE id = $1',
            [req.user.userId]
        );
        
        if (currentUserResult.rows.length === 0 || currentUserResult.rows[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required'
            });
        }
        
        // Get the target user's health records
        const result = await pool.query(
            `SELECT 
                id, date, weight, height, age, body_fat_percentage, 
                muscle_mass, bone_mass, bmi, kcal, 
                metabolic_age, water_percentage, visceral_fat,
                fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk,
                created_at, updated_at
            FROM health_records 
            WHERE user_id = $1 
            ORDER BY date DESC`,
            [userId]
        );

        res.json({
            records: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('Get specific user health records error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, name, address, tax_id, height, TO_CHAR(birthday, \'YYYY-MM-DD\') as birthday, phone, created_at, get_user_role(id) as role FROM users WHERE id = $1',
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

// Update user profile (simple version)
router.put('/profile', authenticateToken, async (req, res) => {
    try {
        // Accept all possible fields from frontend
        const { name, email, address, taxId, height, birthday, phone } = req.body;

        // Basic validation
        if (!name) {
            return res.status(400).json({
                error: 'Name is required'
            });
        }

        // Update user with all provided fields
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        if (name) {
            updateFields.push(`name = $${paramCount}`);
            updateValues.push(name);
            paramCount++;
        }
        if (email) {
            updateFields.push(`email = $${paramCount}`);
            updateValues.push(email);
            paramCount++;
        }
        if (address) {
            updateFields.push(`address = $${paramCount}`);
            updateValues.push(address);
            paramCount++;
        }
        if (taxId) {
            updateFields.push(`tax_id = $${paramCount}`);
            updateValues.push(taxId);
            paramCount++;
        }
        if (height) {
            updateFields.push(`height = $${paramCount}`);
            updateValues.push(height);
            paramCount++;
        }
        if (birthday) {
            updateFields.push(`birthday = $${paramCount}`);
            updateValues.push(birthday);
            paramCount++;
        }
        if (phone) {
            updateFields.push(`phone = $${paramCount}`);
            updateValues.push(phone);
            paramCount++;
        }

        // Add user ID for WHERE clause
        updateValues.push(req.user.userId);

        const query = `
            UPDATE users 
            SET ${updateFields.join(', ')}, updated_at = NOW()
            WHERE id = $${paramCount}
            RETURNING id, email, name, address, tax_id, height, TO_CHAR(birthday, 'YYYY-MM-DD') as birthday, phone, created_at, updated_at
        `;

        const result = await pool.query(query, updateValues);

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

// Get user settings
router.get('/settings', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM user_settings WHERE user_id = $1',
            [req.user.userId]
        );

        res.json({
            settings: result.rows[0] || {}
        });

    } catch (error) {
        console.error('Get user settings error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update user settings
router.put('/settings', authenticateToken, async (req, res) => {
    try {
        const { address, taxId, height } = req.body;

        // Check if settings exist
        const existingSettings = await pool.query(
            'SELECT * FROM user_settings WHERE user_id = $1',
            [req.user.userId]
        );

        if (existingSettings.rows.length > 0) {
            // Update existing settings
            const result = await pool.query(
                `UPDATE user_settings 
                 SET address = $1, tax_id = $2, height = $3, updated_at = NOW()
                 WHERE user_id = $4
                 RETURNING *`,
                [address, taxId, height, req.user.userId]
            );

            res.json({
                message: 'Settings updated successfully',
                settings: result.rows[0]
            });
        } else {
            // Create new settings
            const result = await pool.query(
                `INSERT INTO user_settings (user_id, address, tax_id, height)
                 VALUES ($1, $2, $3, $4)
                 RETURNING *`,
                [req.user.userId, address, taxId, height]
            );

            res.json({
                message: 'Settings created successfully',
                settings: result.rows[0]
            });
        }

    } catch (error) {
        console.error('Update user settings error:', error);
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