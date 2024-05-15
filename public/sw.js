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

// function appendIfDefined(formData, key, value) {
//     if (value !== undefined) {
//         formData.append(key, value);
//     }
// }

//Sync event to sync the entries
self.addEventListener('sync', event => {
    if (event.tag === 'sync-entry') {
        console.log('Service Worker: Uploading new entries');
        openSyncEntriesIDB().then((syncEntryDB) => {
            console.log("after openSyncEntriesIDB()")
            getAllSyncEntries(syncEntryDB).then(async (syncEntries) => {
                console.log("after getAllSyncEntries(syncEntryDB)")
                console.log(syncEntries)
                for (const syncEntry of syncEntries) {
                    const formData = new FormData();
                    formData.append('username', syncEntry.formData.username?.value);
                    formData.append('plant_name', syncEntry.formData.plant_name?.value);
                    // formData.append('image', syncEntry.formData.image?.value);
                    formData.append('image_url', syncEntry.formData.image_url?.value);
                    formData.append('location', syncEntry.formData.location?.value);
                    formData.append('latitude', syncEntry.formData.latitude?.value);
                    formData.append('longitude', syncEntry.formData.longitude?.value);
                    formData.append('description', syncEntry.formData.description?.value);
                    formData.append('height', syncEntry.formData.height?.value);
                    formData.append('spread', syncEntry.formData.spread?.value);
                    formData.append('flowers', syncEntry.formData.flowers?.value);
                    formData.append('colour', syncEntry.formData.colour?.value);
                    formData.append('leaves', syncEntry.formData.leaves?.value);
                    formData.append('fruits_seeds', syncEntry.formData.fruits_seeds?.value);
                    formData.append('sun_exposure', syncEntry.formData.sun_exposure?.value);
                    formData.append('identification_status', syncEntry.formData.identification_status?.value);
                    formData.append('date_seen', syncEntry.formData.date_seen?.value);
                    formData.append('time_seen', syncEntry.formData.time_seen?.value);
                    formData.append('date_post', syncEntry.formData.date_post = Date.now());
                    formData.append('time_post', syncEntry.formData.time_post.value= new Date().toTimeString().split(' ')[0]);

                    if (syncEntry.formData.image) {
                        formData.append('image', new File([syncEntry.formData.image], syncEntry.formData.image.name, {type: syncEntry.formData.image.type}));
                    }

                    // TODO we have to get the permission
                    // const permission = await Notification.permission;
                    // if (permission !== 'granted') {
                    //     return;
                    // }
                    console.log("fetching create post")
                    fetch('http://localhost:3000/create_entry', {
                        method: 'POST',
                        body: formData,
                    }).then(() => {
                        console.log('Service Worker: Syncing new entry done');
                        deleteSyncEntryFromIDB(syncEntryDB, syncEntry.id);
                        // self.registration.showNotification('Plantgram', {
                        //     body: 'Entry uploaded successfully!',
                        // });
                    }).catch((err) => {
                        console.error('Service Worker: Syncing new entry failed');
                        // self.registration.showNotification('Plantgram', {
                        //     body: 'Entry upload failed! Check for network',
                        // });
                    });

                }
            });
        });
    }
});
