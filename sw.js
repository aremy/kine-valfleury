'use strict';

const CACHE = 'kine-valfleury-v1';

const PRECACHE = [
  '/',
  '/en/',
  '/assets/css/main.css',
  '/assets/js/main.js',
  '/img/caducee-masseurkine.webp',
  '/img/caducee-transparent.png',
  '/img/bg-banner.webp',
  '/img/waitingroom.webp',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;
  if (request.method !== 'GET') return;

  /* Only handle same-origin requests */
  if (!request.url.startsWith(self.location.origin)) return;

  if (request.destination === 'document') {
    /* Network-first for HTML: always fresh when online, cached fallback offline */
    e.respondWith(
      fetch(request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('/')))
    );
  } else {
    /* Cache-first for all other assets */
    e.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then(c => c.put(request, clone));
          }
          return res;
        });
      })
    );
  }
});
