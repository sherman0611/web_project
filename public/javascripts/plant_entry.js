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

function sendComment() {
    username = document.getElementById('username').value;
    if (!username) {
        username = 'Anon' + Math.floor(Math.random() * 1000);
        document.getElementById('username').value = username;
    }

    $.ajax({
        url: '/create_comment',
        type: 'POST',
        data: $('#comment_form').serialize(),
        success: function(data) {
            // update comments
            let commentHtml = '<div class="comment">' +
                '<p><strong>' + data.username + '</strong></p>' +
                '<p>' + data.commentText + '</p>' +
                '<p>' + data.date + '</p>' +
                '</div><hr>';
            $('#all_comments').append(commentHtml);

            $('#commentText').val(''); // clear comment input
        },
        error: function(xhr, status, error) {
            console.error("Error creating comment:", error);
        }
    });
}

function writeOnHistory(text) {
    let history = document.getElementById('history');
    let paragraph = document.createElement('p');
    paragraph.innerHTML = text;
    history.appendChild(paragraph);
    document.getElementById('commentText').value = '';
}
