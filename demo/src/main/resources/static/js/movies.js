let moviesData = [];
let currentPage = 1;
const moviesPerPage = 15;

window.addEventListener("DOMContentLoaded", () => {
  init(); // chạy khi DOM sẵn sàng
});

function init() {
  fetch("http://localhost:8081/api/movies/movie")
    .then(res => res.json())
    .then(data => {
      moviesData = data;
      populateYears();
      populateGenres();
      applyFiltersAndRender(); // render toàn bộ khi mới vào trang
    });

  const genreFilter = document.getElementById("genre-filter");
  const yearFilter = document.getElementById("year-filter");

  if (genreFilter && yearFilter) {
    genreFilter.addEventListener("change", () => {
      currentPage = 1;
      applyFiltersAndRender();
    });

    yearFilter.addEventListener("change", () => {
      currentPage = 1;
      applyFiltersAndRender();
    });
  }

  document.getElementById("search-input").addEventListener("input", async () => {
    const searchKeyword = document.getElementById("search-input").value.trim();
    if (searchKeyword === "") {
      fetch("http://localhost:8081/api/movies/movie")
        .then(res => res.json())
        .then(data => {
          moviesData = data;
          currentPage = 1;
          applyFiltersAndRender();
        });
    } else {
      try {
        const res = await fetch(`http://localhost:8081/api/movies/movie/search?query=${encodeURIComponent(searchKeyword)}`);
        const data = await res.json();
        moviesData = data; // cập nhật lại nguồn dữ liệu
        currentPage = 1;
        applyFiltersAndRender();
      } catch (err) {
        console.error("Lỗi tìm kiếm phim:", err);
      }
    }
  });
}

function applyFiltersAndRender() {
  const selectedGenre = document.getElementById("genre-filter").value;
  const selectedYear = document.getElementById("year-filter").value;

  const filtered = moviesData.filter(movie => {
    const matchesGenre = selectedGenre === "" || (movie.genres && movie.genres.includes(selectedGenre));
    const matchesYear = selectedYear === "" || (movie.releaseDate && movie.releaseDate.startsWith(selectedYear));
    return matchesGenre && matchesYear;
  });

  renderMovies(filtered);
  renderPagination(filtered.length);
}

function renderMovies(data) {
  const container = document.getElementById("movies-container");
  if (!container) return;

  const startIndex = (currentPage - 1) * moviesPerPage;
  const endIndex = startIndex + moviesPerPage;
  const currentMovies = data.slice(startIndex, endIndex);

  container.innerHTML = currentMovies.map(movie => `
    <div class="movie-card">
      <a href="movie-detail.html?imdbId=${movie.imdbId}">
        <img src="${movie.poster}" alt="${movie.title}">
        <h4>${movie.title}</h4>
        <span>${movie.releaseDate?.split("-")[0]}</span>
      </a>
    </div>
  `).join("");
}

function renderPagination(totalMovies) {
  const totalPages = Math.ceil(totalMovies / moviesPerPage);
  const paginationContainer = document.getElementById("pagination");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      applyFiltersAndRender();
    });
    paginationContainer.appendChild(btn);
  }
}

function populateYears() {
  const yearSelect = document.getElementById("year-filter");
  if (!yearSelect) return;

  const currentYear = new Date().getFullYear();
  for (let y = currentYear; y >= 1980; y--) {
    const option = document.createElement("option");
    option.value = y;
    option.textContent = y;
    yearSelect.appendChild(option);
  }
}

function populateGenres() {
  const genreSelect = document.getElementById("genre-filter");
  if (!genreSelect || moviesData.length === 0) return;

  const allGenres = new Set();

  moviesData.forEach(movie => {
    if (movie.genres && Array.isArray(movie.genres)) {
      movie.genres.forEach(genre => allGenres.add(genre));
    }
  });

  [...allGenres].sort().forEach(genre => {
    const option = document.createElement("option");
    option.value = genre;
    option.textContent = genre;
    genreSelect.appendChild(option);
  });
}
