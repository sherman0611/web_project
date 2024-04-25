
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