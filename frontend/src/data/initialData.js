// Initial sample data for the health tracker
export const initialImageData = [
    { 
        date: '2025-07-20', 
        height: 169, 
        weight: 94.4, 
        age: 35, 
        bodyFatPercentage: 27.2, 
        bodyFatKg: 25.7, 
        muscleMass: 65.3, 
        boneMass: 3.4, 
        bmi: 33.1, 
        kcal: 4263, 
        metabolicAge: 20, 
        waterPercentage: 62.1, 
        visceralFat: 6 
    },
    { 
        date: '2025-07-21', 
        height: 169, 
        weight: 95.6, 
        age: 35, 
        bodyFatPercentage: 28.8, 
        bodyFatKg: 27.5, 
        muscleMass: 64.6, 
        boneMass: 3.4, 
        bmi: 33.6, 
        kcal: 4218, 
        metabolicAge: 20, 
        waterPercentage: 62.1, 
        visceralFat: 6 
    },
    { 
        date: '2025-07-22', 
        height: 169, 
        weight: 92.2, 
        age: 35, 
        bodyFatPercentage: 25.6, 
        bodyFatKg: 23.6, 
        muscleMass: 65.1, 
        boneMass: 3.4, 
        bmi: 32.4, 
        kcal: 4269, 
        metabolicAge: 20, 
        waterPercentage: 63.4, 
        visceralFat: 4 
    },
    { 
        date: '2025-07-23', 
        height: 169, 
        weight: 90.4, 
        age: 35, 
        bodyFatPercentage: 22.7, 
        bodyFatKg: 20.5, 
        muscleMass: 66.4, 
        boneMass: 3.4, 
        bmi: 31.8, 
        kcal: 4264, 
        metabolicAge: 20, 
        waterPercentage: 68.9, 
        visceralFat: 4 
    },
    { 
        date: '2025-07-24', 
        height: 169, 
        weight: 87.9, 
        age: 35, 
        bodyFatPercentage: 21.6, 
        bodyFatKg: 19.0, 
        muscleMass: 65.7, 
        boneMass: 3.4, 
        bmi: 30.9, 
        kcal: 4124, 
        metabolicAge: 20, 
        waterPercentage: 62.2, 
        visceralFat: 4 
    }
];

// Form field configuration
export const formFields = [
    { key: 'date', label: 'Data', type: 'date', required: true },
    { key: 'weight', label: 'Peso (kg)', type: 'number', step: '0.1', required: true },
    { key: 'height', label: 'Altura (cm)', type: 'number', required: true },
    { key: 'age', label: 'Idade', type: 'number', required: true },
    { key: 'bodyFatPercentage', label: 'Massa Gorda (%)', type: 'number', step: '0.1' },
    { key: 'bodyFatKg', label: 'Massa Gorda (kg)', type: 'number', step: '0.1' },
    { key: 'muscleMass', label: 'Massa Muscular (kg)', type: 'number', step: '0.1' },
    { key: 'boneMass', label: 'Massa Óssea (kg)', type: 'number', step: '0.1' },
    { key: 'bmi', label: 'Índ. Massa Corp.', type: 'number', step: '0.1' },
    { key: 'kcal', label: 'Disp. Calórico (Kcal)', type: 'number' },
    { key: 'metabolicAge', label: 'Idade Metabólica', type: 'number' },
    { key: 'waterPercentage', label: 'Água (%)', type: 'number', step: '0.1' },
    { key: 'visceralFat', label: 'Gordura Visceral', type: 'number' }
];

// Table display fields
export const tableFields = [
    { key: 'date', label: 'Data' },
    { key: 'weight', label: 'Peso' },
    { key: 'bodyFatPercentage', label: '% Gordura' },
    { key: 'muscleMass', label: 'Massa Muscular' },
    { key: 'bmi', label: 'IMC' },
    { key: 'visceralFat', label: 'Gordura Visceral' },
    { key: 'waterPercentage', label: '% Água' },
    { key: 'metabolicAge', label: 'Idade Metabólica' }
]; 