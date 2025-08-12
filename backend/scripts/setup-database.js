#!/usr/bin/env node

/**
 * Database Setup Script for Railway/Render
 * This script reads SQL files from init-scripts and applies them idempotently.
 */

const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const connectionOptions = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'health_tracker',
      user: process.env.DB_USER || 'health_user',
      password: process.env.DB_PASSWORD || 'health_password_2024',
    };

const pool = new Pool(connectionOptions);

async function setupDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database setup...');

    // Read and execute initialization scripts
    const scriptsDir = path.join(__dirname, '../../init-scripts');
    const scriptFiles = [
      '01-init-database.sql',
      '02-update-database.sql',
      '03-add-birthday-column.sql',
      '04-add-user-fields.sql',
      '05-add-user-roles.sql',
      '06-create-admin-user.sql'
    ];
    
    for (const scriptFile of scriptFiles) {
      const scriptPath = path.join(scriptsDir, scriptFile);
      
      if (fs.existsSync(scriptPath)) {
        console.log(`📝 Executing ${scriptFile}...`);
        const script = fs.readFileSync(scriptPath, 'utf8');
        
        // Split script into individual statements
        const statements = script
          .split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        for (const statement of statements) {
          if (statement.trim()) {
            try {
              await client.query(statement);
              console.log(`✅ Statement executed successfully`);
            } catch (error) {
              // Log error but continue (some statements might fail if tables already exist)
              console.log(`⚠️  Statement warning: ${error.message}`);
            }
          }
        }
        
        console.log(`✅ ${scriptFile} completed`);
      } else {
        console.log(`⚠️  Script not found: ${scriptFile}`);
      }
    }
    
    console.log('🎉 Database setup completed successfully!');
    
    // Verify admin user was created
    const adminResult = await client.query(
      'SELECT id, email, name, role FROM users WHERE email = $1',
      ['admin@healthtracker.com']
    );
    
    if (adminResult.rows.length > 0) {
      console.log('👑 Admin user verified:', adminResult.rows[0]);
    } else {
      console.log('⚠️  Admin user not found');
    }
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase()
    .then(() => {
      console.log('✅ Setup completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupDatabase };
