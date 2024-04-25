// Register service worker to control making site work offline
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'})
        .then(function (reg) {
            console.log('Service Worker Registered!', reg);
        })
        .catch(function (err) {
            console.log('Service Worker registration failed: ', err);
        });
}

// Check if the browser supports the Notification API
if ("Notification" in window) {
    // Check if the user has granted permission to receive notifications
    if (Notification.permission === "granted") {
        // Notifications are allowed, you can proceed to create notifications
        // Or do whatever you need to do with notifications
    } else if (Notification.permission !== "denied") {
        // If the user hasn't been asked yet or has previously denied permission,
        // you can request permission from the user
        Notification.requestPermission().then(function (permission) {
            // If the user grants permission, you can proceed to create notifications
            if (permission === "granted") {
                navigator.serviceWorker.ready
                    .then(function (serviceWorkerRegistration) {
                        serviceWorkerRegistration.showNotification("Todo App",
                            {body: "Notifications are enabled!"})
                            .then(r =>
                                console.log(r)
                            );
                    });
            }
        });
    }
}

function usernameDefining(){
    let html_to_insert = ""
    var gotUsername = getUsername();
    if(getUsername() === "") {
        html_to_insert = '<input class="text_input" type="text" id="username" name="username">'+
            '<button class="form-button" type="button" id="save-username" onclick="saveUsername()">Save your username</button>'
        // '<button class="form-button" id="save-username" onclick="preventDefault();stopPropagation();saveUsername()">Save your username</button>'
    } else {
        html_to_insert = '<input type="text" class="input-disabled" id="username" name="username" value='+gotUsername+' readonly><br>' +
            '<a class="form-button" href="/enter_username">Change your username</a>'
    }
    document.getElementById("username-paragraph").insertAdjacentHTML('beforeend',html_to_insert)
}

function returnHome() {
    window.location.href = '/';
}
