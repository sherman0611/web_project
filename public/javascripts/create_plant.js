function getLocation() {
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


function disableDateTime () {
    var checkBox = document.getElementById("toggleCheckbox");
    var datePicker = document.getElementById("date_seen");
    var timePicker = document.getElementById("time_seen");

    datePicker.disabled = checkBox.checked;
    timePicker.disabled = checkBox.checked;
    // If the checkbox is checked, set the date and time picker values to the current date and time
    if (checkBox.checked) {
        let date = new Date();
        datePicker.value =date.toISOString().split('T') [0];
        // timePicker.value = new Date().toTimeString().split(' ') [0];

        let hours = date.getHours();
        let minutes = date.getMinutes();

        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;

        timePicker.value = hours + ":" + minutes;
    }
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
