// Enhanced Authentication service for secure login, registration, and password recovery
// DATABASE-ONLY MODE - No localStorage fallbacks
import { authFunctions, useLocalStorage } from './firebaseConfig.js';
import { LocalStorageService } from './localStorageService.js';
import { DatabaseService } from './databaseService.js';

export class AuthService {
    constructor() {
        this.currentUser = null;
        this.isAuthenticated = false;
        this.token = null;
        this.localStorageService = new LocalStorageService('auth-data');
        this.databaseService = new DatabaseService();
        // Force database mode - no localStorage initialization
        console.log('AuthService initialized in DATABASE-ONLY mode');
    }

    // Check if user is logged in
    async checkAuthStatus() {
        try {
            // Always use backend API - no localStorage fallback
            const token = localStorage.getItem('auth-token');
            if (!token) {
                return { isAuthenticated: false, user: null };
            }

            try {
                const response = await this.databaseService.makeRequest('/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.success) {
                    this.currentUser = response.data.user;
                    this.isAuthenticated = true;
                    this.token = token;
                    console.log('User authenticated via database:', this.currentUser.name);
                    return { isAuthenticated: true, user: this.currentUser };
                } else {
                    // Token invalid, clear it
                    localStorage.removeItem('auth-token');
                    console.log('Invalid token, cleared from storage');
                    return { isAuthenticated: false, user: null };
                }
            } catch (error) {
                console.error('Token validation failed:', error);
                localStorage.removeItem('auth-token');
                return { isAuthenticated: false, user: null };
            }
        } catch (error) {
            console.error('Error checking auth status:', error);
            this.currentUser = null;
            this.isAuthenticated = false;
            return { isAuthenticated: false, user: null };
        }
    }

    // Register new user
    async register(email, password, name) {
        try {
            // Always use backend API - no localStorage fallback
            const response = await this.databaseService.makeRequest('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, name })
            });

            if (response.success) {
                // Store token
                localStorage.setItem('auth-token', response.data.token);
                this.token = response.data.token;
                console.log('User registered successfully via database');
                return { user: response.data.user, success: true };
            } else {
                throw new Error(response.error || 'Registration failed');
            }
        } catch (error) {
            throw new Error(`Erro no registo: ${error.message}`);
        }
    }

    // Login user
    async login(email, password) {
        try {
            // Always use backend API - no localStorage fallback
            const response = await this.databaseService.makeRequest('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.success) {
                // Store token and user info
                localStorage.setItem('auth-token', response.data.token);
                this.token = response.data.token;
                this.currentUser = response.data.user;
                this.isAuthenticated = true;
                console.log('User logged in successfully via database');
                return { user: response.data.user, success: true };
            } else {
                throw new Error(response.error || 'Login failed');
            }
        } catch (error) {
            throw new Error(`Erro no login: ${error.message}`);
        }
    }

    // Logout user
    async logout() {
        try {
            // Always logout with backend API
            if (this.token) {
                try {
                    await this.databaseService.makeRequest('/api/auth/logout', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${this.token}`
                        }
                    });
                } catch (error) {
                    console.warn('Logout API call failed:', error);
                }
            }

            this.currentUser = null;
            this.isAuthenticated = false;
            this.token = null;
            
            // Clear token from storage
            localStorage.removeItem('auth-token');
            console.log('User logged out successfully');
            
            return { success: true };
        } catch (error) {
            throw new Error(`Erro no logout: ${error.message}`);
        }
    }

    // Password recovery
    async sendPasswordResetEmail(email) {
        try {
            // Always use backend API - no localStorage fallback
            const response = await this.databaseService.makeRequest('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            if (response.success) {
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error || 'Password reset failed');
            }
        } catch (error) {
            throw new Error(`Erro na recuperação de password: ${error.message}`);
        }
    }

    // Reset password with token
    async resetPassword(token, newPassword) {
        try {
            // Always use backend API - no localStorage fallback
            const response = await this.databaseService.makeRequest('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, newPassword })
            });

            if (response.success) {
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error || 'Password reset failed');
            }
        } catch (error) {
            throw new Error(`Erro no reset da password: ${error.message}`);
        }
    }

    // Change password
    async changePassword(currentPassword, newPassword) {
        try {
            // Always use backend API - no localStorage fallback
            const response = await this.databaseService.makeRequest('/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            if (response.success) {
                return { success: true, message: response.data.message };
            } else {
                throw new Error(response.error || 'Password change failed');
            }
        } catch (error) {
            throw new Error(`Erro na alteração da password: ${error.message}`);
        }
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }

    // Get authentication token
    getToken() {
        return this.token || localStorage.getItem('auth-token');
    }

    // Update user profile
    async updateProfile(updates) {
        try {
            if (!this.currentUser) {
                throw new Error('Utilizador não autenticado');
            }

            // Always use backend API - no localStorage fallback
            const response = await this.databaseService.makeRequest('/api/users/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(updates)
            });

            if (response.success) {
                this.currentUser = response.data.user;
                return { success: true, user: this.currentUser };
            } else {
                throw new Error(response.error || 'Profile update failed');
            }
        } catch (error) {
            throw new Error(`Erro na atualização do perfil: ${error.message}`);
        }
    }

    // Validate password strength
    validatePassword(password) {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

        const errors = [];
        
        if (password.length < minLength) {
            errors.push(`Password must be at least ${minLength} characters long`);
        }
        if (!hasUpperCase) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!hasLowerCase) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!hasNumbers) {
            errors.push('Password must contain at least one number');
        }
        if (!hasSpecialChars) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Validate email format
    validateEmail(email) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    // Validate name format
    validateName(name) {
        const namePattern = /^[a-zA-ZÀ-ÿ\s'-]+$/;
        return name.length >= 2 && name.length <= 50 && namePattern.test(name);
    }
} 