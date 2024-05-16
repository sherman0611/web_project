let selected;

window.onload = function (){
    setSelected();

    // On change, if somebody wants to update the identification
    document.getElementById("status").addEventListener("change", (event) => {
        selected = document.getElementById("status").value
        if(selected==="completed"){
            // Display the warning if somebody wants to complete the identification
            document.getElementById("completed-warning").classList.remove("hidden")
        } else {
            document.getElementById("completed-warning").classList.add("hidden")
        }
    })
}

// Set in the dropdown the current state of identification
function setSelected(){
    let cur_status = document.getElementById("status").value
    document.getElementById(cur_status).selected = true
}
