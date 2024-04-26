const socket = io();

function scrollToBottomChat(){
    if(document.getElementById("comments-container")){
        document.getElementById("comments-container").scrollTo(0, (document.getElementById("comments-container").scrollHeight))
    }
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

function sendComment(event) {
    event.preventDefault();

    let username = getUsername();
    if (username==="") {
        username = document.getElementById("username")
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