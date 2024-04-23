function addMaterial() {
    const materialContainer = document.getElementById('materials');
    const newMaterialItem = document.createElement('div');
    newMaterialItem.classList.add('material-item');
    newMaterialItem.innerHTML = `
        <input type="text" name="material[]" placeholder="Materiaal">
        <input type="number" name="cost[]" placeholder="0,00€">
    `;
    materialContainer.appendChild(newMaterialItem);
}
function addPhone() {
    const materialContainer = document.getElementById('telefoon');
    const newMaterialItem = document.createElement('div');
    newMaterialItem.classList.add('telefoon-item');
    newMaterialItem.innerHTML = `
    <input type="text" autocomplete="off" placeholder="(0345) 512 673" name="telefoon[]">
    <select class="selectmenu" name="title1" required>
        <option value="mvr">n.v.t</option>
        <option value="dhr">Dhr.</option>
        <option value="mvr">Mvr.</option>
    </select>
    `;
    materialContainer.appendChild(newMaterialItem);
}
function addFileInput() {
    const fileInputContainer = document.getElementById('image').parentNode;
    const newFileInput = document.createElement('input');
    newFileInput.type = 'file';
    newFileInput.name = 'image[]';
    fileInputContainer.appendChild(newFileInput);
}

var suggestionSet = false;

// Function to set the suggestion
function setSuggestion() {
    // Get the current date
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // January is 0
    var year = currentDate.getFullYear();
    var formattedDate = day + '-' + month + '-' + year;

    // Set the value of the input field only if suggestion hasn't been set yet
    if (!suggestionSet) {
        document.getElementById('date').value = formattedDate;
        suggestionSet = true;
    }
}

// Call the function to set the suggestion when the page loads
window.onload = setSuggestion;