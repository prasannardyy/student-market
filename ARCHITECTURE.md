# 🏗️ Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER BROWSER                          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              HTML Pages (Frontend)                      │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│  │  │  Home    │ │ Listings │ │   Cart   │ │  Login   │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐               │ │
│  │  │  Seller  │ │  Admin   │ │ Details  │               │ │
│  │  └──────────┘ └──────────┘ └──────────┘               │ │
│  └────────────────────────────────────────────────────────┘ │
│                            ↕                                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         JavaScript Modules (Business Logic)             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ │
│  │  │  auth.js │ │products  │ │ cart.js  │ │comments  │  │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │ │
│  │  ┌──────────┐ ┌──────────────────────────────────────┐ │ │
│  │  │ admin.js │ │   firebase-config.js (SDK Init)      │ │ │
│  │  └──────────┘ └──────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                    FIREBASE SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Firebase   │  │    Cloud     │  │    Cloud     │      │
│  │     Auth     │  │  Firestore   │  │   Storage    │      │
│  │              │  │              │  │              │      │
│  │ • Register   │  │ • users      │  │ • product-   │      │
│  │ • Login      │  │ • products   │  │   images/    │      │
│  │ • Logout     │  │ • cart       │  │              │      │
│  │ • Sessions   │  │ • comments   │  │ • 5MB limit  │      │
│  │              │  │ • payments   │  │ • Images     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### User Registration Flow
```
register.html → auth.js → Firebase Auth → Firestore (users collection)
                                              ↓
                                        User Document Created
                                              ↓
                                        Redirect to Login
```

### Product Listing Flow
```
listings.html → products.js → Firestore (products collection)
                                    ↓
                              Real-time Listener
                                    ↓
                              Update DOM with Products
```

### Add to Cart Flow
```
item-details.html → cart.js → Firestore (cart collection)
                                    ↓
                              Cart Item Created
                                    ↓
                              Success Message
```

### Image Upload Flow
```
seller-dashboard.html → products.js → Cloud Storage
                                           ↓
                                      Upload Image
                                           ↓
                                      Get Download URL
                                           ↓
                                      Store URL in Firestore
```

## Module Dependencies

```
firebase-config.js (Core - Initializes Firebase)
        ↓
    ┌───┴───┬────────┬──────────┬──────────┐
    ↓       ↓        ↓          ↓          ↓
auth.js products.js cart.js comments.js admin.js
    ↓       ↓        ↓          ↓          ↓
  HTML    HTML     HTML       HTML       HTML
  Pages   Pages    Pages      Pages      Pages
```

## File Structure

```
student-marketplace/
│
├── 📄 HTML Pages (User Interface)
│   ├── index.html              # Landing page
│   ├── login.html              # User login
│   ├── register.html           # User registration
│   ├── seller-login.html       # Seller login
│   ├── listings.html           # Product grid
│   ├── item-details.html       # Product details + comments
│   ├── cart.html               # Shopping cart
│   ├── seller-dashboard.html   # Add products
│   ├── admin-dashboard.html    # Manage sellers
│   └── test-firebase.html      # Connection test
│
├── 🎨 Styling
│   └── css/
│       └── styles.css          # All CSS styles
│
├── ⚙️ JavaScript Modules
│   └── js/
│       ├── firebase-config.js  # Firebase initialization ⚠️
│       ├── auth.js             # Authentication logic
│       ├── products.js         # Product CRUD + images
│       ├── cart.js             # Cart management
│       ├── comments.js         # Comments system
│       └── admin.js            # Admin operations
│
├── 🖼️ Assets
│   └── images/                 # Product images
│
└── 📚 Documentation
    ├── START_HERE.md           # Quick start guide
    ├── FIREBASE_SETUP.md       # Firebase setup steps
    ├── QUICKSTART.md           # Fast reference
    ├── README.md               # Full documentation
    ├── FEATURES.md             # Feature list
    └── ARCHITECTURE.md         # This file
```

## Technology Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS variables
- **JavaScript ES6+**: Modules, async/await, arrow functions

### Backend (Firebase)
- **Firebase Authentication**: User management
- **Cloud Firestore**: NoSQL database
- **Cloud Storage**: File hosting
- **Firebase SDK v10**: Modular SDK

### Development
- **Python HTTP Server**: Local development
- **ES6 Modules**: Code organization
- **CDN**: Firebase SDK delivery

## Security Architecture

### Authentication Layer
```
User Request → Firebase Auth → Token Verification → Access Granted/Denied
```

### Firestore Security Rules
```
Request → Check Auth → Check Role → Check Ownership → Allow/Deny
```

### Storage Security Rules
```
Upload Request → Check Auth → Check File Type → Check Size → Allow/Deny
```

## Real-Time Data Flow

### Products Real-Time Updates
```
Seller adds product → Firestore → onSnapshot listener → All clients update
```

### Comments Real-Time Updates
```
User posts comment → Firestore → onSnapshot listener → Product page updates
```

## API Endpoints (Firebase SDK)

### Authentication
- `createUserWithEmailAndPassword()` - Register
- `signInWithEmailAndPassword()` - Login
- `signOut()` - Logout
- `onAuthStateChanged()` - Session monitoring

### Firestore
- `addDoc()` - Create document
- `getDocs()` - Read documents
- `updateDoc()` - Update document
- `deleteDoc()` - Delete document
- `onSnapshot()` - Real-time listener
- `query()` - Filter data

### Storage
- `uploadBytes()` - Upload file
- `getDownloadURL()` - Get file URL
- `ref()` - Create storage reference

## State Management

### Client-Side State
- **localStorage**: User role, userId, userName
- **Firebase Auth**: Current user session
- **DOM State**: Dynamic content rendering

### Server-Side State
- **Firestore**: All persistent data
- **Storage**: All uploaded files
- **Auth**: User sessions

## Performance Considerations

### Optimization Strategies
1. **Real-time listeners**: Only where needed
2. **Query limits**: Paginate large datasets
3. **Image optimization**: 5MB limit
4. **Lazy loading**: Load on demand
5. **Caching**: Browser cache for static assets

### Scalability
- Firestore auto-scales
- Storage auto-scales
- Auth handles millions of users
- CDN for Firebase SDK

## Error Handling

### Error Flow
```
Operation → Try/Catch → Error Object → User-Friendly Message → Display
```

### Error Types
1. **Auth Errors**: Invalid credentials, weak password
2. **Firestore Errors**: Permission denied, not found
3. **Storage Errors**: File too large, invalid type
4. **Network Errors**: Connection timeout, offline

## Development Workflow

```
1. Edit Code → 2. Save File → 3. Browser Auto-Refresh → 4. Test
                                        ↓
                                   5. Check Console
                                        ↓
                                   6. Debug if needed
                                        ↓
                                   7. Repeat
```

## Deployment Architecture (Future)

```
Local Development → Git Repository → Firebase Hosting → Production
                                           ↓
                                    Custom Domain
                                           ↓
                                    HTTPS Enabled
                                           ↓
                                    Global CDN
```

## Database Schema

### Collections Structure
```
Firestore Database
├── users/
│   └── {userId}
│       ├── name
│       ├── email
│       ├── role
│       ├── isActive
│       └── createdAt
│
├── products/
│   └── {productId}
│       ├── name
│       ├── description
│       ├── price
│       ├── stock
│       ├── imageUrl
│       ├── sellerId
│       ├── sellerName
│       ├── createdAt
│       └── updatedAt
│
├── cart/
│   └── {cartItemId}
│       ├── userId
│       ├── productId
│       ├── quantity
│       └── addedAt
│
├── comments/
│   └── {commentId}
│       ├── productId
│       ├── userId
│       ├── userName
│       ├── commentText
│       └── createdAt
│
└── paymentMethods/
    └── {paymentId}
        ├── type
        ├── details
        ├── isActive
        └── createdAt
```

## Integration Points

### Firebase SDK Integration
```javascript
// Initialize Firebase
import { initializeApp } from 'firebase/app';
const app = initializeApp(config);

// Use services
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
```

### Module Integration
```javascript
// Import from modules
import { loginUser } from './js/auth.js';
import { getProducts } from './js/products.js';
import { addToCart } from './js/cart.js';
```

---

**This architecture provides a scalable, secure, and maintainable foundation for the Student Marketplace.**
