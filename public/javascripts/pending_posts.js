function uploadPosts() {

}

window.onload = function () {
    openSyncEntriesIDB().then((db) => {
        getAllSyncEntries(db).then((entries) => {
            for (const entry of entries) {
                insertEntry(entry);
            }
        });
    });
}