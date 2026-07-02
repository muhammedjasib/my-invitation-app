// Service Worker for Wedding Invitation Builder
// Handles offline functionality, caching, and background sync

const CACHE_NAME = 'wedding-invites-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/admin/dashboard.html',
    '/assets/css/admin.css',
    '/assets/js/main.js',
    '/assets/js/utils.js',
    '/assets/images/icons/favicon.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((error) => {
                console.error('Cache addAll error:', error);
            });
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Network first for API calls
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Cache successful API responses
                    if (response.ok) {
                        const cache = caches.open(CACHE_NAME);
                        cache.then((c) => c.put(event.request, response.clone()));
                    }
                    return response;
                })
                .catch(() => {
                    // Return cached response if network fails
                    return caches.match(event.request);
                })
        );
        return;
    }

    // Cache first for static assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            if (response) {
                return response;
            }

            return fetch(event.request).then((response) => {
                // Cache successful responses
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Return offline page if available
                if (event.request.destination === 'document') {
                    return caches.match('/offline.html');
                }
            });
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-rsvp') {
        event.waitUntil(
            syncRSVP().catch(() => {
                // Will retry later
            })
        );
    }
    if (event.tag === 'sync-wishes') {
        event.waitUntil(
            syncWishes().catch(() => {
                // Will retry later
            })
        );
    }
});

async function syncRSVP() {
    // Sync pending RSVP submissions
    const db = await openDB();
    const pendingRSVPs = await db.getAll('pending-rsvp');
    
    for (const rsvp of pendingRSVPs) {
        try {
            const response = await fetch('/api/rsvp', {
                method: 'POST',
                body: JSON.stringify(rsvp),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                await db.delete('pending-rsvp', rsvp.id);
            }
        } catch (error) {
            console.error('Sync RSVP error:', error);
            throw error;
        }
    }
}

async function syncWishes() {
    // Sync pending wish submissions
    const db = await openDB();
    const pendingWishes = await db.getAll('pending-wishes');
    
    for (const wish of pendingWishes) {
        try {
            const response = await fetch('/api/wishes', {
                method: 'POST',
                body: JSON.stringify(wish),
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (response.ok) {
                await db.delete('pending-wishes', wish.id);
            }
        } catch (error) {
            console.error('Sync wishes error:', error);
            throw error;
        }
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('WeddingInvites', 1);
        
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
        
        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('pending-rsvp')) {
                db.createObjectStore('pending-rsvp', { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains('pending-wishes')) {
                db.createObjectStore('pending-wishes', { keyPath: 'id' });
            }
        };
    });
}

// Push notifications
self.addEventListener('push', (event) => {
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/assets/images/icons/icon-192x192.png',
        badge: '/assets/images/icons/badge-72x72.png',
        tag: 'wedding-notification',
        requireInteraction: false
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then((clientList) => {
            for (let i = 0; i < clientList.length; i++) {
                if (clientList[i].url === event.notification.tag && 'focus' in clientList[i]) {
                    return clientList[i].focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow(event.notification.tag);
            }
        })
    );
});
