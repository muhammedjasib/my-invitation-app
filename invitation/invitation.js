// Guest Invitation Page Controller

let invitation = null;

// Initialize page
document.addEventListener('DOMContentLoaded', async () => {
    const code = getInvitationCode();
    
    if (!code) {
        showError('No invitation code provided');
        return;
    }

    try {
        showLoading();
        await loadInvitation(code);
        initializeCountdown();
        AOS.init();
    } catch (error) {
        console.error('Error loading invitation:', error);
        showError('Invitation not found or has expired');
    }
});

// Get invitation code from URL
function getInvitationCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('code');
}

// Load invitation data
async function loadInvitation(code) {
    try {
        invitation = await Database.getInvitationByCode(code);
        
        if (!invitation) {
            throw new Error('Invitation not found');
        }

        // Update page meta tags
        document.title = `${invitation.brideName} & ${invitation.groomName} - Wedding Invitation`;
        document.querySelector('meta[name="description"]').content = invitation.seoDescription || 'You are invited!';

        // Populate hero section
        document.getElementById('coupleName').textContent = `${invitation.brideName} & ${invitation.groomName}`;
        document.getElementById('weddingDate').textContent = `${Utils.formatDate(invitation.weddingDate, 'MMM DD, YYYY')}`;

        // Populate details
        document.getElementById('name1').textContent = invitation.brideName;
        document.getElementById('subtitle1').textContent = invitation.brideSubtitle;
        document.getElementById('bio1').textContent = invitation.brideBio;
        document.getElementById('photo1').src = invitation.bridePhoto;

        document.getElementById('name2').textContent = invitation.groomName;
        document.getElementById('subtitle2').textContent = invitation.groomSubtitle;
        document.getElementById('bio2').textContent = invitation.groomBio;
        document.getElementById('photo2').src = invitation.groomPhoto;

        // Populate gallery
        if (invitation.galleryImages && invitation.galleryImages.length > 0) {
            const galleryHtml = invitation.galleryImages.map((img, index) => `
                <div class="gallery-item" onclick="openLightbox(${index})">
                    <img src="${img}" alt="Gallery photo ${index + 1}" loading="lazy">
                    <div class="gallery-overlay">
                        <i class="fas fa-search-plus"></i>
                    </div>
                </div>
            `).join('');
            document.getElementById('gallery').innerHTML = galleryHtml;
        }

        // Populate venue
        document.getElementById('venueInfo').textContent = `${invitation.venueName}, ${invitation.venueAddress}`;

        // Track analytics
        if (Analytics) {
            Analytics.trackInvitationView(invitation.code);
        }

        // Hide loading
        hideLoading();

    } catch (error) {
        console.error('Error loading invitation:', error);
        throw error;
    }
}

// Initialize countdown timer
function initializeCountdown() {
    if (!invitation) return;

    const updateCountdown = () => {
        const countdown = Utils.formatCountdown(invitation.weddingDate);
        
        document.getElementById('days').textContent = countdown.days;
        document.getElementById('hours').textContent = countdown.hours;
        document.getElementById('minutes').textContent = countdown.minutes;
        document.getElementById('seconds').textContent = countdown.seconds;

        if (countdown.expired) {
            document.querySelector('.countdown').innerHTML = `
                <div class="container">
                    <h2 style="color: white; margin-bottom: 20px;">Thank you for celebrating with us!</h2>
                    <p style="font-size: 18px; color: rgba(255, 255, 255, 0.9);">The wedding has already happened.</p>
                </div>
            `;
        }
    };

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// Handle RSVP form submission
async function handleRSVP(event) {
    event.preventDefault();

    if (!invitation) return;

    const form = event.target;
    const data = new FormData(form);

    try {
        const rsvpData = {
            name: data.get('name'),
            phone: data.get('phone'),
            guestCount: parseInt(data.get('guestCount')),
            attending: data.get('attending') === 'true',
            mealPreference: data.get('mealPreference'),
            message: data.get('message')
        };

        await Database.createRSVP(invitation.id, rsvpData);

        Utils.showNotification('RSVP submitted successfully!', 'success');
        form.reset();

        if (Analytics) {
            Analytics.trackRSVPSubmit(invitation.code);
        }

    } catch (error) {
        console.error('Error submitting RSVP:', error);
        Utils.showNotification('Error submitting RSVP', 'error');
    }
}

// Lightbox functionality
function openLightbox(index) {
    if (!invitation || !invitation.galleryImages) return;
    
    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    `;

    const img = document.createElement('img');
    img.src = invitation.galleryImages[index];
    img.style.cssText = `
        max-width: 90%;
        max-height: 80%;
        border-radius: 10px;
        object-fit: contain;
    `;

    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 20px;
        background: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        font-size: 20px;
        cursor: pointer;
        z-index: 1001;
    `;
    closeBtn.onclick = () => lightbox.remove();

    lightbox.appendChild(img);
    lightbox.appendChild(closeBtn);
    document.body.appendChild(lightbox);
}

// Scroll to section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

// Loading state
function showLoading() {
    document.body.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p style="margin-top: 20px; color: #999;">Loading invitation...</p>
        </div>
    `;
}

function hideLoading() {
    const loading = document.querySelector('.loading');
    if (loading) {
        loading.remove();
    }
}

// Error state
function showError(message) {
    document.body.innerHTML = `
        <div class="error-container">
            <h2>😟</h2>
            <h2>Invitation Not Found</h2>
            <p>${message}</p>
            <p>Please check the link and try again.</p>
        </div>
    `;
}

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('../public/service-worker.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}
