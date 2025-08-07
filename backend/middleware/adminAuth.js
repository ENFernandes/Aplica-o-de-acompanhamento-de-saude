const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware to require admin access
const requireAdmin = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de acesso necessário' });
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, 'health-tracker-secret-key');
        
        // Check if user exists and is admin
        const result = await pool.query(
            'SELECT u.*, get_user_role(u.id) as role FROM users u WHERE u.id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilizador não encontrado' });
        }

        const user = result.rows[0];
        
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Acesso de administrador necessário' });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Admin auth error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Middleware to check admin status
const checkAdminStatus = async (req, res, next) => {
    try {
        // Get token from header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token de acesso necessário' });
        }

        const token = authHeader.substring(7);

        // Verify token
        const decoded = jwt.verify(token, 'health-tracker-secret-key');
        
        // Check if user exists and get role
        const result = await pool.query(
            'SELECT u.*, get_user_role(u.id) as role FROM users u WHERE u.id = $1',
            [decoded.userId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Utilizador não encontrado' });
        }

        const user = result.rows[0];
        
        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Admin status check error:', error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }
        return res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

// Helper function to check if user is admin
const isAdmin = async (userId) => {
    try {
        const result = await pool.query(
            'SELECT get_user_role($1) as role',
            [userId]
        );
        return result.rows[0]?.role === 'admin';
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
};

// Helper function to promote user to admin
const promoteToAdmin = async (userId) => {
    try {
        await pool.query(
            'SELECT set_user_role($1, $2)',
            [userId, 'admin']
        );
        return true;
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        return false;
    }
};

// Helper function to demote user from admin
const demoteFromAdmin = async (userId) => {
    try {
        await pool.query(
            'SELECT set_user_role($1, $2)',
            [userId, 'customer']
        );
        return true;
    } catch (error) {
        console.error('Error demoting user from admin:', error);
        return false;
    }
};

module.exports = {
    requireAdmin,
    checkAdminStatus,
    isAdmin,
    promoteToAdmin,
    demoteFromAdmin
}; 