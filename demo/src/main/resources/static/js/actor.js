const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");

let hamburgerbtn = document.querySelector(".hamburger");
let nav_list = document.querySelector(".nav-list");
let closebtn = document.querySelector(".close");

hamburgerbtn.addEventListener("click", () => {
  nav_list.classList.add("active");
});
closebtn.addEventListener("click", () => {
  nav_list.classList.remove("active");
});

// Modal logic
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const signBtn = document.getElementById('signinBtn');

function openLoginModal() {
  loginModal.style.display = 'flex';
  registerModal.style.display = 'none';
}
function openRegisterModal() {
  registerModal.style.display = 'flex';
  loginModal.style.display = 'none';
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = 'none';
}
signBtn.addEventListener('click', openLoginModal);
window.addEventListener('click', function(event) {
  if (event.target === loginModal) {
    closeModal('loginModal');
  } else if (event.target === registerModal) {
    closeModal('registerModal');
  }
});

// Hiển thị thông tin diễn viên và phim
if (name) {
  fetch(`http://localhost:8081/api/actor/detail/${name}`)
    .then(response => response.json())
    .then(actor => {
      const detailHtml = `
        <img src="${actor.avatar}" alt="Ảnh diễn viên">
        <div class="bio">
          <h1>${actor.name}</h1>
          <p>${actor.nationality}</p>
          <p>${actor.birthDate}</p>
        </div>
      `;
      document.getElementById("profile").innerHTML = detailHtml;
    });

  let currentPage = 1;
  const moviesPerPage = 15;
  let allMovies = [];

  function renderMoviesPage(page) {
    const filmsList = document.getElementById("films-list");
    const start = (page - 1) * moviesPerPage;
    const end = start + moviesPerPage;
    const pageMovies = allMovies.slice(start, end);

    filmsList.innerHTML = pageMovies
      .map(
        (movie) => `
        <div class="film-card">
          <a href="movie-detail.html?imdbId=${movie.imdbId}">
            <img src="${movie.poster}" alt="${movie.title}">
            <h4>${movie.title}</h4>
            <h4>${movie.releaseDate}</h4>
          </a>
        </div>
      `
      )
      .join("");

    renderPagination();
  }

  function renderPagination() {
    const totalPages = Math.ceil(allMovies.length / moviesPerPage);
    let paginationHtml = "";

    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
        <button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>
      `;
    }

    const paginationContainer = document.getElementById("pagination");
    paginationContainer.innerHTML = paginationHtml;

    document.querySelectorAll(".pagination-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        currentPage = parseInt(btn.dataset.page);
        renderMoviesPage(currentPage);
      });
    });
  }

  fetch(`http://localhost:8081/api/actor/${name}/movies`)
    .then(response => response.json())
    .then(data => {
      allMovies = data;
      renderMoviesPage(currentPage);
    });
}
