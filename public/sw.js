importScripts('/javascripts/idb_utils.js');

const CACHE_NAME = 'Plantgram v1';

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
    // console.log('Service Worker: Installing....');
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

            // console.log('Service Worker: App Shell Cached');
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

// self.addEventListener('fetch', function(event) {
//     console.log('Service Worker: Fetch', event.request.url);
//
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request).then(
                    function(response) {
                        // Check if we received a valid response
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // IMPORTANT: Clone the response. A response is a stream
                        // and because we want the browser to consume the response
                        // as well as the cache consuming the response, we need
                        // to clone it so we have two streams.
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache) {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

function appendIfDefined(formData, key, value) {
    if (value !== undefined) {
        formData.append(key, value);
    }
}

//Sync event to sync the entries
self.addEventListener('sync', event => {
    if (event.tag === 'sync-entry') {
        // console.log('Service Worker: Uploading pending entries');
        openSyncIDB('sync-entries').then((syncEntryDB) => {
            getAllSyncItems(syncEntryDB, 'sync-entries').then(async (syncEntries) => {
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
                    appendIfDefined(formData, 'status', syncEntry.formData.status);
                    appendIfDefined(formData, 'date_seen', syncEntry.formData.date_seen);
                    appendIfDefined(formData, 'time_seen', syncEntry.formData.time_seen);
                    appendIfDefined(formData, 'date_post', new Date());
                    appendIfDefined(formData, 'time_post', new Date().toTimeString().split(' ')[0]);
                    if (syncEntry.formData.image) {
                        appendIfDefined(formData, 'image', new File([syncEntry.formData.image], syncEntry.formData.image.name, {type: syncEntry.formData.image.type}));
                    }
                    const permission = await Notification.permission;

                    fetch('http://localhost:3000/create_entry', {
                        method: 'POST',
                        body: formData,
                    }).then(() => {
                        // console.log('Service Worker: Syncing new entry done');
                        deleteSyncItemFromIDB(syncEntryDB, syncEntry.id, 'sync-entries');

                        // From https://developer.mozilla.org/en-US/docs/Web/API/Client/postMessage
                        // Re-written for the purpose of this project
                        self.clients.matchAll().then(clients => {
                            if (clients.length === 0) {
                                console.log('No matched clients found');
                            } else {
                                const client = clients[0];
                                // Send message: redirect
                                client.postMessage({ redirectTo: '/' });
                            }
                        }).catch(error => {
                            console.error('Error getting clients:', error);
                        });

                        if (permission === 'granted') {
                            self.registration.showNotification('Plantgram', {
                                body: 'Entry uploaded successfully!',
                            });
                        }
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new entry failed');

                        if (permission === 'granted') {
                            self.registration.showNotification('Plantgram', {
                                body: 'Entry upload failed, check your network connection!',
                            });
                        }
                    });
                }
            }).then(() => {
                console.log('Service Worker: All pending entries uploaded');
            });
        });
    } else if (event.tag.includes('sync-comment')){
        let plant_id = event.tag.replace('sync-comment-','');
        let db_name = 'sync-comments-'+plant_id
        console.log('Service Worker: Uploading pending comments');
        openSyncIDB(db_name).then((syncCommentDB) => {
            getAllSyncItems(syncCommentDB, db_name).then(async (syncComments) => {
                for (const syncComment of syncComments) {
                    const formData = new FormData();
                    appendIfDefined(formData, 'username', syncComment.formData.username);
                    appendIfDefined(formData, 'comment_text', syncComment.formData.comment_text);
                    appendIfDefined(formData, 'date', new Date());
                    const permission = await Notification.permission;

                    fetch('http://localhost:3000/send_comment', {
                        method: 'POST',
                        body: formData,
                    }).then(() => {
                        uploadComments()
                        console.log('Service Worker: Syncing new comments done');
                        deleteSyncItemFromIDB(syncCommentDB, syncComment.id, db_name);

                        if (permission === 'granted') {
                            self.registration.showNotification('Plantgram', {
                                body: 'Comments uploaded successfully!',
                            });
                        }
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new comment error');

                        if (permission === 'granted') {
                            self.registration.showNotification('Plantgram', {
                                body: 'Comment upload failed, check your network connection!',
                            });
                        }
                    });
                }
            }).then(() => {
                console.log('Service Worker: All pending comments uploaded');
            });
        });
    }
});

// self.addEventListener('periodicsync', event => {
//     if (event.tag === 'upload-pending') {
//         event.waitUntil(self.sync.register("sync-entry"));
//     }
// });
