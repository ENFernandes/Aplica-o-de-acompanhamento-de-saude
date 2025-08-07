// Main application entry point
console.log('main.js loaded');

// Global variables to store app instances
let globalAppService = null;
let globalAuthManager = null;

// Global function to reload data when user logs in from another page
window.reloadHealthData = async function() {
    console.log('🔄 Reloading health data...');
    if (globalAppService) {
        await globalAppService.loadHealthData();
        console.log('✅ Health data reloaded');
    } else {
        console.log('❌ AppService not initialized');
    }
};

// Global function to check if user is authenticated
window.isUserAuthenticated = function() {
    return globalAuthManager ? globalAuthManager.isAuthenticated() : false;
};

// Global logout function for compatibility
window.logout = function() {
    if (globalAuthManager) {
        globalAuthManager.handleLogout();
    }
};

// Global function to test charts
window.testCharts = function() {
    if (globalAppService && globalAppService.chartService) {
        console.log('Testing charts...');
        globalAppService.chartService.initializeCharts();
        globalAppService.chartService.updateCharts(globalAppService.localHealthRecords);
    } else {
        console.log('Chart service not available');
    }
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');
    
    try {
        console.log('DOM loaded, initializing application...');
        
        // Import modules dynamically
        console.log('Importing modules...');
        const { AppService } = await import('./appService.js');
        const { AuthManager } = await import('./authManager.js');

        // Initialize auth manager first
        console.log('Initializing AuthManager...');
        globalAuthManager = new AuthManager();
        
        // Initialize app service
        console.log('Initializing AppService...');
        globalAppService = new AppService();
        globalAppService.setupEventListeners();
        
        // ROBUST AUTHENTICATION CHECK
        console.log('=== ROBUST AUTH CHECK ===');
        
        // Function to validate token without network calls
        function validateTokenLocally(token) {
            try {
                console.log('🔍 Validating token:', !!token);
                if (!token) {
                    console.log('❌ No token provided');
                    return false;
                }
                
                // Check if token has correct format (3 parts)
                const parts = token.split('.');
                console.log('Token parts:', parts.length);
                if (parts.length !== 3) {
                    console.log('❌ Invalid token format (not 3 parts)');
                    return false;
                }
                
                // Decode payload
                const payload = JSON.parse(atob(parts[1]));
                console.log('Token payload:', payload);
                
                // Check expiration
                const currentTime = Math.floor(Date.now() / 1000);
                console.log('Current time:', currentTime);
                console.log('Token expiration:', payload.exp);
                if (!payload.exp || payload.exp <= currentTime) {
                    console.log('❌ Token expired or no expiration');
                    return false;
                }
                
                // Check if token has required fields
                console.log('Token userId:', payload.userId);
                console.log('Token email:', payload.email);
                if (!payload.userId || !payload.email) {
                    console.log('❌ Token missing required fields');
                    return false;
                }
                
                console.log('✅ Token validation successful');
                return true;
            } catch (error) {
                console.log('❌ Token validation error:', error);
                return false;
            }
        }
        
        // Check token immediately
        const token = localStorage.getItem('auth-token');
        console.log('Token exists:', !!token);
        
        if (validateTokenLocally(token)) {
            console.log('✅ Token is valid, initializing app...');
            
            // Hide loading indicator and show main content
            const loadingIndicator = document.getElementById('loading-indicator');
            const mainContent = document.getElementById('main-content');
            const appArea = document.getElementById('app-area');
            
            console.log('Elements found:', {
                loadingIndicator: !!loadingIndicator,
                mainContent: !!mainContent,
                appArea: !!appArea
            });
            
            if (loadingIndicator) {
                console.log('Before: Loading indicator hidden =', loadingIndicator.classList.contains('hidden'));
                loadingIndicator.classList.add('hidden');
                console.log('After: Loading indicator hidden =', loadingIndicator.classList.contains('hidden'));
                console.log('Loading indicator hidden');
            } else {
                console.log('❌ Loading indicator not found!');
            }
            
            if (mainContent) {
                console.log('Before: Main content hidden =', mainContent.classList.contains('hidden'));
                mainContent.classList.remove('hidden');
                console.log('After: Main content hidden =', mainContent.classList.contains('hidden'));
                console.log('Main content shown');
            } else {
                console.log('❌ Main content not found!');
            }
            
            if (appArea) {
                console.log('Before: App area hidden =', appArea.classList.contains('hidden'));
                appArea.classList.remove('hidden');
                console.log('After: App area hidden =', appArea.classList.contains('hidden'));
                console.log('App area shown');
            } else {
                console.log('❌ App area not found!');
            }
            
            // Check auth status and show app with user profile
            const authResult = await globalAuthManager.checkAuthStatus();
            if (authResult.isAuthenticated && authResult.user) {
                console.log('✅ User authenticated, showing app with profile dropdown');
                globalAuthManager.showApp(authResult.user);
            } else {
                console.log('❌ Auth check failed, redirecting to login');
                localStorage.removeItem('auth-token');
                window.location.href = 'login.html';
            }
        } else {
            console.log('❌ Token invalid or missing, redirecting to login...');
            localStorage.removeItem('auth-token');
            
            // Show loading message before redirect
            const loadingIndicator = document.getElementById('loading-indicator');
            if (loadingIndicator) {
                loadingIndicator.innerHTML = `
                    <div class="text-center">
                        <div class="text-blue-500 text-6xl mb-4">🔐</div>
                        <h2 class="text-xl font-bold text-gray-800 mb-2">Verificando autenticação...</h2>
                        <p class="text-gray-600 mb-4">A redirecionar para a página de login...</p>
                        <div class="mt-4">
                            <a href="login.html" class="text-blue-600 hover:text-blue-800 underline">
                                Clique aqui se não for redirecionado automaticamente
                            </a>
                        </div>
                    </div>
                `;
            }
            
            // Redirect to login page after a short delay
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
        
        console.log('Application initialization complete');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        
        // Show error message to user
        const loadingIndicator = document.getElementById('loading-indicator');
        
        if (loadingIndicator) {
            loadingIndicator.innerHTML = `
                <div class="text-center">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 class="text-xl font-bold text-gray-800 mb-2">Erro ao carregar a aplicação</h2>
                    <p class="text-gray-600 mb-4">Ocorreu um erro inesperado. Por favor, recarregue a página.</p>
                    <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Recarregar Página
                    </button>
                </div>
            `;
        }
    }
});

// Set current date in date input on page load
window.addEventListener('load', async () => {
    console.log('Window loaded');
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
        console.log('Date input set to current date');
    }
    
    // Set height and age from user profile if available
    try {
        const { UIService } = await import('./uiService.js');
        const uiService = new UIService();
        await uiService.populateHeightAndAge();
    } catch (error) {
        console.log('Could not populate height/age from profile:', error);
    }
    
    // Check if user just logged in and reload data
    const token = localStorage.getItem('auth-token');
    if (token && globalAppService) {
        console.log('🔄 User has token, reloading data...');
        setTimeout(async () => {
            await globalAppService.loadHealthData();
        }, 1000);
    }
});

// Fallback: If nothing else works, show a basic message (increased timeout to 10 seconds)
setTimeout(() => {
    const mainContent = document.getElementById('main-content');
    const loadingIndicator = document.getElementById('loading-indicator');
    const appArea = document.getElementById('app-area');
    
    console.log('Fallback timeout triggered (10 seconds)');
    console.log('Loading indicator:', loadingIndicator);
    console.log('Main content:', mainContent);
    console.log('App area:', appArea);
    
    // Only show content if loading indicator is still visible (meaning main flow didn't complete)
    if (loadingIndicator && !loadingIndicator.classList.contains('hidden')) {
        console.log('Fallback: Loading indicator still visible after 10s, showing content');
        loadingIndicator.classList.add('hidden');
        console.log('Fallback: Loading indicator hidden');
        
        if (mainContent) {
        mainContent.classList.remove('hidden');
            console.log('Fallback: Main content shown');
        }
        if (appArea) {
            appArea.classList.remove('hidden');
            console.log('Fallback: App area shown');
        }
        
        console.log('Fallback: Basic content should now be visible');
    } else {
        console.log('Fallback: Loading indicator already hidden or not found, main flow completed successfully');
    }
}, 10000); // Increased from 5000 to 10000ms

// Global functions for external access
window.reloadHealthData = function() {
    if (globalAppService) {
        globalAppService.loadHealthData();
    }
};

window.isUserAuthenticated = function() {
    const token = localStorage.getItem('auth-token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp && payload.exp > currentTime;
    } catch (error) {
        return false;
    }
};

// Global authentication check function
window.checkAuthAndRedirect = function() {
    const token = localStorage.getItem('auth-token');
    if (!token) return false;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Math.floor(Date.now() / 1000);
        
        if (payload.exp && payload.exp > currentTime && payload.userId && payload.email) {
            console.log('✅ Valid token found, staying on current page');
            return true;
        } else {
            console.log('❌ Invalid token, redirecting to login');
            localStorage.removeItem('auth-token');
            return false;
        }
    } catch (error) {
        console.log('❌ Token validation error, redirecting to login');
        localStorage.removeItem('auth-token');
        return false;
    }
};

// Global logout function
window.logout = function() {
    localStorage.removeItem('auth-token');
    window.location.href = 'login.html';
}; 