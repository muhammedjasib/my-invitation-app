// Firebase App Initialization
// This module initializes Firebase and exports commonly used references

let app;
let auth;
let db;
let storage;
let analytics;

try {
    // Initialize Firebase
    app = firebase.initializeApp(firebaseConfig);
    
    // Get Firebase services
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage();
    analytics = firebase.analytics();

    console.log('Firebase initialized successfully');
} catch (error) {
    console.error('Firebase initialization error:', error);
}

// Set up Firestore settings
if (db) {
    db.settings({
        ignoreUndefinedProperties: true
    });
}

// Export Firebase services
const Firebase = {
    app,
    auth,
    db,
    storage,
    analytics,
    firebase
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Firebase;
}
