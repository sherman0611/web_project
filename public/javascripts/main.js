function return_home() {
    window.location.href = '/home';
}

var username_form = document.getElementById("create_username_form")
// username_form.addEventListener('submit', function(e) {
//     e.preventDefault(); // Prevent default form submission
//
//     let username = document.getElementById('username').value;
//     localStorage.setItem('username', username);
// });

function save_username(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);
}

function get_username(){
    return localStorage.getItem("username")
}
