let plant_id = null;
let plant_name = null;
let map;

window.onload = function () {
    plant_id = document.getElementById('plant_id').value;
    plant_name = document.getElementsByTagName('h1')[0].textContent;

    // Chat
    socket.emit('join', plant_id);

    // Called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
    });

    // Fetch DBPedia data only if the identification is completed
    if(document.getElementById("identification_status").textContent.includes("Completed")){
        fetchDBPedia();
    }
    // Ownership, username
    identifyAuthor();
    usernameDefining();
    // Chat functions
    assignCommentAuthor();
    disableChat();
    scrollToBottomChat();
    // Map
    initMap();
}

// Initialising the map element if a given plant was using the coordinates
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
            title: "Uluru",
        });
    }
}

// Fetch DBPedia data and display if found
function fetchDBPedia() {
    // Making sure the plant name is in the correct format for fetching data
    let plant = plant_name;
    //lowercase all word
    plant = plant.toLowerCase();
    //uppercase the first letter of the first word only
    plant = plant.charAt(0).toUpperCase() + plant.slice(1);
    //replace all spaces with underscores for the dbpedia query
    plant = plant.replace(/ /g, '_');

    // DBPedia query
    const resource = `http://dbpedia.org/resource/${plant}`;
    // SPARQL query
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

            // Displaying the information if found
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
