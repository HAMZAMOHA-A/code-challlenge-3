// Fetch and display the first movie
fetch('http://localhost:3000/films/1')
    .then(response => {
        if (!response.ok) {
            throw new Error('Unable to respond');
        }
        return response.json();
    })
    .then(movie => {
        updateMovieDetails(movie);
    })
    .catch(error => {
        console.error('Error fetching the movie data:', error);
    });

// Load all movies when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    Films();
});

function Films() {
    fetch('http://localhost:3000/films')
        .then(response => response.json())
        .then(films => {
            const filmsList = document.getElementById('films');
            filmsList.innerHTML = '';

            for (const film of films) {
                const filmItem = createFilmItem(film);
                filmsList.appendChild(filmItem);
            }

            // Add event listeners for buy and delete buttons
            filmsList.querySelectorAll('.buy-ticket').forEach(button => {
                button.addEventListener('click', buyTicket);
            });

            filmsList.querySelectorAll('.delete-film').forEach(button => {
                button.addEventListener('click', deleteFilm);
            });
        });
}


// Create a list item for each film
function createFilmItem(film) {
    const filmLi = document.createElement('li');
    filmLi.className = 'film';
    filmLi.dataset.id = film.id;

    const titleSpan = document.createElement('span');
    titleSpan.innerText = film.title;

    const buyButton = document.createElement('button');
    buyButton.className = 'buy-ticket';
    buyButton.innerText = 'Buy Ticket';

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-film';
    deleteButton.innerText = 'Delete';

    filmLi.appendChild(titleSpan);
    filmLi.appendChild(buyButton);
    filmLi.appendChild(deleteButton);

    return filmLi;
}



// Update movie details in the DOM
function updateMovieDetails(movie) {
    document.getElementById('poster').src = movie.poster;
    document.getElementById('title').innerText = movie.title;
    document.getElementById('runtime').innerText = `${movie.runtime} minutes`; // Fixed template literal
    document.getElementById('showtime').innerText = movie.showtime;
    document.getElementById('ticket-num').innerText = movie.tickets_sold;
    document.getElementById('film-info').innerText = movie.description;
}


// Handle the 'Buy Ticket' button click
function buyTicket(event) {
    const filmLi = event.target.closest('li');
    const filmId = filmLi.dataset.id;
    const ticketsSold = parseInt(filmLi.dataset.ticketsSold);
    const capacity = parseInt(filmLi.dataset.capacity);

    if (ticketsSold < capacity) {
        const newTicketsSold = ticketsSold + 1;

        fetch(`http://localhost:3000/films/${filmId}`, { // Fixed to use template literals
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: newTicketsSold }),
        })
        .then(response => response.json())
        .then(updatedFilm => {
            filmLi.dataset.ticketsSold = updatedFilm.tickets_sold;
            updateMovieDetails(updatedFilm);

            if (updatedFilm.tickets_sold >= updatedFilm.capacity) {
                event.target.textContent = 'Sold Out';
                filmLi.classList.add('sold-out');
            }
        });
    } else {
        alert('Sold Out');
    }
}



// Handle the 'Delete' button click
function deleteFilm(event) {
    const filmLi = event.target.closest('li');
    const filmId = filmLi.dataset.id;

    fetch(`http://localhost:3000/films/${filmId}`, { // Fixed to use template literals
        method: 'DELETE',
    })
    .then(() => {
        filmLi.remove();
    })
    .catch(error => {
        console.error('Unable to delete the film:', error);
    });
}

