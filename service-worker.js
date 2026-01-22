// Service Worker for PWA and Offline Support
const CACHE_NAME = 'kvartali-v3';
const RUNTIME_CACHE = 'kvartali-runtime';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/utils.js',
    '/state.js',
    '/dataService.js',
    '/uiController.js',
    '/eventHandlers.js',
    '/ui.js',
    '/firebase.js',
    '/appController.js',
    '/data.js',
    '/firebase-config.js',
    '/mobile-enhancements.js',
    '/seo-enhancements.js',
    '/social-sharing.js',
    '/dark-mode.js',
    '/search.js',
    '/charts.js'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching static assets');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip cross-origin requests and Firebase
    if (url.origin !== location.origin && !url.hostname.includes('firebase')) {
        return;
    }
    
    // For Firebase requests - network only
    if (url.hostname.includes('firebase') || url.hostname.includes('gstatic')) {
        event.respondWith(fetch(request));
        return;
    }
    
    // For static assets - cache first, fallback to network
    if (STATIC_ASSETS.some(asset => url.pathname.endsWith(asset))) {
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(request).then((response) => {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, response.clone());
                            return response;
                        });
                    });
                })
        );
        return;
    }
    
    // For everything else - network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                // Clone response to cache
                const responseToCache = response.clone();
                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                });
                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(request);
            })
    );
});

// Background sync for offline rating submissions
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-ratings') {
        event.waitUntil(syncRatings());
    }
});

async function syncRatings() {
    // This would sync any pending ratings stored in IndexedDB
    console.log('Service Worker: Syncing ratings');
}

// Push notifications support (for future use)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Нова оценка в квартала',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    
    event.waitUntil(
        self.registration.showNotification('KvartaliEU', options)
    );
});
