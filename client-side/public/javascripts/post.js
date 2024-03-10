let username = null;
let postId = null;
let socket = io();

function init() {
    postId = document.getElementById('postId').value;

    socket.emit('join', postId);

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
    let commentText = document.getElementById('commentText').value;
    socket.emit('comment', postId, username, commentText);

    document.getElementById('comment_form').submit();
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('commentText').value = '';
}
