let plant_id = null;
let plant_name = null;

let map;

window.onload = function () {
    plant_id = document.getElementById('plant_id').value;
    plant_name = document.getElementsByTagName('h1')[0].textContent;

    socket.emit('join', plant_id);

    // called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
        scrollToBottomChat();
    });
    // General data calls
    if(document.getElementById("identification_status").textContent.includes("Completed")){
        fetchDBPedia();
    }
    identifyAuthor();
    usernameDefining();
    // Chat-related calls
    assignCommentAuthor();
    scrollToBottomChat();
    disableChat();
    // Map calls
    initMap();

    // Heights of the grid elements:
    let main_c = document.getElementsByClassName("main container smaller-column")[0]
    let info_c = document.getElementsByClassName("bigger-column " +
        "two-columns container details-container")
    // let comments_c =
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
            position: location
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

                 SELECT ?label ?abstract
                 WHERE {
                  <${resource}> dbo:abstract ?abstract .
                  <${resource}> rdfs:label ?label .
                 FILTER (langMatches(lang(?abstract), "EN"))
            }`;

    const encodedQuery = encodeURIComponent(sparqlQuery);
    const url = `${endpointUrl}?query=${encodedQuery}&format=json`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById("plant_infoDbp").classList.remove("hidden")
            let bindings = data.results.bindings;
            let dbpTitle = document.getElementById('db_page_title');
            let plantInfoElement = document.getElementById('abstract_dbp');
            if (bindings.length > 0) {
                dbpTitle.textContent = 'DBpedia Information';

                let label = bindings[0].label.value;
                let labelElement = document.getElementById('title_dbp')
                labelElement.textContent = label;

                let abstract = data.results.bindings[0].abstract.value;
                plantInfoElement.innerHTML = abstract;

                let linkElement = document.getElementById('link_dbp');
                linkElement.textContent = 'More info';
                linkElement.href = resource;
            } else {
                let iconHTML = '<img class="announcement-icon" src="/images/announcement.png" alt="Announcement icon">'
                document.getElementById("plant_infoDbp").insertAdjacentHTML("afterbegin", iconHTML)
                dbpTitle.textContent = 'No match for DBpedia entries';
                plantInfoElement.textContent = "The name you provided is not matching any of the DBPedia plants.";
                console.log('No results found');
            }
        })
        .catch(error => console.error('Error:', error));
}


// function setEqualColumnHeights() {
//     let twoColumnContainers = document.getElementsByClassName('two-columns','container');
//
//     for (let child_container of twoColumnContainers[0]) {
//         let firstColumn = child_container.querySelector(':first-child');
//         let secondColumn = child_container.querySelector(':last-child');
//         let thirdColumn =
//         let tallestHeight = Math.max(firstColumn.offsetHeight, secondColumn.offsetHeight);
//
//         container.style.height = tallestHeight + 'px'; // Set container height
//         firstColumn.style.height = tallestHeight + 'px'; // Set first column height (optional)
//         secondColumn.style.height = tallestHeight + 'px'; // Set second column height (optional)
//     }
// }