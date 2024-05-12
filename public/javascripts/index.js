let input = document.getElementById('search-input');

// Search on enter
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("search-button").click();
    }
});

// TODO comment
function fetchData() {
    console.log('Fetching data...');
    const sortOrder = document.getElementById('sort-select').value;
    const filterStatus = document.getElementById('filter-select').value;
    const searchQuery = document.getElementById('search-input').value;

    const url = `/fetch-data?order=${sortOrder}&status=${filterStatus}` + (searchQuery ? `&query=${encodeURIComponent(searchQuery)}` : '');
    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateDisplay(data);
        })
        .catch(error => console.error('Error:', error));
}


// TODO comment
function updateDisplay(data) {
    const container = document.getElementById('plant-entries-container');
    container.innerHTML = '';
    data.forEach(item => {
        const plantEntryDiv = document.createElement('div');
        plantEntryDiv.className = 'home link container';

        const plantLink = document.createElement('a');
        plantLink.href = `/view_plant/${item._id}`;

        if (item.image || item.image_url) {
            const imgSrc = item.image ? item.image.replace('public', '') : item.image_url;
            const plantImage = document.createElement('img');
            plantImage.className = 'plant-image';
            plantImage.src = imgSrc;
            plantImage.alt = item.plant_name;
            plantLink.appendChild(plantImage);
        }

        const infoDiv = document.createElement('div');
        infoDiv.className = 'plant-info';

        const plantInfoP = document.createElement('p');
        const plantInfoB = document.createElement('b');
        // plantInfoP.textContent = `Plant by ${item.username || 'Anonymous'}`;
        plantInfoB.textContent = `${item.plant_name} by ${item.username}`;
        plantInfoP.appendChild(plantInfoB)
        infoDiv.appendChild(plantInfoP);

        if (item.date || item.location) {
            const dateLocationP = document.createElement('p');
            let dateText = item.date ? new Date(item.date).toISOString().substring(0, 10) : 'Unknown date';
            dateLocationP.textContent = `${dateText}, ${item.location || 'Unknown location'}`;
            infoDiv.appendChild(dateLocationP);
        }

        plantLink.appendChild(infoDiv);
        plantEntryDiv.appendChild(plantLink);
        container.appendChild(plantEntryDiv);
    });
}