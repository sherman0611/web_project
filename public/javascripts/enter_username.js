window.onload = function () {
    const usernameInput = document.getElementById("username");
    usernameInput.value = getUsername();

    const add_btn = document.getElementById("save");
    add_btn.addEventListener("click", function () {
        setUsername();
        goToReferrer()
    });
};
