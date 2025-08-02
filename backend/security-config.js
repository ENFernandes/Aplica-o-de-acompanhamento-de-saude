// Security Configuration for Health Tracker
// This file contains security settings for production use

module.exports = {
    // Password requirements
    password: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxLength: 128
    },

    // JWT settings
    jwt: {
        secret: process.env.JWT_SECRET || 'health-tracker-super-secret-jwt-key-2024-change-this-immediately',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        refreshExpiresIn: '30d'
    },

    // Rate limiting
    rateLimit: {
        windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
        max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.'
    },

    // Session settings
    session: {
        timeout: parseInt(process.env.SESSION_TIMEOUT) || 24 * 60 * 60 * 1000, // 24 hours
        refreshThreshold: 60 * 60 * 1000 // 1 hour before expiry
    },

    // Email settings
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    },

    // CORS settings
    cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:8000',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Database security
    database: {
        maxConnections: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
    },

    // Validation rules
    validation: {
        email: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
        }
    }
}; 