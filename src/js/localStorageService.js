// Local storage service for fallback mode
export class LocalStorageService {
    constructor(storageKey = 'health-tracker-data') {
        this.storageKey = storageKey;
    }

    getLocalStorageKey() {
        return this.storageKey;
    }

    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.getLocalStorageKey());
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading from localStorage:', error);
            return [];
        }
    }

    saveToLocalStorage(data) {
        try {
            localStorage.setItem(this.getLocalStorageKey(), JSON.stringify(data));
        } catch (error) {
            console.error('Error saving to localStorage:', error);
        }
    }

    addRecord(record) {
        const records = this.loadFromLocalStorage();
        const newRecord = {
            id: `local-${Date.now()}`,
            ...record
        };
        records.unshift(newRecord);
        this.saveToLocalStorage(records);
        return newRecord;
    }

    updateRecord(recordId, updatedData) {
        const records = this.loadFromLocalStorage();
        const recordIndex = records.findIndex(r => r.id === recordId);
        if (recordIndex !== -1) {
            records[recordIndex] = { ...records[recordIndex], ...updatedData };
            this.saveToLocalStorage(records);
            return records[recordIndex];
        }
        return null;
    }

    deleteRecord(recordId) {
        const records = this.loadFromLocalStorage();
        const filteredRecords = records.filter(r => r.id !== recordId);
        this.saveToLocalStorage(filteredRecords);
        return filteredRecords;
    }

    getAllRecords() {
        return this.loadFromLocalStorage();
    }

    seedInitialData(initialData) {
        const existingData = this.loadFromLocalStorage();
        if (existingData.length === 0) {
            const seededData = initialData.map((record, index) => ({
                id: `local-${Date.now()}-${index}`,
                ...record
            }));
            this.saveToLocalStorage(seededData);
            return seededData;
        }
        return existingData;
    }
} 