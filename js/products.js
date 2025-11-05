// Products Module
import { db, storage } from './firebase-config.js';
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
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js';

// Add new product
export async function addProduct(productData, imageFile) {
    try {
        // Use provided imageUrl, or try to upload file, or use placeholder
        let imageUrl = productData.imageUrl || 'https://via.placeholder.com/400x400/E57A79/FFFFFF?text=Product+Image';

        // Try to upload image if file provided (will fail gracefully if Storage not enabled)
        if (imageFile && !productData.imageUrl) {
            try {
                imageUrl = await uploadProductImage(imageFile, productData.name);
            } catch (storageError) {
                console.warn('Image upload failed (Storage may not be enabled), using placeholder:', storageError);
                // Continue with placeholder or provided URL
            }
        }

        // Add product to Firestore
        const productRef = await addDoc(collection(db, 'products'), {
            name: productData.name,
            description: productData.description,
            price: parseFloat(productData.price),
            stock: parseInt(productData.stock),
            imageUrl: imageUrl,
            sellerId: productData.sellerId,
            sellerName: productData.sellerName,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        console.log('Product added successfully:', productRef.id);
        return { success: true, productId: productRef.id };
    } catch (error) {
        console.error('Error adding product:', error);
        throw error;
    }
}

// Upload product image to Firebase Storage
export async function uploadProductImage(imageFile, productName) {
    try {
        // Validate file size (5MB max)
        if (imageFile.size > 5 * 1024 * 1024) {
            throw new Error('Image size must be less than 5MB');
        }

        // Validate file type
        if (!imageFile.type.startsWith('image/')) {
            throw new Error('File must be an image');
        }

        // Create unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}_${imageFile.name}`;
        const storageRef = ref(storage, `product-images/${filename}`);

        // Upload file
        await uploadBytes(storageRef, imageFile);

        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        console.log('Image uploaded successfully:', downloadURL);
        return downloadURL;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
}

// Get all products
export async function getProducts() {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('stock', '>', 0), orderBy('stock'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Products retrieved:', products.length);
        return products;
    } catch (error) {
        console.error('Error getting products:', error);
        // If orderBy fails due to missing index, try without it
        try {
            const productsRef = collection(db, 'products');
            const querySnapshot = await getDocs(productsRef);
            const products = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.stock > 0) {
                    products.push({
                        id: doc.id,
                        ...data
                    });
                }
            });
            return products;
        } catch (fallbackError) {
            console.error('Fallback query also failed:', fallbackError);
            throw fallbackError;
        }
    }
}

// Get product by ID
export async function getProductById(productId) {
    try {
        const productDoc = await getDoc(doc(db, 'products', productId));
        
        if (!productDoc.exists()) {
            throw new Error('Product not found');
        }

        return {
            id: productDoc.id,
            ...productDoc.data()
        };
    } catch (error) {
        console.error('Error getting product:', error);
        throw error;
    }
}

// Update product
export async function updateProduct(productId, updates) {
    try {
        const productRef = doc(db, 'products', productId);
        await updateDoc(productRef, {
            ...updates,
            updatedAt: serverTimestamp()
        });

        console.log('Product updated successfully:', productId);
        return { success: true };
    } catch (error) {
        console.error('Error updating product:', error);
        throw error;
    }
}

// Delete product
export async function deleteProduct(productId) {
    try {
        await deleteDoc(doc(db, 'products', productId));
        console.log('Product deleted successfully:', productId);
        return { success: true };
    } catch (error) {
        console.error('Error deleting product:', error);
        throw error;
    }
}

// Get products by seller
export async function getSellerProducts(sellerId) {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('sellerId', '==', sellerId));
        const querySnapshot = await getDocs(q);

        const products = [];
        querySnapshot.forEach((doc) => {
            products.push({
                id: doc.id,
                ...doc.data()
            });
        });

        console.log('Seller products retrieved:', products.length);
        return products;
    } catch (error) {
        console.error('Error getting seller products:', error);
        throw error;
    }
}

// Listen to products in real-time
export function listenToProducts(callback) {
    try {
        const productsRef = collection(db, 'products');
        const q = query(productsRef, where('stock', '>', 0));
        
        return onSnapshot(q, (querySnapshot) => {
            const products = [];
            querySnapshot.forEach((doc) => {
                products.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(products);
        }, (error) => {
            console.error('Error listening to products:', error);
            // Fallback to simple query without where clause
            const simpleQuery = collection(db, 'products');
            return onSnapshot(simpleQuery, (querySnapshot) => {
                const products = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.stock > 0) {
                        products.push({
                            id: doc.id,
                            ...data
                        });
                    }
                });
                callback(products);
            });
        });
    } catch (error) {
        console.error('Error setting up products listener:', error);
        throw error;
    }
}
