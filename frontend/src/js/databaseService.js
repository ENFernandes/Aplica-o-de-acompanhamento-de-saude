// Database service for PostgreSQL operations
export class DatabaseService {
    constructor() {
        // Use same-origin API by default; Caddy proxies /api to backend in Docker/Prod
        this.baseUrl = '';
        this.isConnected = false;
    }

    // Generic request method for all API calls
    async makeRequest(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}`;
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            };

            const requestOptions = {
                ...defaultOptions,
                ...options
            };

            console.log(`Making request to: ${url}`, requestOptions);

            const response = await fetch(url, requestOptions);
            
            // Handle non-JSON responses (like rate limit errors)
            let data;
            const responseText = await response.text(); // Read response body once
            
            try {
                data = JSON.parse(responseText);
            } catch (error) {
                // If response is not JSON, return the text
                return {
                    success: false,
                    error: responseText || 'Request failed',
                    status: response.status
                };
            }

            if (!response.ok) {
                return {
                    success: false,
                    error: data.error || data.message || 'Request failed',
                    status: response.status
                };
            }

            return {
                success: true,
                data: data,
                status: response.status
            };
        } catch (error) {
            console.error('Request failed:', error);
            return {
                success: false,
                error: error.message || 'Network error',
                status: 0
            };
        }
    }

    // Test database connection
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (response.ok) {
                this.isConnected = true;
                return true;
            }
            return false;
        } catch (error) {
            console.error('Database connection failed:', error);
            this.isConnected = false;
            return false;
        }
    }

    // Authentication methods
    async registerUser(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Registration failed');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Registration error: ${error.message}`);
        }
    }

    async loginUser(credentials) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Login failed');
            }

            const result = await response.json();
            
            // Store JWT token
            if (result.token) {
                localStorage.setItem('auth-token', result.token);
            }

            return result;
        } catch (error) {
            throw new Error(`Login error: ${error.message}`);
        }
    }

    async logoutUser() {
        try {
            const token = localStorage.getItem('auth-token');
            if (token) {
                await fetch(`${this.baseUrl}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
            
            localStorage.removeItem('auth-token');
            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            localStorage.removeItem('auth-token');
            return { success: true };
        }
    }

    async getCurrentUser() {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) return null;

            const response = await fetch(`${this.baseUrl}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                localStorage.removeItem('auth-token');
                return null;
            }

            return await response.json();
        } catch (error) {
            console.error('Get current user error:', error);
            localStorage.removeItem('auth-token');
            return null;
        }
    }

    // Health records methods
    async getHealthRecords(userId) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/health-records`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch health records');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Get health records error: ${error.message}`);
        }
    }

    async createHealthRecord(recordData) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/health-records`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create health record');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Create health record error: ${error.message}`);
        }
    }

    async updateHealthRecord(recordId, recordData) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/health-records/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(recordData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update health record');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Update health record error: ${error.message}`);
        }
    }

    async deleteHealthRecord(recordId) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/health-records/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to delete health record');
            }

            return { success: true };
        } catch (error) {
            throw new Error(`Delete health record error: ${error.message}`);
        }
    }

    // User profile methods
    async updateUserProfile(profileData) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to update profile');
            }

            return await response.json();
        } catch (error) {
            throw new Error(`Update profile error: ${error.message}`);
        }
    }

    async changePassword(passwordData) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to change password');
            }

            return { success: true };
        } catch (error) {
            throw new Error(`Change password error: ${error.message}`);
        }
    }

    async requestPasswordReset(email) {
        try {
            const response = await fetch(`${this.baseUrl}/auth/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Failed to send reset email');
            }

            return { success: true };
        } catch (error) {
            throw new Error(`Password reset error: ${error.message}`);
        }
    }

    // Utility methods
    getAuthToken() {
        return localStorage.getItem('auth-token');
    }

    isAuthenticated() {
        return !!this.getAuthToken();
    }

    clearAuth() {
        localStorage.removeItem('auth-token');
    }
} 