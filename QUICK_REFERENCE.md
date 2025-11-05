# 🚀 Quick Reference Card

## Essential URLs
```
Main App:      http://localhost:8000
Welcome:       http://localhost:8000/welcome.html
Firebase Test: http://localhost:8000/test-firebase.html
Listings:      http://localhost:8000/listings.html
Login:         http://localhost:8000/login.html
```

## Setup Checklist
- [ ] 1. Create Firebase project at console.firebase.google.com
- [ ] 2. Copy Firebase config from project settings
- [ ] 3. Update `js/firebase-config.js` with your config
- [ ] 4. Enable Authentication (Email/Password)
- [ ] 5. Enable Firestore Database (test mode)
- [ ] 6. Enable Cloud Storage (test mode)
- [ ] 7. Test at http://localhost:8000/test-firebase.html
- [ ] 8. Register a user account
- [ ] 9. Start using the app!

## File to Update
```javascript
// js/firebase-config.js
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",              // ← Change this
    authDomain: "YOUR_PROJECT.firebaseapp.com",  // ← Change this
    projectId: "YOUR_PROJECT_ID",        // ← Change this
    storageBucket: "YOUR_PROJECT.appspot.com",   // ← Change this
    messagingSenderId: "YOUR_SENDER_ID", // ← Change this
    appId: "YOUR_APP_ID"                 // ← Change this
};
```

## User Roles

### User (Buyer)
- Register with role "User"
- Browse products
- Add to cart
- Post comments

### Seller
- Register with role "Seller"
- Login at `/seller-login.html`
- Add products with images
- Manage inventory

### Admin
- Register any account
- Go to Firebase Console → Firestore
- Change `role` field to "admin"
- Access `/admin-dashboard.html`

## Common Commands

### Start Server
```bash
python3 -m http.server 8000
# or
npx http-server -p 8000
```

### Stop Server
```bash
Ctrl + C
```

## Troubleshooting

### "Firebase not defined"
→ Update `js/firebase-config.js`

### "Permission denied"
→ Enable Firebase services in console

### "Loading forever"
→ Check browser console (F12)

### "Can't upload images"
→ Enable Cloud Storage

## Documentation Quick Links

| Document | Purpose | Time |
|----------|---------|------|
| START_HERE.md | Overview | 2 min |
| FIREBASE_SETUP.md | Setup | 10 min |
| QUICKSTART.md | Fast ref | 5 min |
| README.md | Full docs | 15 min |
| FEATURES.md | Features | 5 min |
| ARCHITECTURE.md | Technical | 10 min |

## Firebase Console Links

- **Main Console**: https://console.firebase.google.com
- **Authentication**: Console → Authentication
- **Firestore**: Console → Firestore Database
- **Storage**: Console → Storage
- **Project Settings**: Console → Project Settings (gear icon)

## Project Structure
```
student-marketplace/
├── index.html              # Home
├── listings.html           # Products
├── cart.html               # Cart
├── seller-dashboard.html   # Add products
├── admin-dashboard.html    # Manage sellers
├── js/
│   ├── firebase-config.js  # ⚠️ UPDATE THIS
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── comments.js
│   └── admin.js
└── css/
    └── styles.css
```

## Key Features
✓ User authentication
✓ Product listings
✓ Shopping cart
✓ Comments
✓ Image upload
✓ Real-time updates
✓ Admin panel
✓ Seller dashboard

## Test Accounts

Create these for testing:
1. **User**: test-user@example.com
2. **Seller**: test-seller@example.com
3. **Admin**: test-admin@example.com (set role manually)

## Browser Console Commands

```javascript
// Check current user
firebase.auth().currentUser

// Check local storage
localStorage.getItem('userRole')
localStorage.getItem('userId')

// Clear local storage
localStorage.clear()
```

## Firebase Collections

```
users/          - User accounts
products/       - Product listings
cart/           - Shopping carts
comments/       - Product comments
paymentMethods/ - Payment options
```

## Status Indicators

✅ Working correctly
⚠️ Needs configuration
❌ Error - check console
⏳ Loading...

## Support

1. Check START_HERE.md
2. Run test-firebase.html
3. Read FIREBASE_SETUP.md
4. Check browser console (F12)
5. Verify Firebase services enabled

---

**Quick Start**: Open http://localhost:8000/welcome.html
