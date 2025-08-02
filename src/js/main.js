// Main application entry point
console.log('main.js loaded');

import { AppService } from './appService.js';
import { AuthManager } from './authManager.js';

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM loaded, starting initialization...');
    
    try {
        console.log('DOM loaded, initializing application...');
        
        // Hide loading indicator
        const loadingIndicator = document.getElementById('loading-indicator');
        const mainContent = document.getElementById('main-content');
        
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
            console.log('Loading indicator hidden');
        }
        if (mainContent) {
            mainContent.classList.remove('hidden');
            console.log('Main content shown');
        }

        // Initialize auth manager first
        console.log('Initializing AuthManager...');
        const authManager = new AuthManager();
        
        // Wait for auth manager to initialize
        console.log('Checking auth status...');
        await authManager.checkAuthStatus();
        
        // Initialize app service
        console.log('Initializing AppService...');
        const app = new AppService();
        app.setupEventListeners();
        
        // Check if user is authenticated
        if (authManager.isAuthenticated()) {
            console.log('User is authenticated, initializing app...');
            await app.initialize();
        } else {
            console.log('User not authenticated, login form should be shown');
            // Force show login form as fallback
            setTimeout(() => {
                const authArea = document.getElementById('auth-area');
                const appArea = document.getElementById('app-area');
                
                if (authArea && authArea.classList.contains('hidden')) {
                    console.log('Forcing login form to show...');
                    authManager.showLogin();
                }
            }, 1000);
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
});

// Fallback: If nothing else works, show a basic message
setTimeout(() => {
    const mainContent = document.getElementById('main-content');
    const loadingIndicator = document.getElementById('loading-indicator');
    
    if (mainContent && mainContent.classList.contains('hidden') && loadingIndicator && !loadingIndicator.classList.contains('hidden')) {
        console.log('Fallback: Showing basic content');
        loadingIndicator.classList.add('hidden');
        mainContent.classList.remove('hidden');
        
        // Show a simple login form
        const authArea = document.getElementById('auth-area');
        if (authArea) {
            authArea.innerHTML = `
                <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                    <div class="max-w-md w-full space-y-8">
                        <div>
                            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Health Tracker Login
                            </h2>
                            <p class="mt-2 text-center text-sm text-gray-600">
                                Use: test@healthtracker.com / password123
                            </p>
                        </div>
                        <form class="mt-8 space-y-6" id="simple-login-form">
                            <div>
                                <input type="email" name="email" placeholder="Email" required 
                                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm">
                            </div>
                            <div>
                                <input type="password" name="password" placeholder="Password" required 
                                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm">
                            </div>
                            <div>
                                <button type="submit" 
                                    class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            `;
            authArea.classList.remove('hidden');
        }
    }
}, 3000); 