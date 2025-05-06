const moviejson = "http://localhost:8081/api/movies/movie";
const upcomingjson = "http://localhost:8081/api/movies/upcoming";
const tvseriesjson = "http://localhost:8081/api/movies/series";

// Fetch upcoming movies (upcomingHtml)
fetch(upcomingjson)
  .then(response => response.json())
  .then(data => {
    let upcomingHtml = '';
    data.forEach(movie => {
      upcomingHtml += `
        <li class="card">
          <div class="img">
            <a href="movie-detail.html?imdbId=${movie.imdbId}"><img src="${movie.poster}" alt="" /></a>
          </div>
          <div class="title">
            <a href="movie-detail.html?imdbId=${movie.imdbId}"><h4>${movie.title}</h4></a>
            <span>${movie.releaseDate}</span>
          </div>
          <div class="footer">
            <span>HD</span>
            <div class="time-rating">
              <span><i class="fa-regular fa-clock"></i> 137 min</span>
              <span><i class="fa-solid fa-star"></i> 8.5</span>
            </div>
          </div>
        </li>`;
    });
    const movieCarousel = document.getElementById('movie-carousel');
    if (movieCarousel) {
      movieCarousel.innerHTML = upcomingHtml;
      setupCarousel();
    } else {
      console.error("Không tìm thấy phần tử #movie-carousel");
    }
  })
  .catch(error => console.error("Lỗi khi lấy upcoming:", error));

  fetch(moviejson)
  .then(response => response.json())
  .then(data => {
    let topHtml = '';
    localStorage.setItem('movies', JSON.stringify(data));

    const maxToShow = 4;
    const limitedMovies = data.slice(0, maxToShow);

    limitedMovies.forEach((movie, index) => {
      const isLastVisible = index === limitedMovies.length - 1;
      topHtml += `
        <li class="card">
          <div class="img">
            <a href="movie-detail.html?imdbId=${movie.imdbId}"><img src="${movie.poster}" alt="" /></a>
          </div>
          <div class="title">
            <a href="movie-detail.html?imdbId=${movie.imdbId}"><h4>${movie.title}</h4></a>
            <span>${movie.releaseDate}</span>
          </div>
          <div class="footer">
            <span>2K</span>
            <div class="time-rating">
              <span><i class="fa-regular fa-clock"></i> 122 min</span>
              <span><i class="fa-solid fa-star"></i> 7.8</span>
            </div>
          </div>
          ${isLastVisible ? `<div class="view-more-text"><a href="http://localhost:8081/movies.html">Xem thêm &raquo;</a></div>` : ''}
        </li>`;
    });

    document.getElementById('wrapper').innerHTML = topHtml;
  })
  .catch(error => console.error("Lỗi khi lấy movie:", error));

  fetch(tvseriesjson)
  .then(response => response.json())
  .then(data => {
    let tvHtml = '';
    const maxToShow = 4;
    const limitedSeries = data.slice(0, maxToShow);

    limitedSeries.forEach((movie, index) => {
      const isLastVisible = index === limitedSeries.length - 1;
      tvHtml += `
        <li class="card">
          <div class="img">
            <a href="movie-detail.html?imdbId=${movie.imdbId}"><img src="${movie.poster}" alt="" /></a>
          </div>
          <div class="title">
            <a href="movie-detail.html?imdbId=${movie.imdbId}"><h4>${movie.title}</h4></a>
            <span>${movie.releaseDate}</span>
          </div>
          <div class="footer">
            <span>2K</span>
            <div class="time-rating">
              <span><i class="fa-regular fa-clock"></i> 47 min</span>
              <span><i class="fa-solid fa-star"></i> 8.6</span>
            </div>
          </div>
          ${isLastVisible ? `<div class="view-more-text"><a href="http://localhost:8081/tvseries.html">Xem thêm &raquo;</a></div>` : ''}
        </li>`;
    });

    document.getElementById('wrapper2').innerHTML = tvHtml;
  })
  .catch(error => console.error("Lỗi khi lấy tvseries:", error));

// Function để setup carousel
function setupCarousel() {
  const wrapper = document.querySelector(".wrapper");
  const carousel = document.querySelector(".movie-carousel");

  if (!carousel) {
    console.error("Không tìm thấy .movie-carousel");
    return;
  }

  const firstCard = carousel.querySelector(".card");
  if (!firstCard) {
    console.error("Không có thẻ .card nào trong carousel");
    return;
  }

  const firstCardWidth = firstCard.offsetWidth;
  let isDragging = false,
    startX,
    startScrollLeft,
    timeoutId;

  let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);
  let carouselChildrens = [...carousel.children];

  carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
  });
  carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
  });

  carousel.classList.add("no-transition");
  carousel.scrollLeft = carousel.offsetWidth;
  carousel.classList.remove("no-transition");

  const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
  };

  const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
  };

  const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
  };

  const infiniteScroll = () => {
    if (carousel.scrollLeft === 0) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.scrollWidth - 2 * carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    } else if (
      Math.ceil(carousel.scrollLeft) ===
      carousel.scrollWidth - carousel.offsetWidth
    ) {
      carousel.classList.add("no-transition");
      carousel.scrollLeft = carousel.offsetWidth;
      carousel.classList.remove("no-transition");
    }
    clearTimeout(timeoutId);
    autoPlay();
  };

  const autoPlay = () => {
    if (window.innerWidth < 800) return;
    timeoutId = setTimeout(() => (carousel.scrollLeft += firstCardWidth), 2500);
  };

  autoPlay();

  carousel.addEventListener("mousedown", dragStart);
  carousel.addEventListener("mousemove", dragging);
  document.addEventListener("mouseup", dragStop);
  carousel.addEventListener("scroll", infiniteScroll);
}

// Back to top button
let backbtn = document.querySelector(".back-to-top");
if (backbtn) {
  window.addEventListener("scroll", () => {
    backbtn.classList.toggle("show", window.scrollY > 100);
  });

  backbtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}
