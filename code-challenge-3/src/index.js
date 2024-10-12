document.addEventListener("DOMContentLoaded", () => {
  const filmsList = document.getElementById('films');
  const movieDetails = document.getElementById('movie-details');
  const buyTicketButton = document.getElementById('buy-ticket');
  const filmTitle = document.getElementById('film-title');
  const filmRuntime = document.getElementById('film-runtime');
  const filmShowtime = document.getElementById('film-showtime');
  const filmPoster = document.getElementById('film-poster');
  const availableTickets = document.getElementById('available-tickets');

  function fetchFilms() {
    fetch("http://localhost:3000/films")
      .then(response => response.json())
      .then(films => {
        films.forEach(film => {
          const li = document.createElement('li');
          li.className = 'film item';
          li.innerText = film.title;
          li.addEventListener('click', () => loadFilmDetails(film));
          filmsList.appendChild(li);
        });
      });
  }

  function loadFilmDetails(film) {
    filmTitle.innerText = film.title;
    filmRuntime.innerText = `${film.runtime} minutes`;
    filmShowtime.innerText = film.showtime;
    filmPoster.src = film.poster;
    const ticketsAvailable = film.capacity - film.tickets_sold;
    availableTickets.innerText = `Available Tickets: ${ticketsAvailable}`;
    buyTicketButton.disabled = ticketsAvailable === 0;
    buyTicketButton.onclick = () => buyTicket(film);
  }

  function buyTicket(film) {
    const currentTicketsSold = film.tickets_sold;
    if (currentTicketsSold < film.capacity) {
      const updatedTicketsSold = currentTicketsSold + 1;
      fetch(`http://localhost:3000/films/${film.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ tickets_sold: updatedTicketsSold })
      })
      .then(() => {
        availableTickets.innerText = `Available Tickets: ${film.capacity - updatedTicketsSold}`;
        buyTicketButton.disabled = updatedTicketsSold === film.capacity;
        if (updatedTicketsSold === film.capacity) {
          document.querySelector(`li:contains("${film.title}")`).classList.add('sold-out');
          buyTicketButton.innerText = 'Sold Out';
        }
      });
    }
  }

  fetchFilms();
  fetch("http://localhost:3000/films/1")
    .then(response => response.json())
    .then(loadFilmDetails);
});
