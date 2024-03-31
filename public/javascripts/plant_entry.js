let username = null;
let plant_id = null;
let socket = io();

function init() {
    plant_id = document.getElementById('plant-id').value;

    socket.emit('join', plant_id);

    // called when a message is received
    socket.on('comment', function (room, data) {
        writeNewComment(data);
    });
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
