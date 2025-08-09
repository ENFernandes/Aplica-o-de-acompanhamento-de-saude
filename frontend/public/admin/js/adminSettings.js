// Admin Settings Service
export class AdminSettingsService {
    constructor() {
        this.baseUrl = 'http://localhost:3000';
        this.settings = {
            systemName: 'Health Tracker',
            supportEmail: 'support@healthtracker.com',
            maxRecords: 1000,
            whatsappNumber: '351000000000',
            emailNotifications: true,
            systemAlerts: true,
            autoReports: false
        };
    }

    // Load settings
    async loadSettings() {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/settings`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.settings = { ...this.settings, ...data.settings };
                try { localStorage.setItem('admin-settings', JSON.stringify(this.settings)); } catch (_) {}
                this.updateSettingsForm();
                return this.settings;
            } else {
                throw new Error('Failed to load settings');
            }
        } catch (error) {
            console.error('Error loading settings:', error);
            // Use default settings
            try { localStorage.setItem('admin-settings', JSON.stringify(this.settings)); } catch (_) {}
            this.updateSettingsForm();
        }
    }

    // Save settings
    async saveSettings(settings) {
        try {
            const token = localStorage.getItem('auth-token');
            const response = await fetch(`${this.baseUrl}/api/admin/settings`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ settings })
            });

            if (response.ok) {
                this.settings = { ...this.settings, ...settings };
                // Persist locally to permitir que o site público use o número sem nova chamada
                try { localStorage.setItem('admin-settings', JSON.stringify(this.settings)); } catch (_) {}
                alert('Configurações guardadas com sucesso!');
                return true;
            } else {
                const error = await response.json();
                alert(`Erro ao guardar configurações: ${error.error}`);
                return false;
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Erro ao guardar configurações');
            return false;
        }
    }

    // Update settings form
    updateSettingsForm() {
        const systemName = document.getElementById('system-name');
        const supportEmail = document.getElementById('support-email');
        const maxRecords = document.getElementById('max-records');
        const whatsappNumber = document.getElementById('whatsapp-number');
        const emailNotifications = document.getElementById('email-notifications');
        const systemAlerts = document.getElementById('system-alerts');
        const autoReports = document.getElementById('auto-reports');

        if (systemName) systemName.value = this.settings.systemName;
        if (supportEmail) supportEmail.value = this.settings.supportEmail;
        if (maxRecords) maxRecords.value = this.settings.maxRecords;
        if (whatsappNumber) whatsappNumber.value = this.settings.whatsappNumber || '';
        if (emailNotifications) emailNotifications.checked = this.settings.emailNotifications;
        if (systemAlerts) systemAlerts.checked = this.settings.systemAlerts;
        if (autoReports) autoReports.checked = this.settings.autoReports;
    }

    // Get settings
    getSettings() {
        return this.settings;
    }

    // Get setting value
    getSetting(key) {
        return this.settings[key];
    }
}

// Admin Settings Manager
export class AdminSettingsManager {
    constructor() {
        this.settingsService = new AdminSettingsService();
        this.setupEventListeners();
    }

    // Initialize settings
    async initialize() {
        console.log('Initializing admin settings...');
        
        try {
            await this.settingsService.loadSettings();
            console.log('Settings initialized successfully');
        } catch (error) {
            console.error('Error initializing settings:', error);
        }
    }

    // Setup event listeners
    setupEventListeners() {
        // Save settings button
        const saveSettingsBtn = document.getElementById('save-settings');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Settings form inputs
        const settingsInputs = [
            'system-name',
            'support-email',
            'max-records',
            'whatsapp-number',
            'email-notifications',
            'system-alerts',
            'auto-reports'
        ];

        settingsInputs.forEach(inputId => {
            const input = document.getElementById(inputId);
            if (input) {
                input.addEventListener('change', () => {
                    this.handleSettingChange(inputId, input);
                });
            }
        });
    }

    // Handle setting change
    handleSettingChange(inputId, input) {
        let value;
        
        if (input.type === 'checkbox') {
            value = input.checked;
        } else if (input.type === 'number') {
            value = parseInt(input.value);
        } else {
            value = input.value;
        }

        // Update settings object
        const settingKey = this.getSettingKey(inputId);
        if (settingKey) {
            this.settingsService.settings[settingKey] = value;
        }
    }

    // Get setting key from input ID
    getSettingKey(inputId) {
        const keyMap = {
            'system-name': 'systemName',
            'support-email': 'supportEmail',
            'max-records': 'maxRecords',
            'whatsapp-number': 'whatsappNumber',
            'email-notifications': 'emailNotifications',
            'system-alerts': 'systemAlerts',
            'auto-reports': 'autoReports'
        };
        return keyMap[inputId];
    }

    // Save settings
    async saveSettings() {
        // Get current values from form fields
        const currentSettings = this.getCurrentFormSettings();
        console.log('Current form settings:', currentSettings);
        
        const success = await this.settingsService.saveSettings(currentSettings);
        console.log('Save settings result:', success);
        
        if (success) {
            // Update UI to reflect saved settings
            this.settingsService.updateSettingsForm();
        }
    }

    // Get current settings from form
    getCurrentFormSettings() {
        const settings = {};
        
        // Get all form fields
        const fields = [
            'system-name',
            'support-email',
            'max-records',
            'whatsapp-number',
            'email-notifications',
            'system-alerts',
            'auto-reports'
        ];
        
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (field.type === 'checkbox') {
                    settings[this.convertIdToKey(fieldId)] = field.checked;
                } else {
                    settings[this.convertIdToKey(fieldId)] = field.value;
                }
            }
        });
        
        return settings;
    }

    // Convert HTML ID to settings key
    convertIdToKey(fieldId) {
        const keyMap = {
            'system-name': 'systemName',
            'support-email': 'supportEmail',
            'max-records': 'maxRecords',
            'whatsapp-number': 'whatsappNumber',
            'email-notifications': 'emailNotifications',
            'system-alerts': 'systemAlerts',
            'auto-reports': 'autoReports'
        };
        return keyMap[fieldId] || fieldId;
    }

    // Get settings service
    getSettingsService() {
        return this.settingsService;
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    // Wait for admin authentication to complete
    setTimeout(async () => {
        if (window.adminAuthManager) {
            const settingsManager = new AdminSettingsManager();
            await settingsManager.initialize();
            
            // Make settings manager globally available
            window.adminSettingsManager = settingsManager;
            console.log('Admin settings initialized successfully');
        }
    }, 1000);
}); 