const socket = io();

// Fired on a comment being sent
function sendComment(event) {
    setUsername();
    event.preventDefault();

    let username = getUsername();
    if (username==="") {
        username = document.getElementById("username")
    }

    // Send AJAX request to the server to create comment
    $.ajax({
        type: 'POST',
        url: '/send_comment',
        data: $('#comment-form').serialize(),
        success: function(data) {
            socket.emit('comment', plant_id, data);
        },
        error: function(xhr, status, error) {
            console.error("Error creating comment:", error);
        }
    });
}

// As the page loads, scroll to the latest messages
function scrollToBottomChat(){
    if(document.getElementById("comments_container")){
        document.getElementById("comments_container").scrollTo(0, (document.getElementById("comments_container").scrollHeight))
    }
}

// Correctly assign who is conversing and authorship for the comments
function assignCommentAuthor(){
    let curUser = getUsername()
    let comments = document.getElementsByClassName("comment-container")
    for(let comment in comments){
        if(typeof comments[comment] !== "object"){
            break;
        }

        if(comments[comment].getElementsByClassName("comment-author")[0].value === curUser ){
            // If it is the current user whose message is being loaded,
            // show to the right
            comments[comment].classList.add("right")
        } else {
            // If it is some other user, show to the left
            comments[comment].classList.add("left")
        }
    }
}

// Display a new comment in the comment box
function writeNewComment(data) {
    let commentsContainer = document.getElementById('comments_container');

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

    // Add elements of a single message
    commentContainer.appendChild(usernameParagraph);
    commentContainer.appendChild(commentParagraph);
    commentContainer.appendChild(dateParagraph);
    // Add a message to a pool of messages
    commentsContainer.appendChild(commentContainer);

    // Clear out the message field
    document.getElementById('comment_text').value = '';
    scrollToBottomChat()
}

// Disable the chat function if the identification is completed
function disableChat(){
    let identification_status = document.getElementById("identification_status").textContent
    if(identification_status.includes("Completed")){
        let chatTextBox = document.getElementById("comment_text")
        chatTextBox.setAttribute("disabled", "true")
        chatTextBox.placeholder = "Chat is now disabled!"

        document.getElementById('username-container').style.display = 'none';
    }
}