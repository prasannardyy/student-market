// Authentication Module
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    onAuthStateChanged as firebaseOnAuthStateChanged
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';
import { doc, setDoc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Register new user
export async function registerUser(name, email, password, role = 'user') {
    try {
        // Create user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create user document in Firestore
        await setDoc(doc(db, 'users', user.uid), {
            userId: user.uid,
            name: name,
            email: email,
            role: role,
            createdAt: new Date(),
            isActive: true
        });

        console.log('User registered successfully:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('Registration error:', error);
        throw error;
    }
}

// Login user
export async function loginUser(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        const userData = userDoc.data();

        // Store user role in localStorage
        localStorage.setItem('userRole', userData.role);
        localStorage.setItem('userId', user.uid);
        localStorage.setItem('userName', userData.name);

        console.log('User logged in successfully:', user.uid);
        return { success: true, user, userData };
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Login seller (same as loginUser but verifies seller role)
export async function loginSeller(email, password) {
    try {
        const result = await loginUser(email, password);
        
        if (result.userData.role !== 'seller' && result.userData.role !== 'admin') {
            await signOut(auth);
            localStorage.clear();
            throw new Error('Access denied. Seller credentials required.');
        }

        return result;
    } catch (error) {
        console.error('Seller login error:', error);
        throw error;
    }
}

// Login admin
export async function loginAdmin(email, password) {
    try {
        const result = await loginUser(email, password);
        
        if (result.userData.role !== 'admin') {
            await signOut(auth);
            localStorage.clear();
            throw new Error('Access denied. Admin credentials required.');
        }

        return result;
    } catch (error) {
        console.error('Admin login error:', error);
        throw error;
    }
}

// Logout user
export async function logoutUser() {
    try {
        await signOut(auth);
        localStorage.clear();
        console.log('User logged out successfully');
        return { success: true };
    } catch (error) {
        console.error('Logout error:', error);
        throw error;
    }
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Get current user data from Firestore
export async function getCurrentUserData() {
    const user = getCurrentUser();
    if (!user) return null;

    try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        return userDoc.data();
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
}

// Auth state change listener
export function onAuthStateChanged(callback) {
    return firebaseOnAuthStateChanged(auth, callback);
}

// Check if user is authenticated
export function isAuthenticated() {
    return auth.currentUser !== null;
}

// Get error message for Firebase auth errors
export function getAuthErrorMessage(error) {
    switch (error.code) {
        case 'auth/email-already-in-use':
            return 'This email is already registered. Please login instead.';
        case 'auth/invalid-email':
            return 'Invalid email address.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/user-not-found':
            return 'No account found with this email.';
        case 'auth/wrong-password':
            return 'Incorrect password.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        default:
            return error.message || 'An error occurred. Please try again.';
    }
}
