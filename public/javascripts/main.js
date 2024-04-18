function returnHome() {
    window.location.href = '/home';
}

function saveUsername(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);
}

function getUsername(){
    return localStorage.getItem("username")
}

