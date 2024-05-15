// Set the username in localStorage
function setUsername(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);

    navigator.serviceWorker.ready
        .then(function (sw) {
            sw.showNotification('Plantgram', {
                body: 'Username saved!',
            });
        });
}

/** Get the username from localStorage
 * @returns string username
 */
function getUsername() {
    let username = localStorage.getItem("username");
    if (!username) {
        username = "";
    }
    return username;
}

// Go to the previous website in the history
function goToReferrer(){
    if (document.referrer.includes("enter_username")){
        document.location = "/"
    } else {
        document.location = document.referrer
    }
}
