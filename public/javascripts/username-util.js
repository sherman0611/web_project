function setUsername(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);
    goToReferrer()
}

function getUsername() {
    let username = localStorage.getItem("username");
    if (!username) {
        username = "anon";
    }
    return username;
}

function goToReferrer(){
    if (document.referrer.includes("enter_username")){
        document.location = "/"
    } else {
        document.location = document.referrer
    }
}
