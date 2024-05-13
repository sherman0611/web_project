function uploadPosts() {
    navigator.serviceWorker.controller.postMessage({ action: 'registerSync' });
}

window.onload = function () {
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
