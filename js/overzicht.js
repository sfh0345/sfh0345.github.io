document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners and load initial cards
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const loadMoreButton = document.getElementById('loadMore');

    // Load initial cards
    loadCards();

    // Set up event listeners for load more, search button click, and enter key press
    loadMoreButton.addEventListener('click', loadCards);
    searchButton.addEventListener('click', function() {
        filterCards(searchInput.value);
    });
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === "Enter") {
            filterCards(searchInput.value);
        }
    });
});

function loadCards() {
    const container = document.querySelector('.card-container');
    // Clear existing cards before loading new ones if needed
    // container.innerHTML = '';
    for (let i = 0; i < 10; i++) {
        container.appendChild(createCard(`Name ${i}`, `Description for Name ${i}`, `Address ${i}`, '/../assets/Barcode.png/'));
    }
}

function createCard(name, description, address, imageUrl) {
    const card = document.createElement('a');
    card.className = 'card';
    card.href = "inzien.html";
    card.style.textDecoration = 'none';
    card.style.color = '#333';

    card.innerHTML = `
        <div class="card-content">
            <h2 class="card-name">${name}</h2>
            <p class="card-description">${description}</p>
            <p class="card-address">${address}</p>
        </div>
        <img src="${imageUrl}" alt="Photo of ${name}">
    `;
    return card;
}

function filterCards(searchText) {
    const cards = document.querySelectorAll('.card');
    searchText = searchText.toLowerCase(); // To avoid multiple toLowerCase conversions

    cards.forEach(card => {
        const name = card.querySelector('.card-name').textContent.toLowerCase();
        const description = card.querySelector('.card-description').textContent.toLowerCase();
        const address = card.querySelector('.card-address').textContent.toLowerCase();

        // Checking if the card should be displayed based on the search text
        const shouldDisplay = name.includes(searchText) || description.includes(searchText) || address.includes(searchText);
        card.style.display = shouldDisplay ? '' : 'none';
    });
}

// Event listeners for the search input and button
document.getElementById('searchButton').addEventListener('click', () => {
    const searchText = document.getElementById('searchInput').value;
    filterCards(searchText);
});

document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchText = e.target.value;
        filterCards(searchText);
    }
});
document.getElementById("refreshButton").onclick = function() {
    document.getElementById("dropdownMenu").classList.toggle("show");
};

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('#dotsButton')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
};