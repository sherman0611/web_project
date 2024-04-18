function returnHome() {
    window.location.href = '/home';
}

var username_form = document.getElementById("create_username_form")
// username_form.addEventListener('submit', function(e) {
//     e.preventDefault(); // Prevent default form submission
//
//     let username = document.getElementById('username').value;
//     localStorage.setItem('username', username);
// });

function saveUsername(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);
}

function goToReferrer(){
    if(document.referrer.includes("enter_username")){
        document.location = "/home"
    } else {
        document.location = document.referrer
    }
}

function enterUsernameField() {
    let html_to_insert = '<input class = "text-input" value = "'+getUsername()+'" type = "text" id = "username" name = "username" >'
    document.getElementById("enter_username_field").insertAdjacentHTML('beforeend',html_to_insert)
}

function getUsername() {
    let username = localStorage.getItem("username")
    if(username===undefined){
        username=""
    }
    return username
}

function sortPlants() {
    var sortValue = document.getElementById('sort-select').value;
    window.location.href = '/home?sort=' + sortValue;
}