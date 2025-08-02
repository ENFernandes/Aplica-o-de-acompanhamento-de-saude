// Test middleware loading
console.log('Testing middleware loading...');

try {
    const authMiddleware = require('./middleware/auth');
    console.log('✅ Auth middleware loaded successfully');
    console.log('Available functions:', Object.keys(authMiddleware));
} catch (error) {
    console.error('❌ Error loading auth middleware:', error.message);
}

try {
    const securityConfig = require('./security-config');
    console.log('✅ Security config loaded successfully');
    console.log('Available configs:', Object.keys(securityConfig));
} catch (error) {
    console.error('❌ Error loading security config:', error.message);
}

try {
    const authRoutes = require('./routes/auth');
    console.log('✅ Auth routes loaded successfully');
} catch (error) {
    console.error('❌ Error loading auth routes:', error.message);
}

console.log('Middleware test completed'); 