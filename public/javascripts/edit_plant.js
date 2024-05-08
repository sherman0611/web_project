let selected;

window.onload = function (){
    setSelected();

    document.getElementById("identification_status").addEventListener("change", (event) => {
        selected = document.getElementById("identification_status").value
        if(selected==="completed"){
            document.getElementById("completed-warning").classList.remove("hidden")
        } else {
            document.getElementById("completed-warning").classList.add("hidden")
        }
    })

}

function setSelected(){
    let cur_status = document.getElementById("plant_identification").value
    document.getElementById(cur_status).selected = true
}