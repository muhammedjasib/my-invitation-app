// Admin Dashboard Script

let currentUser = null;

// Initialize dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    firebase.auth().onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = '../index.html';
            return;
        }
        
        currentUser = user;
        initializeDashboard();
    });
});

function initializeDashboard() {
    // Set user info
    const userInitials = currentUser.email.charAt(0).toUpperCase();
    document.getElementById('userInitials').textContent = userInitials;
    document.getElementById('userName').textContent = currentUser.displayName || 'Admin';

    // Setup navigation
    setupNavigation();

    // Load dashboard data
    loadDashboardData();

    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        handleLogout();
    });
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.id === 'logoutBtn') return;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page;
            navigateTo(page);
        });
    });
}

function navigateTo(page) {
    // Update active nav
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.page === page) {
            link.classList.add('active');
        }
    });

    // Update page content
    const pageContents = document.querySelectorAll('.page-content');
    pageContents.forEach(content => content.style.display = 'none');

    const pageElement = document.getElementById(`${page}-page`);
    if (pageElement) {
        pageElement.style.display = 'block';
    }

    // Update page title
    const titles = {
        'dashboard': 'Dashboard',
        'create': 'Create Invitation',
        'invitations': 'All Invitations',
        'rsvp': 'RSVP Management',
        'wishes': 'Wishes & Messages',
        'settings': 'Settings'
    };

    document.getElementById('pageTitle').textContent = titles[page] || 'Dashboard';

    // Track page view
    if (Analytics) {
        Analytics.trackPageView(`/admin/${page}`, titles[page]);
    }
}

async function loadDashboardData() {
    try {
        if (!Database) return;

        const invitations = await Database.getUserInvitations(currentUser.uid);
        
        // Calculate statistics
        let totalGuests = 0;
        let totalRSVPs = 0;
        let totalWishes = 0;
        let totalViews = 0;

        for (const invitation of invitations) {
            totalViews += invitation.viewCount || 0;
            totalRSVPs += invitation.rsvpCount || 0;
            totalWishes += invitation.wishesCount || 0;
            // Guest count would come from form data
        }

        // Update stats
        document.getElementById('totalInvitations').textContent = invitations.length;
        document.getElementById('totalGuests').textContent = totalGuests;
        document.getElementById('totalRSVPs').textContent = totalRSVPs;
        document.getElementById('pendingRSVPs').textContent = Math.max(0, totalGuests - totalRSVPs);
        document.getElementById('totalWishes').textContent = totalWishes;
        document.getElementById('totalViews').textContent = totalViews;

        // Load recent invitations
        loadRecentInvitations(invitations.slice(0, 5));

    } catch (error) {
        console.error('Error loading dashboard data:', error);
        Utils.showNotification('Error loading data', 'error');
    }
}

function loadRecentInvitations(invitations) {
    const tbody = document.getElementById('invitationsTable');
    
    if (invitations.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px; color: #999;">
                    <i class="fas fa-inbox" style="font-size: 24px; margin-bottom: 10px; display: block;"></i>
                    No invitations yet. <a href="#" onclick="navigateTo('create'); return false;" style="color: #D4A574; text-decoration: none;">Create your first invitation</a>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = invitations.map(invitation => `
        <tr>
            <td>
                <strong>${invitation.brideName || 'N/A'} & ${invitation.groomName || 'N/A'}</strong><br>
                <small style="color: #999;">Code: ${invitation.code}</small>
            </td>
            <td>${invitation.weddingDate ? Utils.formatDate(invitation.weddingDate, 'MMM DD, YYYY') : 'N/A'}</td>
            <td>${invitation.viewCount || 0}</td>
            <td>${invitation.rsvpCount || 0}</td>
            <td>
                <span style="
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${invitation.status === 'published' ? '#d4edda' : '#fff3cd'};
                    color: ${invitation.status === 'published' ? '#155724' : '#856404'};
                ">
                    ${invitation.status === 'published' ? '✓ Published' : '◯ Draft'}
                </span>
            </td>
            <td>
                <div class="action-icons">
                    <button class="action-icon" title="Edit" onclick="editInvitation('${invitation.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-icon" title="Preview" onclick="previewInvitation('${invitation.code}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-icon" title="Share" onclick="shareInvitation('${invitation.code}')">
                        <i class="fas fa-share-alt"></i>
                    </button>
                    <button class="action-icon" title="Delete" onclick="deleteInvitation('${invitation.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function editInvitation(invitationId) {
    // TODO: Navigate to create/edit page with invitation data
    Utils.showNotification('Edit functionality coming soon', 'info');
}

function previewInvitation(code) {
    window.open(`../invitation/?code=${code}`, '_blank');
}

function shareInvitation(code) {
    const url = `${window.location.origin}/invitation/?code=${code}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Wedding Invitation',
            text: 'You are invited to our wedding!',
            url: url
        }).catch(err => console.log('Share error:', err));
    } else {
        // Fallback: copy to clipboard
        Utils.copyToClipboard(url).then(() => {
            Utils.showNotification('Link copied to clipboard!', 'success');
        });
    }
}

function deleteInvitation(invitationId) {
    if (confirm('Are you sure you want to delete this invitation? This action cannot be undone.')) {
        // TODO: Implement delete with Database.deleteInvitation()
        Utils.showNotification('Delete functionality coming soon', 'info');
    }
}

async function handleLogout() {
    try {
        await firebase.auth().signOut();
        localStorage.removeItem('userToken');
        window.location.href = '../index.html';
    } catch (error) {
        console.error('Logout error:', error);
        Utils.showNotification('Logout failed', 'error');
    }
}

// Search functionality
document.getElementById('searchInvitations')?.addEventListener('keyup', function() {
    const searchTerm = this.value.toLowerCase();
    const rows = document.querySelectorAll('#invitationsTable tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});
