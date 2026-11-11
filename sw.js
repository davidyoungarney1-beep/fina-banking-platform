const CACHE_NAME = 'freecash-pay-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/app-icon.svg',
  '/auth.css',
  '/fina-theme.css',
  '/auth.js',
  '/config.js',
  '/pwa.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cachedHome = await caches.match('/index.html');
        return cachedHome || new Response(
          'FreeCash Pay is offline. Reconnect to the internet and try again.',
          { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
        );
      })
    );
    return;
  }

  if (/\.(?:css|js|svg|png|webmanifest|woff2?)$/i.test(url.pathname)) {
    event.respondWith(
      fetch(request).then(response => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(async () => {
        return (await caches.match(request)) || Response.error();
      })
    );
  }
});