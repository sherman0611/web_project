
const container = document.getElementById("display_coordinates");

var form;

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        container.innerHTML = "Geolocation is not supported by this browser.";
    }
}

// function showPosition(position) {
//     container.innerHTML = "Latitude: " + position.coords.latitude +
//         "<br>Longitude: " + position.coords.longitude;
// }
function showPosition(position) {
    let add_plant_entry_container = document.getElementsByClassName("add_plant_entry_container")[0];
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var latDirection = lat >= 0 ? "N" : "S";
    var lonDirection = lon >= 0 ? "E" : "W";

    // lat = Math.abs(lat);
    // lon = Math.abs(lon);

    let html_to_insert = '<p><label for="latitude">Latitude:</label>' +
        '<input class="text_input_disabled" type="text" id="latitude" name="latitude" value='+lat+' readonly></p><br>' +
        '<p><label for="longitude">Longitude:</label>' +
        '<input class="text_input_disabled" type="text" id="longitude" name="longitude" value='+lon+' readonly></p>'

    add_plant_entry_container.insertAdjacentHTML('beforeend', html_to_insert);
}

