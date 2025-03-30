const CACHE_NAME = 'todo-cache-v4';
const ASSETS = [
  '/Gril-list/',
  '/Gril-list/index.html',
  '/Gril-list/css/style.css',
  '/Gril-list/js/script.js',
  '/Gril-list/manifest.json',
  '/Gril-list/images/plant.png',
  'https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&family=Dancing+Script:wght@600&family=Poppins:wght@700&display=swap'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => key !== CACHE_NAME && caches.delete(key))
    ))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(res => res || fetch(e.request))
      .catch(() => caches.match('/Gril-list/index.html'))
  );
});
