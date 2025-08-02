const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const securityConfig = require('../security-config');

// Middleware to authenticate JWT tokens
const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                error: 'Access token required',
                code: 'NO_TOKEN'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, securityConfig.jwt.secret);
        
        // Check if user still exists in database
        const user = await pool.query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [decoded.userId]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({
                error: 'User no longer exists',
                code: 'USER_NOT_FOUND'
            });
        }

        // Add user info to request
        req.user = user.rows[0];
        next();

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Invalid token',
                code: 'INVALID_TOKEN'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                code: 'TOKEN_EXPIRED'
            });
        }

        console.error('Authentication error:', error);
        return res.status(500).json({
            error: 'Authentication failed',
            code: 'AUTH_ERROR'
        });
    }
};

// Middleware to check if user is the owner of the resource
const authorizeUser = (resourceUserIdField = 'user_id') => {
    return (req, res, next) => {
        const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
        
        if (!resourceUserId) {
            return res.status(400).json({
                error: 'Resource user ID required',
                code: 'MISSING_USER_ID'
            });
        }

        if (req.user.id !== resourceUserId) {
            return res.status(403).json({
                error: 'Access denied',
                code: 'ACCESS_DENIED'
            });
        }

        next();
    };
};

// Middleware to validate password strength
const validatePassword = (req, res, next) => {
    const { password } = req.body;
    
    if (!password) {
        return res.status(400).json({
            error: 'Password is required',
            code: 'MISSING_PASSWORD'
        });
    }

    const { password: passwordConfig } = securityConfig;
    
    // Check minimum length
    if (password.length < passwordConfig.minLength) {
        return res.status(400).json({
            error: `Password must be at least ${passwordConfig.minLength} characters long`,
            code: 'PASSWORD_TOO_SHORT'
        });
    }

    // Check maximum length
    if (password.length > passwordConfig.maxLength) {
        return res.status(400).json({
            error: `Password must be no more than ${passwordConfig.maxLength} characters long`,
            code: 'PASSWORD_TOO_LONG'
        });
    }

    // Check for uppercase letters
    if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
        return res.status(400).json({
            error: 'Password must contain at least one uppercase letter',
            code: 'PASSWORD_NO_UPPERCASE'
        });
    }

    // Check for lowercase letters
    if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
        return res.status(400).json({
            error: 'Password must contain at least one lowercase letter',
            code: 'PASSWORD_NO_LOWERCASE'
        });
    }

    // Check for numbers
    if (passwordConfig.requireNumbers && !/\d/.test(password)) {
        return res.status(400).json({
            error: 'Password must contain at least one number',
            code: 'PASSWORD_NO_NUMBER'
        });
    }

    // Check for special characters
    if (passwordConfig.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return res.status(400).json({
            error: 'Password must contain at least one special character',
            code: 'PASSWORD_NO_SPECIAL_CHAR'
        });
    }

    next();
};

// Middleware to validate email format
const validateEmail = (req, res, next) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({
            error: 'Email is required',
            code: 'MISSING_EMAIL'
        });
    }

    const emailPattern = securityConfig.validation.email.pattern;
    
    if (!emailPattern.test(email)) {
        return res.status(400).json({
            error: securityConfig.validation.email.message,
            code: 'INVALID_EMAIL'
        });
    }

    next();
};

// Middleware to validate name format
const validateName = (req, res, next) => {
    const { name } = req.body;
    
    if (!name) {
        return res.status(400).json({
            error: 'Name is required',
            code: 'MISSING_NAME'
        });
    }

    const { name: nameConfig } = securityConfig.validation;
    
    if (name.length < nameConfig.minLength || name.length > nameConfig.maxLength) {
        return res.status(400).json({
            error: `Name must be between ${nameConfig.minLength} and ${nameConfig.maxLength} characters`,
            code: 'INVALID_NAME_LENGTH'
        });
    }

    if (!nameConfig.pattern.test(name)) {
        return res.status(400).json({
            error: nameConfig.message,
            code: 'INVALID_NAME_FORMAT'
        });
    }

    next();
};

// Middleware to check if user is admin (optional)
const requireAdmin = async (req, res, next) => {
    try {
        // Check if user has admin role (you can add a role field to users table)
        const user = await pool.query(
            'SELECT role FROM users WHERE id = $1',
            [req.user.id]
        );

        if (user.rows.length === 0 || user.rows[0].role !== 'admin') {
            return res.status(403).json({
                error: 'Admin access required',
                code: 'ADMIN_REQUIRED'
            });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).json({
            error: 'Admin verification failed',
            code: 'ADMIN_CHECK_ERROR'
        });
    }
};

module.exports = {
    authenticateToken,
    authorizeUser,
    validatePassword,
    validateEmail,
    validateName,
    requireAdmin
}; 