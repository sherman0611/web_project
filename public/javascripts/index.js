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
 * Fetch data from the server based on the selected sort order, filters, and search query
 * Then update the display with the fetched data
 */
function sortPosts() {
    console.log('Fetching data...');
    const sortOrder = document.getElementById('sort-select').value;
    const filterStatus = document.getElementById('filter-select').value;
    const searchQuery = document.getElementById('search-input').value || '';
    const flowers = document.querySelector('input[name="flowers"]:checked')?.value || '';
    const leaves = document.querySelector('input[name="leaves"]:checked')?.value || '';
    const fruits_seeds = document.querySelector('input[name="fruits_seeds"]:checked')?.value || '';
    const sun_exposure = Array.from(document.querySelectorAll('input[name="sun_exposure"]:checked')).map(e => e.value);

    const url = new URL(`/fetch-data?order=${sortOrder}&status=${filterStatus}&query=${encodeURIComponent(searchQuery)}`, window.location.origin);
    if (flowers) url.searchParams.append('flowers', flowers);
    if (leaves) url.searchParams.append('leaves', leaves);
    if (fruits_seeds) url.searchParams.append('fruits_seeds', fruits_seeds);
    if (sun_exposure.length > 0) url.searchParams.append('sun_exposure', JSON.stringify(sun_exposure));

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