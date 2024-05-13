function updatePosts() {
    openSyncEntriesIDB().then((db) => {
        setTimeout(() => { // Adding delay here
            getAllSyncEntries(db).then((entries) => {
                for (const entry of entries) {
                    insertEntry(entry);
                }
            });
        }, 100);
    });
}

function uploadPosts() {
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-entry").then(() => {
            const container = document.getElementById("plant-entries-container");
            container.innerHTML = "";
            updatePosts();
        });
    })
}

window.onload = function () {
    updatePosts();
}
