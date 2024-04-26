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
                '/images/white_arrow.png',
                '/manifest.json',
                '/javascripts/comment_utils.js',
                '/javascripts/create_plant.js',
                '/javascripts/enter_username.js',
                '/javascripts/idb_utils.js',
                '/javascripts/index.js',
                '/javascripts/main.js',
                '/javascripts/username_utils.js',
                '/javascripts/view_plant.js',
                '/stylesheets/create_plant.css',
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

//Sync event to sync the todos
// self.addEventListener('sync', event => {
//     if (event.tag === 'sync-todo') {
//         console.log('Service Worker: Syncing new Todos');
//         openSyncTodosIDB().then((syncPostDB) => {
//             getAllSyncTodos(syncPostDB).then((syncTodos) => {
//                 for (const syncTodo of syncTodos) {
//                     console.log('Service Worker: Syncing new Todo: ', syncTodo);
//                     console.log(syncTodo.text)
//                     // Create a FormData object
//                     const formData = new URLSearchParams();
//
// // Use the install event to pre-cache all initial resources.
// self.addEventListener('install', event => {
//     console.log('Service Worker: Installing....');
//     event.waitUntil((async () => {
//         console.log('Service Worker: Caching App Shell at the moment......');
//         try {
//             const cache = await caches.open(CACHE_NAME);
//             cache.addAll([
//                 '/',
//                 '/create_plant',
//                 '/enter_username',
//                 '/images/arrow_left_icon.png',
//                 '/images/install_icon.png',
//                 '/images/search_icon.png',
//                 '/images/white-arrow.png',
//                 '/manifest.json',
//                 '/javascripts/create_plant.js',
//                 '/javascripts/enter_username.js',
//                 '/javascripts/idb-utility.js',
//                 '/javascripts/index.js',
//                 '/javascripts/main.js',
//                 '/javascripts/plant_entry.js',
//                 '/javascripts/username-utils.js',
//                 '/stylesheets/style.css',
//             ]);
//             console.log('Service Worker: App Shell Cached');
//         }
//         catch{
//             console.log("error occured while caching...")
//         }
//     })());
// });
//
// //clear cache on reload
// self.addEventListener('activate', event => {
// // Remove old caches
//     event.waitUntil(
//         (async () => {
//             const keys = await caches.keys();
//             return keys.map(async (cache) => {
//                 if(cache !== CACHE_NAME) {
//                     console.log('Service Worker: Removing old cache: '+cache);
//                     return await caches.delete(cache);
//                 }
//             })
//         })()
//     )
// })
//
// self.addEventListener('fetch', function(event) {
//     console.log('Service Worker: Fetch', event.request.url);
//
//     event.respondWith(
//         caches.match(event.request).then(function(response) {
//             return response || fetch(event.request);
//         })
//     );
// });
//
// //Sync event to sync the todos
// // self.addEventListener('sync', event => {
// //     if (event.tag === 'sync-todo') {
// //         console.log('Service Worker: Syncing new Todos');
// //         openSyncTodosIDB().then((syncPostDB) => {
// //             getAllSyncTodos(syncPostDB).then((syncTodos) => {
// //                 for (const syncTodo of syncTodos) {
// //                     console.log('Service Worker: Syncing new Todo: ', syncTodo);
// //                     console.log(syncTodo.text)
// //                     // Create a FormData object
// //                     const formData = new URLSearchParams();
// //
// //                     // Iterate over the properties of the JSON object and append them to FormData
// //                     formData.append("text", syncTodo.text);
// //
// //                     // Fetch with FormData instead of JSON
// //                     fetch('http://localhost:3000/add-todo', {
// //                         method: 'POST',
// //                         body: formData,
// //                         headers: {
// //                             'Content-Type': 'application/x-www-form-urlencoded',
// //                         },
// //                     }).then(() => {
// //                         console.log('Service Worker: Syncing new Todo: ', syncTodo, ' done');
// //                         deleteSyncTodoFromIDB(syncPostDB,syncTodo.id);
// //                         // Send a notification
// //                         self.registration.showNotification('Todo Synced', {
// //                             body: 'Todo synced successfully!',
// //                         });
// //                     }).catch((err) => {
// //                         console.error('Service Worker: Syncing new Todo: ', syncTodo, ' failed');
// //                     });
// //                 }
// //             });
// //         });
// //     }
// // });
