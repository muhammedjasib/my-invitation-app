// Main Application Entry Point
// Global initialization and setup

const App = (() => {
    let currentUser = null;

    const initialize = async () => {
        console.log('Initializing application...');
        
        // Check authentication
        firebase.auth().onAuthStateChanged(async (user) => {
            if (user) {
                currentUser = user;
                console.log('User logged in:', user.email);
                localStorage.setItem('userId', user.uid);
                localStorage.setItem('userEmail', user.email);
            } else {
                currentUser = null;
                // Redirect to login if not authenticated and not on login page
                if (!window.location.pathname.includes('index.html') && !window.location.pathname.endsWith('/')) {
                    window.location.href = '/index.html';
                }
            }
        });

        // Setup global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
        });

        // Setup performance monitoring
        if (firebase.analytics) {
            Analytics.trackPageView(window.location.pathname, document.title);
        }
    };

    const getCurrentUser = () => currentUser;

    const isAuthenticated = () => !!currentUser;

    const logout = async () => {
        try {
            await Auth.signOutUser();
            window.location.href = '/index.html';
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return {
        initialize,
        getCurrentUser,
        isAuthenticated,
        logout
    };
})();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', App.initialize);
} else {
    App.initialize();
}
