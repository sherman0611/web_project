let name = null;
let roomNo = null;
let socket = io();

// // Open IndexedDB
// let db;
// const request = indexedDB.open("MyTestDatabase");
// request.onerror = (event) => {
//     console.error("Failed to open database:", event.target.errorCode);
// };
// request.onsuccess = (event) => {
//     db = event.target.result;
// };
//
// // Check browser support
// if (!window.indexedDB) {
//     alert("Sorry! Your browser does not support IndexedDB");
// }
//
// // Error handler
// db.onerror = (event) => {
//     console.error(`Database error: ${event.target.errorCode}`);
// };

function init() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('create_post').style.display = 'none';
    document.getElementById('post_details').style.display = 'none';

    // called when someone joins the room. If it is someone else it notifies the joining of the room
    socket.on('joined', function (room, userId) {
        if (userId === name) {
            // it enters the chat
        } else {
            // notifies that someone has joined the room
            writeOnHistory('<b>'+userId+'</b>' + ' joined room ' + room);
        }
    });
    // called when a message is received
    socket.on('chat', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
}

function openCreatePost() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('create_post').style.display = 'block';
}
function closeCreatePost() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('create_post').style.display = 'none';
}

function showPostDetails() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('post_details').style.display = 'block';
}

function closePostDetails() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('post_details').style.display = 'none';
}

function validateForm() {
    var fileInput = document.getElementById('image_file');
    var urlInput = document.getElementById('image_url');

    if (fileInput.files.length === 0 && urlInput.value.trim() === '') {
        alert('Please provide either an image file or URL.');
        return false;
    }
    return true;
}

/**
 * called to generate a random room number
 * This is a simplification. A real world implementation would ask the server to generate a unique room number
 * so to make sure that the room number is not accidentally repeated across uses
 */
function generateRoom() {
    roomNo = Math.round(Math.random() * 10000);
    document.getElementById('roomNo').value = 'R' + roomNo;
}

/**
 * called when the Send button is pressed. It gets the text to send from the interface
 * and sends the message via  socket
 */
function sendChatText() {
    let chatText = document.getElementById('chat_input').value;
    socket.emit('chat', roomNo, name, chatText);
}

/**
 * used to connect to a room. It gets the user name and room number from the
 * interface
 */
function connectToRoom() {
    roomNo = document.getElementById('roomNo').value;
    name = document.getElementById('name').value;
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
}

/**
 * it appends the given html text to the history div
 * @param text: teh text to append
 */
function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}