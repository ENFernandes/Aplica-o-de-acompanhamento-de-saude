const { Pool } = require('pg');

// Database configuration - prioritize DATABASE_URL for Railway deployment
let pool;

if (process.env.DATABASE_URL) {
    // Use DATABASE_URL for Railway deployment
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
} else {
    // Fallback to individual environment variables for local development
    pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'health_tracker',
        user: process.env.DB_USER || 'health_user',
        password: process.env.DB_PASSWORD || 'health_password_2024',
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
    });
}

// Test database connection
async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        console.log('✅ Database connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection error:', error);
        return false;
    }
}

// Initialize database connection
async function initializeDatabase() {
    try {
        await testDatabaseConnection();
        // Database connected successfully
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    // Shutting down database connections...
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    // Shutting down database connections...
    await pool.end();
    process.exit(0);
});

module.exports = {
    pool,
    testDatabaseConnection,
    initializeDatabase
}; 