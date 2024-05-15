importScripts('/javascripts/idb_utils.js');

const CACHE_NAME = 'Plantgram v1';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {
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


            // cache.addAll([
            //     '/view_plant/1',
            //     '/view_plant/2',
            //     // Add more URLs as needed
            // ]);

            console.log('Service Worker: App Shell Cached');
        } catch {
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
    );
})

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
    event.respondWith((async () => {
        const cache = await caches.open("static");
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
            console.log('Service Worker: Fetching from Cache: ', event.request.url);
            return cachedResponse;
        }
        console.log('Service Worker: Fetching from URL: ', event.request.url);
        return fetch(event.request);
    })());
});

function appendIfDefined(formData, key, value) {
    if (value !== undefined) {
        formData.append(key, value);
    }
}

//Sync event to sync the entries
self.addEventListener('sync', event => {
    if (event.tag === 'sync-entry') {
        console.log('Service Worker: Uploading new entries');
        openSyncEntriesIDB().then((syncEntryDB) => {
            getAllSyncEntries(syncEntryDB).then(async (syncEntries) => {
                for (const syncEntry of syncEntries) {
                    const formData = new FormData();
                    appendIfDefined(formData, 'username', syncEntry.formData.username);
                    appendIfDefined(formData, 'plant_name', syncEntry.formData.plant_name);
                    appendIfDefined(formData, 'image_url', syncEntry.formData.image_url);
                    appendIfDefined(formData, 'location', syncEntry.formData.location);
                    appendIfDefined(formData, 'latitude', syncEntry.formData.latitude);
                    appendIfDefined(formData, 'longitude', syncEntry.formData.longitude);
                    appendIfDefined(formData, 'description', syncEntry.formData.description);
                    appendIfDefined(formData, 'height', syncEntry.formData.height);
                    appendIfDefined(formData, 'spread', syncEntry.formData.spread);
                    appendIfDefined(formData, 'flowers', syncEntry.formData.flowers);
                    appendIfDefined(formData, 'colour', syncEntry.formData.colour);
                    appendIfDefined(formData, 'leaves', syncEntry.formData.leaves);
                    appendIfDefined(formData, 'fruits_seeds', syncEntry.formData.fruits_seeds);
                    appendIfDefined(formData, 'sun_exposure', syncEntry.formData.sun_exposure);
                    appendIfDefined(formData, 'identification_status', syncEntry.formData.identification_status);
                    appendIfDefined(formData, 'date_seen', syncEntry.formData.date_seen);
                    appendIfDefined(formData, 'time_seen', syncEntry.formData.time_seen);
                    if (syncEntry.formData.image) {
                        appendIfDefined(formData, 'image', new File([syncEntry.formData.image], syncEntry.formData.image.name, {type: syncEntry.formData.image.type}));
                    }

                    // console.log("fetching create post")
                    fetch('http://localhost:3000/create_entry', {
                        method: 'POST',
                        body: formData,
                    }).then(() => {
                        console.log('Service Worker: Syncing new entry done');
                        deleteSyncEntryFromIDB(syncEntryDB, syncEntry.id);
                        self.registration.showNotification('Plantgram', {
                            body: 'Entry uploaded successfully!',
                        });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new entry failed');
                        self.registration.showNotification('Plantgram', {
                            body: 'Entry upload failed! Check for network',
                        });
                    });
                }
            });
        });
    }
});

// self.addEventListener('periodicsync', event => {
//     if (event.tag === 'upload-pending') {
//         event.waitUntil(self.sync.register("sync-entry"));
//     }
// });

self.addEventListener('install', event => {
    console.log('Service Worker: Installing....');
    event.waitUntil((async () => {
        const cache = await caches.open("static");
        const resources = [
            '/',
            '/stylesheets/style.css',
            '/stylesheets/index.css',
            '/javascripts/app.js',
            '/javascripts/index.js',
            '/javascripts/new_plant.js',
            '/javascripts/view.js',
            '/new_plant',
            '/javascripts/view_local.js',
            '/javascripts/edit_local.js',
            '/edit_plant_local',
            '/view_local'
        ];

        for (const resource of resources) {
            try {
                await cache.add(resource);
            } catch (error) {
                console.log(`Error occurred while caching ${resource}:`, error);
            }
        }

        console.log('Service Worker: App Shell Cached');
    })());
});
