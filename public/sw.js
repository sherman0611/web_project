importScripts('/javascripts/idb_utils.js');

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
                '/pending_posts',
                '/images/announcement.png',
                '/images/arrow_left_icon.png',
                '/images/completed.png',
                '/images/install_icon.png',
                '/images/search_icon.png',
                '/images/white_arrow.png',
                '/manifest.json',
                '/javascripts/comment_utils.js',
                '/javascripts/create_plant.js',
                '/javascripts/edit_plant.js',
                '/javascripts/enter_username.js',
                '/javascripts/idb_utils.js',
                '/javascripts/index.js',
                '/javascripts/main.js',
                '/javascripts/pending_posts.js',
                '/javascripts/username_utils.js',
                '/javascripts/view_plant.js',
                '/stylesheets/create_plant.css',
                '/stylesheets/enter_username.css',
                '/stylesheets/index.css',
                '/stylesheets/style.css',
                '/stylesheets/view_plant.css',
            ]);
            console.log('Service Worker: App Shell Cached');
        }
        catch{
            console.log("error occured while caching...")
        }
    })());
});

//clear cache on reload
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

self.addEventListener('fetch', function(event) {
    console.log('Service Worker: Fetch', event.request.url);

    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});

//Sync event to sync the entries
self.addEventListener('sync', event => {
    if (event.tag === 'sync-entry') {
        console.log('Service Worker: Syncing new entries');
        openSyncEntriesIDB().then((syncEntryDB) => {
            getAllSyncEntries(syncEntryDB).then((syncEntries) => {
                for (const syncEntry of syncEntries) {
                    console.log('Service Worker: Syncing new entry');

                    fetch('http://localhost:3000/create_entry', {
                        method: 'POST',
                        body: JSON.stringify(syncEntry.formData),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then(() => {
                        console.log('Service Worker: Syncing new entry done');
                        deleteSyncEntryFromIDB(syncEntryDB,syncEntry.id);
                        self.registration.showNotification('Plantgram', {
                            body: 'Entry synced successfully!',
                        });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new entry failed');
                        self.registration.showNotification('Plantgram', {
                            body: 'Entry sync failed! Check for network',
                        });
                    });
                }
            });
        });
    }
});
