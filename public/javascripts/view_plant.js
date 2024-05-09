let plant_id = null;
let plant_name = null;

let map;

window.onload = function () {
    plant_id = document.getElementById('plant_id').value;
    plant_name = document.getElementsByTagName('h1')[0].textContent;
    console.log(plant_name)
    console.log(plant_id)
    socket.emit('join', plant_id);

    // called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
    });
    fetchDBPedia();
    identifyAuthor();
    usernameDefining();
    assignCommentAuthor();
    scrollToBottomChat();
    initMap();
}

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
                 SELECT ?label ?abstract ?link
                 WHERE {
                  <${resource}> dbo:abstract ?abstract .
                  <${resource}> rdfs:label ?label .
                  <${resource}> dbo:wikiPageID ?link .
                 FILTER (langMatches(lang(?abstract), "EN"))
            }`;

    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            let bindings = data.results.bindings;
            let result = JSON.stringify(bindings);
            let dbpTitle = document.getElementById('db_page_title');
            dbpTitle.textContent = 'DBpedia Information';

            let label = bindings[0].label.value;
            let labelElement = document.getElementById('title_dbp')
            labelElement.textContent = label;


            let abstract = data.results.bindings[0].abstract.value;
            let plantInfoElement = document.getElementById('abstract_dbp');
            plantInfoElement.innerHTML = abstract;


            let link = bindings[0].link.value;
            let linkElement = document.getElementById('link_dbp');
            linkElement.textContent = 'More info';
            linkElement.href = `http://dbpedia.org/page/${plant_name}`;
        })
        .catch(error => console.error('Error:', error));
}