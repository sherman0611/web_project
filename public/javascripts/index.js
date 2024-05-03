document.getElementById('sort-select').addEventListener('change', function() {
    fetchSortedData();
});
document.getElementById('filter-select').addEventListener('change', fetchFilteredAndSortedData);
// function fetchSortedData() {
//     let sortOrder = document.getElementById('sort-select').value;
//     fetch(`/sort-data?order=${sortOrder}`)
//         .then(response => response.json())
//         .then(data => {
//             updateDisplay(data);
//             res.send(data);
//         })
//         .catch(error => console.error('Error:', error));
// }
function fetchFilteredAndSortedData() {
    const sortOrder = document.getElementById('sort-select').value;
    const filterStatus = document.getElementById('filter-select').value;
    // const statusBoolean = filterStatus === 'completed';  // Converts 'completed' to true, otherwise false
    fetch(`/fetch-data?order=${sortOrder}&status=${filterStatus}`)
        .then(response => response.json())
        .then(data => {
            updateDisplay(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateDisplay(data) {
    const container = document.getElementById('plant-entries-container');
    container.innerHTML = '';
    data.forEach(item => {
        const plantEntryDiv = document.createElement('div');
        plantEntryDiv.className = 'home';
        plantEntryDiv.className = 'link';
        plantEntryDiv.className = 'container';

        const plantLink = document.createElement('a');
        plantLink.href = `/view_plant/${item._id}`;

        if (item.image || item.image_url) {
            const imgSrc = item.image ? item.image.replace('public', '') : item.image_url;
            const plantImage = document.createElement('img');
            plantImage.className = 'plant-image';
            plantImage.src = imgSrc;
            plantImage.alt = item.plant_name;
            plantLink.appendChild(plantImage);
        }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'plant-info';

        const plantInfoP = document.createElement('p');
        // plantInfoP.textContent = `Plant by ${item.username || 'Anonymous'}`;
        plantInfoP.textContent = `Plant by ${item.username || 'Anonymous'}`;
        infoDiv.appendChild(plantInfoP);

        if (item.date || item.location) {
            const dateLocationP = document.createElement('p');
            let dateText = item.date ? new Date(item.date).toISOString().substring(0, 10) : 'Unknown date';
            dateLocationP.textContent = `${dateText}, ${item.location || 'Unknown location'}`;
            infoDiv.appendChild(dateLocationP);
        }

        plantLink.appendChild(infoDiv);
        plantEntryDiv.appendChild(plantLink);
        container.appendChild(plantEntryDiv);
    });
}

// offline back online----------------------------------------------------------------------

const insertEntryToHome = (entry) => {
    if (entry._id) {
        const container = document.getElementById("plant-entries-container");

        const entryDiv = document.createElement("div");
        entryDiv.classList.add("home", "link", "container");

        const anchor = document.createElement("a");
        anchor.href = "/view_plant/" + entry._id;

        const img = document.createElement("img");
        img.classList.add("plant-image");
        img.src = entry.image ? entry.image.includes('public') ? entry.image.replace('public','') : entry.image
            : entry.image_url ? entry.image_url : '';
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
}

window.onload = function () {
    // online/offline mode
    if (navigator.onLine) {
        fetch('http://localhost:3000/entries')
            .then(function (res) {
                return res.json();
            }).then(function (newEntries) {
            openEntriesIDB().then((db) => {
                insertEntryToHome(db, newEntries);
                deleteEntriesFromIDB(db).then(() => {
                    addNewEntriesToIDB(db, newEntries).then(() => {
                        console.log("All new entries added to IDB");
                    })
                });
            });
        });
    } else {
        openEntriesIDB().then((db) => {
            getAllEntries(db).then((entries) => {
                for (const entry of entries) {
                    insertEntryToHome(entry)
                }
            });
        });
    }
}