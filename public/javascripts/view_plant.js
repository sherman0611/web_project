// const plant_id = document.getElementById('plant_id').value;
// const socket = io();
//
// let map, infoWindow
//
// window.onload = function () {
//     // inject username to html
//     const usernameInput = document.getElementById("username");
//     usernameInput.value = getUsername();
//
//     socket.emit('join', plant_id);
//
//     // called when a message is received
//     socket.on('comment', function (room, data) {
//         writeNewComment(data);
//         scrollToBottomChat();
//     });
//
//     identifyAuthor();
//     assignCommentAuthor();
//     scrollToBottomChat();
//     initMap();
// }
//
// function sendComment(event) {
//     event.preventDefault();
//
//     // Send AJAX request to the server to create comment
//     $.ajax({
//         type: 'POST',
//         url: '/send_comment',
//         data: $('#comment-form').serialize(),
//         success: function(data) {
//             socket.emit('comment', plant_id, data);
//         },
//         error: function(xhr, status, error) {
//             console.error("Error sending comment:", error);
//         }
//     });
//     document.getElementById('comment_text').value = '';
// }
//
// function writeNewComment(data) {
//     let commentsContainer = document.getElementById('comments_container');
//
//     let commentContainer = document.createElement('div');
//     commentContainer.classList.add('comment-container');
//     commentContainer.classList.add('bubble');
//     commentContainer.classList.add('right');
//
//     let usernameParagraph = document.createElement('p');
//     let usernameStrong = document.createElement('strong');
//     usernameStrong.textContent = data.username;
//     usernameParagraph.appendChild(usernameStrong);
//
//     let commentParagraph = document.createElement('p');
//     commentParagraph.textContent = data.comment_text;
//
//     let dateParagraph = document.createElement('p');
//     dateParagraph.style.fontSize = "0.6rem";
//     dateParagraph.textContent = 'Sent on ' + data.date.substring(0, 10);
//
//     commentContainer.appendChild(usernameParagraph);
//     commentContainer.appendChild(commentParagraph);
//     commentContainer.appendChild(dateParagraph);
//
//     commentsContainer.appendChild(commentContainer);
// }
//
// function assignCommentAuthor(){
//     let curUser = getUsername();
//     let comments = document.getElementsByClassName("comment-container");
//
//     for(let comment in comments){
//         if(typeof comments[comment] !== "object") {
//             break;
//         }
//         if(comments[comment].getElementsByClassName("comment-author")[0].value === curUser ) {
//             comments[comment].classList.add("right");
//         } else {
//             comments[comment].classList.add("left");
//         }
//     }
// }
//
// function scrollToBottomChat(){
//     let commentsContainer = document.getElementById("comments_container");
//     if(commentsContainer) {
//         commentsContainer.scrollTo(0, commentsContainer.scrollHeight);
//     }
// }
//
// function identifyAuthor(){
//     if(getUsername() === document.getElementById("plant_author").innerText) {
//         let html_to_insert = '<a class="form-button" href="/edit_plant/'+plant_id+'">Edit your plant entry</a>'
//         document.getElementsByClassName("nav-links")[0].insertAdjacentHTML("beforeend", html_to_insert);
//     }
// }
//
// async function initMap() {
//     // The location of Uluru
//
//     const mapElement = document.getElementById('map');
//
//     if(mapElement !== null && mapElement.dataset !== null) {
//         const lat = parseFloat(mapElement.dataset.lat);
//         const lng = parseFloat(mapElement.dataset.lng);
//
//         const location = {lat: lat, lng: lng};
//
//         const {Map} = await google.maps.importLibrary("maps");
//         const {AdvancedMarkerElement} = await google.maps.importLibrary("marker");
//
//         map = new Map(mapElement, {
//             zoom: 4,
//             center: location,
//             mapId: "DEMO_MAP_ID",
//         });
//
//         const marker = new AdvancedMarkerElement({
//             map: map,
//             position: location,
//             title: "Uluru",
//         });
//     }
// }
