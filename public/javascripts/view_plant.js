let plant_id = null;
let plant_name = null;
let map;

window.onload = function () {
    plant_id = document.getElementById('plant_id').value;
    plant_name = document.getElementsByTagName('h1')[0].textContent;

    // fetch all comments from mongo and save to idb
    fetch('http://localhost:3000/comments/' + plant_id)
        .then(function (res) {
            return res.json();
        }).then(function (newEntries) {
            openIDB('comments').then((db) => {
                deleteAllFromIDB(db, 'comments').then(() => {
                    addNewToIDB(db, newEntries, 'comments');
                });
        });
    });

    // inject username to html
    usernameDefining();

    // submit comment
    const create_button = document.getElementById("create_button")
    create_button.addEventListener("click", submitComment)

    // Chat
    socket.emit('join', plant_id);

    // Called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
    });

    // DBPedia
    if (document.getElementById("identification_status").textContent.includes("Completed")) {
        fetchDBPedia();
    }
    // Ownership
    allowEdit();
    // Chat functions
    assignCommentAuthor();
    disableChat();
    scrollToBottomChat();
    // Map
    initMap();

    var coll = document.getElementsByClassName("collapsible");
    for (let i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
    }

    // display comments from mongo
    openIDB('comments').then((db) => {
        setTimeout(() => { // Adding delay here
            getAllItemsFromIDB(db, 'comments').then((items) => {
                for (const item of items) {
                    insertComment(item)
                }
            });
        }, 100);
    });

    // display pending comments
    openSyncIDB('sync-comments').then((db) => {
        setTimeout(() => { // Adding delay here
            getAllSyncItems(db, 'sync-comments').then((items) => {
                for (const item of items) {
                    insertComment(item, true)
                }
            });
        }, 100);
    });
}

/** Check if the current user is the plant author
 * If so, allow them to edit the plant if the identification has not yet
 * been completed.
 */
function allowEdit() {
    if (getUsername() === document.getElementById("plant_author").innerText) {
        let plant_id = document.getElementById("plant_id").value;
        let identification_status = document.getElementById("identification_status").textContent.trim();
        let html_to_insert;
        if (identification_status.includes("Completed")) {
            html_to_insert = '<span class="completed-text">' +
                '<img class="completed-icon" src="/images/completed.png" alt="Completed icon">' +
                '<b>The identification of your plant is completed!</b></span><br>';
            document.getElementsByClassName("plant_details")[0].insertAdjacentHTML("afterbegin", html_to_insert);
        } else {
            html_to_insert = '<a class="form-button" href="/edit_plant/'+plant_id+'">Edit your plant entry</a>';
            document.getElementsByClassName("nav-links")[0].insertAdjacentHTML("beforeend", html_to_insert);
        }
    }
}

// Initialising the map element if a given plant was using the coordinates reading
async function initMap() {
    const mapElement = document.getElementById('map');
    if(mapElement !== null && mapElement.dataset !== null){
        const lat = parseFloat(mapElement.dataset.lat);
        const lng = parseFloat(mapElement.dataset.lng);

        const location = {lat: lat, lng: lng};

        const {Map} = await google.maps.importLibrary("maps");
        const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");

        map = new Map(mapElement, {
            zoom: 4,
            center: location,
            mapId: "DEMO_MAP_ID",
        });
        const marker = new AdvancedMarkerElement({
            map: map,
            position: location,
            title: "Marker",
        });
    }
}

// Fetch DBPedia data and display if found
function fetchDBPedia() {
    let plant = plant_name;
    //lowercase all word
    plant = plant.toLowerCase();
    //uppercase the first letter of the first word only
    plant = plant.charAt(0).toUpperCase() + plant.slice(1);
    //replace all spaces with underscores for the dbpedia query
    plant = plant.replace(/ /g, '_');
    //replace all spaces with underscores for the dbpedia query
    const resource = `http://dbpedia.org/resource/${plant}`;
    const endpointUrl = 'https://dbpedia.org/sparql';
    const sparqlQuery = `
                 PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
                 PREFIX dbo: <http://dbpedia.org/ontology/>
                 SELECT ?label ?abstract
                 WHERE {
                  <${resource}> dbo:abstract ?abstract .
                  <${resource}> rdfs:label ?label .
                 FILTER (langMatches(lang(?abstract), "EN"))
            }`;

    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    // fetching information
    fetch(url)
        .then(response => response.json())
        .then(data => {
            let bindings = data.results.bindings;
            let dbpTitle = document.getElementById('db_page_title');
            let plantInfoElement = document.getElementById('abstract_dbp');
            let labelElement = document.getElementById('title_dbp');
            let linkElement = document.getElementById('link_dbp');

            document.getElementById("plant_infoDbp").classList.remove("hidden")
            if (bindings.length > 0) {
                // if information found
                dbpTitle.textContent = 'DBPedia Information';
                labelElement.textContent = bindings[0].label.value;
                plantInfoElement.innerHTML = data.results.bindings[0].abstract.value;
                linkElement.textContent = 'More info';
                linkElement.href = resource;
            } else {
                // if plant not found
                let iconHTML = '<img class="announcement-icon" src="/images/announcement.png" alt="Announcement icon">'
                document.getElementById("plant_infoDbp").insertAdjacentHTML("afterbegin", iconHTML)
                dbpTitle.textContent = 'No match for DBpedia entries';
                plantInfoElement.textContent = "The name you provided is not matching any of the DBPedia plants.";
            }
        })
        .catch(error =>
            console.error('Error:', error));
}

function getPlantId(){
    return plant_id
}