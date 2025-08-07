// Data validation service
export class ValidationService {
    static validateRecord(record) {
        const errors = [];
        const { weight, height, bmi, bodyFatPercentage, muscleMass, boneMass } = record;
        
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
        
        // Validate component mass sum
        if (weight && muscleMass && boneMass) {
            const componentMass = muscleMass + boneMass;
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
        const numericFields = ['weight', 'height', 'age', 'bodyFatPercentage', 'muscleMass', 'bmi', 'visceralFat', 'waterPercentage', 'metabolicAge', 'boneMass'];
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
        if (value == null || value === '') {
            if (field === 'date') return '';
            return '0.0';
        }
        
        switch(field) {
            case 'date':
                try {
                    // Handle different date formats
                    let dateValue = value;
                    if (typeof value === 'string') {
                        // If it's already a date string, use it directly
                        if (value.includes('T')) {
                            dateValue = value;
                        } else {
                            // Add time if it's just a date
                            dateValue = value + 'T00:00:00';
                        }
                    }
                    const date = new Date(dateValue);
                    if (isNaN(date.getTime())) {
                        console.error('Invalid date value:', value);
                        return '';
                    }
                    return date.toLocaleDateString('pt-BR');
                } catch (error) {
                    console.error('Error formatting date:', error, 'Value:', value);
                    return '';
                }
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
        
        const numericFields = ['weight', 'bodyFatPercentage', 'muscleMass', 'bmi', 'visceralFat', 'waterPercentage', 'metabolicAge', 'boneMass'];
        if (numericFields.includes(field)) {
            const numValue = parseFloat(value);
            return isNaN(numValue) ? null : numValue;
        }
        
        return value;
    }
} 