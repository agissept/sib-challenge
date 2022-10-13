const fileToCaches = [
    '/',
    '/index.html',
    '/manifest.json',
    '/icon-72x72.png',
    '/icon-144x144.png',
    'https://static.staticsave.com/cssforsib/style.css',
    'https://raw.githubusercontent.com/agissept/sib-challenge/master/data.json'
  ];
  
  const cacheName = 'hunger-app-shell';
  
  self.addEventListener('install', (event) => {
    const preCache = async () => {
      const cache = await caches.open(cacheName);
      await cache.addAll(fileToCaches);
    };
  
    event.waitUntil(preCache());
  
    // for skip waiting service worker to update
    self.skipWaiting();
  });
  
  self.addEventListener('activate', () => {
    console.log('SW: Activated');
  });
  
  // Cache-first see: https://web.dev/learn/pwa/serving/#cache-first
  // self.addEventListener('fetch', (event) => {
  //   const preResponse = async (e) => {
  //     const cache = await caches.open(cacheName);
  //     const cachedResponse = await cache.match(e.request);
  
  //     if (cachedResponse) {
  //       return cachedResponse;
  //     }
  
  //     return fetch(e.request);
  //   };
  
  //   event.respondWith(preResponse(event));
  // });
  
  // Network-first see: https://web.dev/learn/pwa/serving/#network-first
  // self.addEventListener('fetch', (event) => {
  //   const preResponse = async (e) => {
  //     try {
  //       return fetch(e.request);
  //     } catch {
  //       const cache = await caches.open(cacheName);
  //       return cache.match(e.request);
  //     }
  //   };
  
  //   event.respondWith(preResponse(event));
  // });
  
  // Stale while revalidate see: https://web.dev/learn/pwa/serving/#stale-while-revalidate
  self.addEventListener('fetch', (event) => {
    const fetchAndCache = async (e) => {
      const response = await fetch(e.request);
  
      const cache = await caches.open(cacheName);
      await cache.put(e.request, response.clone());
  
      return response;
    };
  
    const fetchWithCache = async (e) => {
      const cache = await caches.open(cacheName);
      const cachedResponse = await cache.match(e.request);
  
      if (cachedResponse) {
        // it is cached but we want to update it so request but not await
        fetchAndCache(e);
        return cachedResponse;
      }
  
      // it was not cached yet so request and cache it
      return fetchAndCache(e);
    }
  
    event.respondWith(fetchWithCache(event));
  });
  