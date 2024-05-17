// Alert if indexedDB is not of use
if (!window.indexedDB) {
    alert("Sorry! Your browser does not support IndexedDB");
}

// Register service worker to control making site work offline
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(function () {
            // console.log('Service Worker Registered!');
        }).catch(function (err) {
            console.log('Service Worker registration failed: ', err);
        });

    navigator.serviceWorker.addEventListener("message", (event) => {
        // Redirect the page
        if (event.data && event.data.redirectTo) {
            window.location.href = event.data.redirectTo;
        }
    })

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
    if (Notification.permission === "granted") {
        // Notifications are allowed, you can proceed to create notifications
        // Or do whatever you need to do with notifications
    } else if (Notification.permission !== "denied") {
        // If the user hasn't been asked yet or has previously denied permission,
        // you can request permission from the user
        Notification.requestPermission().then(function (permission) {
            // If the user grants permission, you can proceed to create notifications
            if (permission === "granted") {
                navigator.serviceWorker.ready
                    .then(function (sw) {
                        sw.showNotification("Plantgram", {
                            body: "Notifications are enabled!"
                        });
                    });
            }
        });
    }
}

if (navigator.onLine) {
    // upload pending entries and comments when online
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-entry");
        sw.sync.register("sync-comment");
    })

    // fetch all entries from mongo and save to idb
    fetch('http://localhost:3000/entries')
        .then(function (res) {
            return res.json();
        }).then(function (newEntries) {
            openIDB('entries').then((db) => {
                deleteAllFromIDB(db, 'entries').then(() => {
                    addNewToIDB(db, newEntries, 'entries').then(() => {
                        // console.log("All new entries added to IDB");
                    })
                });
        });
    });
}

window.addEventListener('message', (event) => {
    if (event.data && event.data.redirectTo) {
        window.location.href = event.data.redirectTo;
    }
});

function getValue(id) {
    const element = document.getElementById(id);
    if (element) {
        if (element.type === "text" || element.type === "number" || element.type === "url") {
            if (element.value.trim() !== "") {
                return element.value;
            }
        } else if (element.type === "radio") {
            const checked = document.querySelector(`input[name="${element.name}"]:checked`);

            if (checked) {
                return checked.value;
            }
        } else {
            return element.value;
        }
    }
}