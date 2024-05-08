function setUsername(){
    let username = document.getElementById('username').value;
    localStorage.setItem('username', username);
}

function getUsername() {
    let username = localStorage.getItem("username");
    if (!username) {
        username = "";
    }
    return username;
}

function goToReferrer(){
    if (document.referrer.includes("enter_username")){
        document.location = "/home"
    } else {
        document.location = document.referrer
    }
}

function enterUsernameField() {
    let html_to_insert = '<input class = "text-input" value = "'+getUsername()+'" type = "text" id = "username" name="username" >'
    document.getElementById("enter_username_field").insertAdjacentHTML('beforeend',html_to_insert)
}

function usernameDefining(){
    let html_to_insert = ""
    var gotUsername = getUsername();
    if(getUsername() === "") {
        html_to_insert = '<input class="text_input" type="text" id="username" name="username">'+
            '<button class="form-button" type="button" id="save-username" onclick="setUsername()">Save your username</button>'
        // '<button class="form-button" id="save-username" onclick="preventDefault();stopPropagation();saveUsername()">Save your username</button>'
    } else {
        html_to_insert = '<input type="text" class="input-disabled" id="username" name="username" value='+gotUsername+' readonly><br>' +
            '<a class="form-button" href="/enter_username">Change your username</a>'
    }
    document.getElementById("username-container").insertAdjacentHTML('beforeend',html_to_insert)
}

function identifyAuthor(){
    if(getUsername() === document.getElementById("plant_author").innerText){
        let plant_id = document.getElementById("plant_id").value;
        let identification_status = document.getElementById("identification_status").textContent;
        let html_to_insert;
        if(identification_status.includes("Completed")){
            html_to_insert = '<span class="completed-text">' +
                '<img class="completed-icon" src="/images/completed.png" alt="Completed icon">' +
                '<b>The identification of your plant is completed!</b></span><br>';
            document.getElementsByClassName("plant_details")[0].insertAdjacentHTML("afterbegin", html_to_insert);
        } else {
            html_to_insert = '<a class="form-button" href="/edit_plant/'+plant_id+'">Edit your plant entry</a>';
            document.getElementsByClassName("nav-links")[0].insertAdjacentHTML("beforeend", html_to_insert);
        }
    }
}