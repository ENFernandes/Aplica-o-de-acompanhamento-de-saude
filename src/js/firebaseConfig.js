// Firebase configuration and initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, query, doc, updateDoc, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-health-tracker';

let app, db, auth;
// Force database-only mode - disable localStorage
let useLocalStorage = false;

// Try to initialize Firebase, but always use database mode
try {
    if (firebaseConfig && Object.keys(firebaseConfig).length > 0) {
        app = initializeApp(firebaseConfig);
        db = getFirestore(app);
        auth = getAuth(app);
        console.log('Firebase initialized successfully');
    } else {
        console.warn('No Firebase config provided, using database-only mode');
    }
} catch (error) {
    console.warn('Firebase initialization failed, using database-only mode:', error);
}

// Firebase operations
export const firebaseOperations = {
    async addDocument(collectionRef, data) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return await addDoc(collectionRef, data);
    },

    async updateDocument(docRef, data) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return await updateDoc(docRef, data);
    },

    async deleteDocument(docRef) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return await deleteDoc(docRef);
    },

    async getDocuments(collectionRef) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return await getDocs(query(collectionRef));
    },

    onSnapshot(collectionRef, callback) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return onSnapshot(query(collectionRef), callback);
    },

    createCollection(path) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return collection(db, path);
    },

    createDocument(path, docId) {
        if (useLocalStorage) {
            throw new Error('Cannot use Firebase operations in local storage mode');
        }
        return doc(db, path, docId);
    }
};

// Authentication functions
export const authFunctions = {
    async signInAnonymously() {
        if (useLocalStorage) {
            return { uid: 'local-user-' + Date.now() };
        }
        return await signInAnonymously(auth);
    },

    async signInWithCustomToken(token) {
        if (useLocalStorage) {
            return { uid: 'local-user-' + Date.now() };
        }
        return await signInWithCustomToken(auth, token);
    },

    onAuthStateChanged(callback) {
        if (useLocalStorage) {
            return null;
        }
        return onAuthStateChanged(auth, callback);
    }
};

// Export configuration - FORCE DATABASE MODE
export { useLocalStorage, appId }; 