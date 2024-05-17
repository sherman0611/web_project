const socket = io();

// Fired on a comment being sent
const submitComment = () => {
    if (document.getElementById("username").value === "") {
        alert("Please enter your username!");
        return;
    }

    setUsername();

    const dateObj = new Date();
    const month   = dateObj.getUTCMonth() + 1; // months from 1-12
    const day     = dateObj.getUTCDate();
    const year    = dateObj.getUTCFullYear();

    const newDate = year + "-" + month + "-" + day;

    const formData = {
        plant_id: getPlantId(),
        username: getValue("username"),
        comment_text: getValue("comment_text"),
        date: newDate
    };

    if (!formData.comment_text) {
        alert("Cannot send empty comment!");
        return;
    }

    openSyncIDB('sync-comments').then((db) => {
        addToSync(db, formData, 'sync-comments');
    });

    navigator.serviceWorker.ready
        .then(function (sw) {
            const permission = Notification.permission;
            if (permission === 'granted') {
                sw.showNotification("Plantgram", {
                    body: "Comment added to pending list!"
                });
            }
        }).then(function (sw) {
            try{
                socket.emit('comment', plant_id, formData);
            } catch(e) {
                console.log("Problems with Socket.IO: "+e)
            }
        })

    document.getElementById('comment_text').value = '';
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
function writeNewComment(data, isPending = false) {
    let commentsContainer = document.getElementById('comments_container');

    let commentContainer = document.createElement('div');
    commentContainer.classList.add('comment-container');
    commentContainer.classList.add('bubble');
    if (isPending) {
        commentContainer.classList.add('pending');
    }

    let curUser = getUsername()
    if(data.username === curUser ){
        // If it is the current user whose message is being loaded,
        // show to the right
        commentContainer.classList.add("right")
    } else {
        // If it is some other user, show to the left
        commentContainer.classList.add("left")
    }
    // commentContainer.classList.add('right');

    let usernameParagraph = document.createElement('p');
    let usernameStrong = document.createElement('strong');
    usernameStrong.textContent = data.username;
    usernameParagraph.appendChild(usernameStrong);

    let commentParagraph = document.createElement('p');
    commentParagraph.textContent = data.comment_text;

    let dateParagraph = document.createElement('p');
    dateParagraph.style.fontSize = "0.6rem";
    if (isPending) {
        dateParagraph.textContent = 'Sent on ' + data.date;
    } else {
        dateParagraph.textContent = 'Sent on ' + data.date.substring(0, 10);
    }

    if (isPending) {
        let pendingParagraph = document.createElement('p');
        let pendingStrong = document.createElement('strong');
        pendingStrong.textContent = "Pending";
        pendingParagraph.appendChild(pendingStrong);
        commentContainer.appendChild(pendingParagraph);
    }

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


const insertComment = (comment, isPending = false) => {
    if (comment._id || comment.id) {
        if (comment.id) {
            comment = comment.formData;
        }

        writeNewComment(comment, isPending)
    }
    // writeNewComment(comment, isPending)
};
