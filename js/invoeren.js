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

var hasMadeAutocompleteSelection = false;

function initialize() {
    var input = document.getElementById('hidden'); // Ensure this ID matches the HTML input field for address
    var messageContainer = document.getElementById('messageContainer'); // Ensure this container exists in your HTML
    var options = {
        types: ['address'],
        componentRestrictions: {country: 'nl'}
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);

    // Event listener for Autocomplete selection
    autocomplete.addListener('place_changed', function() {
        hasMadeAutocompleteSelection = true; // User has made a selection
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            console.log("[INFO] No place data was found for this place");
            showMessage("Geen plaatsgegevens gevonden.", 'error');
            return;
        }
        validateAddress(place); // Validate the place object from Autocomplete
    });

    // Event listener for manual input changes
    input.addEventListener('input', function() {
        // Delay validation until after an initial selection from Autocomplete
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

    var address = `${route} ${streetNumber}, ${postalCode} ${locality}, ${country}`;
    document.getElementById('hidden').value = address; // Update the input field with the formatted address

    // Additional validation logic here, for example, validate postal code
    if (!validatePostalCode(postalCode)) {
        showMessage("Let op: de postcode is niet correct ingevuld.", 'error');
    } else {
        showMessage("", 'clear');
    }
}

function validateManualInput(inputValue) {
    console.log("Validating input:", inputValue);

    // Regex patterns for Dutch postal codes and street numbers
    var postalCodeRegex = /\b\d{4}\s?[A-Z]{2}\b/i;
    var streetNumberRegex = /\b\d+\b/; // Matches any sequence of digits in the string

    // Attempt to find matches in the input value
    var postalCodeMatch = inputValue.match(postalCodeRegex);
    var streetNumberMatch = inputValue.match(streetNumberRegex);

    console.log("Postal code match:", postalCodeMatch);
    console.log("Street number match:", streetNumberMatch);

    // Determine the validity of the postal code and street number
    var isValidPostalCode = postalCodeMatch && (inputValue[postalCodeMatch.index + postalCodeMatch[0].length] === ' ' || postalCodeMatch.index + postalCodeMatch[0].length === inputValue.length);
    var isValidStreetNumber = streetNumberMatch && (!postalCodeMatch || postalCodeMatch.index > streetNumberMatch.index);

    // First check for valid street number
    if (!isValidStreetNumber) {
        showMessage("Let op: er is nog geen huisnummer geselecteerd.", 'error');
    } else if (!isValidPostalCode) { // Only check for postal code if street number is valid
        showMessage("De postcode is niet correct ingevuld (vereist formaat: 1234 AB).", 'error');
    } else {
        // If both are valid, clear any previous messages
        showMessage("", 'clear');
    }
}

function showMessage(message, type) {
    var messageContainer = document.getElementById('messageContainer');
    messageContainer.textContent = message;
    messageContainer.style.display = message ? 'block' : 'none';
    messageContainer.style.color = type === 'error' ? 'red' : 'black';
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

document.addEventListener('DOMContentLoaded', initialize);