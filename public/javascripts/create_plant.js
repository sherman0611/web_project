let map, infoWindow;

function getLocation() {
    let add_plant_entry_container = document.getElementsByClassName("add_plant_entry_container")[0];
    console.log("click")
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        add_plant_entry_container.insertAdjacentHTML('beforeend', "<p>Geolocation is not supported by this browser.</p>");
    }
}

function showPosition(position) {
    let add_plant_entry_container = document.getElementsByClassName("add_plant_entry_container")[0];
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var latDirection = lat >= 0 ? "N" : "S";
    var lonDirection = lon >= 0 ? "E" : "W";

    lat = Math.abs(lat);
    lon = Math.abs(lon);

    let html_to_insert = '<p><label for="latitude">Latitude:</label>' +
        '<input class="text_input_disabled" type="text" id="latitude" name="latitude" value='+lat+' readonly></p><br>' +
        '<p><label for="longitude">Longitude:</label>' +
        '<input class="text_input_disabled" type="text" id="longitude" name="longitude" value='+lon+' readonly></p>'

    add_plant_entry_container.insertAdjacentHTML('beforeend', html_to_insert);
}
//
// function initMap() {
//     map = new google.maps.Map(document.getElementById("map"), {
//         center: { lat: -34.397, lng: 150.644 },
//         zoom: 6,
//     });
//     infoWindow = new google.maps.InfoWindow();
//
//     const locationButton = document.createElement("button");
//
//     locationButton.textContent = "Pan to Current Location";
//     locationButton.classList.add("custom-map-control-button");
//     map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//     locationButton.addEventListener("click", () => {
//         // Try HTML5 geolocation.
//         if (navigator.geolocation) {
//             navigator.geolocation.getCurrentPosition(
//                 (position) => {
//                     const pos = {
//                         lat: position.coords.latitude,
//                         lng: position.coords.longitude,
//                     };
//
//                     infoWindow.setPosition(pos);
//                     infoWindow.setContent("Location found.");
//                     infoWindow.open(map);
//                     map.setCenter(pos);
//                 },
//                 () => {
//                     handleLocationError(true, infoWindow, map.getCenter());
//                 },
//             );
//         } else {
//             // Browser doesn't support Geolocation
//             handleLocationError(false, infoWindow, map.getCenter());
//         }
//     });
// }
//
// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//     infoWindow.setPosition(pos);
//     infoWindow.setContent(
//         browserHasGeolocation
//             ? "Error: The Geolocation service failed."
//             : "Error: Your browser doesn't support geolocation.",
//     );
//     infoWindow.open(map);
// }
//
// window.initMap = initMap;
//
