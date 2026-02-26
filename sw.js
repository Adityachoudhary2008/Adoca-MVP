const CACHE_NAME = 'adoca-industrial-v12.1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/config.js',
    '/js/utils.js',
    '/js/app.js',
    '/js/submit-handler.js',
    '/assets/logo.png',
    'https://unpkg.com/lucide@latest',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// 1. Install - Cache static assets
self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("ADOCA SW v12.0: Caching assets");
            return cache.addAll(STATIC_ASSETS);
        })
    );
});

// 2. Activate - Cleanup old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Fetch - Hybrid Strategy (Network First for Logic, Cache First for UI)
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Dynamic Logic Assets (App JS, Config, API) -> Network First
    if (url.pathname.endsWith('.js') || url.pathname.includes('/macros/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
        );
        return;
    }

    // UI/Static Assets -> Cache First with Stale-While-Revalidate
    event.respondWith(
        caches.match(event.request).then(cached => {
            const fetched = fetch(event.request).then(res => {
                const copy = res.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                return res;
            });
            return cached || fetched;
        })
    );
});

// 4. Push Notifications (Phase 7 - Ready for backend integration)
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const title = data.title || 'Adoca';
    const options = {
        body: data.body || 'You have a new update.',
        icon: '/assets/logo.png',
        badge: '/assets/logo.png',
        data: { url: data.url || '/?page=chat' },
        actions: [
            { action: 'view', title: 'View' },
            { action: 'dismiss', title: 'Dismiss' }
        ]
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

// 5. Notification Click - Deep-link into the app
self.addEventListener('notificationclick', event => {
    event.notification.close();
    if (event.action === 'dismiss') return;

    const targetUrl = event.notification.data?.url || '/';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.focus();
                    client.navigate(targetUrl);
                    return;
                }
            }
            if (clients.openWindow) return clients.openWindow(targetUrl);
        })
    );
});
