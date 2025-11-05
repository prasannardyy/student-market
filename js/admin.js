// Admin Module
import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc,
    getDocs, 
    updateDoc,
    doc,
    query,
    where,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Get all sellers
export async function getAllSellers() {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, where('role', '==', 'seller'));
        const querySnapshot = await getDocs(q);

        const sellers = [];
        querySnapshot.forEach((doc) => {
            sellers.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Sellers retrieved:', sellers.length);
        return sellers;
    } catch (error) {
        console.error('Error getting sellers:', error);
        throw error;
    }
}

// Deactivate seller
export async function deactivateSeller(sellerId) {
    try {
        const sellerRef = doc(db, 'users', sellerId);
        await updateDoc(sellerRef, {
            isActive: false,
            updatedAt: serverTimestamp()
        });

        console.log('Seller deactivated:', sellerId);
        return { success: true };
    } catch (error) {
        console.error('Error deactivating seller:', error);
        throw error;
    }
}

// Activate seller
export async function activateSeller(sellerId) {
    try {
        const sellerRef = doc(db, 'users', sellerId);
        await updateDoc(sellerRef, {
            isActive: true,
            updatedAt: serverTimestamp()
        });

        console.log('Seller activated:', sellerId);
        return { success: true };
    } catch (error) {
        console.error('Error activating seller:', error);
        throw error;
    }
}

// Add payment method
export async function addPaymentMethod(paymentData) {
    try {
        const paymentRef = await addDoc(collection(db, 'paymentMethods'), {
            type: paymentData.type,
            details: paymentData.details,
            isActive: true,
            createdAt: serverTimestamp()
        });

        console.log('Payment method added:', paymentRef.id);
        return { success: true, paymentId: paymentRef.id };
    } catch (error) {
        console.error('Error adding payment method:', error);
        throw error;
    }
}

// Get all payment methods
export async function getPaymentMethods() {
    try {
        const paymentsRef = collection(db, 'paymentMethods');
        const querySnapshot = await getDocs(paymentsRef);

        const payments = [];
        querySnapshot.forEach((doc) => {
            payments.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Payment methods retrieved:', payments.length);
        return payments;
    } catch (error) {
        console.error('Error getting payment methods:', error);
        throw error;
    }
}
