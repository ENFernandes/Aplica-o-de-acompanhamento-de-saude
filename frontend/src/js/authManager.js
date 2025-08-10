// Authentication manager to handle auth flow and UI state
import { AuthService } from './authService.js';
import { AuthComponents } from '../components/authComponents.js';
import { UIService } from './uiService.js';

export class AuthManager {
    constructor() {
        this.currentView = 'login';
        this.authService = new AuthService();
        this.uiService = new UIService();
        this.viewedUser = null; // Track the user being viewed (for admin viewing other users)
        this.bindEvents();
    }

    // UserActive System - Manages the currently active user ID
    setUserActive(userId) {
        localStorage.setItem('userActive', userId);
        console.log('UserActive set to:', userId);
    }

    getUserActive() {
        const userActive = localStorage.getItem('userActive');
        console.log('UserActive retrieved:', userActive);
        return userActive;
    }

    clearUserActive() {
        localStorage.removeItem('userActive');
        console.log('UserActive cleared');
    }

    // Get the current user (either viewed user or authenticated user)
    getCurrentUser() {
        // If we have a viewed user (admin viewing another user), return that
        if (this.viewedUser) {
            console.log('Returning viewed user:', this.viewedUser.id);
            return this.viewedUser;
        }
        
        // Otherwise return the authenticated user
        const currentUser = this.authService.getCurrentUser();
        console.log('Returning authenticated user:', currentUser?.id);
        return currentUser;
    }

    // Get the active user ID (for API calls)
    getActiveUserId() {
        const userActive = this.getUserActive();
        if (userActive) {
            console.log('Using UserActive ID:', userActive);
            return userActive;
        }
        
        // Fallback to current user
        const currentUser = this.getCurrentUser();
        const userId = currentUser?.id;
        console.log('Using current user ID:', userId);
        return userId;
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
                console.log('User authenticated, checking role...');
                
                // Check if we have a UserActive set (from BackOffice)
                const userActive = this.getUserActive();
                if (userActive && userActive !== authResult.user.id.toString()) {
                    console.log('UserActive found, loading user profile from database...');
                    // Find the user name from the users list or use a placeholder
                    const userName = 'Utilizador'; // We'll get the real name from the API
                    await this.loadUserProfileFromDatabase(userActive, userName);
                    return { isAuthenticated: true, user: this.viewedUser };
                }
                
                // Check if user is admin
                const isAdmin = authResult.user && authResult.user.role === 'admin';
                
                // Only redirect if not manually navigating and not already on admin page
                const isOnAdminPage = window.location.pathname.includes('admin');
                const isNavigatingFromAdmin = document.referrer.includes('admin.html');
                
                // If admin is on regular page and NOT navigating from admin, redirect to BackOffice
                if (isAdmin && !isOnAdminPage && !isNavigatingFromAdmin) {
                    console.log('Admin user detected, redirecting to BackOffice...');
                    window.location.href = '/admin';
                    return { isAuthenticated: true, user: authResult.user };
                }
                
                // If regular user is on admin page, redirect to main app
                if (!isAdmin && isOnAdminPage) {
                    console.log('Regular user on admin page, redirecting to main app...');
                    window.location.href = 'personalArea.html';
                    return { isAuthenticated: true, user: authResult.user };
                }
                
                console.log('User authenticated, showing app');
                this.showApp(authResult.user);
                return { isAuthenticated: true, user: authResult.user };
            } else {
                console.log('User not authenticated');
                return { isAuthenticated: false, user: null };
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            return { isAuthenticated: false, user: null };
        }
    }

    showLogin() {
        //console.log('Showing login form');
        //this.currentView = 'login';
        //const loginHTML = AuthComponents.createLoginForm(
            //this.handleLogin.bind(this),
            //this.showRegister.bind(this),
            //this.showPasswordRecovery.bind(this)
        //);
        //this.updateMainContent(loginHTML);
        //this.attachLoginEvents();
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
        
        // Check if there's a selected user profile from BackOffice
        const selectedUserProfile = localStorage.getItem('selected-user-profile');
        if (selectedUserProfile) {
            try {
                const selectedUser = JSON.parse(selectedUserProfile);
                console.log('Selected user profile found:', selectedUser);
                
                // Fetch the complete user profile from database
                this.loadUserProfileFromDatabase(selectedUser.id, selectedUser.name);
                
                // Clear the selected user profile from localStorage
                localStorage.removeItem('selected-user-profile');
                
            } catch (error) {
                console.error('Error parsing selected user profile:', error);
                localStorage.removeItem('selected-user-profile');
                this.updateUserDropdown(user);
            }
        } else {
            // Normal user profile
            this.updateUserDropdown(user);
        }
        
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
        
        // Add the dropdown to the header's top right corner container
        const header = document.querySelector('#app-area header');
        if (header) {
            // Find the top right corner container
            const topRightContainer = header.querySelector('.absolute.top-0.right-0');
            if (topRightContainer) {
                // Remove any existing user profile elements
                const existingProfile = topRightContainer.querySelector('.relative');
                if (existingProfile) {
                    existingProfile.remove();
                }
                
                // Create a flex container for vertical stacking
                const flexContainer = document.createElement('div');
                flexContainer.className = 'flex flex-col items-end space-y-1';
                
                // Add BackOffice button for admins first (check authenticated user from token)
                const token = localStorage.getItem('auth-token');
                console.log('Checking for auth token:', token ? 'Token exists' : 'No token');
                
        if (token) {
                    try {
                        // Decode JWT token to get authenticated user info
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        console.log('Token payload:', payload);
                        console.log('Token payload keys:', Object.keys(payload));
                        console.log('Role in token:', payload.role);
                        
                        // Check if authenticated user is admin
                        if (payload.role === 'admin') {
                            const backOfficeButton = `
                                <a id="backoffice-link" href="/admin" class="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors duration-200 flex items-center">
                                    <span class="hidden sm:inline">🔧</span>
                                    <span class="sm:hidden">🔧</span>
                                    <span class="hidden md:inline ml-1">BackOffice</span>
                                    <span class="md:hidden ml-1">Admin</span>
                                </a>
                            `;
                            flexContainer.insertAdjacentHTML('beforeend', backOfficeButton);
                            console.log('BackOffice button added for admin user');
                            // Ensure userActive is cleared when navigating to BackOffice
                            const backofficeLink = flexContainer.querySelector('#backoffice-link');
                            if (backofficeLink) {
                                backofficeLink.addEventListener('click', () => {
                                    try { localStorage.removeItem('userActive'); } catch (_) {}
                                });
                            }
                        } else {
                            console.log('User is not admin, role is:', payload.role);
                        }
                    } catch (error) {
                        console.error('Error decoding token:', error);
                        console.log('Token structure:', token ? token.substring(0, 50) + '...' : 'No token');
                    }
                } else {
                    console.log('No auth token found in localStorage');
                }
                
                // Then add the user dropdown menu
                flexContainer.insertAdjacentHTML('beforeend', userProfileHTML);
                console.log('User dropdown menu added to flex container');
                
                // Add the flex container to the top right
                topRightContainer.appendChild(flexContainer);
            } else {
                console.log('Top right container not found, adding to header');
                header.insertAdjacentHTML('beforeend', userProfileHTML);
            }
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
        let email, password;
        
        // Check if e is an event object or if we're being called directly
        if (e && e.preventDefault && typeof e.preventDefault === 'function') {
            // Called as event handler
            e.preventDefault();
            const formData = new FormData(e.target);
            email = formData.get('email');
            password = formData.get('password');

            // Disable login button to prevent multiple submissions
            const loginButton = e.target.querySelector('button[type="submit"]');
            if (loginButton) {
                loginButton.disabled = true;
                loginButton.textContent = 'A entrar...';
            }
        } else {
            // Called directly with parameters
            email = e; // e is actually the email
            password = arguments[1]; // password is the second argument
        }

        try {
            const result = await this.authService.login(email, password);
            if (result.success) {
                // Set the logged-in user as active
                if (result.user && result.user.id) {
                    this.setUserActive(result.user.id);
                }
                
                // Check if user is admin
                const isAdmin = result.user && result.user.role === 'admin';
                
                // Check if we're on login page or main app
                if (window.location.pathname.includes('login.html')) {
                    // On login page, redirect based on user role
                    if (isAdmin) {
                        // Admin users go to BackOffice
                        window.location.href = '/admin';
                    } else {
                        // Regular users go to main app
                        window.location.href = 'personalArea.html';
                    }
                } else {
                    // In main app, check if admin should be redirected
                    if (isAdmin && !window.location.pathname.includes('admin')) {
                        // Admin is in regular app, redirect to BackOffice
                        window.location.href = '/admin';
                    } else {
                        // Show app normally
                        this.uiService.showToast('Login realizado com sucesso!', false);
                        this.showApp(result.user);
                    }
                }
            }
        } catch (error) {
            // Re-throw the error so it can be caught by the calling function
            throw error;
        } finally {
            // Re-enable login button if it was disabled
            if (e && e.target) {
                const loginButton = e.target.querySelector('button[type="submit"]');
                if (loginButton) {
                    loginButton.disabled = false;
                    loginButton.textContent = 'Entrar';
                }
            }
        }
    }

    async handleRegister(e) {
        let name, email, password, confirmPassword;
        
        // Check if e is an event object or if we're being called directly
        if (e && e.preventDefault && typeof e.preventDefault === 'function') {
            // Called as event handler
            e.preventDefault();
            const formData = new FormData(e.target);
            name = formData.get('name');
            email = formData.get('email');
            password = formData.get('password');
            confirmPassword = formData.get('confirmPassword');
        } else {
            // Called directly with parameters
            name = e; // e is actually the name
            email = arguments[1]; // email is the second argument
            password = arguments[2]; // password is the third argument
            confirmPassword = arguments[3]; // confirmPassword is the fourth argument
        }

        // Validate passwords match
        if (password !== confirmPassword) {
            if (window.location.pathname.includes('login.html')) {
                // On login page, use showStatus function
                if (typeof showStatus === 'function') {
                    showStatus('As passwords não coincidem', 'error');
                }
            } else {
                this.uiService.showToast('As passwords não coincidem');
            }
            return;
        }

        // Validate password strength
        if (password.length < 6) {
            if (window.location.pathname.includes('login.html')) {
                // On login page, use showStatus function
                if (typeof showStatus === 'function') {
                    showStatus('A password deve ter pelo menos 6 caracteres', 'error');
                }
            } else {
                this.uiService.showToast('A password deve ter pelo menos 6 caracteres');
            }
            return;
        }

        try {
            const result = await this.authService.register(email, password, name);
            if (result.success) {
                if (window.location.pathname.includes('login.html')) {
                    // On login page, use showStatus function
                    if (typeof showStatus === 'function') {
                        showStatus('Registo realizado com sucesso! Agora pode fazer login com as suas credenciais.', 'success');
                    }
                } else {
                    this.uiService.showToast('Registo realizado com sucesso! Agora pode fazer login com as suas credenciais.', false);
                }
                // Show login page instead of app after successful registration
                this.showLogin();
            }
        } catch (error) {
            // Re-throw the error so it can be caught by the calling function
            throw error;
        }
    }

    async handlePasswordRecovery(e) {
        let email;
        
        // Check if e is an event object or if we're being called directly
        if (e && e.preventDefault && typeof e.preventDefault === 'function') {
            // Called as event handler
            e.preventDefault();
            const formData = new FormData(e.target);
            email = formData.get('email');
        } else {
            // Called directly with parameters
            email = e; // e is actually the email
        }

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
            // Clear all client-side storage and state
            this.viewedUser = null;
            try { sessionStorage.clear(); } catch (_) {}
            try { localStorage.clear(); } catch (_) {}

            await this.authService.logout();
            this.uiService.showToast('Logout realizado com sucesso!', false);
            // Redirect to login page instead of showing login form
            window.location.href = 'login.html';
        } catch (error) {
            this.uiService.showToast(error.message);
            // Even if there's an error, redirect to login page
            window.location.href = 'login.html';
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
    
    updateUserDropdown(user, isViewingAnotherUser = false) {
        console.log('Updating user dropdown with user:', user, 'isViewingAnotherUser:', isViewingAnotherUser);
        
        const userDropdownContainer = document.getElementById('user-dropdown-container');
        if (userDropdownContainer) {
            userDropdownContainer.innerHTML = AuthComponents.createUserProfile(
                user, 
                () => this.handleLogout(), 
                () => this.showProfileEdit(),
                isViewingAnotherUser
            );
            
            // Attach dropdown toggle event
            const userMenuBtn = document.getElementById('user-menu-btn');
            const userMenuDropdown = document.getElementById('user-menu-dropdown');
            
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
                
                // Attach menu item events
                const editProfileBtn = document.getElementById('edit-profile-menu-btn');
                const viewProfileBtn = document.getElementById('view-profile-btn');
                const logoutBtn = document.getElementById('logout-menu-btn');
                const returnToMyProfileBtn = document.getElementById('return-to-my-profile-btn');
                
                if (editProfileBtn) {
                    editProfileBtn.addEventListener('click', () => {
                        this.showProfileEdit();
                        userMenuDropdown.classList.add('hidden');
                    });
                }
                
                if (viewProfileBtn) {
                    viewProfileBtn.addEventListener('click', () => {
                        // This could be used for viewing own profile details
                        userMenuDropdown.classList.add('hidden');
                    });
                }
                
                if (logoutBtn) {
                    logoutBtn.addEventListener('click', () => {
                        this.handleLogout();
                        userMenuDropdown.classList.add('hidden');
                    });
                }
                
                if (returnToMyProfileBtn) {
                    returnToMyProfileBtn.addEventListener('click', () => {
                        this.clearViewedUser();
                        userMenuDropdown.classList.add('hidden');
                    });
                }
            }
        }
    }

    // Load user profile from database
    async loadUserProfileFromDatabase(userId, userName) {
        try {
            console.log('Loading user profile from database for ID:', userId);
            
            // Set this user as the active user
            this.setUserActive(userId);
            
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`http://localhost:3000/api/users/${userId}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const userProfile = data.user;
                console.log('User profile loaded from database:', userProfile);
                
                // Store the viewed user data
                this.viewedUser = userProfile;
                
                // Show notification that we're viewing another user's profile
                this.uiService.showToast(`A visualizar perfil de: ${userName}`, false);
                
                // Update the user dropdown to show we're viewing another user
                this.updateUserDropdown(userProfile, true);
                
                // Update form fields with the user's data
                this.updateFormWithUserData(userProfile);
                
            } else {
                console.error('Failed to load user profile from database');
                this.uiService.showToast('Erro ao carregar perfil do utilizador', true);
                // Fallback to current user
                const currentUser = this.authService.getCurrentUser();
                this.viewedUser = null;
                this.clearUserActive();
                this.updateUserDropdown(currentUser);
            }
            
        } catch (error) {
            console.error('Error loading user profile from database:', error);
            this.uiService.showToast('Erro ao carregar perfil do utilizador', true);
            // Fallback to current user
            const currentUser = this.authService.getCurrentUser();
            this.viewedUser = null;
            this.clearUserActive();
            this.updateUserDropdown(currentUser);
        }
    }
    
    // Update form fields with user data
    updateFormWithUserData(user) {
        console.log('Updating form with user data:', user);
        
        // Check if we're viewing another user's profile
        const isViewingAnotherUser = this.viewedUser && this.viewedUser.id !== this.authService.getCurrentUser()?.id;
        
        // Update height field
        const heightInput = document.getElementById('height');
        if (heightInput && user.height) {
            heightInput.value = user.height;
            if (isViewingAnotherUser) {
                heightInput.readOnly = true;
                heightInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                heightInput.readOnly = false;
                heightInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Height field updated with:', user.height);
        }
        
        // Update name field if it exists
        const nameInput = document.getElementById('name');
        if (nameInput && user.name) {
            nameInput.value = user.name;
            if (isViewingAnotherUser) {
                nameInput.readOnly = true;
                nameInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                nameInput.readOnly = false;
                nameInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Name field updated with:', user.name);
        }
        
        // Update email field if it exists
        const emailInput = document.getElementById('email');
        if (emailInput && user.email) {
            emailInput.value = user.email;
            if (isViewingAnotherUser) {
                emailInput.readOnly = true;
                emailInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                emailInput.readOnly = false;
                emailInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Email field updated with:', user.email);
        }
        
        // Update address field if it exists
        const addressInput = document.getElementById('address');
        if (addressInput && user.address) {
            addressInput.value = user.address;
            if (isViewingAnotherUser) {
                addressInput.readOnly = true;
                addressInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                addressInput.readOnly = false;
                addressInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Address field updated with:', user.address);
        }
        
        // Update tax_id field if it exists
        const taxIdInput = document.getElementById('tax_id');
        if (taxIdInput && user.tax_id) {
            taxIdInput.value = user.tax_id;
            if (isViewingAnotherUser) {
                taxIdInput.readOnly = true;
                taxIdInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                taxIdInput.readOnly = false;
                taxIdInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Tax ID field updated with:', user.tax_id);
        }
        
        // Update phone field if it exists
        const phoneInput = document.getElementById('phone');
        if (phoneInput && user.phone) {
            phoneInput.value = user.phone;
            if (isViewingAnotherUser) {
                phoneInput.readOnly = true;
                phoneInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                phoneInput.readOnly = false;
                phoneInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Phone field updated with:', user.phone);
        }
        
        // Update birthday field if it exists
        const birthdayInput = document.getElementById('birthday');
        if (birthdayInput && user.birthday) {
            birthdayInput.value = user.birthday;
            if (isViewingAnotherUser) {
                birthdayInput.readOnly = true;
                birthdayInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                birthdayInput.readOnly = false;
                birthdayInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Birthday field updated with:', user.birthday);
        }
        
        // Calculate and update age field if it exists
        const ageInput = document.getElementById('age');
        if (ageInput && user.birthday) {
            const age = this.calculateAge(user.birthday);
            ageInput.value = age;
            if (isViewingAnotherUser) {
                ageInput.readOnly = true;
                ageInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            } else {
                ageInput.readOnly = false;
                ageInput.classList.remove('bg-gray-100', 'cursor-not-allowed');
            }
            console.log('Age calculated and updated with:', age);
        }
        
        // Show a visual indicator that we're viewing another user's data
        const formTitle = document.querySelector('h1, h2, h3');
        if (formTitle && isViewingAnotherUser) {
            // Remove any existing indicator first
            formTitle.innerHTML = formTitle.innerHTML.replace(/<span class="text-sm text-blue-600 font-normal">\(Visualizando: .*?\)<\/span>/, '');
            // Add new indicator
            formTitle.innerHTML += ` <span class="text-sm text-blue-600 font-normal">(Visualizando: ${user.name})</span>`;
        } else if (formTitle && !isViewingAnotherUser) {
            // Remove indicator when viewing own profile
            formTitle.innerHTML = formTitle.innerHTML.replace(/<span class="text-sm text-blue-600 font-normal">\(Visualizando: .*?\)<\/span>/, '');
        }
        
        console.log('Form updated with user data:', user);
    }
    
    // Calculate age from birthday
    calculateAge(birthday) {
        if (!birthday) return '';
        
        try {
            const birthDate = new Date(birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            
            return age.toString();
        } catch (error) {
            console.error('Error calculating age:', error);
            return '';
        }
    }
    
    // Clear viewed user and return to admin's own profile
    clearViewedUser() {
        console.log('Clearing viewed user, returning to admin profile');
        this.viewedUser = null;
        
        // When leaving another user's page, clear the userActive flag entirely
        try { localStorage.removeItem('userActive'); } catch (_) {}
        
        // Get the authenticated admin user
        const adminUser = this.authService.getCurrentUser();
        
        // Update form fields with admin's own data
        this.updateFormWithUserData(adminUser);
        
        // Update user dropdown to show admin's profile
        this.updateUserDropdown(adminUser, false);
        
        // Remove the visual indicator
        const formTitle = document.querySelector('h1, h2, h3');
        if (formTitle) {
            // Remove the "(Visualizando: ...)" part
            formTitle.innerHTML = formTitle.innerHTML.replace(/<span class="text-sm text-blue-600 font-normal">\(Visualizando: .*?\)<\/span>/, '');
        }
        
        this.uiService.showToast('Voltou ao seu perfil', false);
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
        const viewProfileBtn = document.getElementById('view-profile-btn'); // New button
        const returnToBackofficeBtn = document.getElementById('return-to-backoffice-btn'); // New button
        const returnToMyProfileBtn = document.getElementById('return-to-my-profile-btn'); // New button

        console.log('Attaching app events...');
        console.log('User menu button found:', !!userMenuBtn);
        console.log('User menu dropdown found:', !!userMenuDropdown);

        // Toggle dropdown menu
        if (userMenuBtn && userMenuDropdown) {
            console.log('Adding click event listener to user menu button');
            userMenuBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('User menu button clicked');
                const isHidden = userMenuDropdown.classList.contains('hidden');
                console.log('Dropdown is hidden:', isHidden);
                userMenuDropdown.classList.toggle('hidden');
                console.log('Dropdown hidden after toggle:', userMenuDropdown.classList.contains('hidden'));
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
                    console.log('Clicking outside dropdown, closing it');
                    userMenuDropdown.classList.add('hidden');
                }
            });
        } else {
            console.log('User menu button or dropdown not found:', {
                userMenuBtn: !!userMenuBtn,
                userMenuDropdown: !!userMenuDropdown
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

        // View profile from menu
        if (viewProfileBtn) {
            viewProfileBtn.addEventListener('click', () => {
                userMenuDropdown.classList.add('hidden');
                // This button should ideally navigate to the profile page of the current user
                // For now, it will just navigate to the main app, as the profile page is not yet implemented
                window.location.href = 'personalArea.html';
            });
        }

        // Return to BackOffice (when admin is viewing another user's profile)
        if (returnToBackofficeBtn) {
            returnToBackofficeBtn.addEventListener('click', () => {
                userMenuDropdown.classList.add('hidden');
                // Clear userActive when going back to BackOffice
                try { localStorage.removeItem('userActive'); } catch (_) {}
                window.location.href = '/admin';
            });
        }

        // Return to my profile (when admin is viewing another user's profile)
        if (returnToMyProfileBtn) {
            returnToMyProfileBtn.addEventListener('click', () => {
                userMenuDropdown.classList.add('hidden');
                this.clearViewedUser();
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
    isAuthenticated() {
        // Check if we have a token in localStorage as a quick check
        const token = localStorage.getItem('auth-token');
        if (!token) {
            return false;
        }
        
        // Also check the auth service state
        return this.authService.isUserAuthenticated();
    }

    getCurrentView() {
        return this.currentView;
    }
} 