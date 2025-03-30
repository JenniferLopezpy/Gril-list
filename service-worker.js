// Conexión: Este archivo es registrado por script.js y maneja el caching para la PWA

const CACHE_NAME = 'todo-cache-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/manifest.json',
  '/images/icon-192x192.png',
  '/images/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@200;400&display=swap'
];

// Evento de instalación - Cachea los recursos estáticos
self.addEventListener('install', (event) => {
  console.log('ServiceWorker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('ServiceWorker caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Evento de activación - Limpia caches viejos
self.addEventListener('activate', (event) => {
  console.log('ServiceWorker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('ServiceWorker deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Evento fetch - Sirve desde cache o red
self.addEventListener('fetch', (event) => {
  console.log('ServiceWorker fetching:', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta en cache o hace fetch a la red
        return response || fetch(event.request);
      })
      .catch(() => {
        // Fallback para cuando estás offline
        if (event.request.url.endsWith('.html')) {
          return caches.match('/index.html');
        }
      })
  );
});

// Conexión: Este Service Worker interactúa con:
// 1. El navegador para manejar el caching
// 2. La aplicación a través de eventos fetch
// 3. El manifest.json para los recursos de la PWA
