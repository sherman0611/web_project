
const container = document.getElementById("display_coordinates");

var form;
window.addEventListener("load", (event) => {
    var form = document.getElementById("create_plant_form")

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let username = document.getElementById('username').value;
        if(username) {
            localStorage.setItem('username', username);
        }
    });
});


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
