// Main application entry point

// Global variables to store app instances
let globalAppService = null;
let globalAuthManager = null;

// Global function to reload data when user logs in from another page
window.reloadHealthData = async function() {
    if (globalAppService) {
        await globalAppService.loadHealthData();
    } else {
        // AppService not initialized
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
        globalAppService.chartService.initializeCharts();
        globalAppService.chartService.updateCharts(globalAppService.localHealthRecords);
    } else {
        // Chart service not available
    }
};

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    
    try {
        
        // Import modules dynamically
        const { AppService } = await import('./appService.js');
        const { AuthManager } = await import('./authManager.js');
        const { ProfilePopulatorService } = await import('./profilePopulator.js');

        // Initialize auth manager first
        globalAuthManager = new AuthManager();
        
        // Initialize app service
        globalAppService = new AppService();
        globalAppService.setupEventListeners();
        
        // Initialize profile populator service
        const profilePopulator = new ProfilePopulatorService();
        
        // Check authentication status
        const authResult = await globalAuthManager.checkAuthStatus();
        
        if (authResult.isAuthenticated) {
            
            // Check if we have a UserActive set (from BackOffice)
            const userActive = localStorage.getItem('userActive');
            // AuthManager handles loading the user profile when userActive exists
            
            await globalAppService.initialize();
        } else {
            window.location.href = 'login.html';
        }
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
    const dateInput = document.getElementById('date');
    if (dateInput) {
        dateInput.value = new Date().toISOString().split('T')[0];
    }
    
    // Set height and age from user profile if available
    try {
        const { UIService } = await import('./uiService.js');
        const uiService = new UIService();
        await uiService.populateHeightAndAge();
    } catch (error) {
        console.error('Could not populate height/age from profile:', error);
    }
    
    // Check if user just logged in and reload data
    const token = localStorage.getItem('auth-token');
    if (token && globalAppService) {
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
    
    // Only show content if loading indicator is still visible (meaning main flow didn't complete)
    if (loadingIndicator && !loadingIndicator.classList.contains('hidden')) {
        loadingIndicator.classList.add('hidden');
        
        if (mainContent) {
        mainContent.classList.remove('hidden');
        }
        if (appArea) {
            appArea.classList.remove('hidden');
        }
    } else {
        // main flow completed
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
            return true;
        } else {
            localStorage.removeItem('auth-token');
            return false;
        }
    } catch (error) {
        localStorage.removeItem('auth-token');
        return false;
    }
};

// Global logout function
window.logout = function() {
    localStorage.removeItem('auth-token');
    window.location.href = 'login.html';
}; 