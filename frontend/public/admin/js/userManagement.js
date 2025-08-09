// User Management Service
export class UserManagementService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.users = [];
        this.filters = {
            search: '',
            type: '',
            status: ''
        };
    }

    // Load all users
    async loadUsers() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.users = data.users || [];
                this.renderUsersTable();
                return this.users;
            } else {
                throw new Error('Failed to load users');
            }
        } catch (error) {
            console.error('Error loading users:', error);
            // Load mock data for development
            this.loadMockUsers();
        }
    }

    // Load mock users for development
    loadMockUsers() {
        this.users = [
            {
                id: '1',
                name: 'João Silva',
                email: 'joao@example.com',
                role: 'customer',
                status: 'active',
                recordsCount: 15,
                lastLogin: '2024-01-15T10:30:00Z',
                createdAt: '2024-01-01T00:00:00Z'
            },
            {
                id: '2',
                name: 'Maria Santos',
                email: 'maria@example.com',
                role: 'customer',
                status: 'active',
                recordsCount: 23,
                lastLogin: '2024-01-14T15:45:00Z',
                createdAt: '2024-01-02T00:00:00Z'
            },
            {
                id: '3',
                name: 'Admin User',
                email: 'admin@healthtracker.com',
                role: 'admin',
                status: 'active',
                recordsCount: 0,
                lastLogin: '2024-01-15T12:00:00Z',
                createdAt: '2024-01-01T00:00:00Z'
            }
        ];
        this.renderUsersTable();
    }

    // Render users table
    renderUsersTable() {
        const tbody = document.getElementById('users-table-body');
        if (!tbody) return;

        const filteredUsers = this.filterUsers();
        
        tbody.innerHTML = filteredUsers.map(user => `
            <tr class="user-row">
                <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                            <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span class="text-sm font-medium text-blue-800">${user.name.charAt(0).toUpperCase()}</span>
                            </div>
                        </div>
                        <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900 cursor-pointer hover:text-blue-600" 
                                 onclick="userManagement.openUserProfile('${user.id}')" 
                                 title="Clicar para abrir perfil do utilizador">
                                ${user.name}
                            </div>
                            <div class="text-sm text-gray-500">${user.email}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${user.role === 'admin' ? 'status-admin' : 'status-customer'}">
                        ${user.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${user.recordsCount}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(user.lastLogin)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">
                        ${user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex space-x-2">
                        <button class="action-btn action-btn-reset-password" onclick="userManagement.resetPassword('${user.id}')">
                            🔑 Repor Password
                        </button>
                        ${user.role !== 'admin' ? `
                            <button class="action-btn action-btn-promote" onclick="userManagement.promoteUser('${user.id}')">
                                ⬆️ Promover
                            </button>
                        ` : ''}
                        <button class="action-btn action-btn-delete" onclick="userManagement.deleteUser('${user.id}')">
                            🗑️ Eliminar
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Filter users
    filterUsers() {
        return this.users.filter(user => {
            const matchesSearch = !this.filters.search || 
                user.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                user.email.toLowerCase().includes(this.filters.search.toLowerCase());
            
            const matchesType = !this.filters.type || user.role === this.filters.type;
            const matchesStatus = !this.filters.status || user.status === this.filters.status;
            
            return matchesSearch && matchesType && matchesStatus;
        });
    }

    // Apply filters
    applyFilters() {
        this.renderUsersTable();
    }

    // Format date
    formatDate(dateString) {
        if (!dateString) return 'Nunca';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // View user details - REMOVED (replaced by openUserProfile)
    // async viewUser(userId) { ... }

    // Edit user - REMOVED (replaced by openUserProfile)
    // async editUser(userId) { ... }

    // Open user profile in main app
    async openUserProfile(userId) {
        // Open user profile in main app
        
        const user = this.users.find(u => u.id.toString() === userId.toString());
        
        if (!user) {
            console.warn('User not found for ID:', userId);
            return;
        }

        // Set this user as the active user using the UserActive system
        localStorage.setItem('userActive', userId);
        
        // Set a flag to indicate this user came from BackOffice
        localStorage.setItem('userFromBackOffice', 'true');
        
        // Redirect to main app
        window.location.href = 'personalArea.html';
    }

    // Promote user to admin
    async promoteUser(userId) {
        const user = this.users.find(u => u.id.toString() === userId.toString());
        if (!user) {
            console.warn('User not found for promote ID:', userId);
            return;
        }

        if (!confirm(`Tem a certeza que deseja promover "${user.name}" para administrador?`)) {
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}/promote`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`Utilizador "${user.name}" promovido para administrador com sucesso!`);
                await this.loadUsers();
            } else {
                const error = await response.json();
                alert(`Erro ao promover utilizador: ${error.error}`);
            }
        } catch (error) {
            console.error('Error promoting user:', error);
            alert('Erro ao promover utilizador');
        }
    }

    // Delete user
    async deleteUser(userId) {
        const user = this.users.find(u => u.id.toString() === userId.toString());
        
        if (!user) {
            console.warn('User not found for delete ID:', userId);
            return;
        }

        const confirmMessage = `Tem a certeza que deseja eliminar o utilizador "${user.name}"?\n\nEsta ação não pode ser desfeita e todos os dados do utilizador serão perdidos.`;
        
        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert(`Utilizador "${user.name}" eliminado com sucesso!`);
                await this.loadUsers();
            } else {
                const error = await response.json();
                alert(`Erro ao eliminar utilizador: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erro ao eliminar utilizador');
        }
    }

    // Reset user password
    async resetPassword(userId) {
        const user = this.users.find(u => u.id.toString() === userId.toString());
        
        if (!user) {
            console.warn('User not found for reset password ID:', userId);
            return;
        }

        // Prompt for new password
        const newPassword = prompt(`Introduza a nova password para "${user.name}":\n\nA password deve ter pelo menos 6 caracteres.`);
        
        if (!newPassword) {
            return; // User cancelled
        }

        if (newPassword.length < 6) {
            alert('A password deve ter pelo menos 6 caracteres.');
            return;
        }

        // Confirm password
        const confirmPassword = prompt('Confirme a nova password:');
        
        if (newPassword !== confirmPassword) {
            alert('As passwords não coincidem.');
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            // prepare request
            
            const response = await fetch(`${this.baseUrl}/api/admin/users/${userId}/reset-password`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    newPassword: newPassword
                })
            });


            if (response.ok) {
                alert(`Password do utilizador "${user.name}" alterada com sucesso!`);
            } else {
                const error = await response.json();
                alert(`Erro ao alterar password: ${error.error}`);
            }
        } catch (error) {
            console.error('Error resetting password:', error);
            alert('Erro ao alterar password');
        }
    }

    // Export users
    exportUsers() {
        const filteredUsers = this.filterUsers();
        const csvContent = this.convertToCSV(filteredUsers);
        this.downloadCSV(csvContent, 'users.csv');
    }

    // Convert to CSV
    convertToCSV(users) {
        const headers = ['Nome', 'Email', 'Tipo', 'Status', 'Registos', 'Último Login', 'Data de Registo'];
        const rows = users.map(user => [
            user.name,
            user.email,
            user.role === 'admin' ? 'Admin' : 'Customer',
            user.status === 'active' ? 'Ativo' : 'Inativo',
            user.recordsCount,
            this.formatDate(user.lastLogin),
            this.formatDate(user.createdAt)
        ]);

        return [headers, ...rows].map(row => row.join(',')).join('\n');
    }

    // Download CSV
    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// User Management Manager
export class UserManagementManager {
    constructor() {
        this.userService = new UserManagementService();
        this.setupEventListeners();
    }

    // Initialize user management
    async initialize() {
        // init
        
        try {
            await this.userService.loadUsers();
            // loaded
        } catch (error) {
            console.error('Error initializing user management:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('user-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.userService.filters.search = e.target.value;
                this.userService.applyFilters();
            });
        }

        // Type filter
        const typeFilter = document.getElementById('user-type-filter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.userService.filters.type = e.target.value;
                this.userService.applyFilters();
            });
        }

        // Status filter
        const statusFilter = document.getElementById('user-status-filter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.userService.filters.status = e.target.value;
                this.userService.applyFilters();
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-users-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.userService.exportUsers();
            });
        }
    }

    // Get user service
    getUserService() {
        return this.userService;
    }
}

// Initialize user management when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
        // bootstrap
    
    try {
        // Create the user management instance immediately
        const userManagementInstance = new UserManagementManager();
        await userManagementInstance.initialize();
        
        // Create the global userManagement object with direct method calls
        window.userManagement = {
            openUserProfile: (userId) => {
                console.log('Calling openUserProfile with:', userId);
                return userManagementInstance.userService.openUserProfile(userId);
            },
            deleteUser: (userId) => {
                console.log('Calling deleteUser with:', userId);
                return userManagementInstance.userService.deleteUser(userId);
            },
            promoteUser: (userId) => {
                console.log('Calling promoteUser with:', userId);
                return userManagementInstance.userService.promoteUser(userId);
            },
            resetPassword: (userId) => {
                console.log('Calling resetPassword with:', userId);
                return userManagementInstance.userService.resetPassword(userId);
            },
            instance: userManagementInstance,
            isReady: true
        };
        
        
    } catch (error) {
        console.error('Error initializing user management:', error);
        
        // Fallback: create basic functions that at least don't crash
        window.userManagement = {
            openUserProfile: (userId) => {
                console.log('Fallback openUserProfile called with:', userId);
                alert('Funcionalidade temporariamente indisponível');
            },
            deleteUser: (userId) => {
                console.log('Fallback deleteUser called with:', userId);
                alert('Funcionalidade temporariamente indisponível');
            },
            promoteUser: (userId) => {
                console.log('Fallback promoteUser called with:', userId);
                alert('Funcionalidade temporariamente indisponível');
            },
            resetPassword: (userId) => {
                console.log('Fallback resetPassword called with:', userId);
                alert('Funcionalidade temporariamente indisponível');
            },
            isReady: false
        };
    }
}); 