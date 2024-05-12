let displayCoords = document.getElementById("display_coordinates");

window.onload = function () {
    const usernameInput = document.getElementById("username");
    usernameDefining();
    const image_file = document.getElementById('image_file')
    const image_url = document.getElementById('image_url')
    image_file.addEventListener("change", () => {
        image_url.disabled = image_file.files.length === 1;
    });
    image_url.addEventListener("input", () => {
        console.log(image_url.value.length)
        image_file.disabled = image_url.value.length > 1;
        if(image_url.value.length > 1){
            image_file.classList.add("disabled")
        } else {
            image_file.classList.remove("disabled")
        }
    });
}

// Get the current geolocation of the user
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, locationError);
    } else {
        displayCoords.innerHTML = "Geolocation is not supported by this browser.";
    }
}

// If the user disabled the browser to read their location and other errors
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

// Show the position read by geolocation services
function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    displayCoords.innerHTML = '<p><label for="latitude">Latitude:</label>' +
        '<input class="text_input_disabled" type="text" id="latitude" name="latitude" value=' + lat + ' readonly></p><br>' +
        '<p><label for="longitude">Longitude:</label>' +
        '<input class="text_input_disabled" type="text" id="longitude" name="longitude" value=' + lon + ' readonly></p>';
}

// Allow user to specify the date and time seen
// If they are the same, allow them to click an appropriate checkbox
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
    }

    datePicker.readOnly = checkBox.checked;
    timePicker.readOnly = checkBox.checked;
}

// Enable or disable the field for flowers colour if the plant
// has no flowers
function toggleColourFlowers() {
    let flowers_answer_yes = document.getElementById("flowers_yes");
    let flowers_answer_no = document.getElementById("flowers_no");
    let colour_flowers = document.getElementById("colour_flowers");

    // if flowers radio button no is selected, disable the colour flowers input
    if(flowers_answer_no.checked) {
        colour_flowers.disabled = true;
        return;
    }
    // if flowers radio button yes is selected, enable the colour flowers input
    if(flowers_answer_yes.checked) {
        colour_flowers.disabled = false;
    }
}
