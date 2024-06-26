function updatePosts() {
    openSyncIDB('sync-entries').then((db) => {
        setTimeout(() => { // Adding delay here
            getAllSyncItems(db, 'sync-entries').then((entries) => {
                for (const entry of entries) {
                    insertEntry(entry, true);
                }
            });
        }, 100);
    });
}

function uploadPosts() {
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-entry").then(() => {
            document.getElementById("plant-entries-container").innerHTML = "";
            updatePosts();
        });
    })
}

window.onload = function () {
    updatePosts();
}
