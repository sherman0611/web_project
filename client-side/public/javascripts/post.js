let username = null;
let postId = null;
let socket = io();

function init(id) {
    postId = id;

    // called when a message is received
    socket.on('comment', function (room, userId, chatText) {
        let who = userId
        if (userId === username) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
}

function connectToRoom() {
    username = document.getElementById('username').value;
    if (!username) username = 'Anon' + Math.floor(Math.random() * 1000);
    socket.emit('create or join', postId, username);
}

function sendCommentText() {
    connectToRoom()
    let commentText = document.getElementById('comment_input').value;
    socket.emit('comment', postId, username, commentText);
    console.log('Sent chat message:', commentText);

    document.getElementById('comment_form').submit();
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('comment_input').value = '';
}
