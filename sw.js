/* Helen PWA — Service Worker: cache app shell + offline support */
const CACHE_VERSION = 'ma-fille-v2';
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/base.css',
  './css/layout.css',
  './css/games.css',
  './css/coloring.css',
  './js/storage.js',
  './js/audio.js',
  './js/router.js',
  './js/games-loader.js',
  './js/dashboard.js',
  './js/voice-dictionary.js',
  './js/shared-data.js',
  './js/app.js',
  './js/intro-lock.js',
  './js/settings-applier.js',
  './games/manifest.json',
  './img/icon.svg',
  './img/icons/icon-96.png',
  './img/icons/icon-144.png',
  './img/icons/icon-192.png',
  './img/icons/icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_VERSION).then(c => c.addAll(PRECACHE).catch(err => console.warn('[SW] precache partial:', err)))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return; // external (fonts, etc.) → pass

  // HTML → Network first (always fresh), fallback cache
  if (req.mode === 'navigate' || req.destination === 'document') {
    e.respondWith(
      fetch(req)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
    );
    return;
  }

  // Others → Cache first, network fallback
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});
