function returnHome() {
    window.location.href = '/';
}

function setActive(id){
    let menu_links = document.getElementsByClassName('menu_links')[0].children
    for(var i=0; i<menu_links.length; i++){
        menu_links[i].classList.remove('active')
    }
    document.getElementById(id).classList.add('active')
}