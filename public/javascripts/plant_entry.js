let username = null;
let plant_id = null;
let socket = io();

function init() {
    plant_id = document.getElementById('plant_id').value;

    socket.emit('join', plant_id);

    // called when a message is received
    // socket.on('comment', function (room, userId, chatText) {
    //     let who = userId
    //     if (userId === username) who = 'Me';
    //     writeOnHistory('<b>' + who + ':</b> ' + chatText);
    // });
}

function sendCommentText() {
    username = document.getElementById('username').value;
    if (!username) {
        username = 'Anon' + Math.floor(Math.random() * 1000);
        document.getElementById('username').value = username;
    }
    // let commentText = document.getElementById('commentText').value;
    // socket.emit('comment', plant_id, username, commentText);

    document.getElementById('comment_form').submit();
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('commentText').value = '';
}
