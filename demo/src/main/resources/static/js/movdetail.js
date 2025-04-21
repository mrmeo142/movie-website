const params = new URLSearchParams(window.location.search);
const imdbId = params.get("imdbId");

fetch(`http://localhost:8081/api/movies/detail/${imdbId}`)
  .then(response => response.json())
  .then(movie => {
    if (!movie) return;

    // Set background nếu có ảnh nền
    if (movie.backdrops && movie.backdrops.length > 0) {
      document.querySelector(".movie-detail").style.backgroundImage = `url(${movie.backdrops[0]})`;
    }

    // Tạo HTML genre
    const genreHtml = movie.genres.map(genre => `<a href="#">${genre}</a>`).join(", ");

    // Tạo HTML chi tiết
    const detailHtml = `
      <div class="main">
        <div class="img">
          <a href="#"><img src="${movie.poster}" alt=""></a>
          <i class="fa-regular fa-circle-play" id="trailerlink"></i>
        </div>
        <div class="content">
          <h4>${movie.title}</h4>
          <div class="detail-actions">
            <div class="badge-genre">
              <div class="badge">
                <span>PG 13</span>
                <span>HD</span>
              </div>
              <div class="genre">${genreHtml}</div>
            </div>
            <div class="date-time">
              <span><i class="fa-solid fa-calendar-days"></i> ${movie.releaseDate}</span>
              <span><i class="fa-regular fa-clock"></i> 115 min</span>
            </div>
            <div class="description"><p>${movie.description || 'No description available.'}</p></div>
            <div class="btn">
              <button id="watch-now-btn"><i class="fa-solid fa-play"></i> Watch Now</button>
            </div>
          </div>
        </div>
      </div>
      <div class="download-btn">
        <a href="${movie.poster}" download>Download <i class="fa-solid fa-download"></i></a>
      </div>

      <div id="youtube-popup" class="video-popup" style="display: none;">
        <div class="video-container">
          <span id="close-youtube" class="close-btn">×</span>
          <iframe id="youtube-iframe" width="100%" height="400" src="" frameborder="0"
            allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
    `;

    document.getElementById("movie-detail").innerHTML = detailHtml;

    // Trailer popup logic
    const trailerBtn = document.getElementById("trailerlink");
    const popup = document.getElementById("youtube-popup");
    const closeBtn = document.getElementById("close-youtube");
    const iframe = document.getElementById("youtube-iframe");

    if (trailerBtn && movie.trailerLink) {
      const youtubeId = new URL(movie.trailerLink).searchParams.get("v");
      trailerBtn.addEventListener("click", (e) => {
        e.preventDefault();
        iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=1`;
        popup.style.display = "flex";
      });
    }

    closeBtn?.addEventListener("click", () => {
      popup.style.display = "none";
      iframe.src = "";
    });

    popup.addEventListener("click", (e) => {
      if (e.target === popup) {
        popup.style.display = "none";
        iframe.src = "";
      }
    });

    // Watch now
    const watchBtn = document.getElementById("watch-now-btn");
    watchBtn?.addEventListener("click", () => {
      const frameSection = document.getElementById("movie-frame");
      const firstEpisodeLink = movie.movieLink[0];
      const videoId = `player-${Date.now()}`;

      frameSection.innerHTML = `
        <div class="video-player" style="text-align: center;">
          <video id="${videoId}" width="90%" height="600" controls style="display:block; margin: 0 auto;"></video>
        </div>

        <div id="episode-list" style="margin: 20px auto; text-align: center;">
          <h4 style="color:white;">Episodes:</h4>
          ${movie.movieLink.map((link, index) => `
            <button class="episode-btn" data-link="${link}" style="margin: 5px; padding: 8px 12px; background: #222; color: white; border: none; border-radius: 4px; cursor: pointer;">
              Tập ${index + 1}
            </button>
          `).join("")}
        </div>

        <div id="review-section" style="margin-top: 40px; background-color: #111; padding: 20px; border-radius: 10px; color: white;">
          <h3 style="margin-bottom: 10px; text-align: center;">Write a Review?</h3>
          <textarea id="review-input" rows="4" style="width: 100%; border-radius: 5px; padding: 10px;"></textarea>
          <button id="submit-review" style="margin-top: 10px; background-color: #00bfff; color: white; border: none; padding: 8px 16px; border-radius: 6px; cursor: pointer;">Submit</button>
          <div id="review-list" style="margin-top: 20px;"></div>
        </div>
      `;

      frameSection.scrollIntoView({ behavior: "smooth" });

      const video = document.getElementById(videoId);
      const loadVideo = (link) => {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(link);
          hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = link;
        } else {
          alert("Trình duyệt không hỗ trợ phát video HLS (.m3u8)");
        }
      };

      loadVideo(firstEpisodeLink);

      document.querySelectorAll(".episode-btn").forEach(button => {
        button.addEventListener("click", () => {
          loadVideo(button.dataset.link);
        });
      });

      // Reviews
      const reviewInput = document.getElementById("review-input");
      const submitReview = document.getElementById("submit-review");
      const reviewList = document.getElementById("review-list");

      const loadReviews = () => {
        fetch(`http://localhost:8081/api/reviews/${movie.imdbId}`)
          .then(res => res.json())
          .then(reviews => {
            reviewList.innerHTML = "";
            const MAX = 3;
            const total = reviews.length;

            const render = (count) => {
              reviewList.innerHTML = reviews.slice(0, count).map(r => `
                <div style="margin-bottom: 10px; border-bottom: 1px solid gray; padding-bottom: 5px;">
                  ${r.body}
                </div>
              `).join("");

              if (total > MAX) {
                const toggleBtn = document.createElement("button");
                toggleBtn.textContent = count > MAX ? "Thu gọn" : "Xem thêm";
                toggleBtn.style = "margin-top: 10px; background-color: #444; color: white; padding: 5px 10px; border: none; border-radius: 5px; cursor: pointer;";
                toggleBtn.addEventListener("click", () => {
                  if (toggleBtn.textContent === "Xem thêm") render(total);
                  else render(MAX);
                });
                reviewList.appendChild(toggleBtn);
              }
            };

            render(MAX);
          });
      };

      submitReview.addEventListener("click", () => {
        const body = reviewInput.value.trim();
        if (!body) return;

        fetch("http://localhost:8081/api/reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body, imdbId: movie.imdbId })
        })
        .then(res => res.json())
        .then(() => {
          reviewInput.value = "";
          loadReviews();
        });
      });

      loadReviews();
    });

    // 🔁 PHIM GỢI Ý
    fetch(`http://localhost:8081/api/movies`)
      .then(response => response.json())
      .then(data => {
        const relatedMovies = data.filter(m =>
          m.imdbId !== movie.imdbId &&
          m.genres?.some(g => movie.genres.includes(g))
        ).slice(0, 4);

        let recmtHtml = '';
        relatedMovies.forEach(m => {
          recmtHtml += `
            <li class="card">
              <div class="img">
                <a href="movie-detail.html?imdbId=${m.imdbId}"><img src="${m.poster}" alt="" /></a>
              </div>
              <div class="title">
                <a href="movie-detail.html?imdbId=${m.imdbId}"><h4>${m.title}</h4></a>
                <span>${m.releaseDate}</span>
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

        document.getElementById('movie-card').innerHTML = recmtHtml;
      })
      .catch(error => {
        console.error("Error fetching recommended movies:", error);
      });
  })
  .catch(error => {
    console.error("Error fetching movie data:", error);
  });
