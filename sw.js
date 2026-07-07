const CACHE_NAME = 'nif-cache-v1';

// Liste des fichiers à mettre en cache
const urlsToCache = [
  '/',
  '/index.html',
  '/login.html',
  '/register.html',
  '/profil.html',
  '/activite.html',
  '/boutique.html',
  '/formation.html',
  '/recharger.html',
  '/retrait.html',
  '/avis.html',
  '/vendre.html',
  '/manifest.json'
];

// Installation
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Installation du cache...');
        const promises = urlsToCache.map(url => {
          return cache.add(url).catch(() => {
            console.warn('⚠️ Fichier ignoré:', url);
            return Promise.resolve();
          });
        });
        return Promise.all(promises);
      })
  );
  self.skipWaiting();
});

// 🔥 INTERCEPTION DES REQUÊTES (CORRIGÉ)
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // ✅ IGNORER les requêtes Firebase, Google et API externes
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('cdnjs.cloudflare.com')
  ) {
    // Laisser le navigateur gérer normalement
    return;
  }

  // ✅ Pour les autres requêtes, utiliser le cache
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).catch(() => {
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return new Response('📡 Hors ligne', { status: 503 });
        });
      })
  );
});

// Activation
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('🗑️ Ancien cache supprimé:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

console.log('✅ Service Worker N.I.F installé !');
