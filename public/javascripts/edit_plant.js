let selected;

window.onload = function (){
    setSelected();

    document.getElementById("identification_status").addEventListener("select", (event) => {
        selected = document.getElementById("identification_status").value
    })

}
function setSelected(){
    let cur_status = document.getElementById("plant_identification").value
    document.getElementById(cur_status).selected = true
}