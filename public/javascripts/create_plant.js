
const container = document.getElementById("display_coordinates");

var form;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        container.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    let add_plant_entry_container = document.getElementsByClassName("add_plant_entry_container")[0];
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // var latDirection = lat >= 0 ? "N" : "S";
    // var lonDirection = lon >= 0 ? "E" : "W";
    //
    // lat = Math.abs(lat);
    // lon = Math.abs(lon);

    let html_to_insert = '<p><label for="latitude">Latitude:</label>' +
        '<input class="text_input_disabled" type="text" id="latitude" name="latitude" value='+lat+' readonly></p><br>' +
        '<p><label for="longitude">Longitude:</label>' +
        '<input class="text_input_disabled" type="text" id="longitude" name="longitude" value='+lon+' readonly></p>'

    add_plant_entry_container.insertAdjacentHTML('beforeend', html_to_insert);
}

function usernameDefining(){
    let html_to_insert = ""
    var gotUsername = getUsername();
    if(getUsername() === "") {
        html_to_insert = '<input class="text_input" type="text" id="username" name="username">'+
            '<button class="form-button" onclick="saveUsername()">Save your username</button>'
    } else {
        // html_to_insert = "<p><strong>"+getUsername()+"</strong><\p>" +
        //     '<a class="form-button" href="/enter_username">Change your username</a>'
        html_to_insert = '<input type="text" id="username" name="username" value='+gotUsername+' readonly></p><br>' +
            '<a class="form-button" href="/enter_username">Change your username</a>'
    }
    document.getElementById("username-paragraph").insertAdjacentHTML('beforeend',html_to_insert)
}

