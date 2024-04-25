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

function initialize() {
    var input = document.getElementById('hidden');
    var options = {
        types: ['address'],
        componentRestrictions: {country: 'nl'}
    };

    var autocomplete = new google.maps.places.Autocomplete(input, options);

    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            // Handle case where no place data is available
            console.log("[INFO] No place data was found for this place")
            return;
        }

        // Function to find a component and return its long name
        function getComponent(type) {
            var component = place.address_components.find(c => c.types.includes(type));
            return component ? component.long_name : '';
        }

        // Build the address according to the specified format
        var streetNumber = getComponent('street_number');
        var route = getComponent('route');
        var postalCode = getComponent('postal_code');  // Correct type for full postal code
        var locality = getComponent('locality');
        var country = getComponent('country');

        var validPostalCode = /^[0-9]{4}\s?[A-Z]{2}$/i; // Regex for Dutch postal code: four digits followed by two letters

        if (!validPostalCode.test(postalCode)) {
            showMessage("Let op: de postcode is niet automatisch correct ingevuld. \nBij sommige adressen moet dit handmatig", 'error');
            console.log("[INFO] postcode not correct")
        }
        


        if (!getComponent('street_number')) {
            var formattedAddress = `${route}, ${postalCode} ${locality}, ${country}`;
            console.log("[INFO] no street number found on ", formattedAddress)
            showMessage("Let op: er is nog geen huisnummer geselecteerd", 'error');

        }
        else {
            var formattedAddress = `${route} ${streetNumber}, ${postalCode} ${locality}, ${country}`;
        }

        if (!getComponent('street_number') && !validPostalCode.test(postalCode)) {
            showMessage("Let op: de postcode en het huisnummer zijn niet automatisch correct ingevuld", 'error');
            console.log("[INFO] postcode and street number are not correct")
        }


        
        input.value = formattedAddress;  // Set the formatted address into the input field
    });
}

document.addEventListener('DOMContentLoaded', initialize);


function showMessage(message, type) {
    if (type === 'error') {
        messageContainer.innerHTML = `<h6 style="margin: 0; line-height: 1; font-family: Rubik light; color: #f44336; margin-top: -5px; margin-bottom: 30px;">${message}</h6>`;
    } else {
        messageContainer.innerHTML = "";
    }
}

function getComponent(type) {
    return place.address_components.find(component => component.types.includes(type)) || {};
}