// Analytics Module
// Tracks page views, events, and user interactions

const Analytics = (() => {
    const trackPageView = (page, title) => {
        try {
            if (firebase.analytics) {
                firebase.analytics().logEvent('page_view', {
                    page_title: title,
                    page_location: page,
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.log('Analytics error:', error);
        }
    };

    const trackEvent = (eventName, eventData = {}) => {
        try {
            if (firebase.analytics) {
                firebase.analytics().logEvent(eventName, {
                    ...eventData,
                    timestamp: new Date()
                });
            }
        } catch (error) {
            console.log('Analytics error:', error);
        }
    };

    const trackInvitationView = (invitationCode) => {
        trackEvent('invitation_view', {
            invitation_code: invitationCode
        });
    };

    const trackRSVPSubmit = (invitationCode) => {
        trackEvent('rsvp_submit', {
            invitation_code: invitationCode
        });
    };

    const trackWishSubmit = (invitationCode) => {
        trackEvent('wish_submit', {
            invitation_code: invitationCode
        });
    };

    const trackGalleryView = (invitationCode, imageCount) => {
        trackEvent('gallery_view', {
            invitation_code: invitationCode,
            image_count: imageCount
        });
    };

    const trackShare = (invitationCode, platform) => {
        trackEvent('share', {
            invitation_code: invitationCode,
            platform: platform
        });
    };

    return {
        trackPageView,
        trackEvent,
        trackInvitationView,
        trackRSVPSubmit,
        trackWishSubmit,
        trackGalleryView,
        trackShare
    };
})();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = Analytics;
}
