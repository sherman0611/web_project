document.getElementById('sort-select').addEventListener('change', function() {
    fetchSortedData();
});
document.getElementById('filter-select').addEventListener('change', fetchFilteredAndSortedData);
// function fetchSortedData() {
//     let sortOrder = document.getElementById('sort-select').value;
//     fetch(`/sort-data?order=${sortOrder}`)
//         .then(response => response.json())
//         .then(data => {
//             updateDisplay(data);
//             res.send(data);
//         })
//         .catch(error => console.error('Error:', error));
// }
function fetchFilteredAndSortedData() {
    const sortOrder = document.getElementById('sort-select').value;
    const filterStatus = document.getElementById('filter-select').value;
    // const statusBoolean = filterStatus === 'completed';  // Converts 'completed' to true, otherwise false
    fetch(`/fetch-data?order=${sortOrder}&status=${filterStatus}`)
        .then(response => response.json())
        .then(data => {
            updateDisplay(data);
        })
        .catch(error => console.error('Error:', error));
}

function updateDisplay(data) {
    const container = document.getElementById('plant-entries-container');
    container.innerHTML = '';
    data.forEach(item => {
        const plantEntryDiv = document.createElement('div');
        plantEntryDiv.className = 'home';
        plantEntryDiv.className = 'link';
        plantEntryDiv.className = 'container';

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
        // plantInfoP.textContent = `Plant by ${item.username || 'Anonymous'}`;
        plantInfoP.textContent = `Plant by ${item.username || 'Anonymous'}`;
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
