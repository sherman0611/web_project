function enter_username() {
    let html_to_insert = '<input class = "text-input" value = "'+getUsername()+'" type = "text" id = "username" name="username" >'
    document.getElementById("enter_username_field").insertAdjacentHTML('beforeend',html_to_insert)

    const save_btn = document.getElementById("save_btn");
    save_btn.addEventListener("click", function () {
        setUsername();
        goToReferrer()
    });

    const home_btn = document.getElementById("home_btn");
    home_btn.addEventListener("click", function () {
        returnHome();
    });
};