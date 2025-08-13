// Data Management Service
export class DataManagementService {
    constructor() {
        this.baseUrl = '/api';
        this.records = [];
        this.filters = {
            userId: '',
            startDate: '',
            endDate: '',
            search: ''
        };
    }

    // Load all health records
    async loadRecords() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/admin/health-records`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.records = data.records || [];
                this.renderRecordsTable();
                return this.records;
            } else {
                throw new Error('Failed to load records');
            }
        } catch (error) {
            console.error('Error loading records:', error);
            // Load mock data for development
            this.loadMockRecords();
        }
    }

    // Load mock records for development
    loadMockRecords() {
        this.records = [
            {
                id: '1',
                userId: '1',
                userName: 'João Silva',
                date: '2024-01-15',
                weight: 75.5,
                height: 175,
                bmi: 24.7,
                bodyFatPercentage: 15.2,
                muscleMass: 58.3,
                visceralFat: 8.5,
                waterPercentage: 62.1,
                metabolicAge: 28
            },
            {
                id: '2',
                userId: '1',
                userName: 'João Silva',
                date: '2024-01-10',
                weight: 76.2,
                height: 175,
                bmi: 24.9,
                bodyFatPercentage: 15.8,
                muscleMass: 57.9,
                visceralFat: 8.8,
                waterPercentage: 61.8,
                metabolicAge: 29
            },
            {
                id: '3',
                userId: '2',
                userName: 'Maria Santos',
                date: '2024-01-14',
                weight: 62.1,
                height: 165,
                bmi: 22.8,
                bodyFatPercentage: 18.5,
                muscleMass: 45.2,
                visceralFat: 6.2,
                waterPercentage: 64.3,
                metabolicAge: 25
            }
        ];
        this.renderRecordsTable();
    }

    // Render records table
    renderRecordsTable() {
        const tbody = document.getElementById('data-table-body');
        if (!tbody) return;

        const filteredRecords = this.filterRecords();
        
        tbody.innerHTML = filteredRecords.map(record => `
            <tr class="data-row">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.userName}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${this.formatDate(record.date)}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.weight} kg
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.height} cm
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.bmi}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${record.bodyFatPercentage}%
                </td>
                
            </tr>
        `).join('');
    }

    // Filter records
    filterRecords() {
        return this.records.filter(record => {
            const matchesUser = !this.filters.userId || record.userId === this.filters.userId;
            const matchesSearch = !this.filters.search || 
                record.userName.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                record.weight.toString().includes(this.filters.search) ||
                record.height.toString().includes(this.filters.search);
            
            let matchesDate = true;
            if (this.filters.startDate) {
                matchesDate = matchesDate && record.date >= this.filters.startDate;
            }
            if (this.filters.endDate) {
                matchesDate = matchesDate && record.date <= this.filters.endDate;
            }
            
            return matchesUser && matchesSearch && matchesDate;
        });
    }

    // Apply filters
    applyFilters() {
        this.renderRecordsTable();
    }

    // Format date
    formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-PT');
    }

    // View record details
    async viewRecord(recordId) {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return;

        this.showRecordDetailsModal(record);
    }

    // Edit record
    async editRecord(recordId) {
        const record = this.records.find(r => r.id === recordId);
        if (!record) return;

        this.showEditRecordModal(record);
    }

    // Delete record
    async deleteRecord(recordId) {
        if (!confirm('Tem a certeza que deseja eliminar este registo? Esta ação não pode ser desfeita.')) {
            return;
        }

        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/admin/health-records/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                alert('Registo eliminado com sucesso!');
                await this.loadRecords();
            } else {
                const error = await response.json();
                alert(`Erro ao eliminar registo: ${error.error}`);
            }
        } catch (error) {
            console.error('Error deleting record:', error);
            alert('Erro ao eliminar registo');
        }
    }

    // Show record details modal
    showRecordDetailsModal(record) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Detalhes do Registo</h3>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Utilizador</label>
                            <p class="text-sm text-gray-900">${record.userName}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Data</label>
                            <p class="text-sm text-gray-900">${this.formatDate(record.date)}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Peso</label>
                            <p class="text-sm text-gray-900">${record.weight} kg</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Altura</label>
                            <p class="text-sm text-gray-900">${record.height} cm</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">IMC</label>
                            <p class="text-sm text-gray-900">${record.bmi}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">% Gordura</label>
                            <p class="text-sm text-gray-900">${record.bodyFatPercentage}%</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Massa Muscular</label>
                            <p class="text-sm text-gray-900">${record.muscleMass} kg</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Gordura Visceral</label>
                            <p class="text-sm text-gray-900">${record.visceralFat}</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">% Água</label>
                            <p class="text-sm text-gray-900">${record.waterPercentage}%</p>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700">Idade Metabólica</label>
                            <p class="text-sm text-gray-900">${record.metabolicAge} anos</p>
                        </div>
                    </div>
                    <div class="mt-6 flex justify-end">
                        <button onclick="this.closest('.fixed').remove()" class="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                            Fechar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    // Show edit record modal
    showEditRecordModal(record) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full">
                <div class="p-6">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">Editar Registo</h3>
                    <form id="edit-record-form" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Data</label>
                                <input type="date" id="edit-record-date" value="${record.date}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Peso (kg)</label>
                                <input type="number" step="0.1" id="edit-record-weight" value="${record.weight}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Altura (cm)</label>
                                <input type="number" id="edit-record-height" value="${record.height}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">% Gordura</label>
                                <input type="number" step="0.1" id="edit-record-body-fat" value="${record.bodyFatPercentage}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Massa Muscular (kg)</label>
                                <input type="number" step="0.1" id="edit-record-muscle-mass" value="${record.muscleMass}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Gordura Visceral</label>
                                <input type="number" step="0.1" id="edit-record-visceral-fat" value="${record.visceralFat}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">% Água</label>
                                <input type="number" step="0.1" id="edit-record-water" value="${record.waterPercentage}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Idade Metabólica</label>
                                <input type="number" id="edit-record-metabolic-age" value="${record.metabolicAge}" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                            </div>
                        </div>
                        <div class="flex space-x-3">
                            <button type="submit" class="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                💾 Guardar
                            </button>
                            <button type="button" onclick="this.closest('.fixed').remove()" class="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Handle form submission
        const form = modal.querySelector('#edit-record-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.updateRecord(record.id, {
                date: document.getElementById('edit-record-date').value,
                weight: parseFloat(document.getElementById('edit-record-weight').value),
                height: parseInt(document.getElementById('edit-record-height').value),
                bodyFatPercentage: parseFloat(document.getElementById('edit-record-body-fat').value),
                muscleMass: parseFloat(document.getElementById('edit-record-muscle-mass').value),
                visceralFat: parseFloat(document.getElementById('edit-record-visceral-fat').value),
                waterPercentage: parseFloat(document.getElementById('edit-record-water').value),
                metabolicAge: parseInt(document.getElementById('edit-record-metabolic-age').value)
            });
            modal.remove();
        });
    }

    // Update record
    async updateRecord(recordId, recordData) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/admin/health-records/${recordId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(recordData)
            });

            if (response.ok) {
                alert('Registo atualizado com sucesso!');
                await this.loadRecords();
            } else {
                const error = await response.json();
                alert(`Erro ao atualizar registo: ${error.error}`);
            }
        } catch (error) {
            console.error('Error updating record:', error);
            alert('Erro ao atualizar registo');
        }
    }

    // Export records
    exportRecords() {
        const filteredRecords = this.filterRecords();
        const csvContent = this.convertToCSV(filteredRecords);
        this.downloadCSV(csvContent, 'health_records.csv');
    }

    // Convert to CSV
    convertToCSV(records) {
        const headers = ['Utilizador', 'Data', 'Peso (kg)', 'Altura (cm)', 'IMC', '% Gordura', 'Massa Muscular (kg)', 'Gordura Visceral', '% Água', 'Idade Metabólica'];
        const rows = records.map(record => [
            record.userName,
            this.formatDate(record.date),
            record.weight,
            record.height,
            record.bmi,
            record.bodyFatPercentage,
            record.muscleMass,
            record.visceralFat,
            record.waterPercentage,
            record.metabolicAge
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

    // Clear filters
    clearFilters() {
        this.filters = {
            userId: '',
            startDate: '',
            endDate: '',
            search: ''
        };
        
        // Reset form inputs
        const userFilter = document.getElementById('data-user-filter');
        const startDate = document.getElementById('data-start-date');
        const endDate = document.getElementById('data-end-date');
        const search = document.getElementById('data-search');
        
        if (userFilter) userFilter.value = '';
        if (startDate) startDate.value = '';
        if (endDate) endDate.value = '';
        if (search) search.value = '';
        
        this.renderRecordsTable();
    }
}

// Data Management Manager
export class DataManagementManager {
    constructor() {
        this.dataService = new DataManagementService();
        this.setupEventListeners();
    }

    // Initialize data management
    async initialize() {
        console.log('Initializing data management...');
        
        try {
            await this.dataService.loadRecords();
            console.log('Data management initialized successfully');
        } catch (error) {
            console.error('Error initializing data management:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // User filter
        const userFilter = document.getElementById('data-user-filter');
        if (userFilter) {
            userFilter.addEventListener('change', (e) => {
                this.dataService.filters.userId = e.target.value;
                this.dataService.applyFilters();
            });
        }

        // Date filters
        const startDate = document.getElementById('data-start-date');
        if (startDate) {
            startDate.addEventListener('change', (e) => {
                this.dataService.filters.startDate = e.target.value;
                this.dataService.applyFilters();
            });
        }

        const endDate = document.getElementById('data-end-date');
        if (endDate) {
            endDate.addEventListener('change', (e) => {
                this.dataService.filters.endDate = e.target.value;
                this.dataService.applyFilters();
            });
        }

        // Search input
        const searchInput = document.getElementById('data-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.dataService.filters.search = e.target.value;
                this.dataService.applyFilters();
            });
        }

        // Export button
        const exportBtn = document.getElementById('export-data-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.dataService.exportRecords();
            });
        }

        // Clear filters button
        const clearFiltersBtn = document.getElementById('clear-filters-btn');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.dataService.clearFilters();
            });
        }
    }

    // Get data service
    getDataService() {
        return this.dataService;
    }
}

// Initialize data management when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for admin authentication to complete
    setTimeout(async () => {
        if (window.adminAuthManager) {
            const dataManagement = new DataManagementManager();
            await dataManagement.initialize();
            
            // Make data management globally available
            window.dataManagement = dataManagement;
            console.log('Data management initialized successfully');
        }
    }, 1000);
}); 