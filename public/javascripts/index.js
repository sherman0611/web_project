// Keypress event listener for the search input field
let input = document.getElementById('search-input');

// Search on enter
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});

/**
 * Fetch data from the server based on the selected sort order, filter status, and search query
 * Then update the display with the fetched data
 */
function sortPosts() {
    console.log('Fetching data...');
    const sortOrder = document.getElementById('sort-select').value;
    const filterStatus = document.getElementById('filter-select').value;
    const searchQuery = document.getElementById('search-input').value;

    const url = `/fetch-data?order=${sortOrder}&status=${filterStatus}` + (searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '');
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('plant-entries-container');
            container.innerHTML = '';
            data.forEach(item => {
                insertEntry(item);
            });
        })
        .catch(error => console.error('Error:', error));
}

window.onload = function () {
    openEntriesIDB().then((db) => {
        setTimeout(() => { // Adding delay here
            getAllEntries(db).then((entries) => {
                for (const entry of entries) {
                    insertEntry(entry)
                }
            });
        }, 100);
    });
}