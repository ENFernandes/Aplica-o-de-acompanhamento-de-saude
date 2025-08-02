const { Pool } = require('pg');

// Database configuration
const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || 'health_tracker',
    user: process.env.DB_USER || 'health_user',
    password: process.env.DB_PASSWORD || 'health_password_2024',
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

// Test database connection
async function testDatabaseConnection() {
    try {
        const client = await pool.connect();
        await client.query('SELECT NOW()');
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

// Initialize database connection
async function initializeDatabase() {
    try {
        await testDatabaseConnection();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('🔄 Shutting down database connections...');
    await pool.end();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('🔄 Shutting down database connections...');
    await pool.end();
    process.exit(0);
});

module.exports = {
    pool,
    testDatabaseConnection,
    initializeDatabase
}; 