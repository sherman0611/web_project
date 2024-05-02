var form;
let displayCoords = document.getElementById("display_coordinates");

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, locationError);
    } else {
        displayCoords.innerHTML = "Geolocation is not supported by this browser.";
    }
}

function locationError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            displayCoords.innerHTML = "Please enable location services to use this feature.";
            break;
        case error.POSITION_UNAVAILABLE:
            displayCoords.innerHTML = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            displayCoords.innerHTML = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            displayCoords.innerHTML = "An unknown error occurred.";
            break;
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    let html_to_insert = '<p><label for="latitude">Latitude:</label>' +
        '<input class="text_input_disabled" type="text" id="latitude" name="latitude" value='+lat+' readonly></p><br>' +
        '<p><label for="longitude">Longitude:</label>' +
        '<input class="text_input_disabled" type="text" id="longitude" name="longitude" value='+lon+' readonly></p>'

    displayCoords.innerHTML = html_to_insert;
}

function disableDateTime () {
    var checkBox = document.getElementById("toggleCheckbox");
    var datePicker = document.getElementById("date_seen");
    var timePicker = document.getElementById("time_seen");

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
        console.log(timePicker.value);
    }

    datePicker.readOnly = checkBox.checked;
    timePicker.readOnly = checkBox.checked;
}

function disableColourFlowers() {
    var flowers_answer_no = document.getElementById("flowers_no");
    var colour_flowers = document.getElementById("colour_flowers");

    //if flowers radio button no is selected, disable the colour flowers input
    if(flowers_answer_no.checked) {
        colour_flowers.disabled = true;
    }
}

function enableColourFlowers() {
    var flowers_answer_yes = document.getElementById("flowers_yes");
    var colour_flowers = document.getElementById("colour_flowers");

    //if flowers radio button yes is selected, enable the colour flowers input
    if(flowers_answer_yes.checked) {
        colour_flowers.disabled = false;
    }
}

window.onload = function () {
    const usernameInput = document.getElementById("username");
    usernameDefining();
}