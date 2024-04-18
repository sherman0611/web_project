window.onload= (event) => {
    sortBySavedValue()
}
function sortPlants(data) {
    var sortValue = document.getElementById('sort-select').value;
    localStorage.setItem('sortValue', sortValue)
//     TODO here sort the data
}

function sortBySavedValue() {
    let sortValue = getSortOrder()
    if(sortValue === undefined){
        sortValue = 'date-desc'
        localStorage.setItem('sortValue', sortValue)
    }
}

function  getSortOrder(){
    return localStorage.getItem('sortValue')
}
