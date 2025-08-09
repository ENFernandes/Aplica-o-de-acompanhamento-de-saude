const Joi = require('joi');

// Validation schemas
const registrationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required'
    }),
    name: Joi.string().min(2).max(255).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 255 characters',
        'any.required': 'Name is required'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required'
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required'
    })
});

const healthRecordSchema = Joi.object({
    date: Joi.date().required().messages({
        'any.required': 'Date is required'
    }),
    weight: Joi.number().min(20).max(300).optional().messages({
        'number.min': 'Weight must be at least 20 kg',
        'number.max': 'Weight cannot exceed 300 kg'
    }),
    height: Joi.number().integer().min(100).max(250).optional().messages({
        'number.integer': 'Height must be a whole number',
        'number.min': 'Height must be at least 100 cm',
        'number.max': 'Height cannot exceed 250 cm'
    }),
    age: Joi.number().integer().min(1).max(150).optional().messages({
        'number.integer': 'Age must be a whole number',
        'number.min': 'Age must be at least 1',
        'number.max': 'Age cannot exceed 150'
    }),
    // Support both snake_case and camelCase field names
    body_fat_percentage: Joi.number().min(1).max(50).optional().messages({
        'number.min': 'Body fat percentage must be at least 1%',
        'number.max': 'Body fat percentage cannot exceed 50%'
    }),
    bodyFatPercentage: Joi.number().min(1).max(50).optional().messages({
        'number.min': 'Body fat percentage must be at least 1%',
        'number.max': 'Body fat percentage cannot exceed 50%'
    }),

    muscle_mass: Joi.number().min(0).max(100).optional().messages({
        'number.min': 'Muscle mass cannot be negative',
        'number.max': 'Muscle mass cannot exceed 100 kg'
    }),
    muscleMass: Joi.number().min(0).max(100).optional().messages({
        'number.min': 'Muscle mass cannot be negative',
        'number.max': 'Muscle mass cannot exceed 100 kg'
    }),
    bone_mass: Joi.number().min(0).max(10).optional().messages({
        'number.min': 'Bone mass cannot be negative',
        'number.max': 'Bone mass cannot exceed 10 kg'
    }),
    boneMass: Joi.number().min(0).max(10).optional().messages({
        'number.min': 'Bone mass cannot be negative',
        'number.max': 'Bone mass cannot exceed 10 kg'
    }),
    bmi: Joi.number().min(10).max(60).optional().messages({
        'number.min': 'BMI must be at least 10',
        'number.max': 'BMI cannot exceed 60'
    }),
    kcal: Joi.number().integer().min(500).max(10000).optional().messages({
        'number.integer': 'Calories must be a whole number',
        'number.min': 'Calories must be at least 500',
        'number.max': 'Calories cannot exceed 10000'
    }),
    metabolic_age: Joi.number().integer().min(10).max(100).optional().messages({
        'number.integer': 'Metabolic age must be a whole number',
        'number.min': 'Metabolic age must be at least 10',
        'number.max': 'Metabolic age cannot exceed 100'
    }),
    metabolicAge: Joi.number().integer().min(10).max(100).optional().messages({
        'number.integer': 'Metabolic age must be a whole number',
        'number.min': 'Metabolic age must be at least 10',
        'number.max': 'Metabolic age cannot exceed 100'
    }),
    water_percentage: Joi.number().min(30).max(80).optional().messages({
        'number.min': 'Water percentage must be at least 30%',
        'number.max': 'Water percentage cannot exceed 80%'
    }),
    waterPercentage: Joi.number().min(30).max(80).optional().messages({
        'number.min': 'Water percentage must be at least 30%',
        'number.max': 'Water percentage cannot exceed 80%'
    }),
    visceral_fat: Joi.number().integer().min(1).max(30).optional().messages({
        'number.integer': 'Visceral fat must be a whole number',
        'number.min': 'Visceral fat must be at least 1',
        'number.max': 'Visceral fat cannot exceed 30'
    }),
    visceralFat: Joi.number().integer().min(1).max(30).optional().messages({
        'number.integer': 'Visceral fat must be a whole number',
        'number.min': 'Visceral fat must be at least 1',
        'number.max': 'Visceral fat cannot exceed 30'
    }),
    fat_right_arm: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Right arm fat cannot be negative',
        'number.max': 'Right arm fat cannot exceed 50%'
    }),
    fatRightArm: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Right arm fat cannot be negative',
        'number.max': 'Right arm fat cannot exceed 50%'
    }),
    fat_left_arm: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Left arm fat cannot be negative',
        'number.max': 'Left arm fat cannot exceed 50%'
    }),
    fatLeftArm: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Left arm fat cannot be negative',
        'number.max': 'Left arm fat cannot exceed 50%'
    }),
    fat_right_leg: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Right leg fat cannot be negative',
        'number.max': 'Right leg fat cannot exceed 50%'
    }),
    fatRightLeg: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Right leg fat cannot be negative',
        'number.max': 'Right leg fat cannot exceed 50%'
    }),
    fat_left_leg: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Left leg fat cannot be negative',
        'number.max': 'Left leg fat cannot exceed 50%'
    }),
    fatLeftLeg: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Left leg fat cannot be negative',
        'number.max': 'Left leg fat cannot exceed 50%'
    }),
    fat_trunk: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Trunk fat cannot be negative',
        'number.max': 'Trunk fat cannot exceed 50%'
    }),
    fatTrunk: Joi.number().min(0).max(50).optional().messages({
        'number.min': 'Trunk fat cannot be negative',
        'number.max': 'Trunk fat cannot exceed 50%'
    }),
    notes: Joi.string().optional()
});

const profileUpdateSchema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
        'string.min': 'Name must be at least 2 characters long',
        'string.max': 'Name cannot exceed 255 characters',
        'any.required': 'Name is required'
    })
});

const passwordChangeSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required'
    }),
    newPassword: Joi.string().min(6).required().messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required'
    })
});

// Validation middleware functions
function validateRegistration(req, res, next) {
    const { error } = registrationSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    
    next();
}

function validateLogin(req, res, next) {
    const { error } = loginSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    
    next();
}

function validateHealthRecord(req, res, next) {
    // Validating health record
    
    // Create a normalized body for validation
    const normalizedBody = { ...req.body };
    
    // Convert camelCase to snake_case for validation
    const camelToSnake = {
        bodyFatPercentage: 'body_fat_percentage',
        muscleMass: 'muscle_mass',
        boneMass: 'bone_mass',
        metabolicAge: 'metabolic_age',
        waterPercentage: 'water_percentage',
        visceralFat: 'visceral_fat',
        fatRightArm: 'fat_right_arm',
        fatLeftArm: 'fat_left_arm',
        fatRightLeg: 'fat_right_leg',
        fatLeftLeg: 'fat_left_leg',
        fatTrunk: 'fat_trunk'
    };
    
    Object.keys(normalizedBody).forEach(key => {
        if (camelToSnake[key]) {
            normalizedBody[camelToSnake[key]] = normalizedBody[key];
            delete normalizedBody[key];
        }
    });
    
        // Normalized body for validation
    
    const { error } = healthRecordSchema.validate(normalizedBody);
    
    if (error) {
        // Validation error
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    
    // Validation passed
    next();
}

function validateProfileUpdate(req, res, next) {
    const { error } = profileUpdateSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    
    next();
}

function validatePasswordChange(req, res, next) {
    const { error } = passwordChangeSchema.validate(req.body);
    
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            message: error.details[0].message
        });
    }
    
    next();
}

module.exports = {
    validateRegistration,
    validateLogin,
    validateHealthRecord,
    validateProfileUpdate,
    validatePasswordChange
}; 