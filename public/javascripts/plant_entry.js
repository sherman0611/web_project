let username = null;
let plant_id = null;
let socket = io();

let map, infoWindow
function init() {
    plant_id = document.getElementById('plant-id').value;

    socket.emit('join', plant_id);

    // called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
    });
}

function identifyAuthor(){
    console.log(document.getElementById("plant_author").innerText)
    if(getUsername() === document.getElementById("plant_author").innerText){
        let plant_id = document.getElementById("plant_id").value
        let html_to_insert = '<a class="form-button" href="/edit_plant/'+plant_id+'">Edit your plant entry</a>'
        document.getElementsByClassName("nav-links")[0].insertAdjacentHTML("beforeend", html_to_insert)
    }
}

function sendComment(event) {
    event.preventDefault();

    username = document.getElementById('username').value;
    if (!username) {
        username = 'Anon' + Math.floor(Math.random() * 1000);
        document.getElementById('username').value = username;
    }

    // Send AJAX request to the server to create comment
    $.ajax({
        type: 'POST',
        url: '/create_comment',
        data: $('#comment-form').serialize(),
        success: function(data) {
            socket.emit('comment', plant_id, data);
        },
        error: function(xhr, status, error) {
            console.error("Error creating comment:", error);
        }
    });
}

function writeNewComment(data) {
    let commentsContainer = document.getElementById('comments-container');

    let commentContainer = document.createElement('div');
    commentContainer.classList.add('comment-container');

    let usernameParagraph = document.createElement('p');
    let usernameStrong = document.createElement('strong');
    usernameStrong.textContent = data.username;
    usernameParagraph.appendChild(usernameStrong);

    let commentParagraph = document.createElement('p');
    commentParagraph.textContent = data.comment_text;

    let dateParagraph = document.createElement('p');
    dateParagraph.textContent = 'Sent on ' + data.date.substring(0, 10);

    let hr = document.createElement('hr');

    commentContainer.appendChild(usernameParagraph);
    commentContainer.appendChild(commentParagraph);
    commentContainer.appendChild(dateParagraph);
    commentContainer.appendChild(hr);

    commentsContainer.appendChild(commentContainer);

    document.getElementById('comment-text').value = '';
}
// function initMap() {
//     // Coordinates will be set dynamically via HTML data attributes
//     const mapElement = document.getElementById('map');
//     const lat = parseFloat(mapElement.dataset.lat);
//     const lng = parseFloat(mapElement.dataset.lng);
//
//     const location = {lat: lat, lng: lng};
//     const map = new google.maps.Map(mapElement, {
//         zoom: 8,
//         center: location
//     });
//     const marker = new google.maps.Marker({
//         position: location,
//         map: map
//     });
// }
// function initMap() {
//     var location = {lat: <%= plant_entry.latitude %>, lng: <%= plant_entry.longitude %>};
//     var map = new google.maps.Map(document.getElementById('map'), {
//         zoom: 8,
//         center: location
//     });
//     var marker = new google.maps.Marker({
//         position: location,
//         map: map
//     });
// }



async function initMap() {
    // The location of Uluru

    const mapElement = document.getElementById('map');
    const lat = parseFloat(mapElement.dataset.lat);
    const lng = parseFloat(mapElement.dataset.lng);

    const location = {lat: lat, lng: lng};

    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

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
initMap();


