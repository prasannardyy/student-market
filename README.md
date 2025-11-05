# Student Marketplace - Firebase Integration

A campus marketplace web application where students can buy and sell products. Built with vanilla JavaScript and Firebase backend services.

## Features

- **User Authentication**: Register and login as User, Seller, or Admin
- **Product Listings**: Browse products with real-time updates
- **Shopping Cart**: Add products to cart and manage quantities
- **Product Comments**: Post and view comments on products
- **Seller Dashboard**: Sellers can add products with images
- **Admin Dashboard**: Manage sellers and payment methods
- **Image Upload**: Upload product images to Firebase Storage
- **Real-time Updates**: Products and comments update in real-time

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6 Modules)
- **Backend**: Firebase
  - Firebase Authentication
  - Cloud Firestore
  - Cloud Storage
- **Development**: Local HTTP Server

## Setup Instructions

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once created, click on the web icon (</>) to add a web app
4. Register your app and copy the Firebase configuration

### 2. Configure Firebase

1. Open `js/firebase-config.js`
2. Replace the placeholder values with your actual Firebase configuration:

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

### 3. Enable Firebase Services

#### Enable Authentication:
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable "Email/Password" provider

#### Enable Firestore:
1. Go to Firestore Database
2. Click "Create database"
3. Start in **test mode** (for development)
4. Choose a location

#### Enable Storage:
1. Go to Storage
2. Click "Get started"
3. Start in **test mode** (for development)

### 4. Set Up Security Rules

#### Firestore Rules:
Go to Firestore Database > Rules and paste:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId;
    }
    
    match /products/{productId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    match /cart/{cartItemId} {
      allow read, write: if request.auth != null;
    }
    
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null;
    }
    
    match /paymentMethods/{paymentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

#### Storage Rules:
Go to Storage > Rules and paste:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /product-images/{fileName} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.resource.size < 5 * 1024 * 1024 &&
                     request.resource.contentType.matches('image/.*');
    }
  }
}
```

### 5. Run Locally

You need a local web server to run the application (required for ES6 modules).

#### Option 1: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Option 2: Node.js http-server
```bash
# Install globally
npm install -g http-server

# Run
http-server -p 8000
```

#### Option 3: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:8000
```

## Usage Guide

### For Users (Buyers):
1. Register an account (select "User" role)
2. Login with your credentials
3. Browse products on the listings page
4. Click on a product to view details
5. Add products to cart
6. View and manage your cart
7. Post comments on products

### For Sellers:
1. Register an account (select "Seller" role)
2. Login via the Seller Login page
3. Access the Seller Dashboard
4. Add products with name, description, price, stock, and image
5. Your products will appear in the marketplace

### For Admins:
1. Create an admin account manually in Firestore:
   - Go to Firestore Database
   - Find your user document in the `users` collection
   - Change the `role` field to "admin"
2. Login via the regular login page
3. Navigate to `/admin-dashboard.html`
4. Manage sellers (activate/deactivate)
5. Add payment methods

## Project Structure

```
student-marketplace/
├── index.html              # Home page
├── login.html              # User login
├── register.html           # User registration
├── seller-login.html       # Seller login
├── seller-dashboard.html   # Seller product management
├── admin-dashboard.html    # Admin panel
├── listings.html           # Product listings
├── item-details.html       # Product details & comments
├── cart.html               # Shopping cart
├── css/
│   └── styles.css          # All styles
├── js/
│   ├── firebase-config.js  # Firebase initialization
│   ├── auth.js             # Authentication functions
│   ├── products.js         # Product operations
│   ├── cart.js             # Cart management
│   ├── comments.js         # Comments functionality
│   └── admin.js            # Admin operations
├── images/                 # Sample product images
└── README.md               # This file
```

## Firestore Collections

### users
- userId (auto-generated)
- name
- email
- role (user/seller/admin)
- createdAt
- isActive

### products
- productId (auto-generated)
- name
- description
- price
- stock
- imageUrl
- sellerId
- sellerName
- createdAt
- updatedAt

### cart
- cartItemId (auto-generated)
- userId
- productId
- quantity
- addedAt

### comments
- commentId (auto-generated)
- productId
- userId
- userName
- commentText
- createdAt

### paymentMethods
- paymentId (auto-generated)
- type
- details
- isActive
- createdAt

## Troubleshooting

### Firebase Configuration Error
- Make sure you've replaced the placeholder values in `firebase-config.js` with your actual Firebase project configuration

### CORS Errors
- You must run the application through a web server, not by opening the HTML file directly
- Use one of the local server options mentioned above

### Authentication Errors
- Ensure Email/Password authentication is enabled in Firebase Console
- Check that your Firebase project is active

### Firestore Permission Errors
- Make sure you've set up the security rules correctly
- For development, you can temporarily use test mode

### Image Upload Errors
- Verify that Firebase Storage is enabled
- Check that storage security rules are configured
- Ensure image file is less than 5MB

## Security Notes

⚠️ **Important**: The current security rules are simplified for development. For production:

1. Implement proper role-based access control in Firestore rules
2. Add server-side validation
3. Use Firebase Admin SDK for sensitive operations
4. Enable App Check to prevent abuse
5. Set up proper CORS policies
6. Use environment variables for configuration

## Future Enhancements

- Payment gateway integration
- Order history and tracking
- Product search and filters
- User profiles and ratings
- Email notifications
- Product categories
- Wishlist functionality
- Admin analytics dashboard

## License

This project is for educational purposes.

## Support

For issues or questions, please check:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
