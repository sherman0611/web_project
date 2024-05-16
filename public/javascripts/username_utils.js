// Set the username in localStorage
function setUsername(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);

    navigator.serviceWorker.ready
        .then(function (sw) {
            const permission = Notification.permission;
            if (permission === 'granted') {
                sw.showNotification('Plantgram', {
                    body: 'Username saved!',
                });
            }
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

// Pull the username from the localStorage or allow to create a new username
function usernameDefining(){
    let html_to_insert = ""
    let username = getUsername();
    if(username === "") {
        html_to_insert = '<input class="text_input" type="text" id="username" name="username">'+
            '<button class="form-button" type="button" id="save-username" onclick="setUsername()">Save your username</button>'
    } else {
        html_to_insert = '<input type="text" class="input-disabled" id="username" name="username" value='+username+' readonly><br>' +
            '<a class="form-button" href="/enter_username">Change your username</a>'
    }
    document.getElementById("username-container").insertAdjacentHTML('beforeend',html_to_insert)
}

// Go to the previous website in the history
function goToReferrer(){
    if (document.referrer.includes("enter_username")){
        document.location = "/"
    } else {
        document.location = document.referrer
    }
}
