// Firestore Database Module
// Handles all database operations (CRUD for collections)

const Database = (() => {
    // USERS Collection
    const getUser = async (uid) => {
        try {
            const doc = await firebase.firestore().collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error getting user:', error);
            throw error;
        }
    };

    const updateUser = async (uid, data) => {
        try {
            await firebase.firestore().collection('users').doc(uid).update(data);
            return true;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    // INVITATIONS Collection
    const createInvitation = async (userId, invitationData) => {
        try {
            const code = generateInvitationCode();
            const docRef = await firebase.firestore().collection('invitations').add({
                ...invitationData,
                userId,
                code,
                status: 'draft',
                viewCount: 0,
                uniqueVisitors: 0,
                rsvpCount: 0,
                wishesCount: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            return { id: docRef.id, code };
        } catch (error) {
            console.error('Error creating invitation:', error);
            throw error;
        }
    };

    const getInvitation = async (invitationId) => {
        try {
            const doc = await firebase.firestore().collection('invitations').doc(invitationId).get();
            return doc.exists ? { id: doc.id, ...doc.data() } : null;
        } catch (error) {
            console.error('Error getting invitation:', error);
            throw error;
        }
    };

    const getInvitationByCode = async (code) => {
        try {
            const snapshot = await firebase.firestore()
                .collection('invitations')
                .where('code', '==', code)
                .limit(1)
                .get();
            
            if (snapshot.empty) return null;
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        } catch (error) {
            console.error('Error getting invitation by code:', error);
            throw error;
        }
    };

    const getUserInvitations = async (userId) => {
        try {
            const snapshot = await firebase.firestore()
                .collection('invitations')
                .where('userId', '==', userId)
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting user invitations:', error);
            throw error;
        }
    };

    const updateInvitation = async (invitationId, data) => {
        try {
            await firebase.firestore().collection('invitations').doc(invitationId).update({
                ...data,
                updatedAt: new Date()
            });
            return true;
        } catch (error) {
            console.error('Error updating invitation:', error);
            throw error;
        }
    };

    const deleteInvitation = async (invitationId) => {
        try {
            await firebase.firestore().collection('invitations').doc(invitationId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting invitation:', error);
            throw error;
        }
    };

    const duplicateInvitation = async (invitationId, userId) => {
        try {
            const original = await getInvitation(invitationId);
            if (!original) throw new Error('Invitation not found');
            
            const { id, code, createdAt, updatedAt, ...data } = original;
            return await createInvitation(userId, data);
        } catch (error) {
            console.error('Error duplicating invitation:', error);
            throw error;
        }
    };

    // RSVP Collection
    const createRSVP = async (invitationId, rsvpData) => {
        try {
            const docRef = await firebase.firestore().collection('rsvp').add({
                ...rsvpData,
                invitationId,
                createdAt: new Date()
            });
            
            // Update RSVP count
            const invitation = await getInvitation(invitationId);
            await updateInvitation(invitationId, {
                rsvpCount: (invitation.rsvpCount || 0) + 1
            });
            
            return docRef.id;
        } catch (error) {
            console.error('Error creating RSVP:', error);
            throw error;
        }
    };

    const getInvitationRSVPs = async (invitationId) => {
        try {
            const snapshot = await firebase.firestore()
                .collection('rsvp')
                .where('invitationId', '==', invitationId)
                .orderBy('createdAt', 'desc')
                .get();
            
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting RSVPs:', error);
            throw error;
        }
    };

    // WISHES Collection
    const createWish = async (invitationId, wishData) => {
        try {
            const docRef = await firebase.firestore().collection('wishes').add({
                ...wishData,
                invitationId,
                approved: false,
                createdAt: new Date()
            });
            
            // Update wishes count
            const invitation = await getInvitation(invitationId);
            await updateInvitation(invitationId, {
                wishesCount: (invitation.wishesCount || 0) + 1
            });
            
            return docRef.id;
        } catch (error) {
            console.error('Error creating wish:', error);
            throw error;
        }
    };

    const getInvitationWishes = async (invitationId, approvedOnly = true) => {
        try {
            let query = firebase.firestore()
                .collection('wishes')
                .where('invitationId', '==', invitationId);
            
            if (approvedOnly) {
                query = query.where('approved', '==', true);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        } catch (error) {
            console.error('Error getting wishes:', error);
            throw error;
        }
    };

    const updateWish = async (wishId, data) => {
        try {
            await firebase.firestore().collection('wishes').doc(wishId).update(data);
            return true;
        } catch (error) {
            console.error('Error updating wish:', error);
            throw error;
        }
    };

    const deleteWish = async (wishId) => {
        try {
            await firebase.firestore().collection('wishes').doc(wishId).delete();
            return true;
        } catch (error) {
            console.error('Error deleting wish:', error);
            throw error;
        }
    };

    // ANALYTICS Collection
    const trackEvent = async (invitationId, eventData) => {
        try {
            await firebase.firestore().collection('analytics').add({
                ...eventData,
                invitationId,
                timestamp: new Date()
            });
            return true;
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    };

    const getInvitationAnalytics = async (invitationId) => {
        try {
            const snapshot = await firebase.firestore()
                .collection('analytics')
                .where('invitationId', '==', invitationId)
                .get();
            
            return snapshot.docs.map(doc => doc.data());
        } catch (error) {
            console.error('Error getting analytics:', error);
            return [];
        }
    };

    // Helper function to generate random 10-character invitation code
    const generateInvitationCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 10; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    return {
        // Users
        getUser,
        updateUser,
        // Invitations
        createInvitation,
        getInvitation,
        getInvitationByCode,
        getUserInvitations,
        updateInvitation,
        deleteInvitation,
        duplicateInvitation,
        // RSVP
        createRSVP,
        getInvitationRSVPs,
        // Wishes
        createWish,
        getInvitationWishes,
        updateWish,
        deleteWish,
        // Analytics
        trackEvent,
        getInvitationAnalytics
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Database;
}
