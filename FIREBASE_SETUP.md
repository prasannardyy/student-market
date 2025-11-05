# Firebase Setup Instructions

## Important: You MUST complete these steps before the application will work!

The application is currently configured with placeholder Firebase credentials. Follow these steps to connect it to your own Firebase project.

## Step-by-Step Firebase Configuration

### 1. Create a Firebase Project (2 minutes)

1. Open your browser and go to: https://console.firebase.google.com/
2. Click the **"Add project"** button
3. Enter a project name (e.g., "student-marketplace")
4. Click **"Continue"**
5. Disable Google Analytics (optional, you can enable it if you want)
6. Click **"Create project"**
7. Wait for the project to be created
8. Click **"Continue"** when ready

### 2. Register Your Web App (1 minute)

1. On the Firebase project overview page, click the **web icon** `</>`
2. Enter an app nickname: "Student Marketplace Web"
3. **Do NOT** check "Also set up Firebase Hosting"
4. Click **"Register app"**
5. You'll see a code snippet with `firebaseConfig` - **COPY THIS ENTIRE OBJECT**

It will look like this:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

6. Click **"Continue to console"**

### 3. Update Your Local Configuration (1 minute)

1. Open the file `js/firebase-config.js` in your code editor
2. Find the `firebaseConfig` object (around line 10)
3. **Replace the entire placeholder config** with the config you copied
4. Save the file

**Before:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "your-project.firebaseapp.com",
    // ... placeholder values
};
```

**After:**
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyC...", // Your actual API key
    authDomain: "student-marketplace-abc123.firebaseapp.com",
    // ... your actual values
};
```

### 4. Enable Authentication (2 minutes)

1. In Firebase Console, click **"Authentication"** in the left sidebar
2. Click **"Get started"** button
3. Click on the **"Sign-in method"** tab
4. Find **"Email/Password"** in the list
5. Click on it
6. Toggle the **"Enable"** switch to ON
7. Click **"Save"**

### 5. Enable Firestore Database (2 minutes)

1. In Firebase Console, click **"Firestore Database"** in the left sidebar
2. Click **"Create database"** button
3. Select **"Start in test mode"** (for development)
4. Click **"Next"**
5. Choose your Cloud Firestore location (select the one closest to you)
6. Click **"Enable"**
7. Wait for the database to be created

### 6. Enable Cloud Storage (2 minutes)

1. In Firebase Console, click **"Storage"** in the left sidebar
2. Click **"Get started"** button
3. Review the security rules message
4. Click **"Next"**
5. Select your Cloud Storage location (same as Firestore)
6. Click **"Done"**

### 7. Verify Everything is Working

1. Make sure your local server is running:
   ```bash
   python3 -m http.server 8000
   ```

2. Open your browser to: http://localhost:8000

3. Click **"Login"** → **"Register"**

4. Fill in the registration form:
   - Name: Test User
   - Email: test@example.com
   - Password: test123
   - Role: User (Buyer)

5. Click **"Register"**

6. If you see "Registration successful!" - **YOU'RE DONE!** ✅

### Troubleshooting

#### Error: "Firebase: Error (auth/api-key-not-valid)"
- You haven't updated `js/firebase-config.js` with your actual Firebase config
- Go back to Step 3 and make sure you copied the correct values

#### Error: "Firebase: Error (auth/operation-not-allowed)"
- Email/Password authentication is not enabled
- Go back to Step 4 and enable it

#### Error: "Missing or insufficient permissions"
- Firestore is not enabled or not in test mode
- Go back to Step 5 and make sure you selected "test mode"

#### Page shows "Loading..." forever
- Check the browser console (F12) for errors
- Make sure you're running the app through a web server (not opening the HTML file directly)
- Verify your Firebase config is correct

#### Can't upload images
- Cloud Storage is not enabled
- Go back to Step 6 and enable it

### Security Rules (Optional - For Production)

The current setup uses "test mode" which allows all reads and writes. This is fine for development but NOT for production.

For production, you should update the security rules:

**Firestore Rules** (Firestore Database → Rules):
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

**Storage Rules** (Storage → Rules):
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

### Next Steps

Once Firebase is configured and working:

1. **Create a Seller Account**
   - Register with role "Seller"
   - Login via "Login as Seller"
   - Add some products

2. **Create an Admin Account**
   - Register a user
   - Go to Firebase Console → Firestore Database
   - Find your user in the `users` collection
   - Edit the `role` field to "admin"
   - Login and access `/admin-dashboard.html`

3. **Test All Features**
   - Browse products
   - Add to cart
   - Post comments
   - Upload product images

### Need More Help?

- Check the full README.md for detailed documentation
- Visit Firebase Documentation: https://firebase.google.com/docs
- Check browser console (F12) for error messages
