// Network-First Service Worker for Wang Speech Practice v5
const CACHE_NAME = 'wang-speech-v5';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './js/tailwind.js',
  './js/vue.global.prod.js',
  './data/corpus.js',
  './data/corpus.json'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).catch(() => {})
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            return caches.delete(k);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, resClone);
          });
        }
        return networkRes;
      })
      .catch(() => {
        return caches.match(e.request);
      })
  );
});
