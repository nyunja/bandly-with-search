document.addEventListener('DOMContentLoaded', document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const suggestionsBox = document.getElementById('suggestions');

    async function fetchData() {
        try {
            const response = await fetch('https://groupietrackers.herokuapp.com/api/artists');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            return [];
        }
    }

    async function performSearch() {
        const query = input.value.toLowerCase();
        if (!query) {
            suggestionsBox.innerHTML = '';
            return;
        }

        const artistsData = await fetchData();
        const matches = artistsData.filter(artist => 
            artist.Name.toLowerCase().includes(query) ||
            artist.Members.some(member => member.toLowerCase().includes(query)) ||
            artist.Locations.toLowerCase().includes(query) ||
            artist.ConcertDates.toLowerCase().includes(query) ||
            artist.Relations.toLowerCase().includes(query)
        );

        suggestionsBox.innerHTML = matches.map(match =>
            `<div class="suggestion-item">${match.Name} - ${match.Locations}</div>`
        ).join('');

        document.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                input.value = item.textContent.split(' - ')[0];
                suggestionsBox.innerHTML = '';
            });
        });
    }

    searchBtn.addEventListener('click', performSearch);

    // Handle 'input' events for real-time suggestions
    let debounceTimeout;
    input.addEventListener('input', async () => {
        const query = input.value.toLowerCase();
        if (!query) {
            suggestionsBox.innerHTML = '';
            return;
        }

        // Debounce the input event to avoid excessive API calls
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(async () => {
            const artistsData = await fetchData();
            const matches = artistsData.filter(artist => 
                artist.Name.toLowerCase().includes(query) ||
                artist.Members.some(member => member.toLowerCase().includes(query)) ||
                artist.Locations.toLowerCase().includes(query) ||
                artist.ConcertDates.toLowerCase().includes(query) ||
                artist.Relations.toLowerCase().includes(query)
            );

            suggestionsBox.innerHTML = matches.map(match =>
                `<div class="suggestion-item">${match.Name} - ${match.Locations}</div>`
            ).join('');

            document.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    input.value = item.textContent.split(' - ')[0];
                    suggestionsBox.innerHTML = '';
                });
            });
        }, 300); // Adjust the debounce delay as needed
    });
}));

document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search-input').value.toLowerCase();
    const artists = document.querySelectorAll('.card-item');

    artists.forEach(function(artist) {
        const name = artist.querySelector('.card-title').textContent.toLowerCase();
        const locations = artist.querySelector('.card-description').textContent.toLowerCase();
        const firstAlbum = artist.querySelector('.card-description').textContent.toLowerCase();
        const creationDate = artist.querySelector('.card-creation-date').textContent.toLowerCase();

        if (name.includes(query) || locations.includes(query) || firstAlbum.includes(query) || creationDate.includes(query)) {
            artist.style.display = 'block';
        } else {
            artist.style.display = 'none';
        }
    });
});

document.getElementById('search-input').addEventListener('keyup', function() {
    const query = this.value.toLowerCase();
    const artists = document.querySelectorAll('.card-item');

    artists.forEach(function(artist) {
        const name = artist.querySelector('.card-title').textContent.toLowerCase();
        const locations = artist.querySelector('.card-description').textContent.toLowerCase();
        const firstAlbum = artist.querySelector('.card-description').textContent.toLowerCase();
        const creationDate = artist.querySelector('.card-creation-date').textContent.toLowerCase();

        if (name.includes(query) || locations.includes(query) || firstAlbum.includes(query) || creationDate.includes(query)) {
            artist.style.display = 'block';
        } else {
            artist.style.display = 'none';
        }
    });
});