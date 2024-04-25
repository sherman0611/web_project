function getLocation() {
    const container = document.getElementById("display_coordinates");
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
