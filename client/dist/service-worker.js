const CACHE_NAME = 'premium-estate-v3';
const RUNTIME_CACHE = 'premium-estate-runtime-v3';

const PRECACHE_URLS = ['/', '/index.html'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME && name !== RUNTIME_CACHE)
            .map((name) => caches.delete(name))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // API: always network — never cache auth, moderation, or catalog responses
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Vite hashed assets: network only
  if (url.pathname.includes('/assets/')) {
    return;
  }

  // Web app manifest must bypass the SW to avoid install/fetch timeouts.
  if (url.pathname === '/manifest.json') {
    return;
  }

  event.respondWith(handleStaticRequest(event.request));
});

async function handleStaticRequest(request) {
  const url = new URL(request.url);
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const isHtmlRequest =
      url.pathname === '/' || url.pathname.endsWith('.html');

    if (!isHtmlRequest) {
      return new Response('Offline', { status: 503 });
    }

    const fallbackResponse = await caches.match('/index.html');
    if (fallbackResponse) return fallbackResponse;
    return new Response('Offline', { status: 503 });
  }
}

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((names) => {
      names.forEach((name) => caches.delete(name));
    });
  }
});
