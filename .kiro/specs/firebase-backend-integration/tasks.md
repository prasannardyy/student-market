# Implementation Plan

- [x] 1. Set up project structure and Firebase configuration
  - Create js/ directory for JavaScript modules
  - Create images/ directory for sample product images
  - Organize existing HTML files in root directory
  - Set up Firebase project in Firebase Console and obtain configuration keys
  - Create firebase-config.js with Firebase initialization code
  - _Requirements: 7.1, 7.2, 7.5_

- [ ] 2. Implement authentication module
  - [ ] 2.1 Create auth.js with Firebase Authentication functions
    - Write registerUser function for user registration
    - Write loginUser function for user authentication
    - Write loginSeller function for seller authentication
    - Write logoutUser function to sign out users
    - Write getCurrentUser function to retrieve authenticated user
    - Write onAuthStateChanged listener for session management
    - _Requirements: 1.1, 1.2, 1.4, 2.1_

  - [ ] 2.2 Integrate authentication with login.html
    - Add Firebase SDK script tags to login.html
    - Replace form POST action with JavaScript event handler
    - Call loginUser function on form submission
    - Display error messages for authentication failures
    - Redirect to listings.html on successful login
    - _Requirements: 1.2, 1.3_

  - [ ] 2.3 Integrate authentication with register.html
    - Add Firebase SDK script tags to register.html
    - Replace form POST action with JavaScript event handler
    - Call registerUser function with form data
    - Create user document in Firestore users collection
    - Redirect to login.html on successful registration
    - _Requirements: 1.1_

  - [ ] 2.4 Integrate seller authentication with seller-login.html
    - Add Firebase SDK script tags to seller-login.html
    - Replace form POST action with JavaScript event handler
    - Call loginSeller function and verify seller role
    - Redirect to seller-dashboard.html on successful login
    - _Requirements: 2.1_

  - [ ] 2.5 Implement session persistence across all pages
    - Add auth state listener to all HTML pages
    - Store user role in localStorage on login
    - Update navigation links based on authentication state
    - Redirect unauthenticated users to login page where required
    - _Requirements: 1.5_

- [ ] 3. Implement products module and listing functionality
  - [ ] 3.1 Create products.js with Firestore product operations
    - Write addProduct function to create products in Firestore
    - Write getProducts function to retrieve all active products
    - Write getProductById function for single product details
    - Write updateProduct function for product updates
    - Write getSellerProducts function to filter by seller
    - _Requirements: 2.2, 3.1, 3.2_

  - [ ] 3.2 Integrate product listing with listings.html
    - Add Firebase SDK script tags to listings.html
    - Call getProducts function on page load
    - Dynamically generate product cards from Firestore data
    - Display product image, name, and price for each item
    - Implement real-time listener for product updates
    - _Requirements: 3.1, 3.2, 3.5_

  - [ ] 3.3 Integrate product details with item-details.html
    - Add Firebase SDK script tags to item-details.html
    - Extract product ID from URL query parameter
    - Call getProductById function to load product data
    - Display product image, name, price, description, and stock
    - Load product image from Firebase Storage URL
    - _Requirements: 3.3, 3.4_

  - [ ] 3.4 Implement image upload functionality
    - Create storage.js module for Cloud Storage operations
    - Write uploadProductImage function to upload images
    - Generate unique filenames using product IDs
    - Return downloadable image URL after upload
    - Validate file size (max 5MB) and type (images only)
    - _Requirements: 2.3, 8.5_

  - [ ] 3.5 Integrate product creation with seller-dashboard.html
    - Add Firebase SDK script tags to seller-dashboard.html
    - Replace form POST action with JavaScript event handler
    - Call addProduct function with form data
    - Upload product image using uploadProductImage function
    - Store product with seller ID and image URL in Firestore
    - Display success message and clear form on completion
    - _Requirements: 2.2, 2.3, 2.4_

- [ ] 4. Implement shopping cart functionality
  - [ ] 4.1 Create cart.js with Firestore cart operations
    - Write addToCart function to add items to user's cart
    - Write getCartItems function to retrieve cart with product details
    - Write updateCartQuantity function to modify item quantities
    - Write removeFromCart function to delete cart items
    - Write calculateCartTotal function to compute total price
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [ ] 4.2 Integrate add to cart with item-details.html
    - Add event listener to "Add to Cart" button
    - Call addToCart function with product ID and quantity
    - Validate stock availability before adding to cart
    - Display success message or error if stock insufficient
    - Update cart icon count in navigation
    - _Requirements: 4.1, 4.5_

  - [ ] 4.3 Integrate cart display with cart.html
    - Add Firebase SDK script tags to cart.html
    - Call getCartItems function on page load
    - Dynamically generate cart table rows from Firestore data
    - Display product name, price, quantity, and total for each item
    - Call calculateCartTotal and display total cost
    - _Requirements: 4.2_

  - [ ] 4.4 Implement cart item removal and quantity updates
    - Add event listeners to "Remove" buttons in cart.html
    - Call removeFromCart function on button click
    - Add quantity input fields with update functionality
    - Call updateCartQuantity on quantity change
    - Refresh cart display after modifications
    - _Requirements: 4.3, 4.4_

- [ ] 5. Implement comments functionality
  - [ ] 5.1 Create comments.js with Firestore comment operations
    - Write addComment function to post comments
    - Write getProductComments function to retrieve comments
    - Write listenToComments function for real-time updates
    - _Requirements: 5.1, 5.2, 5.4_

  - [ ] 5.2 Integrate comments with item-details.html
    - Add event listener to "Post Comment" button
    - Call addComment function with product ID and comment text
    - Call getProductComments on page load to display existing comments
    - Implement real-time listener to update comments without refresh
    - Display commenter name and comment text for each comment
    - Validate comment length (max 500 characters)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. Implement admin functionality
  - [ ] 6.1 Create admin.js with admin operations
    - Write getAllSellers function to retrieve seller accounts
    - Write deactivateSeller function to disable sellers
    - Write activateSeller function to enable sellers
    - Write addPaymentMethod function to add payment options
    - Write getPaymentMethods function to retrieve payment methods
    - _Requirements: 6.2, 6.3, 6.4_

  - [ ] 6.2 Integrate seller management with admin-dashboard.html
    - Add Firebase SDK script tags to admin-dashboard.html
    - Verify admin role on page load and restrict access
    - Call getAllSellers function to load seller list
    - Dynamically generate seller table rows
    - Add event listeners to "Deactivate" buttons
    - Call deactivateSeller function on button click
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ] 6.3 Integrate payment method management with admin-dashboard.html
    - Add event listener to payment method form
    - Call addPaymentMethod function with form data
    - Store payment method in Firestore
    - Display success message and clear form
    - _Requirements: 6.4_

- [ ] 7. Implement Firestore security rules
  - Write security rules for users collection (read: authenticated, write: own document)
  - Write security rules for products collection (read: all, write: sellers only)
  - Write security rules for cart collection (read/write: own cart only)
  - Write security rules for comments collection (read: all, create: authenticated)
  - Write security rules for paymentMethods collection (read: authenticated, write: admin only)
  - Deploy security rules to Firebase Console
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 8. Implement Cloud Storage security rules
  - Write storage rules to allow public read access for product images
  - Write storage rules to restrict uploads to authenticated sellers
  - Write storage rules to enforce 5MB file size limit
  - Write storage rules to validate image file types only
  - Deploy storage rules to Firebase Console
  - _Requirements: 8.5_

- [ ] 9. Add error handling and validation
  - [ ] 9.1 Implement authentication error handling
    - Add try-catch blocks to all auth functions
    - Display user-friendly error messages for invalid credentials
    - Show error for email already exists on registration
    - Validate password strength (minimum 6 characters)
    - Handle network errors with retry options
    - _Requirements: 1.3, 8.4_

  - [ ] 9.2 Implement database error handling
    - Add try-catch blocks to all Firestore operations
    - Handle permission denied errors with redirect to login
    - Display error messages for document not found
    - Implement retry logic for network timeouts
    - Log errors to console for debugging
    - _Requirements: 8.4_

  - [ ] 9.3 Implement storage error handling
    - Validate file size before upload (max 5MB)
    - Validate file type (accept only images)
    - Display error message for upload failures
    - Show retry option for failed uploads
    - _Requirements: 8.5_

  - [ ] 9.4 Implement client-side form validation
    - Validate all form inputs before submission
    - Check required fields are not empty
    - Validate email format on registration and login forms
    - Validate numeric inputs for price and stock
    - Display inline error messages for validation failures
    - _Requirements: 8.4_

- [ ] 10. Set up local development environment
  - Create package.json for project dependencies (optional)
  - Add Firebase SDK via CDN links to all HTML pages
  - Create .gitignore file to exclude firebase-config.js with API keys
  - Create README.md with setup instructions
  - Document how to obtain Firebase configuration keys
  - Document how to run local development server
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [ ] 11. Wire everything together and test complete flows
  - [ ] 11.1 Test user registration and login flow
    - Register new user account
    - Login with user credentials
    - Verify session persistence across page navigation
    - Test logout functionality
    - _Requirements: 1.1, 1.2, 1.4, 1.5_

  - [ ] 11.2 Test seller product management flow
    - Login as seller
    - Add new product with image upload
    - Verify product appears in listings
    - View product details page
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3_

  - [ ] 11.3 Test shopping cart flow
    - Browse products as authenticated user
    - Add multiple products to cart
    - View cart and verify totals
    - Update quantities and remove items
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [ ] 11.4 Test comments functionality
    - View product details as authenticated user
    - Post comment on product
    - Verify comment appears in real-time
    - View comments from other users
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [ ] 11.5 Test admin functionality
    - Login as admin user
    - View seller list in admin dashboard
    - Deactivate a seller account
    - Add new payment method
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_
