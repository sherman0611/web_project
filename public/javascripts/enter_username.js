window.onload = function () {
    // Set the box value to what is currently saved in the localStorage
    const usernameInput = document.getElementById("username");
    usernameInput.value = getUsername();
}