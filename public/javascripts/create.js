function validateForm() {
    var fileInput = document.getElementById('image_file');
    var urlInput = document.getElementById('image_url');

    if (fileInput.files.length === 0 && urlInput.value.trim() === '') {
        alert('Please provide either an image file or URL.');
        return false;
    }
    return true;
}
