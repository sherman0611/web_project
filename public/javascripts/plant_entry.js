let plant_id = null;
const socket = io();

let map, infoWindow

window.onload = function () {
    plant_id = document.getElementById('plant-id').value;

    socket.emit('join', plant_id);

    // called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
    });
    identifyAuthor();
    usernameDefining();
    assignCommentAuthor();
    scrollToBottomChat()
}

function sendComment(event) {
    event.preventDefault();

    // let username = getUsername();
    // if (username==="") {
    //
    // }

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
    commentContainer.classList.add('bubble');
    commentContainer.classList.add('right');

    let usernameParagraph = document.createElement('p');
    let usernameStrong = document.createElement('strong');
    usernameStrong.textContent = data.username;
    usernameParagraph.appendChild(usernameStrong);

    let commentParagraph = document.createElement('p');
    commentParagraph.textContent = data.comment_text;

    let dateParagraph = document.createElement('p');
    dateParagraph.style.fontSize = "0.6rem";
    dateParagraph.textContent = 'Sent on ' + data.date.substring(0, 10);

    commentContainer.appendChild(usernameParagraph);
    commentContainer.appendChild(commentParagraph);
    commentContainer.appendChild(dateParagraph);

    commentsContainer.appendChild(commentContainer);

    document.getElementById('comment-text').value = '';
    scrollToBottomChat()
}

function assignCommentAuthor(){
    let curUser = getUsername()
    let comments = document.getElementsByClassName("comment-container")
    for(let comment in comments){
    if(typeof comments[comment] !== "object"){
    break;
}
    if(comments[comment].getElementsByClassName("comment-author")[0].value === curUser ){
    comments[comment].classList.add("right")
} else {
    comments[comment].classList.add("left")
}
}
}

async function initMap() {
    // The location of Uluru

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

function scrollToBottomChat(){
    if(document.getElementById("comments-container")){
    document.getElementById("comments-container").scrollTo(0, (document.getElementById("comments-container").scrollHeight))
}
}

document.onload = initMap()