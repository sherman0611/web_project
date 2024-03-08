// // Open IndexedDB
// let db;
// const request = indexedDB.open("MyTestDatabase");
// request.onerror = (event) => {
//     console.error("Failed to open database:", event.target.errorCode);
// };
// request.onsuccess = (event) => {
//     db = event.target.result;
// };
//
// // Check browser support
// if (!window.indexedDB) {
//     alert("Sorry! Your browser does not support IndexedDB");
// }
//
// // Error handler
// db.onerror = (event) => {
//     console.error(`Database error: ${event.target.errorCode}`);
// };

function init() {
    document.getElementById('overlay').style.display = 'none';
}

function returnHome() {
    window.location.href = '/';
}