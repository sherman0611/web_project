let displayCoords = document.getElementById("display_coordinates");

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
    }
}

// Show the position read by geolocation services
function showPosition(position) {
    displayCoords.innerHTML =
        '<p><label for="latitude">Latitude:</label>' +
        '<input class="text_input_disabled" type="number" id="latitude" name="latitude" value=' + position.coords.latitude + '></p><br>' +
        '<p><label for="longitude">Longitude:</label>' +
        '<input class="text_input_disabled" type="number" id="longitude" name="longitude" value=' + position.coords.longitude + '></p>';
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

// Enable or disable the field for flowers colour based on selection
function toggleColourInput() {
    let input = document.getElementById("colour_flowers");

    if(document.getElementById("flowers_no").checked) {
        input.disabled = true;
        return;
    }
    if(document.getElementById("flowers_yes").checked) {
        input.disabled = false;
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

const submitEventListener = () => {
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
        date_seen: getValue("date_seen"),
        time_seen: getValue("time_seen"),
    };

    // verify form inputs
    if (formData.username.trim() === '' || formData.plant_name.trim() === '' || formData.certainty.trim() === '') {
        alert("Please fill in all required fields (Username, Plant Name, Certainty)");
        return;
    }

    openSyncEntriesIDB().then((db) => {
        addNewEntryToSync(db, formData);
    });

    navigator.serviceWorker.ready
        .then(function (sw) {
            sw.showNotification("Plantgram", {
                body: "Entry added to pending list!"
            }).then(r => {
                // window.location.href = "/";
            });
        });
}

window.onload = function () {
    // inject username to html
    const usernameInput = document.getElementById("username");
    usernameInput.value = getUsername();

    // Add event listeners to create button
    const create_button = document.getElementById("create_button")
    create_button.addEventListener("click", submitEventListener)

    // const image_file = document.getElementById('image_file')
    // const image_url = document.getElementById('image_url')
    // image_file.addEventListener("change", () => {
    //     image_url.disabled = image_file.files.length === 1;
    // });
    // image_url.addEventListener("input", () => {
    //     console.log(image_url.value.length)
    //     image_file.disabled = image_url.value.length > 1;
    //     if(image_url.value.length > 1){
    //         image_file.classList.add("disabled")
    //     } else {
    //         image_file.classList.remove("disabled")
    //     }
    // });
}