/*
 * Heartverse Service Worker
 * Provides offline functionality and PWA features
 */

const CACHE_NAME = 'heartverse-v1.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/main.js',
  '/portal.html',
  '/portal.css',
  '/portal.js',
  '/garden.html',
  '/garden.css',
  '/garden.js',
  '/music.html',
  '/music.css',
  '/music.js',
  '/letter.html',
  '/letter.css',
  '/letter.js',
  '/game.html',
  '/game.css',
  '/game.js',
  '/dream.html',
  '/dream.css',
  '/dream.js',
  '/secret.html',
  '/secret.css',
  '/secret.js',
  '/settings.html',
  '/settings.css',
  '/settings.js',
  '/manifest.json',
  '/assets/icons/heart-icon-192.png',
  '/assets/icons/heart-icon-512.png'
];

// Install event - cache all static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
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