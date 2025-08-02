const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const { 
    authenticateToken, 
    validatePassword, 
    validateEmail, 
    validateName 
} = require('../middleware/auth');
const securityConfig = require('../security-config');

const router = express.Router();

// Register new user
router.post('/register', [validateEmail, validateName, validatePassword], async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: 'Email already registered',
                code: 'EMAIL_EXISTS'
            });
        }

        // Hash password with configured salt rounds
        const saltRounds = securityConfig.password.minLength;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await pool.query(
            'INSERT INTO users (email, name, password_hash) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
            [email, name, passwordHash]
        );

        // Generate JWT token
        const token = jwt.sign(
            { userId: newUser.rows[0].id, email },
            securityConfig.jwt.secret,
            { expiresIn: securityConfig.jwt.expiresIn }
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
            error: 'Internal server error',
            code: 'REGISTRATION_ERROR'
        });
    }
});

// Login user
router.post('/login', [validateEmail], async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!password) {
            return res.status(400).json({
                error: 'Password is required',
                code: 'MISSING_PASSWORD'
            });
        }

        // Find user by email
        const user = await pool.query(
            'SELECT id, email, name, password_hash FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({
                error: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        const userData = user.rows[0];

        // Verify password
        const isValidPassword = await bcrypt.compare(password, userData.password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: userData.id, email: userData.email },
            securityConfig.jwt.secret,
            { expiresIn: securityConfig.jwt.expiresIn }
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
            error: 'Internal server error',
            code: 'LOGIN_ERROR'
        });
    }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        res.json({
            user: req.user
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'GET_USER_ERROR'
        });
    }
});

// Logout (client-side token removal)
router.post('/logout', authenticateToken, async (req, res) => {
    // In a real application, you might want to implement token blacklisting
    // For now, we'll just return success as the client will remove the token
    res.json({
        message: 'Logout successful'
    });
});

// Change password
router.post('/change-password', [authenticateToken, validatePassword], async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Get current user with password hash
        const user = await pool.query(
            'SELECT password_hash FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Verify current password
        const isValidPassword = await bcrypt.compare(currentPassword, user.rows[0].password_hash);

        if (!isValidPassword) {
            return res.status(401).json({
                error: 'Current password is incorrect',
                code: 'INVALID_CURRENT_PASSWORD'
            });
        }

        // Hash new password
        const saltRounds = securityConfig.password.minLength;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, req.user.id]
        );

        res.json({
            message: 'Password changed successfully'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'CHANGE_PASSWORD_ERROR'
        });
    }
});

// Forgot password (send reset email)
router.post('/forgot-password', [validateEmail], async (req, res) => {
    try {
        const { email } = req.body;

        // Check if user exists
        const user = await pool.query(
            'SELECT id, name FROM users WHERE email = $1',
            [email]
        );

        if (user.rows.length === 0) {
            // Don't reveal if email exists or not for security
            return res.json({
                message: 'If the email exists, a reset link has been sent'
            });
        }

        // Generate reset token (shorter expiry for security)
        const resetToken = jwt.sign(
            { userId: user.rows[0].id, email, type: 'password_reset' },
            securityConfig.jwt.secret,
            { expiresIn: '1h' }
        );

        // In a real application, you would send an email here
        // For now, we'll just log the token
        console.log(`Password reset token for ${email}: ${resetToken}`);

        res.json({
            message: 'If the email exists, a reset link has been sent'
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'FORGOT_PASSWORD_ERROR'
        });
    }
});

// Reset password with token
router.post('/reset-password', [validatePassword], async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token) {
            return res.status(400).json({
                error: 'Reset token is required',
                code: 'MISSING_TOKEN'
            });
        }

        // Verify reset token
        const decoded = jwt.verify(token, securityConfig.jwt.secret);
        
        if (decoded.type !== 'password_reset') {
            return res.status(400).json({
                error: 'Invalid reset token',
                code: 'INVALID_RESET_TOKEN'
            });
        }

        // Check if user exists
        const user = await pool.query(
            'SELECT id FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({
                error: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }

        // Hash new password
        const saltRounds = securityConfig.password.minLength;
        const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        await pool.query(
            'UPDATE users SET password_hash = $1 WHERE id = $2',
            [newPasswordHash, decoded.userId]
        );

        res.json({
            message: 'Password reset successfully'
        });

    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(400).json({
                error: 'Invalid or expired reset token',
                code: 'INVALID_RESET_TOKEN'
            });
        }

        console.error('Reset password error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'RESET_PASSWORD_ERROR'
        });
    }
});

// Refresh token (optional - for longer sessions)
router.post('/refresh-token', authenticateToken, async (req, res) => {
    try {
        // Generate new token with same user info
        const token = jwt.sign(
            { userId: req.user.id, email: req.user.email },
            securityConfig.jwt.secret,
            { expiresIn: securityConfig.jwt.expiresIn }
        );

        res.json({
            token
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(500).json({
            error: 'Internal server error',
            code: 'REFRESH_TOKEN_ERROR'
        });
    }
});

module.exports = router; 