function openEntriesIDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("entries", 1);

        request.onerror = function (event) {
            reject(new Error(`Database error: ${event.target}`));
        };
        request.onupgradeneeded = function (event) {
            const db = event.target.result;
            db.createObjectStore('entries', {keyPath: '_id'});
        };
        request.onsuccess = function (event) {
            const db = event.target.result;
            resolve(db);
        };
    });
}

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

const addEntryToSync = (syncEntryIDB, formData) => {
    if (formData) {
        const transaction = syncEntryIDB.transaction(["sync-entries"], "readwrite");
        const entryStore = transaction.objectStore("sync-entries");
        const createRequest = entryStore.add({formData});

        createRequest.addEventListener("success", () => {
            console.log("Added entry to idb");

            const getRequest = entryStore.get(createRequest.result);
            // console.log(getRequest)
            getRequest.addEventListener("success", () => {
                // console.log("getRequest ready")
                navigator.serviceWorker.ready.then((sw) => {
                    // console.log("in navigator.serviceWorker.ready")
                    sw.sync.register("sync-entry");
                }).catch((err) => {
                    console.log("Sync registration failed: " + JSON.stringify(err));
                })
            })
        })
    }
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

const insertEntry = (entry, isPending = false) => {
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
        if (isPending) {
            anchor.href = "/view_plant/" + entry_id;
        } else {
            anchor.href = "/view_plant/" + entry._id;
        }

        const img = document.createElement("img");
        img.classList.add("plant-image");
        if (entry.image_url) {
            img.src = entry.image_url;
        } else if (entry.image) {
            if (isPending) {
                img.src = URL.createObjectURL(entry.image);
            } else {
                img.src = entry.image.includes('public') ? entry.image.replace('public','') : entry.image;
            }
        }
        img.alt = entry.plant_name;
        anchor.appendChild(img);

        const plantInfoDiv = document.createElement("div");
        plantInfoDiv.classList.add("plant-info");

        const usernameParagraph = document.createElement("b");
        usernameParagraph.textContent = entry.plant_name + ", by " + entry.username;

        const locationParagraph = document.createElement("p");
        locationParagraph.textContent = "Found at " + entry.location;

        const dateParagraph = document.createElement("p");
        dateParagraph.textContent = "Found on " + entry.date_seen.substring(0, 10);

        plantInfoDiv.appendChild(usernameParagraph);
        plantInfoDiv.appendChild(locationParagraph);
        plantInfoDiv.appendChild(dateParagraph);

        anchor.appendChild(plantInfoDiv);

        entryDiv.appendChild(anchor);

        container.appendChild(entryDiv);
    }
};