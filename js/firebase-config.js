// Firebase Configuration and Initialization
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js';
import { getAuth, onAuthStateChanged as firebaseOnAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { getStorage } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Firebase configuration
// Your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBlwNJDNS1rpmdV_Fv6GLzObTS7ePhwbcY",
    authDomain: "student-marketplace-44b40.firebaseapp.com",
    projectId: "student-marketplace-44b40",
    storageBucket: "student-marketplace-44b40.firebasestorage.app",
    messagingSenderId: "560300760603",
    appId: "1:560300760603:web:034bc92cca650eb7bb22be"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Storage is optional - only initialize if available (requires Blaze plan)
let storage = null;
try {
    storage = getStorage(app);
    console.log('Firebase Storage initialized');
} catch (error) {
    console.warn('Firebase Storage not available (requires Blaze plan). Using placeholder images.');
}
export { storage };

// Export onAuthStateChanged for convenience
export const onAuthStateChanged = firebaseOnAuthStateChanged;

console.log('Firebase initialized successfully (Auth + Firestore)');
