// Main application service
import { firebaseOperations, authFunctions, useLocalStorage, appId } from './firebaseConfig.js';
import { LocalStorageService } from './localStorageService.js';
import { ValidationService } from './validationService.js';
import { ChartService } from './chartService.js';
import { SuggestionsService } from './suggestionsService.js';
import { UIService } from './uiService.js';
import { AuthManager } from './authManager.js';
import { initialImageData, tableFields } from '../data/initialData.js';

export class AppService {
    constructor() {
        this.userId = null;
        this.healthDataCollection = null;
        this.localHealthRecords = [];
        this.editingRowId = null;
        
        // Initialize services
        this.localStorageService = new LocalStorageService();
        this.chartService = new ChartService();
        this.uiService = new UIService();
        this.authManager = new AuthManager();
        
        // Bind methods
        this.handleEditClick = this.handleEditClick.bind(this);
        this.handleSaveClick = this.handleSaveClick.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    async initialize() {
        try {
            // Check if user is authenticated
            if (this.authManager.isAuthenticated()) {
                const user = this.authManager.getCurrentUser();
                if (user) {
                    this.userId = user.id;
                    await this.setupAuth();
                } else {
                    // Show login if not authenticated
                    this.authManager.showLogin();
                    return;
                }
            } else {
                // Show login if not authenticated
                this.authManager.showLogin();
                return;
            }
        } catch (error) {
            console.error('Failed to initialize app:', error);
            this.uiService.showToast('Erro ao inicializar a aplicação.');
        }
    }

    async setupAuth() {
        if (useLocalStorage) {
            // Local storage mode
            this.userId = 'local-user-' + Date.now();
            this.uiService.updateUserIdDisplay(this.userId, true);
            await this.seedInitialData();
            await this.loadHealthData();
            this.uiService.hideLoading();
            return;
        }

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
        if (useLocalStorage) {
            this.localHealthRecords = this.localStorageService.seedInitialData(initialImageData);
        } else {
            const snapshot = await firebaseOperations.getDocuments(this.healthDataCollection);
            if (snapshot.empty) {
                for (const record of initialImageData) {
                    await firebaseOperations.addDocument(this.healthDataCollection, record);
                }
            }
        }
    }

    async loadHealthData() {
        if (useLocalStorage) {
            this.updateUI();
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            if (!token) {
                console.log('No auth token found, skipping data load');
                return;
            }

            const response = await fetch('http://localhost:3000/api/health-records', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch health records');
            }

            const data = await response.json();
            this.localHealthRecords = data.records || [];
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
        this.chartService.updateCharts(this.localHealthRecords);
        
        const suggestions = SuggestionsService.generateSuggestions(this.localHealthRecords[0]);
        const suggestionsContainer = document.getElementById('suggestions-container');
        SuggestionsService.renderSuggestions(suggestions, suggestionsContainer);
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
            if (useLocalStorage) {
                const newRecord = this.localStorageService.addRecord(data);
                this.localHealthRecords.unshift(newRecord);
            } else {
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
            }

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
            if (useLocalStorage) {
                this.localStorageService.updateRecord(docId, updatedData);
                this.localHealthRecords = this.localStorageService.getAllRecords();
            } else {
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
            }
            
            this.uiService.showToast("Registo atualizado com sucesso!", false);
            // Refresh the data after successful update
            await this.loadHealthData();
        } catch (error) {
            console.error('Error updating health record:', error);
            this.uiService.showToast(`Não foi possível guardar as alterações: ${error.message}`);
        } finally {
            this.editingRowId = null;
        }
    }

    async handleDeleteClick(docId) {
        this.uiService.showConfirmModal(async () => {
            if (docId === this.editingRowId) {
                this.editingRowId = null;
            }
            
            try {
                if (useLocalStorage) {
                    this.localHealthRecords = this.localStorageService.deleteRecord(docId);
                } else {
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