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
                error: 'Email, password e nome são obrigatórios'
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                error: 'A password deve ter pelo menos 6 caracteres'
            });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: 'Email já registado'
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
            message: 'Utilizador registado com sucesso',
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
            error: 'Erro interno do servidor'
        });
    }
});

// Simple login route without middleware
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e password são obrigatórios'
            });
        }

        // Find user by email
        const user = await pool.query(
            'SELECT id, email, name, password_hash, get_user_role(id) as role FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({
                error: 'Email ou password inválidos'
            });
        }

        const userData = user.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, userData.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Email ou password inválidos'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: userData.id, email: userData.email, role: userData.role },
            'health-tracker-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login realizado com sucesso',
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                role: userData.role
            },
            token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token de acesso obrigatório' });
    }

    jwt.verify(token, 'health-tracker-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token inválido ou expirado' });
        }
        req.user = user;
        next();
    });
};

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId;
        
        const user = await pool.query(
            'SELECT id, email, name, created_at, get_user_role(id) as role FROM users WHERE id = $1',
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ error: 'Utilizador não encontrado' });
        }

        res.json({
            success: true,
            data: {
                user: {
                    id: user.rows[0].id,
                    email: user.rows[0].email,
                    name: user.rows[0].name,
                    role: user.rows[0].role,
                    created_at: user.rows[0].created_at
                }
            }
        });

    } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router; 