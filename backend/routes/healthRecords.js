const express = require('express');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { validateHealthRecord } = require('../middleware/validation');

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
        const decoded = jwt.verify(token, 'health-tracker-secret-key');
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({
            error: 'Invalid or expired token'
        });
    }
};

// Get all health records for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                id, date, weight, height, age, body_fat_percentage, 
                body_fat_kg, muscle_mass, bone_mass, bmi, kcal, 
                metabolic_age, water_percentage, visceral_fat,
                fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk,
                created_at, updated_at
            FROM health_records 
            WHERE user_id = $1 
            ORDER BY date DESC`,
            [req.user.userId]
        );

        res.json({
            records: result.rows,
            count: result.rows.length
        });

    } catch (error) {
        console.error('Get health records error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get a specific health record
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `SELECT 
                id, date, weight, height, age, body_fat_percentage, 
                body_fat_kg, muscle_mass, bone_mass, bmi, kcal, 
                metabolic_age, water_percentage, visceral_fat,
                fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk,
                created_at, updated_at
            FROM health_records 
            WHERE id = $1 AND user_id = $2`,
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Health record not found'
            });
        }

        res.json({
            record: result.rows[0]
        });

    } catch (error) {
        console.error('Get health record error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Create a new health record
router.post('/', authenticateToken, validateHealthRecord, async (req, res) => {
    try {
        const {
            date, weight, height, age, body_fat_percentage, body_fat_kg,
            muscle_mass, bone_mass, bmi, kcal, metabolic_age, water_percentage,
            visceral_fat, fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk
        } = req.body;

        // Check if record for this date already exists
        const existingRecord = await pool.query(
            'SELECT id FROM health_records WHERE user_id = $1 AND date = $2',
            [req.user.userId, date]
        );

        if (existingRecord.rows.length > 0) {
            return res.status(409).json({
                error: 'A health record for this date already exists'
            });
        }

        const result = await pool.query(
            `INSERT INTO health_records (
                user_id, date, weight, height, age, body_fat_percentage, 
                body_fat_kg, muscle_mass, bone_mass, bmi, kcal, 
                metabolic_age, water_percentage, visceral_fat,
                fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
            RETURNING *`,
            [
                req.user.userId, date, weight, height, age, body_fat_percentage,
                body_fat_kg, muscle_mass, bone_mass, bmi, kcal, metabolic_age,
                water_percentage, visceral_fat, fat_right_arm, fat_left_arm,
                fat_right_leg, fat_left_leg, fat_trunk
            ]
        );

        res.status(201).json({
            message: 'Health record created successfully',
            record: result.rows[0]
        });

    } catch (error) {
        console.error('Create health record error:', error);
        
        if (error.message.includes('BMI value is inconsistent')) {
            return res.status(400).json({
                error: 'BMI value is inconsistent with weight and height'
            });
        }
        
        if (error.message.includes('Body fat percentage is inconsistent')) {
            return res.status(400).json({
                error: 'Body fat percentage is inconsistent with weight and body fat kg'
            });
        }
        
        if (error.message.includes('Component masses exceed total weight')) {
            return res.status(400).json({
                error: 'Component masses exceed total weight'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Update a health record
router.put('/:id', authenticateToken, validateHealthRecord, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            date, weight, height, age, body_fat_percentage, body_fat_kg,
            muscle_mass, bone_mass, bmi, kcal, metabolic_age, water_percentage,
            visceral_fat, fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk
        } = req.body;

        // Check if record exists and belongs to user
        const existingRecord = await pool.query(
            'SELECT id FROM health_records WHERE id = $1 AND user_id = $2',
            [id, req.user.userId]
        );

        if (existingRecord.rows.length === 0) {
            return res.status(404).json({
                error: 'Health record not found'
            });
        }

        // Check if date conflicts with another record (excluding current record)
        const dateConflict = await pool.query(
            'SELECT id FROM health_records WHERE user_id = $1 AND date = $2 AND id != $3',
            [req.user.userId, date, id]
        );

        if (dateConflict.rows.length > 0) {
            return res.status(409).json({
                error: 'A health record for this date already exists'
            });
        }

        const result = await pool.query(
            `UPDATE health_records SET 
                date = $1, weight = $2, height = $3, age = $4, body_fat_percentage = $5,
                body_fat_kg = $6, muscle_mass = $7, bone_mass = $8, bmi = $9, kcal = $10,
                metabolic_age = $11, water_percentage = $12, visceral_fat = $13,
                fat_right_arm = $14, fat_left_arm = $15, fat_right_leg = $16, fat_left_leg = $17, fat_trunk = $18
            WHERE id = $19 AND user_id = $20
            RETURNING *`,
            [
                date, weight, height, age, body_fat_percentage, body_fat_kg,
                muscle_mass, bone_mass, bmi, kcal, metabolic_age, water_percentage,
                visceral_fat, fat_right_arm, fat_left_arm, fat_right_leg, fat_left_leg, fat_trunk,
                id, req.user.userId
            ]
        );

        res.json({
            message: 'Health record updated successfully',
            record: result.rows[0]
        });

    } catch (error) {
        console.error('Update health record error:', error);
        
        if (error.message.includes('BMI value is inconsistent')) {
            return res.status(400).json({
                error: 'BMI value is inconsistent with weight and height'
            });
        }
        
        if (error.message.includes('Body fat percentage is inconsistent')) {
            return res.status(400).json({
                error: 'Body fat percentage is inconsistent with weight and body fat kg'
            });
        }
        
        if (error.message.includes('Component masses exceed total weight')) {
            return res.status(400).json({
                error: 'Component masses exceed total weight'
            });
        }

        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Delete a health record
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM health_records WHERE id = $1 AND user_id = $2 RETURNING id',
            [id, req.user.userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: 'Health record not found'
            });
        }

        res.json({
            message: 'Health record deleted successfully'
        });

    } catch (error) {
        console.error('Delete health record error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Get health statistics for the user
router.get('/stats/summary', authenticateToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT 
                COUNT(*) as total_records,
                MIN(date) as first_record_date,
                MAX(date) as last_record_date,
                AVG(weight) as avg_weight,
                MIN(weight) as min_weight,
                MAX(weight) as max_weight,
                AVG(body_fat_percentage) as avg_body_fat,
                AVG(muscle_mass) as avg_muscle_mass,
                AVG(bmi) as avg_bmi
            FROM health_records 
            WHERE user_id = $1`,
            [req.user.userId]
        );

        res.json({
            stats: result.rows[0]
        });

    } catch (error) {
        console.error('Get health stats error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router; 