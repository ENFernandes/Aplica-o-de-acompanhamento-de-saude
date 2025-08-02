// Authentication manager to handle auth flow and UI state
import { AuthService } from './authService.js';
import { AuthComponents } from '../components/authComponents.js';
import { UIService } from './uiService.js';

export class AuthManager {
    constructor() {
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.currentView = 'login'; // login, register, password-recovery, app
        this.isEditingProfile = false;
        
        // Don't call checkAuthStatus here, it will be called from main.js
    }

    bindEvents() {
        // This will be called after initialization
        console.log('AuthManager events bound');
    }

    async checkAuthStatus() {
        try {
            console.log('Checking auth status...');
            const authResult = await this.authService.checkAuthStatus();
            
            if (authResult.isAuthenticated && authResult.user) {
                console.log('User authenticated, showing app');
                this.showApp(authResult.user);
                return true;
            } else {
                console.log('User not authenticated, showing login');
                this.showLogin();
                return false;
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            this.showLogin();
            return false;
        }
    }

    showLogin() {
        console.log('Showing login form');
        this.currentView = 'login';
        const loginHTML = AuthComponents.createLoginForm(
            this.handleLogin.bind(this),
            this.showRegister.bind(this),
            this.showPasswordRecovery.bind(this)
        );
        this.updateMainContent(loginHTML);
        this.attachLoginEvents();
    }

    showRegister() {
        this.currentView = 'register';
        const registerHTML = AuthComponents.createRegisterForm(
            this.handleRegister.bind(this),
            this.showLogin.bind(this)
        );
        this.updateMainContent(registerHTML);
        this.attachRegisterEvents();
    }

    showPasswordRecovery() {
        this.currentView = 'password-recovery';
        const recoveryHTML = AuthComponents.createPasswordRecoveryForm(
            this.handlePasswordRecovery.bind(this),
            this.showLogin.bind(this)
        );
        this.updateMainContent(recoveryHTML);
        this.attachPasswordRecoveryEvents();
    }

    showApp(user) {
        console.log('Showing app for user:', user.name);
        this.currentView = 'app';
        
        // First, update the main content to show the app area
        const authArea = document.getElementById('auth-area');
        const appArea = document.getElementById('app-area');
        
        if (authArea) {
            authArea.classList.add('hidden');
            console.log('Auth area hidden');
        }
        if (appArea) {
            appArea.classList.remove('hidden');
            console.log('App area shown');
        }
        
        console.log('App area should now be visible');
        
        // Add the dropdown menu to the header (not a profile card)
        const userProfileHTML = AuthComponents.createUserProfile(
            user,
            this.handleLogout.bind(this),
            this.showProfileEdit.bind(this)
        );
        
        // Add the dropdown to the header
        const header = document.querySelector('#app-area header');
        if (header) {
            // Remove any existing user profile elements
            const existingProfile = header.querySelector('.absolute.top-4.right-4');
            if (existingProfile) {
                existingProfile.remove();
            }
            header.insertAdjacentHTML('beforeend', userProfileHTML);
            console.log('User dropdown menu added to header');
        }
        
        this.attachAppEvents();
        
        // Show a simple success message instead of initializing AppService
        console.log('Login successful! App should be visible now.');
        this.uiService.showToast('Login realizado com sucesso! Aplicação carregada.', false);
        
        // Try to initialize AppService in a simpler way
        this.simpleAppInit();
    }
    
    async simpleAppInit() {
        try {
            console.log('Starting simple app initialization...');

            // Get current user data
            const currentUser = this.authService.getCurrentUser();
            console.log('Current user:', currentUser);

            // Just set up basic event listeners without complex initialization
            const healthForm = document.getElementById('health-form');
            if (healthForm) {
                healthForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    console.log('Form submitted');
                    this.uiService.showToast('Registo adicionado com sucesso!', false);
                });
                console.log('Health form event listener added');
            }

            // Set current date
            const dateInput = document.getElementById('date');
            if (dateInput) {
                dateInput.value = new Date().toISOString().split('T')[0];
                console.log('Date input set to current date');
            }

            // Set user's height from profile and make it read-only
            const heightInput = document.getElementById('height');
            if (heightInput && currentUser) {
                console.log('Setting height field with user data:', currentUser.height);
                if (currentUser.height && currentUser.height !== '') {
                    heightInput.value = currentUser.height;
                    heightInput.readOnly = true;
                    heightInput.classList.add('bg-gray-100', 'cursor-not-allowed');
                    console.log('Height input set to user profile height:', currentUser.height);
                } else {
                    // If no height in profile, show placeholder and make it editable
                    heightInput.value = '';
                    heightInput.placeholder = 'Defina a sua altura no perfil';
                    heightInput.readOnly = false;
                    heightInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
                    console.log('No height in profile, showing placeholder');
                }
            } else if (heightInput) {
                console.log('Height input found but no user data');
            } else {
                console.log('Height input not found');
            }

            console.log('Simple app initialization complete');

        } catch (error) {
            console.error('Simple app init error:', error);
        }
    }

    showProfileEdit() {
        const user = this.authService.getCurrentUser();
        if (!user) return;

        this.isEditingProfile = true;
        const profileEditHTML = AuthComponents.createProfileEditForm(
            user,
            this.handleProfileUpdate.bind(this),
            this.cancelProfileEdit.bind(this)
        );
        
        // Add the modal to the body
        document.body.insertAdjacentHTML('beforeend', profileEditHTML);
        
        this.attachProfileEditEvents();
    }

    cancelProfileEdit() {
        this.isEditingProfile = false;
        
        // Remove the modal from the DOM
        const modal = document.querySelector('.fixed.inset-0.bg-gray-600.bg-opacity-50');
        if (modal) {
            modal.remove();
        }
    }

    updateMainContent(html) {
        console.log('Updating main content with view:', this.currentView);
        const authArea = document.getElementById('auth-area');
        const appArea = document.getElementById('app-area');
        
        if (this.currentView === 'app') {
            if (authArea) authArea.classList.add('hidden');
            if (appArea) appArea.classList.remove('hidden');
        } else {
            if (authArea) {
                authArea.innerHTML = html;
                authArea.classList.remove('hidden');
            }
            if (appArea) appArea.classList.add('hidden');
        }
    }

    // Event handlers
    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        try {
            const result = await this.authService.login(email, password);
            if (result.success) {
                this.uiService.showToast('Login realizado com sucesso!', false);
                this.showApp(result.user);
            }
        } catch (error) {
            this.uiService.showToast(error.message);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get('name');
        const email = formData.get('email');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        // Validate passwords match
        if (password !== confirmPassword) {
            this.uiService.showToast('As passwords não coincidem');
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            this.uiService.showToast('A password deve ter pelo menos 6 caracteres');
            return;
        }

        try {
            const result = await this.authService.register(email, password, name);
            if (result.success) {
                this.uiService.showToast('Registo realizado com sucesso! Agora pode fazer login com as suas credenciais.', false);
                // Show login page instead of app after successful registration
                this.showLogin();
            }
        } catch (error) {
            this.uiService.showToast(error.message);
        }
    }

    async handlePasswordRecovery(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get('email');

        try {
            const result = await this.authService.sendPasswordResetEmail(email);
            if (result.success) {
                this.uiService.showToast(result.message, false);
                this.showLogin();
            }
        } catch (error) {
            this.uiService.showToast(error.message);
        }
    }

    async handleLogout() {
        try {
            await this.authService.logout();
            this.uiService.showToast('Logout realizado com sucesso!', false);
            this.showLogin();
        } catch (error) {
            this.uiService.showToast(error.message);
        }
    }

    async handleProfileUpdate(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updates = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            taxId: formData.get('taxId'),
            height: formData.get('height'),
            birthday: formData.get('birthday')
        };

        try {
            const result = await this.authService.updateProfile(updates);
            if (result.success) {
                // Show success message first
                this.uiService.showToast('Perfil atualizado com sucesso!', false);
                
                // Close the modal after a short delay for better UX
                setTimeout(() => {
                    this.isEditingProfile = false;
                    const modal = document.querySelector('.fixed.inset-0.bg-gray-600.bg-opacity-50');
                    if (modal) {
                        modal.remove();
                    }
                    
                    // Update the dropdown menu with new user data
                    this.updateUserDropdown(result.user);
                    
                    // Update height field in the form
                    this.uiService.updateHeightFromProfile(result.user);
                    
                    // Update age field in the form
                    this.uiService.updateAgeFromProfile(result.user);
                }, 500); // 500ms delay
            }
        } catch (error) {
            this.uiService.showToast(error.message);
        }
    }
    
    updateUserDropdown(user) {
        // Update the user name in the dropdown button
        const userMenuBtn = document.getElementById('user-menu-btn');
        if (userMenuBtn) {
            const nameSpan = userMenuBtn.querySelector('span');
            if (nameSpan) {
                nameSpan.textContent = user.name;
            }
            
            const avatarSpan = userMenuBtn.querySelector('.w-8.h-8 span');
            if (avatarSpan) {
                avatarSpan.textContent = user.name.charAt(0).toUpperCase();
            }
        }
        
        // Update height field in main form if it exists
        const heightInput = document.getElementById('height');
        if (heightInput && user.height) {
            heightInput.value = user.height;
            heightInput.readOnly = true;
            heightInput.classList.add('bg-gray-100', 'cursor-not-allowed');
        }
    }

    // Event attachments
    attachLoginEvents() {
        const loginForm = document.getElementById('login-form');
        const switchToRegisterBtn = document.getElementById('switch-to-register-btn');
        const forgotPasswordBtn = document.getElementById('forgot-password-btn');

        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        if (switchToRegisterBtn) {
            switchToRegisterBtn.addEventListener('click', this.showRegister.bind(this));
        }
        if (forgotPasswordBtn) {
            forgotPasswordBtn.addEventListener('click', this.showPasswordRecovery.bind(this));
        }
    }

    attachRegisterEvents() {
        const registerForm = document.getElementById('register-form');
        const switchToLoginBtn = document.getElementById('switch-to-login-btn');

        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }
        if (switchToLoginBtn) {
            switchToLoginBtn.addEventListener('click', this.showLogin.bind(this));
        }
    }

    attachPasswordRecoveryEvents() {
        const recoveryForm = document.getElementById('password-recovery-form');
        const backToLoginBtn = document.getElementById('back-to-login-btn');

        if (recoveryForm) {
            recoveryForm.addEventListener('submit', this.handlePasswordRecovery.bind(this));
        }
        if (backToLoginBtn) {
            backToLoginBtn.addEventListener('click', this.showLogin.bind(this));
        }
    }

    attachAppEvents() {
        const userMenuBtn = document.getElementById('user-menu-btn');
        const userMenuDropdown = document.getElementById('user-menu-dropdown');
        const editProfileMenuBtn = document.getElementById('edit-profile-menu-btn');
        const logoutMenuBtn = document.getElementById('logout-menu-btn');

        // Toggle dropdown menu
        if (userMenuBtn && userMenuDropdown) {
            userMenuBtn.addEventListener('click', () => {
                userMenuDropdown.classList.toggle('hidden');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                    userMenuDropdown.classList.add('hidden');
                }
            });
        }

        // Edit profile from menu
        if (editProfileMenuBtn) {
            editProfileMenuBtn.addEventListener('click', () => {
                userMenuDropdown.classList.add('hidden');
                this.showProfileEdit();
            });
        }

        // Logout from menu
        if (logoutMenuBtn) {
            logoutMenuBtn.addEventListener('click', () => {
                userMenuDropdown.classList.add('hidden');
                this.handleLogout();
            });
        }
    }

    attachProfileEditEvents() {
        const profileEditForm = document.getElementById('profile-edit-form');
        const cancelEditBtn = document.getElementById('cancel-edit-btn');

        if (profileEditForm) {
            profileEditForm.addEventListener('submit', this.handleProfileUpdate.bind(this));
        }
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', this.cancelProfileEdit.bind(this));
        }
    }

    // Public methods
    getCurrentUser() {
        return this.authService.getCurrentUser();
    }

    isAuthenticated() {
        return this.authService.isUserAuthenticated();
    }

    getCurrentView() {
        return this.currentView;
    }
} 