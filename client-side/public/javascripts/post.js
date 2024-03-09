let name = null;
let roomNo = null;
let socket = io();

function init(id) {
    roomNo = id;

    // called when a message is received
    socket.on('comment', function (room, userId, chatText) {
        let who = userId
        if (userId === name) who = 'Me';
        writeOnHistory('<b>' + who + ':</b> ' + chatText);
    });
}

function sendChatText() {
    connectToRoom()
    let chatText = document.getElementById('chat_input').value;

    // Send an HTTP request to your server to save the comment
    fetch('/save-comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            roomNo: roomNo,
            name: name,
            chatText: chatText
        })
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to save comment');
        }
        console.log('Comment saved successfully');
    }).catch(error => {
        console.error('Error saving comment:', error);
    });

    socket.emit('comment', roomNo, name, chatText);
    console.log('Sent chat message:', chatText);
}

function connectToRoom() {
    name = document.getElementById('name').value;
    if (!name) name = 'Unknown-' + Math.random();
    socket.emit('create or join', roomNo, name);
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('chat_input').value = '';
}
