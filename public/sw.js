const CACHE_NAME = 'Plantgram v1';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {

        console.log('Service Worker: Caching App Shell at the moment......');
        try {
            const cache = await caches.open(CACHE_NAME);
            cache.addAll([
                '/',
                '/create_plant',
                '/enter_username',
                '/images/arrow_left_icon.png',
                '/images/install_icon.png',
                '/images/search_icon.png',
                '/images/white-arrow.png',
                '/stylesheets/style.css'
            ]);
        }
        catch{
            console.log("error occured while caching...");
        }

    })());
});

// clear cache on reload
self.addEventListener('activate', event => {
// Remove old caches
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            return keys.map(async (cache) => {
                if(cache !== CACHE_NAME) {
                    console.log('Service Worker: Removing old cache: '+cache);
                    return await caches.delete(cache);
                }
            })
        })()
    )
})

// self.addEventListener('fetch', function(event) {
//
//     console.log('Service Worker: Fetch', event.request.url);
//
//     console.log("Url", event.request.url);
//
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });

self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching....');

    event.respondWith(
        // Try fetching from the cache
        caches.match(event.request).then(response => {
            // Cache hit - return response
            if (response) {
                return response;
            }

            // Clone the request since it's a one-time use
            let fetchRequest = event.request.clone();

            return fetch(fetchRequest).then(response => {
                // Check if we received a valid response
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response since it's a one-time use
                let responseToCache = response.clone();

                // Cache the fetched response
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });

                return response;
            }).catch(() => {
                // Offline fallback
                return caches.match('/offline.html');
            });
        })
    );
});
