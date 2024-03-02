// Open IndexedDB
// const request = window.indexedDB.open("Database", 3);

function init() {
    document.getElementById('create_form').style.display = 'none';
}

function openCreateForm() {
    document.getElementById('create_form').style.display = 'block';
}

function closeCreateForm() {
    document.getElementById('create_form').style.display = 'none';
}

function validateForm() {
    var fileInput = document.getElementById('image_file');
    var urlInput = document.getElementById('image_url');

    if (fileInput.files.length === 0 && urlInput.value.trim() === '') {
        alert('Please provide either an image file or URL.');
        return false;
    }
    return true;
}