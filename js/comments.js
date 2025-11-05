// Comments Module
import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    query,
    where,
    orderBy,
    onSnapshot,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

// Add comment to product
export async function addComment(productId, userId, userName, commentText) {
    try {
        if (commentText.length > 500) {
            throw new Error('Comment must be 500 characters or less');
        }

        await addDoc(collection(db, 'comments'), {
            productId,
            userId,
            userName,
            commentText,
            createdAt: serverTimestamp()
        });

        console.log('Comment added successfully');
        return { success: true };
    } catch (error) {
        console.error('Error adding comment:', error);
        throw error;
    }
}

// Listen to comments in real-time
export function listenToComments(productId, callback) {
    try {
        const commentsRef = collection(db, 'comments');
        const q = query(
            commentsRef, 
            where('productId', '==', productId),
            orderBy('createdAt', 'desc')
        );

        return onSnapshot(q, (querySnapshot) => {
            const comments = [];
            querySnapshot.forEach((doc) => {
                comments.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
            callback(comments);
        }, (error) => {
            console.error('Error listening to comments:', error);
            // Fallback without orderBy if index doesn't exist
            const simpleQuery = query(commentsRef, where('productId', '==', productId));
            return onSnapshot(simpleQuery, (querySnapshot) => {
                const comments = [];
                querySnapshot.forEach((doc) => {
                    comments.push({
                        id: doc.id,
                        ...doc.data()
                    });
                });
                // Sort manually
                comments.sort((a, b) => {
                    if (!a.createdAt || !b.createdAt) return 0;
                    return b.createdAt.seconds - a.createdAt.seconds;
                });
                callback(comments);
            });
        });
    } catch (error) {
        console.error('Error setting up comments listener:', error);
        throw error;
    }
}
