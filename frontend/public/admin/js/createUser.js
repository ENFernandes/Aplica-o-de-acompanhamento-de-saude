// Create User Management
export class CreateUserService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
    }

    // Create new user
    async createUser(userData) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/users`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                return { success: true, user: data.user };
            } else {
                const error = await response.json();
                throw new Error(error.error || 'Erro ao criar utilizador');
            }
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    // Validate form data
    validateForm(formData) {
        const errors = [];

        // Required fields
        if (!formData.name || formData.name.trim().length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!formData.email || !formData.email.includes('@')) {
            errors.push('Email inválido');
        }

        if (!formData.password || formData.password.length < 6) {
            errors.push('Password deve ter pelo menos 6 caracteres');
        }

        if (formData.password !== formData.confirmPassword) {
            errors.push('As passwords não coincidem');
        }

        // Optional validations
        if (formData.phone && !/^\+?[\d\s\-\(\)]+$/.test(formData.phone)) {
            errors.push('Telemóvel inválido');
        }

        if (formData.tax_id && !/^\d{9}$/.test(formData.tax_id)) {
            errors.push('NIF deve ter 9 dígitos');
        }

        if (formData.height && (formData.height < 100 || formData.height > 250)) {
            errors.push('Altura deve estar entre 100 e 250 cm');
        }

        if (formData.birthday) {
            const birthDate = new Date(formData.birthday);
            const today = new Date();
            if (birthDate >= today) {
                errors.push('Data de nascimento deve ser no passado');
            }
        }

        return errors;
    }
}

export class CreateUserManager {
    constructor() {
        this.createUserService = new CreateUserService();
        this.setupEventListeners();
    }

    // Setup event listeners
    setupEventListeners() {
        const form = document.getElementById('create-user-form');
        const cancelBtn = document.getElementById('cancel-create-user');

        if (form) {
            form.addEventListener('submit', this.handleSubmit.bind(this));
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', this.handleCancel.bind(this));
        }

        // Add real-time validation
        this.setupValidation();
    }

    // Setup real-time validation
    setupValidation() {
        const passwordInput = document.getElementById('create-password');
        const confirmPasswordInput = document.getElementById('create-confirm-password');

        if (passwordInput && confirmPasswordInput) {
            confirmPasswordInput.addEventListener('input', () => {
                this.validatePasswords();
            });
        }
    }

    // Validate passwords match
    validatePasswords() {
        const passwordInput = document.getElementById('create-password');
        const confirmPasswordInput = document.getElementById('create-confirm-password');
        const submitBtn = document.getElementById('submit-create-user');

        if (!passwordInput || !confirmPasswordInput || !submitBtn) return;

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (confirmPassword && password !== confirmPassword) {
            confirmPasswordInput.classList.add('border-red-500');
            confirmPasswordInput.classList.remove('border-gray-300');
            submitBtn.disabled = true;
        } else {
            confirmPasswordInput.classList.remove('border-red-500');
            confirmPasswordInput.classList.add('border-gray-300');
            submitBtn.disabled = false;
        }
    }

    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone') || null,
            tax_id: formData.get('tax_id') || null,
            address: formData.get('address') || null,
            height: formData.get('height') ? parseInt(formData.get('height')) : null,
            birthday: formData.get('birthday') || null,
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        // Validate form data
        const errors = this.createUserService.validateForm(userData);
        
        if (errors.length > 0) {
            alert('Erros de validação:\n\n' + errors.join('\n'));
            return;
        }

        // Disable submit button
        const submitBtn = document.getElementById('submit-create-user');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = 'A criar...';
        }

        try {
            const result = await this.createUserService.createUser(userData);
            
            if (result.success) {
                alert(`Utilizador "${userData.name}" criado com sucesso!`);
                this.resetForm();
                
                // Refresh users list if available
                if (window.userManagement && window.userManagement.instance) {
                    await window.userManagement.instance.userService.loadUsers();
                }
            }
        } catch (error) {
            alert(`Erro ao criar utilizador: ${error.message}`);
        } finally {
            // Re-enable submit button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Criar Utilizador';
            }
        }
    }

    // Handle cancel
    handleCancel() {
        if (confirm('Tem a certeza que deseja cancelar? Os dados introduzidos serão perdidos.')) {
            this.resetForm();
            // Switch to users section
            const usersBtn = document.getElementById('nav-users');
            if (usersBtn) {
                usersBtn.click();
            }
        }
    }

    // Reset form
    resetForm() {
        const form = document.getElementById('create-user-form');
        if (form) {
            form.reset();
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Initializing create user management...');
    
    try {
        const createUserManager = new CreateUserManager();
        window.createUserManager = createUserManager;
        console.log('Create user management initialized successfully');
    } catch (error) {
        console.error('Error initializing create user management:', error);
    }
});
