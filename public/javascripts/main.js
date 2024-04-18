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

function getUsername(){
    return localStorage.getItem("username")
}

function sortPlants() {
    var sortValue = document.getElementById('sort-select').value;
    window.location.href = '/home?sort=' + sortValue;
}
