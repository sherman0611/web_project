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
    // let commentText = document.getElementById('commentText').value;
    // socket.emit('comment', postId, username, commentText);

    document.getElementById('comment_form').submit();
}

function fetchComments(postId) {
    fetch('/fetch-comments?postId=' + postId)
        .then(r => r.json())
        .then(comments => {
            let history = document.getElementById('history');
            history.innerHTML = '';

            comments.forEach(comment => {
                let div = document.createElement('div');
                div.className = 'post_content';

                let username = document.createElement('p');
                username.innerHTML = '<strong>' + comment.username + '</strong>';

                let commentText = document.createElement('p');
                commentText.innerHTML = comment.commentText;

                let date = document.createElement('p');
                date.innerHTML = comment.date;

                div.appendChild(username);
                div.appendChild(commentText);
                div.appendChild(date);

                history.appendChild(div);

                let hr = document.createElement('hr');
                history.appendChild(hr);
            });
        }).catch(err => {
            console.error('Error fetching comments: ', err);
        });
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('commentText').value = '';
}
