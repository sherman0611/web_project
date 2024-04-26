const plant_id = document.getElementById('plant_id').value;
const socket = io();

let map

window.onload = function () {
    // inject username to html
    const usernameInput = document.getElementById("username");
    console.log('dfajdfnjasdbgvkasfld');
    usernameInput.value = getUsername();

    socket.emit('join', plant_id);

    // called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
        scrollToBottomChat();
    });

    identifyAuthor();
    assignCommentAuthor();
    scrollToBottomChat();
    initMap();
}

function sendComment(event) {
    event.preventDefault();

    // Send AJAX request to the server to create comment
    $.ajax({
        type: 'POST',
        url: '/send_comment',
        data: $('#comment-form').serialize(),
        success: function(data) {
            socket.emit('comment', plant_id, data);
        },
        error: function(xhr, status, error) {
            console.error("Error sending comment:", error);
        }
    });
    document.getElementById('comment_text').value = '';
}

function identifyAuthor(){
    if(getUsername() === document.getElementById("plant_author").innerText) {
        let html_to_insert = '<a class="form-button" href="/edit_plant/'+plant_id+'">Edit your plant entry</a>'
        document.getElementsByClassName("nav-links")[0].insertAdjacentHTML("beforeend", html_to_insert);
    }
}

async function initMap() {
    // The location of Uluru

    const mapElement = document.getElementById('map');

    if(mapElement !== null && mapElement.dataset !== null) {
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
