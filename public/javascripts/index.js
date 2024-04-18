window.onload= (event) => {
    sortPlants()
}
function sortPlants(data) {
    var sortValue = document.getElementById('sort-select').value;
    if(sortValue === undefined){
        sortValue = 'date-desc'
    }
    localStorage.setItem('sortValue', sortValue)
//     TODO here sort the data
}

function  getSortOrder(){
    return localStorage.getItem('sortValue')
}
