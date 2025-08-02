// Application Configuration
// DATABASE-ONLY MODE - No localStorage fallbacks

export const APP_CONFIG = {
    // Force database-only mode
    USE_DATABASE_ONLY: true,
    USE_LOCAL_STORAGE: false,
    
    // Backend API configuration
    API_BASE_URL: 'http://localhost:3000/api',
    
    // Authentication settings
    AUTH: {
        TOKEN_KEY: 'auth-token',
        TOKEN_EXPIRY: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        REFRESH_THRESHOLD: 60 * 60 * 1000, // 1 hour before expiry
    },
    
    // Password requirements
    PASSWORD_REQUIREMENTS: {
        MIN_LENGTH: 8,
        REQUIRE_UPPERCASE: true,
        REQUIRE_LOWERCASE: true,
        REQUIRE_NUMBERS: true,
        REQUIRE_SPECIAL_CHARS: true,
        MAX_LENGTH: 128
    },
    
    // Validation rules
    VALIDATION: {
        EMAIL: {
            PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            MESSAGE: 'Please enter a valid email address'
        },
        NAME: {
            MIN_LENGTH: 2,
            MAX_LENGTH: 50,
            PATTERN: /^[a-zA-ZÀ-ÿ\s'-]+$/,
            MESSAGE: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes'
        }
    },
    
    // API endpoints
    ENDPOINTS: {
        AUTH: {
            REGISTER: '/auth/register',
            LOGIN: '/auth/login',
            LOGOUT: '/auth/logout',
            ME: '/auth/me',
            CHANGE_PASSWORD: '/auth/change-password',
            FORGOT_PASSWORD: '/auth/forgot-password',
            RESET_PASSWORD: '/auth/reset-password',
            REFRESH_TOKEN: '/auth/refresh-token'
        },
        HEALTH_RECORDS: {
            LIST: '/health-records',
            CREATE: '/health-records',
            UPDATE: '/health-records/:id',
            DELETE: '/health-records/:id'
        },
        USERS: {
            PROFILE: '/users/profile',
            SETTINGS: '/users/settings'
        },
        HEALTH: '/health'
    },
    
    // Error messages
    ERROR_MESSAGES: {
        NETWORK_ERROR: 'Network error. Please check your connection.',
        AUTH_ERROR: 'Authentication failed. Please log in again.',
        VALIDATION_ERROR: 'Please check your input and try again.',
        SERVER_ERROR: 'Server error. Please try again later.',
        DATABASE_ERROR: 'Database connection failed. Please try again.',
        TOKEN_EXPIRED: 'Session expired. Please log in again.',
        INVALID_CREDENTIALS: 'Invalid email or password.',
        EMAIL_EXISTS: 'Email already registered.',
        WEAK_PASSWORD: 'Password does not meet security requirements.'
    },
    
    // Success messages
    SUCCESS_MESSAGES: {
        REGISTRATION: 'Account created successfully!',
        LOGIN: 'Login successful!',
        LOGOUT: 'Logged out successfully!',
        PROFILE_UPDATE: 'Profile updated successfully!',
        PASSWORD_CHANGE: 'Password changed successfully!',
        PASSWORD_RESET_SENT: 'Password reset email sent!',
        HEALTH_RECORD_CREATED: 'Health record saved successfully!',
        HEALTH_RECORD_UPDATED: 'Health record updated successfully!',
        HEALTH_RECORD_DELETED: 'Health record deleted successfully!'
    },
    
    // Feature flags
    FEATURES: {
        PASSWORD_RESET: true,
        EMAIL_VERIFICATION: false, // Not implemented yet
        TWO_FACTOR_AUTH: false, // Not implemented yet
        SOCIAL_LOGIN: false, // Not implemented yet
        OFFLINE_MODE: false, // Disabled - database only
        DATA_EXPORT: true,
        DATA_IMPORT: false // Not implemented yet
    },
    
    // UI settings
    UI: {
        THEME: 'light', // 'light' or 'dark'
        LANGUAGE: 'pt-BR',
        DATE_FORMAT: 'DD/MM/YYYY',
        TIME_FORMAT: 'HH:mm',
        CURRENCY: 'EUR',
        WEIGHT_UNIT: 'kg',
        HEIGHT_UNIT: 'cm',
        TEMPERATURE_UNIT: 'C'
    },
    
    // Debug settings
    DEBUG: {
        ENABLED: false,
        LOG_LEVEL: 'error', // 'debug', 'info', 'warn', 'error'
        SHOW_API_CALLS: false,
        SHOW_VALIDATION_ERRORS: true
    }
};

// Export individual configurations for easy access
export const { 
    USE_DATABASE_ONLY, 
    USE_LOCAL_STORAGE, 
    API_BASE_URL, 
    AUTH, 
    PASSWORD_REQUIREMENTS, 
    VALIDATION, 
    ENDPOINTS, 
    ERROR_MESSAGES, 
    SUCCESS_MESSAGES, 
    FEATURES, 
    UI, 
    DEBUG 
} = APP_CONFIG;

// Helper function to check if database-only mode is enabled
export const isDatabaseOnlyMode = () => USE_DATABASE_ONLY && !USE_LOCAL_STORAGE;

// Helper function to get full API URL
export const getApiUrl = (endpoint) => `${API_BASE_URL}${endpoint}`;

// Helper function to validate password
export const validatePassword = (password) => {
    const { PASSWORD_REQUIREMENTS } = APP_CONFIG;
    const errors = [];
    
    if (password.length < PASSWORD_REQUIREMENTS.MIN_LENGTH) {
        errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.MIN_LENGTH} characters long`);
    }
    if (password.length > PASSWORD_REQUIREMENTS.MAX_LENGTH) {
        errors.push(`Password must be no more than ${PASSWORD_REQUIREMENTS.MAX_LENGTH} characters long`);
    }
    if (PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter');
    }
    if (PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter');
    }
    if (PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS && !/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }
    if (PASSWORD_REQUIREMENTS.REQUIRE_SPECIAL_CHARS && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }
    
    return {
        isValid: errors.length === 0,
        errors
    };
};

// Helper function to validate email
export const validateEmail = (email) => {
    return VALIDATION.EMAIL.PATTERN.test(email);
};

// Helper function to validate name
export const validateName = (name) => {
    const { NAME } = VALIDATION;
    return name.length >= NAME.MIN_LENGTH && 
           name.length <= NAME.MAX_LENGTH && 
           NAME.PATTERN.test(name);
};

export default APP_CONFIG; 