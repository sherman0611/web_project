// Alert if indexedDB is not of use
if (!window.indexedDB) {
    alert("Sorry! Your browser does not support IndexedDB");
}

// Register service worker to control making site work offline
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(function () {
            console.log('Service Worker Registered!');
        }).catch(function (err) {
            console.log('Service Worker registration failed: ', err);
        });

    // navigator.serviceWorker.ready.then(registration => {
    //     if (registration.periodicSync) {
    //         try {
    //             registration.periodicSync.register("upload-pending", {
    //                 minInterval: 24 * 60 * 60 * 1000,
    //             });
    //             console.log('Periodic Background registered');
    //         } catch {
    //             console.log("Periodic Sync could not be registered!");
    //         }
    //     } else {
    //         console.log('Periodic Background Sync not supported');
    //     }});
}

// Check if the browser supports the Notification API
if ("Notification" in window) {
    // Check if the user has granted permission to receive notifications
    if (Notification.permission !== "denied") {
        // If the user hasn't been asked yet or has previously denied permission,
        // you can request permission from the user
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                navigator.serviceWorker.ready
                    .then(function (sw) {
                        sw.showNotification("Todo App", {
                            body: "Notifications are enabled!"
                        });
                    });
            }
        });
    }
}

if (navigator.onLine) {
    // upload pending entries when online
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-entry");
    })

    // fetch all entries from mongo and save to idb
    fetch('http://localhost:3000/entries')
        .then(function (res) {
            return res.json();
        }).then(function (newEntries) {
            openEntriesIDB().then((db) => {
                deleteEntriesFromIDB(db).then(() => {
                    addNewEntriesToIDB(db, newEntries).then(() => {
                        console.log("All new entries added to IDB");
                    })
                });
        });
    });
}