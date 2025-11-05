## Quick Start Guide

Follow these steps to get the Student Marketplace running locally:

### Step 1: Firebase Setup (5 minutes)

1. **Create Firebase Project**
   - Go to https://console.firebase.google.com/
   - Click "Add project"
   - Name it "student-marketplace" (or any name)
   - Disable Google Analytics (optional)
   - Click "Create project"

2. **Add Web App**
   - Click the web icon `</>` on the project overview
   - Register app name: "Student Marketplace Web"
   - Copy the `firebaseConfig` object

3. **Update Configuration**
   - Open `js/firebase-config.js` in your editor
   - Replace the placeholder config with your copied config

### Step 2: Enable Firebase Services (3 minutes)

1. **Enable Authentication**
   - In Firebase Console, click "Authentication" in left menu
   - Click "Get started"
   - Click "Sign-in method" tab
   - Enable "Email/Password"
   - Click "Save"

2. **Enable Firestore**
   - Click "Firestore Database" in left menu
   - Click "Create database"
   - Select "Start in test mode"
   - Choose your location
   - Click "Enable"

3. **Enable Storage**
   - Click "Storage" in left menu
   - Click "Get started"
   - Select "Start in test mode"
   - Click "Done"

### Step 3: Run Locally (1 minute)

**Option A: Python (if you have Python installed)**
```bash
python -m http.server 8000
```

**Option B: Node.js (if you have Node.js installed)**
```bash
npx http-server -p 8000
```

**Option C: VS Code Live Server**
- Install "Live Server" extension
- Right-click `index.html`
- Click "Open with Live Server"

### Step 4: Test the Application

1. **Open Browser**
   - Navigate to `http://localhost:8000`

2. **Register a User**
   - Click "Login" → "Register"
   - Fill in details
   - Select "User (Buyer)" role
   - Click "Register"

3. **Register a Seller**
   - Logout (if logged in)
   - Go to Register again
   - Fill in different details
   - Select "Seller" role
   - Click "Register"

4. **Add a Product (as Seller)**
   - Login via "Login as Seller"
   - You'll be redirected to Seller Dashboard
   - Fill in product details
   - Optionally upload an image
   - Click "Add Product"

5. **Browse and Shop (as User)**
   - Logout and login as the user you created
   - Go to "Products"
   - Click on a product
   - Click "Add to Cart"
   - View your cart

6. **Create Admin (Manual)**
   - Go to Firebase Console → Firestore Database
   - Find the `users` collection
   - Click on your user document
   - Edit the `role` field to "admin"
   - Save
   - Logout and login again
   - Navigate to `/admin-dashboard.html`

### Common Issues

**"Module not found" error**
- Make sure you're running through a web server, not opening the HTML file directly

**"Firebase not defined" error**
- Check that you've updated `js/firebase-config.js` with your actual Firebase config

**"Permission denied" error**
- Make sure you've enabled Authentication, Firestore, and Storage in Firebase Console
- Verify they're all in "test mode" for development

**Images not uploading**
- Check Firebase Storage is enabled
- Verify the image is less than 5MB
- Check browser console for specific errors

### Next Steps

- Add more products as a seller
- Test the cart functionality
- Try posting comments on products
- Explore the admin dashboard
- Customize the styling in `css/styles.css`

### Need Help?

Check the full README.md for detailed documentation and troubleshooting.
