const express = require('express');
const router = express.Router();
const { pool } = require('../config/database');

// Public settings endpoint – exposes only safe fields
router.get('/settings', async (req, res) => {
  try {
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_settings (
        id SERIAL PRIMARY KEY,
        setting_key VARCHAR(255) UNIQUE NOT NULL,
        setting_value TEXT,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Fetch whatsappNumber only
    const result = await pool.query(
      'SELECT setting_value FROM admin_settings WHERE setting_key = $1',
      ['whatsappNumber']
    );

    let whatsappNumber = null;
    if (result.rows.length > 0) {
      try {
        whatsappNumber = JSON.parse(result.rows[0].setting_value);
      } catch (e) {
        whatsappNumber = result.rows[0].setting_value;
      }
    }

    res.json({ settings: { whatsappNumber } });
  } catch (error) {
    console.error('Public settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;


