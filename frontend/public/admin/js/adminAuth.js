// Admin Authentication Service
export class AdminAuthService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.currentAdmin = null;
        this.isAuthenticated = false;
    }

    // Check if user is admin
    async checkAdminStatus() {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                return { isAdmin: false, admin: null };
            }

            const response = await fetch(`${this.baseUrl}/api/admin/check`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentAdmin = data.admin;
                this.isAuthenticated = true;
                return { isAdmin: true, admin: data.admin };
            } else {
                return { isAdmin: false, admin: null };
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            return { isAdmin: false, admin: null };
        }
    }

    // Get current admin
    getCurrentAdmin() {
        return this.currentAdmin;
    }

    // Check if authenticated
    isAdminAuthenticated() {
        return this.isAuthenticated;
    }

    // Logout admin
    logout() {
        this.currentAdmin = null;
        this.isAuthenticated = false;
        try { sessionStorage.clear(); } catch (_) {}
        try { localStorage.clear(); } catch (_) {}
        window.location.href = '../login.html';
    }

    // Show admin interface
    showAdminInterface() {
        const loadingIndicator = document.getElementById('loading-indicator');
        const adminInterface = document.getElementById('admin-interface');
        
        if (loadingIndicator) {
            loadingIndicator.classList.add('hidden');
        }
        
        if (adminInterface) {
            adminInterface.classList.remove('hidden');
        }
    }

    // Hide admin interface
    hideAdminInterface() {
        const adminInterface = document.getElementById('admin-interface');
        if (adminInterface) {
            adminInterface.classList.add('hidden');
        }
    }

    // Show error and redirect
    showErrorAndRedirect(message) {
        alert(message);
        window.location.href = '../login.html';
    }
}

// Admin Authentication Manager
export class AdminAuthManager {
    constructor() {
        this.authService = new AdminAuthService();
        this.setupEventListeners();
    }

    // Initialize admin authentication
    async initialize() {
        // Initialize admin authentication
        
        try {
            const { isAdmin, admin } = await this.authService.checkAdminStatus();
            
            if (isAdmin && admin) {
                this.authService.showAdminInterface();
                this.updateAdminProfile(admin);
                this.setupNavigation();
                return true;
            } else {
                this.authService.showErrorAndRedirect('Acesso de administrador necessário');
                return false;
            }
        } catch (error) {
            console.error('Error initializing admin auth:', error);
            this.authService.showErrorAndRedirect('Erro ao verificar permissões de administrador');
            return false;
        }
    }

    // Update admin profile display
    updateAdminProfile(admin) {
        const adminName = document.getElementById('admin-name');
        const adminInitials = document.getElementById('admin-initials');
        
        if (adminName && admin.name) {
            adminName.textContent = admin.name;
        }
        
        if (adminInitials && admin.name) {
            adminInitials.textContent = admin.name.charAt(0).toUpperCase();
        }
    }

    // Setup navigation
    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Show corresponding section
                const section = item.getAttribute('data-section');
                this.showSection(section);
            });
        });
    }

    // Show section
    showSection(sectionName) {
        // Hide all sections
        const sections = document.querySelectorAll('.admin-section');
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        
        // Show selected section
        const targetSection = document.getElementById(`${sectionName}-section`);
        if (targetSection) {
            targetSection.classList.remove('hidden');
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Go to main app button
        const goToMainAppBtn = document.getElementById('go-to-main-app');
        if (goToMainAppBtn) {
            goToMainAppBtn.addEventListener('click', () => {
                // Direct navigation without triggering auth redirects
                window.location.replace('../personalArea.html');
            });
        }

        // Admin profile button
        const adminProfileBtn = document.getElementById('admin-profile-btn');
        if (adminProfileBtn) {
            adminProfileBtn.addEventListener('click', () => {
                this.showAdminProfileModal();
            });
        }

        // Admin profile modal
        const adminProfileModal = document.getElementById('admin-profile-modal');
        if (adminProfileModal) {
            adminProfileModal.addEventListener('click', (e) => {
                if (e.target === adminProfileModal) {
                    this.hideAdminProfileModal();
                }
            });
        }

        // Close admin profile modal
        const closeAdminProfileBtn = document.getElementById('close-admin-profile');
        if (closeAdminProfileBtn) {
            closeAdminProfileBtn.addEventListener('click', () => {
                this.hideAdminProfileModal();
            });
        }

        // Save admin profile
        const saveAdminProfileBtn = document.getElementById('save-admin-profile');
        if (saveAdminProfileBtn) {
            saveAdminProfileBtn.addEventListener('click', () => {
                this.saveAdminProfile();
            });
        }

        // Logout admin
        const logoutAdminBtn = document.getElementById('logout-admin');
        if (logoutAdminBtn) {
            logoutAdminBtn.addEventListener('click', () => {
                this.authService.logout();
            });
        }

        // Notifications removed

        // Close notifications panel when clicking outside
        document.addEventListener('click', (e) => {
            const notificationsPanel = document.getElementById('notifications-panel');
            const notificationsBtn = document.getElementById('notifications-btn');
            
            if (notificationsPanel && notificationsBtn && !notificationsPanel.contains(e.target) && !notificationsBtn.contains(e.target)) {
                notificationsPanel.classList.add('hidden');
            }
        });
    }

    // Show admin profile modal
    showAdminProfileModal() {
        const modal = document.getElementById('admin-profile-modal');
        const adminNameInput = document.getElementById('admin-name-input');
        const adminEmailInput = document.getElementById('admin-email-input');
        
        if (modal && this.authService.currentAdmin) {
            if (adminNameInput) {
                adminNameInput.value = this.authService.currentAdmin.name || '';
            }
            if (adminEmailInput) {
                adminEmailInput.value = this.authService.currentAdmin.email || '';
            }
            modal.classList.remove('hidden');
        }
    }

    // Hide admin profile modal
    hideAdminProfileModal() {
        const modal = document.getElementById('admin-profile-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    // Save admin profile
    async saveAdminProfile() {
        const adminNameInput = document.getElementById('admin-name-input');
        const adminEmailInput = document.getElementById('admin-email-input');
        
        if (!adminNameInput || !adminEmailInput) return;
        
        const name = adminNameInput.value.trim();
        const email = adminEmailInput.value.trim();
        
        if (!name || !email) {
            alert('Por favor, preencha todos os campos');
            return;
        }
        
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.authService.baseUrl}/api/users/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, email })
            });
            
            if (response.ok) {
                const data = await response.json();
                // Backend returns 'user' not 'admin'
                const updatedUser = data.user || data.admin;
                this.authService.currentAdmin = updatedUser;
                this.updateAdminProfile(updatedUser);
                this.hideAdminProfileModal();
                alert('Perfil atualizado com sucesso!');
            } else {
                const error = await response.json();
                alert(`Erro ao atualizar perfil: ${error.error}`);
            }
        } catch (error) {
            console.error('Error saving admin profile:', error);
            alert('Erro ao atualizar perfil');
        }
    }

    // Notifications removed

    // Get auth service
    getAuthService() {
        return this.authService;
    }
}

// Initialize admin authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    const adminAuthManager = new AdminAuthManager();
    const success = await adminAuthManager.initialize();
    
    if (success) {
        // Make adminAuthManager globally available
        window.adminAuthManager = adminAuthManager;
        console.log('Admin authentication initialized successfully');
    }
}); 