# Design Document

## Overview

This design document outlines the technical approach for integrating Firebase backend services with the existing Student Marketplace HTML frontend. The solution will use Firebase Authentication for user management, Cloud Firestore for data storage, and Cloud Storage for product images. The integration will be implemented using the Firebase JavaScript SDK with minimal changes to the existing HTML structure.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   Client Browser                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │         HTML Pages (Existing Interface)           │  │
│  │  - index.html, listings.html, cart.html, etc.    │  │
│  └───────────────────────────────────────────────────┘  │
│                          ↕                               │
│  ┌───────────────────────────────────────────────────┐  │
│  │      JavaScript Layer (Firebase Integration)      │  │
│  │  - firebase-config.js (initialization)            │  │
│  │  - auth.js (authentication logic)                 │  │
│  │  - products.js (product operations)               │  │
│  │  - cart.js (cart management)                      │  │
│  │  - admin.js (admin operations)                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│                  Firebase Services                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Firebase     │  │  Cloud       │  │   Cloud      │  │
│  │ Auth         │  │  Firestore   │  │   Storage    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: Existing HTML5, CSS3, Vanilla JavaScript
- **Backend Services**: Firebase (v9+ modular SDK)
  - Firebase Authentication
  - Cloud Firestore
  - Cloud Storage
- **Development Server**: Live Server or Python SimpleHTTPServer for local testing

## Components and Interfaces

### 1. Firebase Configuration Module (`js/firebase-config.js`)

**Purpose**: Initialize Firebase services and export instances for use across the application.

**Exports**:
- `auth`: Firebase Authentication instance
- `db`: Firestore database instance
- `storage`: Cloud Storage instance

**Configuration**:
```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### 2. Authentication Module (`js/auth.js`)

**Purpose**: Handle user registration, login, logout, and session management.

**Key Functions**:
- `registerUser(name, email, password, role)`: Create new user account
- `loginUser(email, password)`: Authenticate user
- `loginSeller(email, password)`: Authenticate seller
- `logoutUser()`: Sign out current user
- `getCurrentUser()`: Get authenticated user details
- `onAuthStateChanged(callback)`: Listen for auth state changes

**Integration Points**:
- `login.html`: User login form
- `seller-login.html`: Seller login form
- `register.html`: User registration form
- All pages: Check authentication state on load

### 3. Products Module (`js/products.js`)

**Purpose**: Manage product CRUD operations and real-time product listing.

**Key Functions**:
- `addProduct(productData, imageFile)`: Create new product with image upload
- `getProducts()`: Retrieve all active products
- `getProductById(productId)`: Get single product details
- `updateProduct(productId, updates)`: Update product information
- `deleteProduct(productId)`: Remove product
- `getSellerProducts(sellerId)`: Get products by specific seller

**Integration Points**:
- `listings.html`: Display product grid
- `item-details.html`: Show product details
- `seller-dashboard.html`: Seller's product management
- `post-item.html`: Add new product form

### 4. Cart Module (`js/cart.js`)

**Purpose**: Manage shopping cart operations for authenticated users.

**Key Functions**:
- `addToCart(userId, productId, quantity)`: Add item to cart
- `getCartItems(userId)`: Retrieve user's cart with product details
- `updateCartQuantity(cartItemId, quantity)`: Modify item quantity
- `removeFromCart(cartItemId)`: Delete cart item
- `calculateCartTotal(cartItems)`: Compute total price
- `clearCart(userId)`: Empty cart after checkout

**Integration Points**:
- `cart.html`: Display cart items and total
- `item-details.html`: Add to cart button
- All pages: Cart icon with item count

### 5. Comments Module (`js/comments.js`)

**Purpose**: Handle product comments and reviews.

**Key Functions**:
- `addComment(productId, userId, commentText)`: Post new comment
- `getProductComments(productId)`: Retrieve comments for a product
- `listenToComments(productId, callback)`: Real-time comment updates

**Integration Points**:
- `item-details.html`: Comments section

### 6. Admin Module (`js/admin.js`)

**Purpose**: Administrative functions for managing sellers and payment methods.

**Key Functions**:
- `getAllSellers()`: Retrieve all seller accounts
- `deactivateSeller(sellerId)`: Disable seller account
- `activateSeller(sellerId)`: Enable seller account
- `addPaymentMethod(paymentData)`: Add new payment option
- `getPaymentMethods()`: Retrieve available payment methods

**Integration Points**:
- `admin-dashboard.html`: Admin control panel

## Data Models

### Firestore Collections Structure

#### Users Collection (`users`)
```javascript
{
  userId: "auto-generated-id",
  name: "string",
  email: "string",
  role: "user" | "seller" | "admin",
  createdAt: timestamp,
  isActive: boolean
}
```

#### Products Collection (`products`)
```javascript
{
  productId: "auto-generated-id",
  name: "string",
  description: "string",
  price: number,
  stock: number,
  imageUrl: "string",
  sellerId: "string",
  sellerName: "string",
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Cart Collection (`cart`)
```javascript
{
  cartItemId: "auto-generated-id",
  userId: "string",
  productId: "string",
  quantity: number,
  addedAt: timestamp
}
```

#### Comments Collection (`comments`)
```javascript
{
  commentId: "auto-generated-id",
  productId: "string",
  userId: "string",
  userName: "string",
  commentText: "string",
  createdAt: timestamp
}
```

#### Payment Methods Collection (`paymentMethods`)
```javascript
{
  paymentId: "auto-generated-id",
  type: "string",
  details: "string",
  isActive: boolean,
  createdAt: timestamp
}
```

### Cloud Storage Structure

```
/product-images/
  /{productId}/
    /image.jpg
```

## Error Handling

### Authentication Errors
- **Invalid credentials**: Display user-friendly message on login forms
- **Email already exists**: Show error on registration form
- **Weak password**: Validate password strength (min 6 characters)
- **Network errors**: Show retry option with error message

### Database Errors
- **Permission denied**: Redirect to login page
- **Document not found**: Show 404 message or redirect to listings
- **Network timeout**: Display retry button with error notification
- **Quota exceeded**: Log error and notify admin

### Storage Errors
- **File too large**: Validate file size before upload (max 5MB)
- **Invalid file type**: Accept only image formats (jpg, png, webp)
- **Upload failed**: Show error message with retry option

### Error Display Strategy
- Use browser alerts for critical errors
- Display inline error messages for form validation
- Log errors to console for debugging
- Implement toast notifications for non-blocking errors

## Security Implementation

### Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    // Products collection
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null && 
                      get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'seller';
      allow update, delete: if request.auth != null && 
                               resource.data.sellerId == request.auth.uid;
    }
    
    // Cart collection
    match /cart/{cartItemId} {
      allow read, write: if request.auth != null && 
                           resource.data.userId == request.auth.uid;
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
                      resource.data.userId == request.auth.uid;
    }
    
    // Payment methods (admin only)
    match /paymentMethods/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

### Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{productId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.resource.size < 5 * 1024 * 1024 &&
                     request.resource.contentType.matches('image/.*');
    }
  }
}
```

### Client-Side Validation
- Validate all form inputs before submission
- Sanitize user-generated content (comments, product descriptions)
- Implement CSRF protection for form submissions
- Use HTTPS for all Firebase connections

## Testing Strategy

### Unit Testing
- Test individual Firebase operations (add, read, update, delete)
- Mock Firebase services using Firebase emulators
- Test authentication flows with different user roles
- Validate data model constraints

### Integration Testing
- Test complete user flows (registration → login → browse → add to cart → checkout)
- Test seller flows (login → add product → manage products)
- Test admin flows (login → manage sellers → add payment methods)
- Verify real-time updates for products and comments

### Manual Testing Checklist
1. User registration and login
2. Seller registration and login
3. Admin login
4. Product listing display
5. Product details page
6. Add to cart functionality
7. Cart management (add, update, remove)
8. Product image upload
9. Comments posting and display
10. Seller product management
11. Admin seller management
12. Payment method management
13. Authentication persistence across page refreshes
14. Real-time updates for products and comments

### Local Development Testing
- Use Firebase Emulator Suite for local testing
- Test with multiple user accounts (user, seller, admin)
- Verify security rules in emulator
- Test offline behavior and error handling

## Implementation Notes

### HTML Modifications Required
- Add Firebase SDK script tags to all HTML pages
- Update form submissions from POST to JavaScript event handlers
- Add data attributes for dynamic content binding
- Include loading states and error message containers

### JavaScript Module Loading
- Use ES6 modules with `type="module"` in script tags
- Import Firebase SDK from CDN or npm
- Organize code into separate module files
- Use async/await for Firebase operations

### Real-Time Updates
- Implement Firestore `onSnapshot` listeners for products and comments
- Update DOM dynamically when data changes
- Unsubscribe from listeners on page unload to prevent memory leaks

### Image Handling
- Compress images on client-side before upload
- Generate unique filenames using product IDs
- Display loading spinner during upload
- Show image preview before upload

### Session Management
- Store minimal user data in localStorage (userId, role)
- Use Firebase auth state persistence
- Redirect unauthenticated users to login page
- Clear session data on logout

### Performance Optimization
- Implement pagination for product listings (20 items per page)
- Use Firestore query limits and cursors
- Cache product images in browser
- Lazy load images on scroll
- Minimize Firestore reads by caching data locally
