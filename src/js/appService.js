// Main application service
import { ValidationService } from './validationService.js';
import { UIService } from './uiService.js';
import { ChartService } from './chartService.js';
import { tableFields } from '../../../../src/data/initialData.js';

export class AppService {
    constructor() {
        this.userId = null;
        this.healthDataCollection = null;
        this.localHealthRecords = [];
        this.editingRowId = null;
        
        // Initialize services
        this.uiService = new UIService();
        this.chartService = new ChartService();
        
        // Bind methods
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async initialize() {
        try {
            // Check if user is authenticated by checking token
            const token = localStorage.getItem('auth-token');
            if (token) {
                // Try to decode token to get user info
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    const currentTime = Math.floor(Date.now() / 1000);
                    
                    if (payload.exp && payload.exp > currentTime && payload.userId) {
                        // Check if we have a UserActive set
                        const userActive = localStorage.getItem('userActive');
                        if (userActive) {
                            this.userId = userActive;
                            console.log('Using UserActive ID:', userActive);
                        } else {
                            this.userId = payload.userId;
                            console.log('Using token userId:', payload.userId);
                        }
                        await this.setupAuth();
                    } else {
                        // Token expired or invalid
                        localStorage.removeItem('auth-token');
                        localStorage.removeItem('userActive');
                        console.log('Token expired or invalid');
                        return;
                    }
                } catch (error) {
                    console.error('Error decoding token:', error);
                    localStorage.removeItem('auth-token');
                    localStorage.removeItem('userActive');
                    return;
                }
            } else {
                console.log('No auth token found');
                return;
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.uiService.showToast('Erro ao inicializar a aplicação.');
        }
    }

    async setupAuth() {
        try {
            // Database mode - load health data from backend
            await this.loadHealthData();
            this.uiService.hideLoading();
        } catch (error) {
            console.error("Authentication failed:", error);
            this.uiService.showToast('Erro ao carregar dados de saúde');
            this.uiService.hideLoading();
        }
    }

    async seedInitialData() {
        console.log('Skipping initial data seeding');
    }

    async loadHealthData() {
        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                console.log('No auth token found, skipping data load');
                return;
            }

            // Check if we have a UserActive set
            const userActive = localStorage.getItem('userActive');
            let endpoint = 'http://localhost:3000/api/health-records';
            
            if (userActive) {
                // Use the specific user endpoint if we have a UserActive
                endpoint = `http://localhost:3000/api/users/${userActive}/health-records`;
                console.log('Using UserActive endpoint for health records:', endpoint);
            } else {
                console.log('Using authenticated user endpoint for health records:', endpoint);
            }

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch health records');
            }

            const data = await response.json();
            
            // Convert snake_case field names to camelCase for frontend compatibility
            this.localHealthRecords = (data.records || []).map(record => {
                const convertedRecord = { ...record };
                
                // Convert field names from snake_case to camelCase
                const fieldMappings = {
                    body_fat_percentage: 'bodyFatPercentage',
                    muscle_mass: 'muscleMass',
                    bone_mass: 'boneMass',
                    metabolic_age: 'metabolicAge',
                    water_percentage: 'waterPercentage',
                    visceral_fat: 'visceralFat',
                    fat_right_arm: 'fatRightArm',
                    fat_left_arm: 'fatLeftArm',
                    fat_right_leg: 'fatRightLeg',
                    fat_left_leg: 'fatLeftLeg',
                    fat_trunk: 'fatTrunk'
                };
                
                Object.keys(fieldMappings).forEach(snakeKey => {
                    if (convertedRecord.hasOwnProperty(snakeKey)) {
                        convertedRecord[fieldMappings[snakeKey]] = convertedRecord[snakeKey];
                        delete convertedRecord[snakeKey];
                    }
                });
                
                return convertedRecord;
            });
            
            this.updateUI();
            console.log('Health records loaded:', this.localHealthRecords.length);
        } catch (error) {
            console.error('Error loading health data:', error);
            this.uiService.showToast('Erro ao carregar dados de saúde');
        }
    }

    updateUI() {
        this.uiService.updateHistoryTable(
            this.localHealthRecords, 
            this.editingRowId, 
            this.handleEditClick, 
            this.handleSaveClick, 
            this.handleDeleteClick
        );
        
        // Initialize and update charts with a small delay to ensure DOM is ready
        setTimeout(() => {
            this.chartService.initializeCharts();
            this.chartService.updateCharts(this.localHealthRecords);
        }, 100);
        
        console.log('UI updated with', this.localHealthRecords.length, 'records');
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        // Parse numeric fields
        Object.keys(data).forEach(key => {
            if (key !== 'date') {
                data[key] = data[key] ? parseFloat(data[key]) : null;
            }
        });

        // Validate form data
        const validationErrors = ValidationService.validateFormData(data);
        if (validationErrors.length > 0) {
            this.uiService.showToast(validationErrors[0].message);
            return;
        }

        try {
            // Send to backend API
            const token = localStorage.getItem('auth-token');
            if (!token) {
                this.uiService.showToast("Erro: Não está autenticado.");
                return;
            }

            const response = await fetch('http://localhost:3000/api/health-records', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao guardar no servidor');
            }

            const result = await response.json();
            console.log('Health record saved successfully:', result);

            await this.uiService.resetForm();
            this.uiService.showToast("Novo registo guardado com sucesso!", false);
            
            // Refresh the data after successful save
            await this.loadHealthData();
        } catch (error) {
            console.error('Error saving health record:', error);
            this.uiService.showToast(`Erro ao guardar os dados: ${error.message}`);
        }
    }

    async handleEditClick(docId) {
        if (this.editingRowId) return;
        this.editingRowId = docId;
        this.updateUI();
    }

    async handleSaveClick(docId) {
        const row = document.querySelector(`tr[data-id='${docId}']`);
        if (!row) return;

        const updatedData = { height: parseFloat(row.dataset.height) };
        let hasError = false;

        row.querySelectorAll('td[data-field]').forEach(cell => {
            const field = cell.dataset.field;
            let value;
            
            if (field === 'date') {
                const input = cell.querySelector('input');
                value = input ? input.value : null;
                if (!value) hasError = true;
            } else {
                value = cell.textContent.trim();
            }
            
            updatedData[field] = ValidationService.parseCellValue(value, field);
        });

        if (hasError) {
            this.uiService.showToast("Data inválida. Por favor, preencha a data.");
            return;
        }

        try {
            // Send update request to backend API
            const token = localStorage.getItem('auth-token');
            if (!token) {
                this.uiService.showToast("Erro: Não está autenticado.");
                return;
            }

            const response = await fetch(`http://localhost:3000/api/health-records/${docId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao atualizar no servidor');
            }

            const result = await response.json();
            console.log('Health record updated successfully:', result);
            
            this.uiService.showToast("Registo atualizado com sucesso!", false);
            // Exit edit mode
            this.editingRowId = null;
            // Refresh the data after successful update
            await this.loadHealthData();
        } catch (error) {
            console.error('Error updating health record:', error);
            this.uiService.showToast(`Não foi possível guardar as alterações: ${error.message}`);
        }
    }

    async handleDeleteClick(docId) {
        this.uiService.showConfirmModal(async () => {
            if (docId === this.editingRowId) {
                this.editingRowId = null;
            }
            
            try {
                // Send delete request to backend API
                const token = localStorage.getItem('auth-token');
                if (!token) {
                    this.uiService.showToast("Erro: Não está autenticado.");
                    return;
                }

                const response = await fetch(`http://localhost:3000/api/health-records/${docId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Erro ao eliminar no servidor');
                }
                
                this.uiService.showToast("Registo eliminado.", false);
                // Refresh the data after successful delete
                await this.loadHealthData();
            } catch (error) {
                console.error('Error deleting health record:', error);
                this.uiService.showToast(`Não foi possível eliminar o registo: ${error.message}`);
            }
        });
    }

    setupEventListeners() {
        const healthForm = document.getElementById('health-form');
        healthForm?.addEventListener('submit', this.handleFormSubmit);
        
        // Set height from user profile if available
        this.setHeightFromProfile();
    }
    
    setHeightFromProfile() {
        try {
            const currentUser = this.authManager.getCurrentUser();
            if (currentUser) {
                const heightInput = document.getElementById('height');
                if (heightInput && currentUser.height) {
                    heightInput.value = currentUser.height;
                    heightInput.readOnly = true;
                    heightInput.classList.add('bg-gray-100', 'cursor-not-allowed');
                    console.log('Height set from user profile in AppService:', currentUser.height);
                } else if (heightInput && !currentUser.height) {
                    // If no height in profile, show placeholder
                    heightInput.placeholder = 'Defina a sua altura no perfil';
                    console.log('No height in profile, showing placeholder');
                }
            }
        } catch (error) {
            console.log('Could not set height from profile in AppService:', error);
        }
    }
} 