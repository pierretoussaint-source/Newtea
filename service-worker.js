const CACHE_NAME = 'newtea-cache-v1';
const urlsToCache = [
  './Index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Installation du service worker et mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Fichiers mis en cache avec succès');
        return cache.addAll(urlsToCache);
      })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la version en cache si elle existe (mode hors-ligne)
        if (response) {
          return response;
        }
        // Sinon, fait la requête réseau
        return fetch(event.request);
      })
  );
});

// Nettoyage des anciens caches lors des mises à jour
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
