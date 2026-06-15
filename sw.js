const CACHE_NAME = 'nif-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/investissement.html',
  '/profil.html',
  '/menu.html',
  '/formations.html',
  '/parrainage.html',
  '/nex.html',
  '/avis.html',
  '/informations.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});