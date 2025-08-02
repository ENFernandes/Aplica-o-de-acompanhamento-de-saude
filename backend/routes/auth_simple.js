const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

const router = express.Router();

// Simple register route without middleware
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Basic validation
        if (!email || !password || !name) {
            return res.status(400).json({
                error: 'Email, password, and name are required'
            });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: 'Email already registered'
            });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = await pool.query(
            'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, name, passwordHash]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id, email },
            'health-tracker-secret-key',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.rows[0].id,
                email: newUser.rows[0].email,
                name: newUser.rows[0].name
            },
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

// Simple login route without middleware
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        // Find user by email
        const user = await pool.query(
            'SELECT id, email, name, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const userData = user.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, userData.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: userData.id, email: userData.email },
            'health-tracker-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Internal server error'
        });
    }
});

module.exports = router; 