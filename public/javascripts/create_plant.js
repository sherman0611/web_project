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

function getValue(id) {
    const element = document.getElementById(id);
    if (element) {
        if (element.type === "radio") {
            const checkedOption = document.querySelector(`input[name="${element.name}"]:checked`);
            return checkedOption ? checkedOption.value : '';
        } else {
            return element.value;
        }
    } else {
        return '';
    }
}

const createEntryEventListener = () => {
    const formData = {
        username: getValue("username"),
        plant_name: getValue("plant_name"),
        image: getValue("image_file"),
        image_url: getValue("image_url"),
        location: getValue("location"),
        latitude: getValue("latitude"),
        longitude: getValue("longitude"),
        description: getValue("description"),
        height: getValue("height"),
        spread: getValue("spread"),
        flowers: getValue("flowers"),
        colour: getValue("colour"),
        leaves: getValue("leaves"),
        fruits_seeds: getValue("fruits_seeds"),
        sun_exposure: getValue("sun_exposure"),
        certainty: getValue("certainty"),
        date: getValue("date_seen"),
        time: getValue("time_seen"),
    };

    // Verify required fields
    if (formData.username.trim() === '' || formData.plant_name.trim() === '' || formData.certainty.trim() === '') {
        alert("Please fill in all required fields (Username, Plant Name, Certainty)");
        return;
    }

    openSyncEntriesIDB().then((db) => {
        addNewEntryToSync(db, formData);
    });
    navigator.serviceWorker.ready
        .then(function (sw) {
            sw.showNotification("Plantgram",
                {body: "Entry added to pending list!"})
                .then(r => {
                    window.location.href = "/";
                });
        });
}

window.onload = function () {
    // inject username to html
    const usernameInput = document.getElementById("username");
    usernameInput.value = getUsername();

    // Add event listeners to create button
    const create_button = document.getElementById("create_button")
    create_button.addEventListener("click", createEntryEventListener)
}