function returnHome() {
    window.location.href = '/home';
}

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
    let html_to_insert = '<input class = "text-input" value = "'+getUsername()+'" type = "text" id = "username" name="username" >'
    document.getElementById("enter_username_field").insertAdjacentHTML('beforeend',html_to_insert)
}

function getUsername() {
    let username = localStorage.getItem("username")
    if(username===undefined){
        username=""
    }
    return username
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