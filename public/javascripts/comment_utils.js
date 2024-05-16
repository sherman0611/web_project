const socket = io();

// Fired on a comment being sent
function sendComment(event) {
    setUsername();
    event.preventDefault();

    let username = getUsername();
    if (username==="") {
        username = document.getElementById("username")
    }

    const dateObj = new Date();
    const month   = dateObj.getUTCMonth() + 1; // months from 1-12
    const day     = dateObj.getUTCDate();
    const year    = dateObj.getUTCFullYear();

    const newDate = year + "-" + month + "-" + day;
    const formData = {
        username: username,
        comment_text: getValue("comment_text"),
        date: newDate
    };

    openSyncIDB('sync-comments-'+plant_id).then((db) => {
        addToSync(db, formData, 'sync-comments-'+plant_id);
    });

    navigator.serviceWorker.ready
        .then(function (sw) {
            console.log("New comment added to the pending list")
            const permission = Notification.permission;
            if (permission === 'granted') {
                sw.showNotification("Plantgram", {
                    body: "Comment added to pending list!"
                });
            }
        });

    try{
        uploadComments()
    } catch(e) {
        console.log("Problem: "+e)
    }

    try{
        socket.emit('comment', plant_id, formData);
    } catch(e) {
        console.log("Problems with Socket.IO: "+e)
    }
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
    // dateParagraph.textContent = 'Sent on ' + data.date;

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
        let comment_id;
        if (comment.id) {
            comment_id = comment.id;
            comment = comment.formData;
        }

        writeNewComment(comment)
    }
};

function updateComments() {
    console.log("in Update Comments")
    openSyncIDB('sync-comments-'+plant_id).then((db) => {
        setTimeout(() => { // Adding delay here
            getAllSyncItems(db, 'sync-comments-'+plant_id).then((items) => {
                for (const item of items) {
                    insertComment(item, true);
                }
            });
        }, 100);
    });

    let db_name = 'comments-'+plant_id

    // fetch all entries from mongo and save to idb
    fetch('http://localhost:3000/comments/'+plant_id)
        .then(function (res) {
            return res.json();
        }).then(function (newComments) {
        openIDB(db_name).then((db) => {
            deleteAllFromIDB(db, db_name).then(() => {
                addNewToIDB(db, newComments, db_name).then(() => {
                    console.log("All new comments added to IDB");
                })
            });
        });
    });
}

function uploadComments() {
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-comment-"+plant_id).then(() => {
            updateComments();
        });
    })
}


if (navigator.onLine) {
    let plant_id = getPlantId()
    // upload pending comments when online
    navigator.serviceWorker.ready.then((sw) => {
        sw.sync.register("sync-comment-"+plant_id);
    })

}
