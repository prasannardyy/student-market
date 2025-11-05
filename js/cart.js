// Cart Module
import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    getDoc,
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Add item to cart
export async function addToCart(userId, productId, quantity = 1) {
    try {
        // Check if item already exists in cart
        const cartRef = collection(db, 'cart');
        const q = query(cartRef, where('userId', '==', userId), where('productId', '==', productId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            // Update existing cart item
            const cartItemDoc = querySnapshot.docs[0];
            const currentQuantity = cartItemDoc.data().quantity;
            await updateDoc(doc(db, 'cart', cartItemDoc.id), {
                quantity: currentQuantity + quantity
            });
            console.log('Cart item quantity updated');
        } else {
            // Add new cart item
            await addDoc(collection(db, 'cart'), {
                userId,
                productId,
                quantity,
                addedAt: serverTimestamp()
            });
            console.log('Item added to cart');
        }

        return { success: true };
    } catch (error) {
        console.error('Error adding to cart:', error);
        throw error;
    }
}

// Get cart items for a user
export async function getCartItems(userId) {
    try {
        const cartRef = collection(db, 'cart');
        const q = query(cartRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const cartItems = [];
        
        // Get cart items with product details
        for (const cartDoc of querySnapshot.docs) {
            const cartData = cartDoc.data();
            
            // Get product details
            const productDoc = await getDoc(doc(db, 'products', cartData.productId));
            
            if (productDoc.exists()) {
                const productData = productDoc.data();
                cartItems.push({
                    cartItemId: cartDoc.id,
                    quantity: cartData.quantity,
                    product: {
                        id: productDoc.id,
                        ...productData
                    }
                });
            }
        }

        console.log('Cart items retrieved:', cartItems.length);
        return cartItems;
    } catch (error) {
        console.error('Error getting cart items:', error);
        throw error;
    }
}

// Update cart item quantity
export async function updateCartQuantity(cartItemId, quantity) {
    try {
        if (quantity <= 0) {
            throw new Error('Quantity must be greater than 0');
        }

        const cartItemRef = doc(db, 'cart', cartItemId);
        await updateDoc(cartItemRef, {
            quantity: quantity
        });

        console.log('Cart quantity updated');
        return { success: true };
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        throw error;
    }
}

// Remove item from cart
export async function removeFromCart(cartItemId) {
    try {
        await deleteDoc(doc(db, 'cart', cartItemId));
        console.log('Item removed from cart');
        return { success: true };
    } catch (error) {
        console.error('Error removing from cart:', error);
        throw error;
    }
}

// Calculate cart total
export function calculateCartTotal(cartItems) {
    return cartItems.reduce((total, item) => {
        return total + (item.product.price * item.quantity);
    }, 0);
}

// Clear cart (after checkout)
export async function clearCart(userId) {
    try {
        const cartRef = collection(db, 'cart');
        const q = query(cartRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);

        const deletePromises = [];
        querySnapshot.forEach((doc) => {
            deletePromises.push(deleteDoc(doc.ref));
        });

        await Promise.all(deletePromises);
        console.log('Cart cleared');
        return { success: true };
    } catch (error) {
        console.error('Error clearing cart:', error);
        throw error;
    }
}

// Get cart item count
export async function getCartItemCount(userId) {
    try {
        const cartRef = collection(db, 'cart');
        const q = query(cartRef, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.size;
    } catch (error) {
        console.error('Error getting cart count:', error);
        return 0;
    }
}
