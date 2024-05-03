let selected;

window.onload = function (){
    setSelected();

    document.getElementById("identification_status").addEventListener("change", (event) => {
        selected = document.getElementById("identification_status").value
        console.log(selected)
        if(selected==="completed"){
            let mainSection = document.getElementsByClassName("main_section")[0]
            let completedContainer = document.createElement('div');
            completedContainer.classList.add('warning-message');

            let warningTitle = document.createElement('h2');
            warningTitle.textContent = "Warning!"

            let warningText = document.createElement('p');
            warningText.textContent = "Make sure that the plant name is correct (e.g. has the correct name, " +
                "no spelling mistakes, etc. Once the status is updated to Completed," +
                " this cannot be changed."
            completedContainer.appendChild(warningTitle);
            completedContainer.appendChild(warningText);
            mainSection.appendChild(completedContainer)
        }
    })

}

function setSelected(){
    let cur_status = document.getElementById("plant_identification").value
    document.getElementById(cur_status).selected = true
}