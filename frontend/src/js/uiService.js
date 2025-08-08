// UI service for notifications and modal management
import { ValidationService } from './validationService.js';
import { tableFields } from '../data/initialData.js';

export class UIService {
    constructor() {
        this.confirmCallback = null;
        this.toast = document.getElementById('toast-notification');
        this.toastMessage = document.getElementById('toast-message');
        this.confirmModal = document.getElementById('confirm-modal');
        this.modalConfirmBtn = document.getElementById('modal-confirm-btn');
        this.modalCancelBtn = document.getElementById('modal-cancel-btn');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        this.modalConfirmBtn?.addEventListener('click', () => {
            if (this.confirmCallback) this.confirmCallback();
            this.hideConfirmModal();
        });

        this.modalCancelBtn?.addEventListener('click', () => {
            this.hideConfirmModal();
        });
    }

    showToast(message, isError = true) {
        if (!this.toastMessage) return;
        
        this.toastMessage.textContent = message;
        this.toast.classList.toggle('bg-red-500', isError);
        this.toast.classList.toggle('bg-green-500', !isError);
        this.toast.classList.remove('hidden');
        
        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 3000);
    }

    showConfirmModal(onConfirm) {
        this.confirmCallback = onConfirm;
        this.confirmModal?.classList.remove('hidden');
    }

    hideConfirmModal() {
        this.confirmModal?.classList.add('hidden');
        this.confirmCallback = null;
    }

    showLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        const mainContent = document.getElementById('main-content');
        
        loadingIndicator?.classList.remove('hidden');
        mainContent?.classList.add('hidden');
    }

    hideLoading() {
        const loadingIndicator = document.getElementById('loading-indicator');
        const mainContent = document.getElementById('main-content');
        
        loadingIndicator?.classList.add('hidden');
        mainContent?.classList.remove('hidden');
    }

    updateUserIdDisplay(userId, isLocalMode = false) {
        const userIdDisplay = document.getElementById('user-id-display');
        if (userIdDisplay) {
            if (isLocalMode) {
                userIdDisplay.textContent = 'Modo Local - Dados salvos no navegador';
            } else {
                userIdDisplay.textContent = `Seu ID de Usuário: ${userId}`;
            }
        }
    }

    async resetForm() {
        const healthForm = document.getElementById('health-form');
        const dateInput = document.getElementById('date');
        const heightInput = document.getElementById('height');
        
        healthForm?.reset();
        if (dateInput) {
            dateInput.value = new Date().toISOString().split('T')[0];
        }
        
        // Set height and age from user profile if available
        await this.populateHeightAndAge();
    }
    
    async populateHeightAndAge() {
        const heightInput = document.getElementById('height');
        const ageInput = document.getElementById('age');
        
        console.log('Populating height and age fields...');
        console.log('Height input found:', !!heightInput);
        console.log('Age input found:', !!ageInput);
        
        // Try to get current user from localStorage or global state
        try {
            // Check if we have a current user in localStorage or global state
            const token = localStorage.getItem('auth-token');
            if (token) {
                console.log('Token found, fetching user data...');
                // Try to get user data from a global variable or make an API call
                await this.fetchAndPopulateUserData();
            } else {
                console.log('No token found, setting placeholders');
                if (heightInput) heightInput.placeholder = 'Defina a sua altura no perfil';
                if (ageInput) ageInput.placeholder = 'Defina a sua data de nascimento no perfil';
            }
        } catch (error) {
            console.log('Could not populate height/age from profile:', error);
        }
    }
    
    async fetchAndPopulateUserData() {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) return;
            
            // Check if we have a UserActive set
            const userActive = localStorage.getItem('userActive');
            let endpoint = 'http://localhost:3000/api/users/profile';
            
            if (userActive) {
                // Use the specific user endpoint if we have a UserActive
                endpoint = `http://localhost:3000/api/users/${userActive}/profile`;
                console.log('Using UserActive endpoint:', endpoint);
            } else {
                console.log('Using authenticated user endpoint:', endpoint);
            }
            
            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const user = data.user;
                
                if (user) {
                    console.log('User data fetched:', user);
                    // Update height field
                    this.updateHeightFromProfile(user);
                    // Update age field
                    this.updateAgeFromProfile(user);
                }
            } else {
                console.error('Failed to fetch user data:', response.status);
            }
        } catch (error) {
            console.log('Could not fetch user data:', error);
        }
    }

    createRowElement(record, isEditing, onEdit, onSave, onDelete) {
        const validationErrors = ValidationService.validateRecord(record);
        const errorsByField = validationErrors.reduce((acc, err) => ({ ...acc, [err.field]: err.message }), {});
        
        const row = document.createElement('tr');
        row.className = 'border-b border-gray-200 md:border-b-0';
        row.dataset.id = record.id;
        row.dataset.height = record.height;

        // Create cells for each field
        tableFields.forEach(({key, label}) => {
            const cell = document.createElement('td');
            const error = errorsByField[key];
            cell.className = `py-2 px-4 relative ${error ? 'border-2 border-red-400' : ''}`;
            cell.dataset.label = label;
            cell.dataset.field = key;
            if (error) cell.title = error;
            
            const value = record[key];
            
            if (isEditing) {
                cell.classList.add('bg-blue-50');
                if (key === 'date') {
                    cell.dataset.value = value || '';
                    cell.innerHTML = `<input type="date" value="${value || ''}" class="bg-transparent w-full p-1 -m-1 rounded border border-blue-300">`;
                } else {
                    cell.setAttribute('contenteditable', 'true');
                    cell.textContent = value != null ? value : '';
                }
            } else {
                cell.textContent = ValidationService.formatDisplayValue(value, key);
            }
            row.appendChild(cell);
        });

        // Create actions cell
        const actionsCell = document.createElement('td');
        actionsCell.className = 'py-2 px-4 text-center';
        actionsCell.dataset.label = 'Ações';
        actionsCell.innerHTML = `
            <div class="flex justify-end md:justify-center">
                <button class="edit-btn text-blue-500 hover:text-blue-700 text-xl mx-1 ${isEditing ? 'hidden' : ''}" title="Editar">✏️</button>
                <button class="save-btn text-green-500 hover:text-green-700 text-xl mx-1 ${isEditing ? '' : 'hidden'}" title="Guardar">✅</button>
                <button class="delete-btn text-red-500 hover:text-red-700 text-xl mx-1" title="Eliminar">🗑️</button>
            </div>
        `;
        
        actionsCell.querySelector('.edit-btn')?.addEventListener('click', () => onEdit(record.id));
        actionsCell.querySelector('.save-btn')?.addEventListener('click', () => onSave(record.id));
        actionsCell.querySelector('.delete-btn')?.addEventListener('click', () => onDelete(record.id));
        
        row.appendChild(actionsCell);
        return row;
    }

    updateHistoryTable(records, editingRowId, onEdit, onSave, onDelete) {
        const historyTableBody = document.getElementById('history-table-body');
        if (!historyTableBody) return;

        historyTableBody.innerHTML = '';
        
        if (records.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="9" class="text-center py-4">Nenhum registro encontrado.</td></tr>`;
            return;
        }

        records.forEach(record => {
            const row = this.createRowElement(
                record, 
                record.id === editingRowId, 
                onEdit, 
                onSave, 
                onDelete
            );
            historyTableBody.appendChild(row);
        });
    }
    
    updateHeightFromProfile(user) {
        const heightInput = document.getElementById('height');
        console.log('Setting height field with user data:', user?.height);
        
        if (heightInput && user && user.height) {
            heightInput.value = user.height;
            heightInput.readOnly = true;
            heightInput.classList.add('bg-gray-100', 'cursor-not-allowed');
            console.log('Height updated from profile:', user.height);
            
            // Update profile info banner
            this.updateProfileInfoBanner(user);
        } else if (heightInput) {
            console.log('No height in profile, showing placeholder');
            heightInput.placeholder = 'Defina a sua altura no perfil';
        }
    }
    
    calculateAgeFromBirthday(birthday) {
        if (!birthday) return null;
        
        const today = new Date();
        const birthDate = new Date(birthday);
        
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age;
    }
    
    updateAgeFromProfile(user) {
        const ageInput = document.getElementById('age');
        console.log('Setting age field with user data:', user?.birthday);
        
        if (ageInput && user && user.birthday) {
            const age = this.calculateAgeFromBirthday(user.birthday);
            if (age !== null) {
                ageInput.value = age;
                ageInput.readOnly = true;
                ageInput.classList.add('bg-gray-100', 'cursor-not-allowed');
                console.log('Age calculated from profile birthday:', age);
                
                // Update profile info banner
                this.updateProfileInfoBanner(user);
            }
        } else if (ageInput) {
            console.log('No birthday in profile, showing placeholder');
            ageInput.placeholder = 'Defina a sua data de nascimento no perfil';
        }
    }
    
    updateProfileInfoBanner(user) {
        const banner = document.getElementById('profile-info-banner');
        const heightInfo = document.getElementById('profile-height-info');
        const ageInfo = document.getElementById('profile-age-info');
        const heightValue = document.getElementById('profile-height-value');
        const ageValue = document.getElementById('profile-age-value');
        
        if (banner && user) {
            let hasInfo = false;
            
            // Show height info
            if (user.height) {
                heightInfo.classList.remove('hidden');
                heightValue.textContent = user.height;
                hasInfo = true;
            }
            
            // Show age info
            if (user.birthday) {
                const age = this.calculateAgeFromBirthday(user.birthday);
                if (age !== null) {
                    ageInfo.classList.remove('hidden');
                    ageValue.textContent = age;
                    hasInfo = true;
                }
            }
            
            // Show banner if we have any info
            if (hasInfo) {
                banner.classList.remove('hidden');
            }
        }
    }
} 