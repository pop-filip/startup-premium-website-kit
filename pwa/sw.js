// ============================================================
// SERVICE WORKER — Offline support & caching
// Place at: public/sw.js
//
// Strategy:
//   - Static assets → Cache First (fast, serve from cache)
//   - API calls → Network First (fresh data, cache fallback)
//   - HTML pages → Stale While Revalidate (fast + fresh)
//   - Images → Cache First with 30-day expiry
// ============================================================

const CACHE_VERSION = 'v1.0.0';
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Files to cache immediately on install
const PRECACHE_URLS = [
  '/',
  '/offline',           // Create an /offline page as fallback
  '/manifest.json',
];

// Max items in dynamic cache
const MAX_DYNAMIC_CACHE = 50;
const MAX_IMAGE_CACHE = 100;

// ============================================================
// INSTALL — Precache essential assets
// ============================================================
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ============================================================
// ACTIVATE — Clean up old caches
// ============================================================
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ============================================================
// FETCH — Route requests to appropriate cache strategy
// ============================================================
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and non-http
  if (!url.protocol.startsWith('http')) return;

  // --- API calls: Network First ---
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE));
    return;
  }

  // --- Images: Cache First with expiry ---
  if (isImage(url.pathname)) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, MAX_IMAGE_CACHE));
    return;
  }

  // --- Static assets (JS, CSS, fonts): Cache First ---
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  // --- HTML pages: Stale While Revalidate ---
  event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE, MAX_DYNAMIC_CACHE));
});


// ============================================================
// CACHING STRATEGIES
// ============================================================

/** Cache First — Serve from cache, fallback to network */
async function cacheFirst(request, cacheName, maxItems) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      if (maxItems) trimCache(cacheName, maxItems);
    }
    return response;
  } catch {
    return offlineFallback(request);
  }
}

/** Network First — Try network, fallback to cache */
async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback(request);
  }
}

/** Stale While Revalidate — Serve cache immediately, update in background */
async function staleWhileRevalidate(request, cacheName, maxItems) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        const cache = caches.open(cacheName).then((c) => {
          c.put(request, response.clone());
          if (maxItems) trimCache(cacheName, maxItems);
        });
      }
      return response;
    })
    .catch(() => cached || offlineFallback(request));

  return cached || fetchPromise;
}


// ============================================================
// HELPERS
// ============================================================

function isImage(path) {
  return /\.(jpg|jpeg|png|gif|webp|avif|svg|ico)$/i.test(path);
}

function isStaticAsset(path) {
  return /\.(js|css|woff|woff2|ttf|eot)$/i.test(path) || path.startsWith('/_next/static/');
}

async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxItems) {
    // Remove oldest items
    const toDelete = keys.slice(0, keys.length - maxItems);
    await Promise.all(toDelete.map((key) => cache.delete(key)));
  }
}

async function offlineFallback(request) {
  // For HTML requests, show offline page
  if (request.headers.get('accept')?.includes('text/html')) {
    const offlinePage = await caches.match('/offline');
    if (offlinePage) return offlinePage;
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' },
  });
}


// ============================================================
// PUSH NOTIFICATIONS (optional — uncomment to enable)
// ============================================================

// self.addEventListener('push', (event) => {
//   const data = event.data?.json() ?? {};
//   const title = data.title || 'Novo obaveštenje';
//   const options = {
//     body: data.body || '',
//     icon: '/icons/icon-192x192.png',
//     badge: '/icons/icon-72x72.png',
//     vibrate: [100, 50, 100],
//     data: { url: data.url || '/' },
//     actions: [
//       { action: 'open', title: 'Otvori' },
//       { action: 'dismiss', title: 'Zatvori' },
//     ],
//   };
//   event.waitUntil(self.registration.showNotification(title, options));
// });

// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   if (event.action === 'dismiss') return;
//   event.waitUntil(clients.openWindow(event.notification.data.url));
// });
