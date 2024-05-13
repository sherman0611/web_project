function openSyncEntriesIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("sync-entries", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('sync-entries', {keyPath: 'id', autoIncrement: true});
        };
        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}
const addNewEntryToSync = (syncTodoIDB, formData) => {
    // Retrieve form data and add it to the IndexedDB
    if (formData) {
        const transaction = syncTodoIDB.transaction(["sync-entries"], "readwrite");
        const entryStore = transaction.objectStore("sync-entries");
        const createRequest = entryStore.add({formData});

        createRequest.addEventListener("success", () => {
            console.log("Added entry to idb");

            const getRequest = entryStore.get(createRequest.result);

            getRequest.addEventListener("success", () => {
                navigator.serviceWorker.ready.then((sw) => {
                    sw.sync.register("sync-entry");
                }).then(() => {
                    console.log("Sync registered");
                }).catch((err) => {
                    console.log("Sync registration failed: " + JSON.stringify(err));
                })
            })
        })
    }
}

// Function to get the entry list from idb
const getAllSyncEntries = (syncEntryIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = syncEntryIDB.transaction(["sync-entries"]);
        const entryStore = transaction.objectStore("sync-entries");
        const req = entryStore.getAll();

        req.addEventListener("success", () => {
            resolve(req.result);
        });
        req.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

// Function to delete a sync
const deleteSyncEntryFromIDB = (syncEntryIDB, id) => {
    const transaction = syncEntryIDB.transaction(["sync-entries"], "readwrite");
    const entryStore = transaction.objectStore("sync-entries");
    const req = entryStore.delete(id);

    req.addEventListener("success", () => {
        console.log("Deleted " + id);
    })
}

function openEntriesIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("entries", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('entries', {keyPath: '_id'});
            // console.log("123")
        };
        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
            // console.log("1234")
        };
    });
}

// Function to remove all entries from idb
const deleteEntriesFromIDB = (entryIDB) => {
    const transaction = entryIDB.transaction(["entries"], "readwrite");
    const entryStore = transaction.objectStore("entries");
    const req = entryStore.clear();

    return new Promise((resolve, reject) => {
        req.addEventListener("success", () => {
            resolve();
        });
        req.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
};

// Function to add new entries to idb and return a promise
const addNewEntriesToIDB = (entryIDB, entries) => {
    return new Promise((resolve, reject) => {
        const transaction = entryIDB.transaction(["entries"], "readwrite");
        const entryStore = transaction.objectStore("entries");

        const addPromises = entries.map(entry => {
            return new Promise((resolveAdd, rejectAdd) => {
                const addRequest = entryStore.add(entry);
                addRequest.addEventListener("success", () => {
                    const getRequest = entryStore.get(addRequest.result);
                    getRequest.addEventListener("success", () => {
                        // insertEntry(getRequest.result)
                        resolveAdd(); // Resolve the add promise
                    });
                    getRequest.addEventListener("error", (event) => {
                        rejectAdd(event.target.error);
                    });
                });
                addRequest.addEventListener("error", (event) => {
                    rejectAdd(event.target.error);
                });
            });
        });

        // Resolve the main promise when all add operations are completed
        Promise.all(addPromises).then(() => {
            resolve();
        }).catch((error) => {
            reject(error);
        });
    });
};

// Function to get the entry list from idb
const getAllEntries = (entryIDB) => {
    return new Promise((resolve, reject) => {
        const transaction = entryIDB.transaction(["entries"]);
        const entryStore = transaction.objectStore("entries");
        const req = entryStore.getAll();

        req.addEventListener("success", (event) => {
            resolve(event.target.result); // Use event.target.result to get the result
        });
        req.addEventListener("error", (event) => {
            reject(event.target.error);
        });
    });
}

const insertEntry = (entry) => {
    if (entry._id || entry.id) {
        let entry_id;
        if (entry.id) {
            entry_id = entry.id;
            entry = entry.formData;
        }

        const container = document.getElementById("plant-entries-container");

        const entryDiv = document.createElement("div");
        entryDiv.classList.add("home", "link", "container");

        const anchor = document.createElement("a");
        if (entry._id) {
            anchor.href = "/view_plant/" + entry._id;
        } else {
            anchor.href = "/view_plant/" + entry_id;
        }

        const img = document.createElement("img");
        img.classList.add("plant-image");
        img.src = entry.image ? (entry.image.includes('public') ? entry.image.replace('public','') : entry.image) : (entry.image_url || '');
        img.alt = entry.plant_name;
        anchor.appendChild(img);

        const plantInfoDiv = document.createElement("div");
        plantInfoDiv.classList.add("plant-info");

        const usernameParagraph = document.createElement("p");
        usernameParagraph.textContent = "Plant by " + entry.username;

        const dateLocationParagraph = document.createElement("p");
        dateLocationParagraph.textContent = entry.date ? entry.date.substring(0, 10) + ", " + entry.location : entry.location;

        plantInfoDiv.appendChild(usernameParagraph);
        plantInfoDiv.appendChild(dateLocationParagraph);

        anchor.appendChild(plantInfoDiv);

        entryDiv.appendChild(anchor);

        container.appendChild(entryDiv);
    }
};