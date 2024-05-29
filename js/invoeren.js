window.addEventListener('load', function () {
    var canvas = document.getElementById('signature-pad');
    var context = canvas.getContext('2d');
    var isSigned = false; // Flag to track if the canvas has been signed

    // Set up canvas event listeners to detect drawing
    canvas.addEventListener('mousedown', () => { isSigned = true; });
    canvas.addEventListener('touchstart', () => { isSigned = true; });

    function runOnOpslaanClick() {
        const popup = document.querySelector('.notification-popup');
        if (!isSigned) {
            alert('Please sign before submitting the form.');
            return; // Exit the function to prevent further actions
        }

        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show');
        }, 1700);

        setTimeout(() => {
            window.location.replace("invoeren.html");
        }, 2000);
    }

    // Attach the click event to the "Opslaan" button
    const opslaanButton = document.getElementById('opslaanbutton');
    opslaanButton.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the default form submission
        runOnOpslaanClick();
    });

    // Initialize Google Maps Places Autocomplete
    initialize();

    // Set the initial date suggestion
    setSuggestion();

    // Initialize file upload handlers
    const container = document.getElementById('file-upload-container');
    window.addFileInput = function () {
        const fileInputContainer = document.createElement('div');
        fileInputContainer.className = 'file-input-container';
        const uniqueId = 'file-' + Math.random().toString(36).substr(2, 9);
        fileInputContainer.innerHTML = `
            <input type="file" id="${uniqueId}" required name="image[]" class="file-input" hidden onchange="updateFileDetails(this)">
            <label for="${uniqueId}" class="file-display">
                <svg class="paperclip-icon h-4 w-4 flex-shrink-0 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M15.621 4.379a3 3 0 00-4.242 0l-7 7a3 3 0 004.241 4.243h.001l.497-.5a.75.75 0 011.064 1.057l-.498.501-.002.002a4.5 4.5 0 01-6.364-6.364l7-7a4.5 4.5 0 016.368 6.36l-3.455 3.553A2.625 2.625 0 119.52 9.52l3.45-3.451a.75.75 0 111.061 1.06l-3.45 3.451a1.125 1.125 0 001.587 1.595l3.454-3.553a3 3 0 000-4.242z" clip-rule="evenodd" />
                </svg>
                <span class="file-name">Geen bestand gekozen</span>
                <span class="file-size"></span>
            </label>
            <button type="button" class="delete-btn" onclick="removeFileInput(this)">verwijderen</button>
        `;
        container.appendChild(fileInputContainer);
    };

    window.updateFileDetails = function (input) {
        const fileDisplay = input.nextElementSibling;
        const fileNameSpan = fileDisplay.querySelector('.file-name');
        const fileSizeSpan = fileDisplay.querySelector('.file-size');

        if (input.files.length > 0) {
            const file = input.files[0];
            const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + ' MB';
            fileNameSpan.textContent = file.name;
            fileSizeSpan.textContent = fileSizeMB;
        } else {
            fileNameSpan.textContent = 'Geen bestand gekozen';
            fileSizeSpan.textContent = '';
        }
    };

    window.removeFileInput = function (button) {
        button.closest('.file-input-container').remove();
    };

    // Add initial file input on load
    addFileInput();
});

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
    const phoneContainer = document.getElementById('telefoon');
    const newPhoneItem = document.createElement('div');
    newPhoneItem.classList.add('telefoon-item');
    newPhoneItem.innerHTML = `
        <input type="text" autocomplete="off" placeholder="(0345) 512 673" name="telefoon[]">
        <select class="selectmenu" name="title1" required>
            <option value="mvr">n.v.t</option>
            <option value="dhr">Dhr.</option>
            <option value="mvr">Mvr.</option>
        </select>
    `;
    phoneContainer.appendChild(newPhoneItem);
}

var suggestionSet = false;

function setSuggestion() {
    var currentDate = new Date();
    var day = currentDate.getDate();
    var month = currentDate.getMonth() + 1; // January is 0
    var year = currentDate.getFullYear();
    var formattedDate = day + '-' + month + '-' + year;

    if (!suggestionSet) {
        document.getElementById('date').value = formattedDate;
        suggestionSet = true;
    }
}

var hasMadeAutocompleteSelection = false;

function initialize() {
    var input = document.getElementById('hidden');
    var options = {
        types: ['address'],
        componentRestrictions: { country: 'nl' }
    };
    var autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', function () {
        hasMadeAutocompleteSelection = true;
        var place = autocomplete.getPlace();

        if (!place.geometry) {
            showMessage("Geen plaatsgegevens gevonden.", 'error');
            return;
        }

        validateAddress(place);
    });

    input.addEventListener('input', function () {
        if (hasMadeAutocompleteSelection) {
            validateManualInput(input.value);
        }
    });
}

function validateAddress(place) {
    var streetNumber = getComponent(place, 'street_number');
    var route = getComponent(place, 'route');
    var postalCode = getComponent(place, 'postal_code');
    var locality = getComponent(place, 'locality');
    var country = getComponent(place, 'country');
    var street_number = getComponent(place, 'street_number');


    var address = `${route} ${streetNumber}, ${postalCode} ${locality}, ${country}`;
    document.getElementById('hidden').value = address;

    var streetNumberRegex = /\b\d+([a-zA-Z\-]?[a-zA-Z0-9]*)?\b/;
    var streetNumberMatch = street_number.match(streetNumberRegex);

    if (!streetNumberMatch) {
        showMessage("Let op: er is nog geen huisnummer geselecteerd.", 'error');
        console.log("ERROR 1: Er is geen huisnummer geselecteerd")
    } else if (!validatePostalCode(postalCode)){
        showMessage("De postcode is niet correct ingevuld (vereist formaat: 1234 AB).", 'error');
        console.log("ERROR 2: De postcode is niet correct ingevuld")
    } else {
        showMessage("", 'clear');
    }
}

function validateManualInput(inputValue) {
    var postalCodeRegex = /\b\d{4}\s?[A-Z]{2}\b/i;
    var streetNumberRegex = /\b\d+([a-zA-Z\-]?[a-zA-Z0-9]*)?\b/;
    var postalCodeMatch = inputValue.match(postalCodeRegex);
    var streetNumberMatch = inputValue.match(streetNumberRegex);
    var isValidPostalCode = postalCodeMatch && (inputValue[postalCodeMatch.index + postalCodeMatch[0].length] === ' ' || postalCodeMatch.index + postalCodeMatch[0].length === inputValue.length);
    var isValidStreetNumber = streetNumberMatch && (!postalCodeMatch || postalCodeMatch.index > streetNumberMatch.index);

    if (!isValidStreetNumber) {
        showMessage("Let op: er is nog geen huisnummer geselecteerd.", 'error');
        console.log("ERROR 3: Er is geen huisnummer ingevuld (manual input)")

    } else if (!isValidPostalCode) {
        showMessage("De postcode is niet correct ingevuld (vereist formaat: 1234 AB).", 'error');
        console.log("ERROR 4: De postcode is niet correct ingevuld (manual input)")
    } else {
        showMessage("", 'clear');
    }
}

function showMessage(message, type) {
    var messageContainer = document.getElementById('messageContainer');
    var inputField = document.querySelector('.errorfield');
    
    messageContainer.textContent = message;
    messageContainer.style.display = message ? 'block' : 'none';
    messageContainer.style.color = type === 'error' ? 'red' : 'black';

    if (type === 'error') {
        inputField.classList.add('error');
    } else {
        inputField.classList.remove('error');
    }

    console.log("Displaying message:", message);
}

function validatePostalCode(postalCode) {
    var validPostalCodePattern = /^\d{4}\s?[A-Z]{2}$/i;
    return validPostalCodePattern.test(postalCode);
}

function getComponent(place, type) {
    var component = place.address_components.find(c => c.types.includes(type));
    return component ? component.long_name : '';
}
document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById('signature-pad');
    var context = canvas.getContext('2d');
    canvas.style.width ='100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = 200;

    var drawing = false;
    var lastX = 0;
    var lastY = 0;
    var isSigned = false;  // Flag to indicate whether the canvas has been signed

    function draw(x, y) {
        if (!drawing) return;
        context.beginPath();
        context.moveTo(lastX, lastY);
        context.lineTo(x, y);
        context.stroke();
        lastX = x;
        lastY = y;
        isSigned = true;  // Set the flag to true once the user draws
    }

    function startDrawing(e) {
        drawing = true;
        lastX = e.offsetX;
        lastY = e.offsetY;
    }

    function stopDrawing() {
        drawing = false;
    }

    // Event listeners for mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', (e) => draw(e.offsetX, e.offsetY));
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Event listeners for touch
    canvas.addEventListener('touchstart', (e) => {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousedown", { clientX: touch.clientX, clientY: touch.clientY });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    });

    canvas.addEventListener('touchmove', (e) => {
        var touch = e.touches[0];
        var mouseEvent = new MouseEvent("mousemove", { clientX: touch.clientX, clientY: touch.clientY });
        canvas.dispatchEvent(mouseEvent);
        e.preventDefault();
    });

    canvas.addEventListener('touchend', (e) => {
        var mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });

    // Clear button functionality
    document.getElementById('clear').addEventListener('click', () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
        isSigned = false;  // Reset the flag when the canvas is cleared
    });

    // Checking the signature before submitting
    document.getElementById('opslaanbutton').addEventListener('click', function(event) {
        if (!isSigned) {
            event.preventDefault(); // Stop form submission
        } else {
            var dataURL = canvas.toDataURL('image/png');
            var link = document.createElement('a');
            link.download = 'signature.png';
            link.href = dataURL;
            link.click();
        }
    });
});
