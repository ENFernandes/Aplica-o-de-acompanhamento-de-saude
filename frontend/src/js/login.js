/**
 * Login Page JavaScript
 * Handles authentication, form management, and UI interactions
 */

// Global variables for auth services
let authService = null;
let authManager = null;

/**
 * Initialize authentication services
 */
async function initializeAuth() {
    try {
        const { AuthService } = await import('./authService.js');
        const { AuthManager } = await import('./authManager.js');
        
        authService = new AuthService();
        authManager = new AuthManager(authService);

        // Check if user is already authenticated
        const token = localStorage.getItem('auth-token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                
                if (payload.exp && payload.exp > currentTime && payload.userId && payload.email) {
                    // User is already authenticated, redirect to main app
                    window.location.href = 'personalArea.html';
                    return;
                }
            } catch (error) {
                // Invalid token, clear it
                localStorage.removeItem('auth-token');
            }
        }

        // Setup form handlers with auth services
        setupFormHandlers();
    } catch (error) {
        console.error('Failed to initialize auth services:', error);
        showStatus('Erro ao carregar serviços de autenticação', 'error');
    }
}

/**
 * Setup form event handlers
 */
function setupFormHandlers() {
    // Login form handler
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Remove any existing listeners first
        loginForm.removeEventListener('submit', handleLogin);
        loginForm.addEventListener('submit', handleLogin);
    }

    // Registration form handler
    const registrationForm = document.getElementById('registration-form');
    if (registrationForm) {
        // Remove any existing listeners first
        registrationForm.removeEventListener('submit', handleRegistration);
        registrationForm.addEventListener('submit', handleRegistration);
    }
}

/**
 * Handle login form submission
 */
async function handleLogin(e) {
    if (!e || typeof e.preventDefault !== 'function') {
        console.error('Invalid event object:', e);
        return;
    }
    
    e.preventDefault();
    
    if (!authManager) {
        showStatus('Serviços de autenticação não carregados', 'error');
        return;
    }
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('login-btn');

    loginBtn.disabled = true;
    loginBtn.textContent = 'Entrando...';

    try {
        await authManager.handleLogin(email, password);
        // On successful login, redirect to main app
        window.location.href = 'personalArea.html';
    } catch (error) {
        console.error('Login error:', error);
        showStatus('Erro no login: ' + error.message, 'error');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Entrar';
    }
}

/**
 * Handle registration form submission
 */
async function handleRegistration(e) {
    if (!e || typeof e.preventDefault !== 'function') {
        console.error('Invalid event object:', e);
        return;
    }
    
    e.preventDefault();
    
    if (!authService) {
        showStatus('Serviços de autenticação não carregados', 'error');
        return;
    }
    
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const registerBtn = document.getElementById('register-btn');

    registerBtn.disabled = true;
    registerBtn.textContent = 'Criando conta...';

    try {
        await authManager.handleRegister(name, email, password, password);
        showStatus('Conta criada com sucesso! Faça login.', 'success');
        showLogin(); // Switch back to login form
        registerBtn.disabled = false;
        registerBtn.textContent = 'Criar Conta';
    } catch (error) {
        console.error('Registration error:', error);
        showStatus('Erro ao criar conta: ' + error.message, 'error');
        registerBtn.disabled = false;
        registerBtn.textContent = 'Criar Conta';
    }
}

/**
 * Show registration form
 */
function showRegistration() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('registration-form').classList.remove('hidden');
    document.getElementById('back-to-login').classList.remove('hidden');
    document.querySelector('button[onclick="showRegistration()"]').parentElement.classList.add('hidden');
}

/**
 * Show login form
 */
function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('registration-form').classList.add('hidden');
    document.getElementById('back-to-login').classList.add('hidden');
    document.querySelector('button[onclick="showRegistration()"]').parentElement.classList.remove('hidden');
}

/**
 * Show status message
 */
function showStatus(message, type) {
    console.log('Showing status:', message, type);
    const statusDiv = document.getElementById('status-message');
    if (statusDiv) {
        statusDiv.textContent = message;
        statusDiv.className = `status-message ${type === 'error' ? 'error' : 'success'}`;
        statusDiv.classList.remove('hidden');
        
        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 5000);
    } else {
        console.error('Status message div not found');
    }
}

/**
 * Initialize when page loads
 */
document.addEventListener('DOMContentLoaded', function() {
    // Initialize auth services immediately
    initializeAuth();
});

// Export functions for global access
window.showRegistration = showRegistration;
window.showLogin = showLogin; 