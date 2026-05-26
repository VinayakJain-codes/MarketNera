const CACHE_NAME = 'marketnera-cache-v1';

const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  '/logo.png',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching offline assets');
      return cache.addAll(ASSETS_TO_CACHE).catch(err => {
        console.warn('[Service Worker] Failed to pre-cache some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only handle HTTP/HTTPS (ignore chrome-extension:// etc)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle navigation requests (pages)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone and cache the successful response
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return response;
        })
        .catch(() => {
          // If offline, try to get it from cache
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Fallback to offline page
            return new Response(
              `<!DOCTYPE html>
              <html lang="en">
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>MarketNera — Offline</title>
                <style>
                  body {
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                    background-color: #f6f8f6;
                    color: #2e3b2e;
                    text-align: center;
                    padding: 50px 20px;
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                  }
                  .container {
                    max-width: 500px;
                    width: 100%;
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                  }
                  .logo {
                    font-size: 28px;
                    font-weight: 800;
                    color: #13ec5b;
                    margin-bottom: 24px;
                    letter-spacing: -0.5px;
                  }
                  h1 {
                    color: #1a202c;
                    font-size: 24px;
                    margin-bottom: 16px;
                  }
                  p {
                    color: #718096;
                    font-size: 16px;
                    line-height: 1.6;
                    margin-bottom: 32px;
                  }
                  button {
                    background-color: #13ec5b;
                    color: black;
                    border: none;
                    padding: 14px 28px;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    box-shadow: 0 4px 6px rgba(19, 236, 91, 0.2);
                  }
                  button:hover {
                    opacity: 0.95;
                    transform: translateY(-1px);
                  }
                  button:active {
                    transform: translateY(0);
                  }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="logo">MarketNera</div>
                  <h1>You are offline</h1>
                  <p>It looks like you don't have an active internet connection right now. Check your network status and try reloading the app.</p>
                  <button onclick="window.location.reload()">Retry Connection</button>
                </div>
              </body>
              </html>`,
              {
                headers: { 'Content-Type': 'text/html' }
              }
            );
          });
        })
    );
    return;
  }

  // Cache-first for non-navigation assets (static resources)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Cache static JS/CSS/Images
        const isStaticAsset = 
          event.request.url.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ico)$/) ||
          event.request.url.includes('/_next/static/');
        
        if (response.status === 200 && isStaticAsset) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
