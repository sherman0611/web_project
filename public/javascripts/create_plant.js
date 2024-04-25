function getLocation() {
    const container = document.getElementById("display_coordinates");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        document.getElementById("display_coordinates").innerHTML = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    // var latDirection = lat >= 0 ? "N" : "S";
    // var lonDirection = lon >= 0 ? "E" : "W";
    //
    // lat = Math.abs(lat);
    // lon = Math.abs(lon);

    let latitudeInput = document.getElementById("latitude");
    let longitudeInput = document.getElementById("longitude");

    latitudeInput.value = lat;
    longitudeInput.value = lon;
}

window.onload = function () {
    const usernameInput = document.getElementById("username");
    usernameInput.value = getUsername();

    const create_btn = document.getElementById("create");
    create_btn.addEventListener("click", function() {
        const form = document.getElementById("create_plant_form");
        if (form.checkValidity()) {
            setUsername()
            form.submit();
        }
    });
};
