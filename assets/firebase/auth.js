// Firebase Authentication Module
// Handles login, logout, and session management

const Auth = (() => {
    const signInWithEmail = async (email, password) => {
        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Store user token
            const token = await user.getIdToken();
            localStorage.setItem('userToken', token);
            localStorage.setItem('userId', user.uid);
            localStorage.setItem('userEmail', user.email);
            
            return user;
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    const signOutUser = async () => {
        try {
            await firebase.auth().signOut();
            localStorage.removeItem('userToken');
            localStorage.removeItem('userId');
            localStorage.removeItem('userEmail');
            return true;
        } catch (error) {
            console.error('Sign out error:', error);
            return false;
        }
    };

    const getCurrentUser = () => {
        return firebase.auth().currentUser;
    };

    const isUserLoggedIn = () => {
        return !!localStorage.getItem('userToken') && !!firebase.auth().currentUser;
    };

    const sendPasswordReset = async (email) => {
        try {
            await firebase.auth().sendPasswordResetEmail(email);
            return true;
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    const createUserWithEmail = async (email, password, displayName) => {
        try {
            const userCredential = await firebase.auth().createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update user profile
            await user.updateProfile({ displayName });
            
            // Create user document in Firestore
            await firebase.firestore().collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email,
                displayName: displayName,
                createdAt: new Date(),
                subscription: 'free'
            });
            
            return user;
        } catch (error) {
            throw new Error(getAuthErrorMessage(error.code));
        }
    };

    const getAuthErrorMessage = (code) => {
        const messages = {
            'auth/invalid-email': 'Invalid email address',
            'auth/user-disabled': 'User account has been disabled',
            'auth/user-not-found': 'Email not found',
            'auth/wrong-password': 'Incorrect password',
            'auth/email-already-in-use': 'Email already in use',
            'auth/weak-password': 'Password should be at least 6 characters',
            'auth/operation-not-allowed': 'Operation not allowed',
            'auth/too-many-requests': 'Too many login attempts, please try later'
        };
        return messages[code] || 'Authentication error';
    };

    return {
        signInWithEmail,
        signOutUser,
        getCurrentUser,
        isUserLoggedIn,
        sendPasswordReset,
        createUserWithEmail
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Auth;
}
