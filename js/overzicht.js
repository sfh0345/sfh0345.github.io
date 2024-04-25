document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const loadMoreButton = document.getElementById('loadMore');

    loadCards();
    loadMoreButton.addEventListener('click', loadCards);

    // Event listener for the search button click
    searchButton.addEventListener('click', function() {
        filterCards(searchInput.value);
    });

    // Event listener for the 'Enter' key in the search input field
    searchInput.addEventListener('keyup', function(event) {
        if (event.key === "Enter") {
            filterCards(this.value);
        }
    });
});

function loadCards() {
    const container = document.querySelector('.card-container');
    for (let i = 0; i < 10; i++) {
        container.appendChild(createCard(`Name ${i}`, `Description for Name ${i}`, `Address ${i}`, '../assets/Barcode.png/'));
    }
}

function createCard(name, description, address, imageUrl) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <div>
            <h2>${name}</h2>
            <p>${description}</p>
            <p>${address}</p>
        </div>
        <img src="${imageUrl}" alt="Photo of ${name}">
    `;
    return card;
}

function filterCards(searchText) {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const name = card.querySelector('h2').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        if (name.includes(searchText.toLowerCase()) || description.includes(searchText.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}
