
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
    container.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;
}
