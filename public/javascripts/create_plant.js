let displayCoords = document.getElementById("display_coordinates");

window.onload = function () {
    // Let user define username (if new user) or keep on using the saved one
    usernameDefining()

    const create_button = document.getElementById("create_button")
    create_button.addEventListener("click", submitForm)

    const image_file = document.getElementById('image_file')
    const image_url = document.getElementById('image_url')
    image_file.addEventListener("change", () => {
        image_url.disabled = image_file.files.length === 1;
    });
    image_url.addEventListener("input", () => {
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
    let label = document.querySelector("[for='colour']");
    let input = document.getElementById("colour");

    let value = document.querySelector("input[name='flowers']:checked").value;
    if (value === "no") {
        input.disabled = true;
        label.innerHTML = "If so, what is the colour of these flowers:";
    } else {
        input.disabled = false;
        label.innerHTML = "If so, what is the colour of these flowers: <span class='required'>*</span>";
    }
}

const submitForm = () => {
    //check if username exist
    if (document.getElementById("username").value === "") {
        alert("Please enter your username!");
        return;
    }

    setUsername()

    // setUsername();
    const formData = {
        username: getValue("username"),
        plant_name: getValue("plant_name"),
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
        status: getValue("status"),
        date_seen: getValue("date_seen"),
        time_seen: getValue("time_seen"),
        image: document.getElementById('image_file').files[0],
    };

    // verify inputs
    if (formData.image && formData.image_url || !formData.image && !formData.image_url) {
        alert("Please select either image upload or URL!");
        return;
    }
    if (!formData.plant_name || !formData.date_seen || !formData.time_seen || !formData.location || !formData.height ||
        !formData.spread || !formData.flowers || !formData.leaves || !formData.fruits_seeds || !formData.sun_exposure ||
        !formData.description || !formData.status || formData.flowers === "yes" && !formData.colour) {

        alert("Please fill in all required fields!");
        return;
    }

    openSyncIDB('sync-entries').then((db) => {
        addToSync(db, formData, 'sync-entries');
    });

    navigator.serviceWorker.ready
        .then(function (sw) {
            const permission = Notification.permission;
            if (permission === 'granted') {
                sw.showNotification("Plantgram", {
                    body: "Entry added to pending list!"
                });
            }
        });

    // goToReferrer();
    // document.location = "/" //TODO: if we want to refer back to homepage
}
