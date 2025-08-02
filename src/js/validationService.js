// Data validation service
export class ValidationService {
    static validateRecord(record) {
        const errors = [];
        const { weight, height, bmi, bodyFatPercentage, bodyFatKg, muscleMass, boneMass } = record;
        
        // Validate BMI calculation
        if (weight && height && bmi) {
            const expectedBmi = weight / ((height / 100) ** 2);
            if (Math.abs(bmi - expectedBmi) > 1.0) {
                errors.push({ 
                    field: 'bmi', 
                    message: `O IMC (${bmi.toFixed(1)}) parece inconsistente. O esperado seria ~${expectedBmi.toFixed(1)}.` 
                });
            }
        }
        
        // Validate body fat percentage calculation
        if (weight && bodyFatKg && bodyFatPercentage) {
            const expectedPercentage = (bodyFatKg / weight) * 100;
            if (Math.abs(bodyFatPercentage - expectedPercentage) > 1.0) {
                errors.push({ 
                    field: 'bodyFatPercentage', 
                    message: `% Gordura (${bodyFatPercentage.toFixed(1)}%) inconsistente. Esperado ~${expectedPercentage.toFixed(1)}%.` 
                });
            }
        }
        
        // Validate component mass sum
        if (weight && bodyFatKg && muscleMass && boneMass) {
            const componentMass = bodyFatKg + muscleMass + boneMass;
            if (componentMass > weight + 1) {
                errors.push({ 
                    field: 'weight', 
                    message: `Peso (${weight}kg) menor que a soma das massas (${componentMass.toFixed(1)}kg).` 
                });
            }
        }
        
        return errors;
    }

    static validateFormData(formData) {
        const errors = [];
        const requiredFields = ['date', 'weight', 'height', 'age'];
        
        requiredFields.forEach(field => {
            if (!formData[field]) {
                errors.push({ 
                    field, 
                    message: `Campo obrigatório: ${field}` 
                });
            }
        });
        
        // Validate numeric fields
        const numericFields = ['weight', 'height', 'age', 'bodyFatPercentage', 'muscleMass', 'bmi', 'visceralFat', 'waterPercentage', 'metabolicAge', 'bodyFatKg', 'boneMass'];
        numericFields.forEach(field => {
            if (formData[field] && isNaN(parseFloat(formData[field]))) {
                errors.push({ 
                    field, 
                    message: `Valor inválido para ${field}` 
                });
            }
        });
        
        return errors;
    }

    static formatDisplayValue(value, field) {
        if (value == null || value === '') return '0.0';
        
        switch(field) {
            case 'date':
                return new Date(value + 'T00:00:00').toLocaleDateString('pt-BR');
            case 'weight':
            case 'muscleMass':
                return `${parseFloat(value).toFixed(1)} kg`;
            case 'bodyFatPercentage':
            case 'waterPercentage':
                return `${parseFloat(value).toFixed(1)}%`;
            case 'metabolicAge':
                return `${parseInt(value)} anos`;
            default:
                return parseFloat(value).toFixed(1);
        }
    }

    static parseCellValue(cellText, field) {
        let value = cellText.trim();
        
        // Remove units
        value = value.replace(/ .*/, '').replace(',', '.');
        
        if (field === 'date') {
            return value;
        }
        
        const numericFields = ['weight', 'bodyFatPercentage', 'muscleMass', 'bmi', 'visceralFat', 'waterPercentage', 'metabolicAge', 'bodyFatKg', 'boneMass'];
        if (numericFields.includes(field)) {
            const numValue = parseFloat(value);
            return isNaN(numValue) ? null : numValue;
        }
        
        return value;
    }
} 