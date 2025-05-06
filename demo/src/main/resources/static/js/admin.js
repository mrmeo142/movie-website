
document.addEventListener("DOMContentLoaded", function () {
    initMovieManagement();
    initActorManagement();
    initAdminManagement();
    
});
function initMovieManagement() {
    const navItems = document.querySelectorAll('.nav li');
    const contentSections = document.querySelectorAll('.content-section');
    const searchInput = document.querySelector('.search-bar input');
    const tableBody = document.getElementById('productTableBody');
    const pagination = document.getElementById('pagination');
    const filterButtonsContainer = document.querySelector('.filter-buttons');

    let movies = [];
    let filteredMovies = [];
    const itemsPerPage = 5;
    let currentPage = 1;
    let isSubmitting = false; // Trạng thái để ngăn gửi nhiều yêu cầu

    const currentFilters = {
        movieType: 'all',
        genre: 'all',
        year: 'all',
        search: ''
    };

    // --- Hàm chuyển tab ---
    function switchTab(tabIndex) {
        navItems.forEach(item => item.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));

        navItems[tabIndex].classList.add('active');
        contentSections[tabIndex].classList.add('active');
    }

    // --- Hàm render bảng phim ---
    function renderTable(moviesList, page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const moviesToShow = moviesList.slice(start, end);

        let tableHtml = '';
        moviesToShow.forEach((movie, index) => {
            const genreHtml = (movie.genres || []).map(g => `<a href="#">${g}</a>`).join(", ");
            tableHtml += `
                <tr>
                    <td>${start + index + 1}</td>
                    <td>${movie.title}</td>
                    <td>${genreHtml}</td>
                    <td>${movie.releaseDate}</td>
                    <td>
                        <button class="action-btn edit"><i class="fas fa-edit"></i></button>
                        <button class="action-btn delete"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
        tableBody.innerHTML = tableHtml;
    }

    // --- Hàm render nút phân trang ---
    function renderPagination(moviesList, page) {
        const totalPages = Math.ceil(moviesList.length / itemsPerPage);
        pagination.innerHTML = ''; // Xóa danh sách phân trang hiện tại
    
        // Tính toán các nút phân trang để hiển thị (tối đa 5 nút)
        const maxButtons = 5;
        let startPage = Math.max(1, page - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }
    
        // Thêm nút "Trước"
        if (page > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.textContent = '<';
            prevBtn.classList.add('page-btn', 'prev-btn');
            prevBtn.addEventListener('click', () => {
                currentPage = page - 1;
                renderTable(moviesList, currentPage);
                renderPagination(moviesList, currentPage);
            });
            pagination.appendChild(prevBtn);
        }
    
        // Thêm các nút trang
        for (let i = startPage; i <= endPage; i++) {
            const btn = document.createElement('button');
            btn.textContent = i;
            btn.classList.add('page-btn');
            if (i === page) btn.classList.add('active');
            btn.addEventListener('click', () => {
                currentPage = i;
                renderTable(moviesList, currentPage);
                renderPagination(moviesList, currentPage);
            });
            pagination.appendChild(btn);
        }
    
        // Thêm nút "Tiến"
        if (page < totalPages) {
            const nextBtn = document.createElement('button');
            nextBtn.textContent = '>';
            nextBtn.classList.add('page-btn', 'next-btn');
            nextBtn.addEventListener('click', () => {
                currentPage = page + 1;
                renderTable(moviesList, currentPage);
                renderPagination(moviesList, currentPage);
            });
            pagination.appendChild(nextBtn);
        }
    }
    

    // --- Hàm tìm kiếm phim ---
    function searchMovies(keyword) {
        currentFilters.search = keyword.trim().toLowerCase();
        applyFilters();
    }

    // --- Hàm áp dụng tất cả bộ lọc ---
    function applyFilters() {
        let filtered = [...movies];

        // Loại phim
        if (currentFilters.movieType !== 'all') {
            filtered = filtered.filter(movie => {
                const linkCount = movie.movieLink?.length || 0;
                if (currentFilters.movieType === 'upcoming') return linkCount === 0;
                if (currentFilters.movieType === 'movie') return linkCount === 1;
                if (currentFilters.movieType === 'tvSeries') return linkCount > 1;
                return true;
            });
        }

        // Thể loại
        if (currentFilters.genre !== 'all') {
            filtered = filtered.filter(movie => (movie.genres || []).includes(currentFilters.genre));
        }

        // Năm phát hành
        if (currentFilters.year !== 'all') {
            filtered = filtered.filter(movie => {
                if (!movie.releaseDate) return false;
                const year = new Date(movie.releaseDate).getFullYear();
                return String(year) === currentFilters.year;
            });
        }

        // Tìm kiếm
        if (currentFilters.search) {
            filtered = filtered.filter(movie => movie.title.toLowerCase().includes(currentFilters.search));
        }

        filteredMovies = filtered;
        currentPage = 1;
        renderTable(filteredMovies, currentPage);
        renderPagination(filteredMovies, currentPage);
    }

    // --- Hàm populate dropdown filter ---
    function populateDropdowns() {
        const movieTypeDropdown = document.querySelector('.filter-dropdown:nth-child(1) .dropdown-content');
        const genreDropdown = document.querySelector('.filter-dropdown:nth-child(2) .dropdown-content');
        const yearDropdown = document.querySelector('.filter-dropdown:nth-child(3) .dropdown-content');

        const genresSet = new Set();
        const yearsSet = new Set();

        movies.forEach(movie => {
            (movie.genres || []).forEach(genre => genresSet.add(genre));
            if (movie.releaseDate) {
                yearsSet.add(new Date(movie.releaseDate).getFullYear());
            }
        });

        // Loại phim
        movieTypeDropdown.innerHTML = `
            <a href="#" data-filter-type="movieType" data-value="all">Tất cả</a>
            <a href="#" data-filter-type="movieType" data-value="upcoming">Sắp chiếu</a>
            <a href="#" data-filter-type="movieType" data-value="movie">Phim lẻ</a>
            <a href="#" data-filter-type="movieType" data-value="tvSeries">Phim bộ</a>
        `;

        // Thể loại
        genreDropdown.innerHTML = '<a href="#" data-filter-type="genre" data-value="all">Tất cả</a>';
        Array.from(genresSet).sort().forEach(genre => {
            genreDropdown.innerHTML += `<a href="#" data-filter-type="genre" data-value="${genre}">${genre}</a>`;
        });

        // Năm
        yearDropdown.innerHTML = '<a href="#" data-filter-type="year" data-value="all">Tất cả</a>';
        Array.from(yearsSet).sort((a, b) => b - a).forEach(year => {
            yearDropdown.innerHTML += `<a href="#" data-filter-type="year" data-value="${year}">${year}</a>`;
        });
    }

    // --- Sự kiện click filter ---
    function setupFilterClick() {
        filterButtonsContainer.addEventListener('click', function(event) {
            if (event.target.tagName.toLowerCase() === 'a') {
                const filterType = event.target.dataset.filterType;
                const value = event.target.dataset.value;

                if (filterType && value !== undefined) {
                    currentFilters[filterType] = value;
                    applyFilters();
                }
            }
        });
    }
    // --- Fetch dữ liệu phim từ API ---
    fetch('http://localhost:8081/api/movies')
    .then(response => response.json())
    .then(data => {
        movies = data;
        localStorage.setItem('movies', JSON.stringify(data));
        filteredMovies = [...movies];

        populateDropdowns();
        renderTable(filteredMovies, currentPage);
        renderPagination(filteredMovies, currentPage);
    })
    .catch(error => {
        console.error('Lỗi khi fetch phim:', error);
    });
    
    // --- Sự kiện tìm kiếm ---
    searchInput.addEventListener('input', function() {
        searchMovies(this.value);
    });

    // --- Sự kiện click các tab ---
    navItems.forEach((item, index) => {
        if (index === navItems.length - 1) {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const confirmed = confirm('Bạn có chắc chắn muốn đăng xuất?');
                if (confirmed) {
                    localStorage.removeItem('loggedInUser');
                    window.location.href = 'index.html';
                }
            });
        } else {
            item.addEventListener('click', function() {
                switchTab(index);
            });
        }
    });
    
    // --- Mặc định mở tab Dashboard ---
    switchTab(0);

    // --- Modal mở/đóng ---
    function openModal(modalId) {
        const modal = document.getElementById(modalId);
        modal.classList.add('show');
    }

    function closeModal(modalElement) {
        modalElement.classList.remove('show');
    }

    window.onclick = function(event) {
        document.querySelectorAll('.modal').forEach(modal => {
            if (event.target === modal) {
                closeModal(modal);
            }
        });
    }    

    document.querySelector('.addactor-btn')?.addEventListener('click', function() {
        document.getElementById('addActorModal').classList.add('show');
    });

    document.querySelector('.add-btn')?.addEventListener('click', function() {
        document.getElementById('addMovieModal').classList.add('show');
    });

    document.querySelector('.addadmin-btn')?.addEventListener('click', function() {
        document.getElementById('addUserModal').classList.add('show');
    });

    document.querySelectorAll('.cancel-btn, .close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                // Đóng modal và reset lại nội dung nếu cần
                closeModal(modal);
                resetModalContent(modal); // Hàm reset nội dung modal nếu cần
            }
        });
    });

    // Hàm reset lại nội dung modal khi đóng
    function resetModalContent(modal) {
        const modalId = modal.id;
        if (modalId === 'editMovieModal') {
            document.getElementById('editMovieId').value = '';
            document.getElementById('editImdbId').value = '';
            document.getElementById('editTitle').value = '';
            document.getElementById('editReleaseDate').value = '';
            document.getElementById('editTrailerLink').value = '';
            document.getElementById('editGenres').value = '';
            document.getElementById('editPoster').value = '';
            document.getElementById('editBackdrops').value = '';
            document.getElementById('editMovielink').value = '';
            document.getElementById('editActors').value = '';
        }
        if (modalId === 'deleteMovieModal') {
            document.getElementById('deleteMovieName').textContent = '';
            document.getElementById('deleteMovieId').value = '';
        }
    }

    // --- Click nút sửa movie---
    document.addEventListener('click', function(event) {
        if (event.target.closest('.action-btn.edit')) {
            const row = event.target.closest('tr');
            const cells = row.querySelectorAll('td');

            const title = cells[1].textContent.trim();
            const movie = movies.find(m => m.title === title);

            if (movie) {
                document.getElementById('editMovieId').value = movie.id || '';
                document.getElementById('editImdbId').value = movie.imdbId || '';
                document.getElementById('editTitle').value = movie.title || '';
                document.getElementById('editReleaseDate').value = movie.releaseDate || '';
                document.getElementById('editTrailerLink').value = movie.trailerLink || '';
                document.getElementById('editGenres').value = movie.genres?.join(', ') || '';
                document.getElementById('editPoster').value = movie.poster || '';
                document.getElementById('editBackdrops').value = movie.backdrops?.join(', ') || '';
                document.getElementById('editMovielink').value = movie.movieLink?.join(', ') || '';
                document.getElementById('editActors').value = movie.actors?.join(', ') || '';
            }

            openModal('editMovieModal');
        }
    });

    // --- Click nút xóa movie---
    document.addEventListener('click', function(event) {
        if (event.target.closest('.action-btn.delete')) {
            const row = event.target.closest('tr');
            const title = row.querySelectorAll('td')[1].textContent.trim();
            const movie = movies.find(m => m.title === title);

            if (movie) {
                document.getElementById('deleteMovieName').textContent = title;
                document.getElementById('deleteMovieId').value = movie.imdbId || '';
                openModal('deleteMovieModal');
            }
        }
    });

    // --- Gán sự kiện filter ---
    setupFilterClick();
    // Lấy các phần tử DOM
    const addMovieModal = document.getElementById("addMovieModal");
    const closeModalBtn = document.querySelector(".close-modal");
    const addMovieForm = document.getElementById("addMovieForm");
    const submitMovieBtn = document.getElementById("submit-movie");
    // Đóng modal khi nhấn vào nút đóng
    closeModalBtn.addEventListener("click", function() {
        addMovieModal.style.display = "none";
    });

    // Đóng modal khi nhấn nút Hủy
    const cancelBtn = document.querySelector(".cancel-btn");
    cancelBtn.addEventListener("click", function() {
        addMovieModal.style.display = "none";
    });

    // Mở modal khi cần thiết
    function openAddMovieModal() {
        addMovieModal.style.display = "block";
    }

    // Lưu dữ liệu phim vào database
    submitMovieBtn.addEventListener("click", function(event) {
        event.preventDefault(); 
        if (isSubmitting) return; 
        isSubmitting = true; 
    
        // Lấy giá trị từ form và kiểm tra null hoặc undefined
        const imdbId = (document.getElementById("imdbId").value || '').trim();
        const title = (document.getElementById("title").value || '').trim();
        const releaseDate = (document.getElementById("releaseDate").value || '').trim();
        const trailerLink = (document.getElementById("trailerLink").value || '').trim();
        const genres = (document.getElementById("genres").value || '').trim();
        const poster = (document.getElementById("poster").value || '').trim();
        const backdrops = (document.getElementById("backdrops").value || '').trim();
        const movielink = (document.getElementById("movielink").value || '').trim();
        const allactors = (document.getElementById("allactors").value || '').trim();
        // Tạo đối tượng movie từ form
        const movieData = {
            imdbId: imdbId,
            title: title,
            releaseDate: releaseDate,
            trailerLink: trailerLink,
            genres: genres ? genres.split(',').map(g => g.trim()) : [],
            poster: poster,
            backdrops: backdrops ? backdrops.split(',').map(b => b.trim()) : [],
            movielink: movielink ? movielink.split(',').map(m => m.trim()) : [],
            actors: allactors ? allactors.split(',').map(a => a.trim()) : []
        };    
    
            // Gửi dữ liệu lên server thông qua POST request
            fetch('/api/movies/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(movieData)
            })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    addMovieModal.style.display = "none"; // Đóng modal
                    movies.push(data); 
                    applyFilters(); 
                    window.location.reload();
                } else {
                    alert('Lỗi khi thêm phim!');
                }
            })
            .catch(error => {
                console.error('Có lỗi xảy ra:', error);
                alert('Có lỗi xảy ra, vui lòng thử lại!');
            })
            .finally(() => {
                isSubmitting = false; // Đặt lại trạng thái khi hoàn thành
            });
        });
    
    // Sự kiện click nút Cập nhật trong modal
    document.getElementById('submit-edit').addEventListener('click', function(event) {
        event.preventDefault(); 
    
        // Lấy giá trị từ form
        const imdbId = document.getElementById("editImdbId").value;
        const title = document.getElementById("editTitle").value;
        const releaseDate = document.getElementById("editReleaseDate").value;
        const trailerLink = document.getElementById("editTrailerLink").value;
        const genres = document.getElementById("editGenres").value.split(',').map(genre => genre.trim());
        const poster = document.getElementById("editPoster").value;
        const backdrops = document.getElementById("editBackdrops").value.split(',').map(url => url.trim());
        const movielink = document.getElementById("editMovielink").value.split(',').map(url => url.trim());
        const actors = document.getElementById("editActors").value.split(',').map(actor => actor.trim());
        // Tạo đối tượng movie từ form
        const movieData = {
            imdbId: imdbId,
            title: title,
            releaseDate: releaseDate,
            trailerLink: trailerLink,
            genres: genres,
            poster: poster,
            backdrops: backdrops,
            movielink: movielink,
            actors: actors
        };
    
        // Gửi dữ liệu lên server thông qua PUT request
        fetch(`/api/movies/put/${imdbId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                closeModal(document.getElementById('editMovieModal')); // Đóng modal
                const index = movies.findIndex(m => m.imdbId === imdbId);
                if (index !== -1) {
                    movies[index] = movieData;
                    applyFilters();
                    window.location.reload();
                }
            } else {
                alert('Lỗi khi cập nhật phim!');
            }
        })
        .catch(error => {
            console.error('Có lỗi xảy ra:', error);
            alert('Có lỗi xảy ra, vui lòng thử lại!');
        });
    });
    document.getElementById('confirmDeleteBtn').addEventListener('click', function (event) {
        event.preventDefault();
    
        const imdbId = document.getElementById('deleteMovieId').value;
        if (!imdbId) {
            alert('Không tìm thấy ID phim để xóa!');
            return;
        }
    
        fetch(`/api/movies/delete/${imdbId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (response.ok) {
                closeModal(document.getElementById('deleteMovieModal'));
                movies = movies.filter(movie => movie.imdbId !== imdbId);
                applyFilters();
            } else {
                response.text().then(text => {
                    alert('Không thể xóa phim: ' + text);
                });
            }
        })
        .catch(error => {
            console.error('Lỗi khi xóa phim:', error);
            alert('Xảy ra lỗi, vui lòng thử lại.');
        });
    });

    // lấy dữ liệu từ localStorage
    let storedMovies = localStorage.getItem('movies');
    storedMovies = JSON.parse(storedMovies);

    // Lưu diễn viên vào database
    document.getElementById('addActorForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('username').value.trim();
        const nationality = document.getElementById('nationality').value.trim();
        const birthDate = document.getElementById('birthDate').value.trim();
        const avatar = document.getElementById('avatar').value.trim();
        const actorData = {
            name: name,
            nationality: nationality,
            birthDate: birthDate,
            avatar: avatar,
            movies: []  // Sẽ cập nhật ở dưới
        };

        // Lọc ra các phim có diễn viên này
        const matchedMovies = storedMovies.filter(movie => 
            movie.actors && movie.actors.includes(actorData.name)  // Kiểm tra nếu 'actors' tồn tại
        );
        const imdbIds = matchedMovies.map(movie => movie.imdbId);
        // Gán lại vào actorData
        actorData.movies = imdbIds;
        // Gửi dữ liệu lên server
        fetch('/api/actor/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(actorData)
        })
        .then(response => {
            if (response.ok) {
                alert('Thêm diễn viên thành công!');
                document.getElementById('addActorModal').style.display = 'none';
                document.getElementById('addActorForm').reset();
                window.location.reload();
            } else {
                alert('Thêm diễn viên thất bại!');
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra!');
        });
    });
}

function initActorManagement() {
    const actorSearchInput = document.getElementById("actorSearchInput");
    const actorListContainer = document.getElementById("actors");
    const actorsPerPage = 5;
    let currentActorPage = 1;
    let filteredActorList = [];

    function fetchActors() {
        fetch("http://localhost:8081/api/actor")
            .then(response => response.json())
            .then(actors => {
                window.actorDataList = actors;
                filteredActorList = actors;
                displayActors();
                renderActorPagination();
            })
            .catch(error => console.error("Lỗi khi lấy dữ liệu diễn viên:", error));
    }

    function displayActors() {
        actorListContainer.innerHTML = "";
        const start = (currentActorPage - 1) * actorsPerPage;
        const end = start + actorsPerPage;
        const actorsToDisplay = filteredActorList.slice(start, end);

        actorsToDisplay.forEach((actor, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${actor.name}</td>
                <td>${actor.nationality}</td>
                <td>${actor.birthDate}</td>
                <td>
                    <button class="editactor" onclick='editActorInfo(${JSON.stringify(actor)})'><i class="fas fa-edit"></i></button>
                    <button class="deleteactor" onclick='deleteActorByName("${actor.name}")'><i class="fas fa-trash"></i></button>
                </td>
            `;
            actorListContainer.appendChild(tr);
        });
    }

    function renderActorPagination() {
        const paginationContainer = document.getElementById("pagination1");
        if (!paginationContainer) return;

        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredActorList.length / actorsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.classList.add("pagination-btn");
            if (i === currentActorPage) btn.classList.add("active");
            btn.addEventListener("click", () => {
                currentActorPage = i;
                displayActors();
                renderActorPagination();
            });
            paginationContainer.appendChild(btn);
        }
    }

    function searchActor(query) {
        filteredActorList = window.actorDataList.filter(actor =>
            actor.name.toLowerCase().includes(query.toLowerCase())
        );
        currentActorPage = 1;
        displayActors();
        renderActorPagination();
    }

    document.getElementById("searchActorBtn").addEventListener("click", () => {
        searchActor(actorSearchInput.value.trim());
    });

    actorSearchInput.addEventListener("input", () => {
        searchActor(actorSearchInput.value.trim());
    });

    window.editActorInfo = function (actor) {
        document.getElementById("editUsername").value = actor.name || "";
        document.getElementById("editNationality").value = actor.nationality || "";
        document.getElementById("editBirthDate").value = actor.birthDate || "";
        document.getElementById("editAvatar").value = actor.avatar || "";
        document.getElementById("editMovies").value = (actor.movies || []).join(",");
        document.getElementById("editActorModal").style.display = "block";
    };

    window.deleteActorByName = function (name) {
        if (confirm(`Bạn có chắc chắn muốn xóa diễn viên "${name}"?`)) {
            fetch(`/api/actor/delete/${name}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    alert("Xóa thành công!");
                    fetchActors();
                } else {
                    alert("Không tìm thấy diễn viên.");
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa:", error);
                alert("Có lỗi xảy ra.");
            });
        }
    };

    document.getElementById("saveEditActor").addEventListener("click", function (e) {
        e.preventDefault();

        const name = document.getElementById("editUsername").value.trim();
        const updatedActor = {
            name: name,
            nationality: document.getElementById("editNationality").value.trim(),
            birthDate: document.getElementById("editBirthDate").value.trim(),
            avatar: document.getElementById("editAvatar").value.trim(),
            movies: document.getElementById("editMovies").value.split(",").map(m => m.trim())
        };

        fetch(`/api/actor/put/${name}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedActor)
        })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật thành công!");
                document.getElementById("editActorModal").style.display = "none";
                fetchActors();
            } else {
                alert("Không thể cập nhật.");
            }
        })
        .catch(error => {
            console.error("Lỗi cập nhật:", error);
            alert("Lỗi kết nối.");
        });
    });

    document.querySelectorAll(".close-modal, .cancel-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("editActorModal").style.display = "none";
        });
    });

    fetchActors();
}

function initAdminManagement() {
    const adminSearchInput = document.getElementById("adminSearchInput");
    const adminListContainer = document.getElementById("admins");
    const adminsPerPage = 5;
    let currentAdminPage = 1;
    let filteredAdminList = [];

    function fetchAdmins() {
        fetch("http://localhost:8081/api/admin")
            .then(response => response.json())
            .then(admins => {
                window.adminDataList = admins;
                filteredAdminList = admins;
                displayAdmins();
                renderAdminPagination();
            })
            .catch(error => console.error("Lỗi khi lấy dữ liệu admin:", error));
    }

    function displayAdmins() {
        adminListContainer.innerHTML = "";
        const start = (currentAdminPage - 1) * adminsPerPage;
        const end = start + adminsPerPage;
        const adminsToDisplay = filteredAdminList.slice(start, end);

        adminsToDisplay.forEach((admin, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${start + index + 1}</td>
                <td>${admin.username}</td>
                <td>${admin.password}</td>
                <td>
                    <button class="editadmin" onclick='editAdminInfo(${JSON.stringify(admin)})'><i class="fas fa-edit"></i></button>
                    <button class="deleteadmin" onclick='deleteAdminByUsername("${admin.username}")'><i class="fas fa-trash"></i></button>
                </td>
            `;
            adminListContainer.appendChild(tr);
        });
    }

    function renderAdminPagination() {
        const paginationContainer = document.getElementById("pagination2");
        if (!paginationContainer) return;

        paginationContainer.innerHTML = "";
        const totalPages = Math.ceil(filteredAdminList.length / adminsPerPage);
        for (let i = 1; i <= totalPages; i++) {
            const btn = document.createElement("button");
            btn.innerText = i;
            btn.classList.add("pagination-btn");
            if (i === currentAdminPage) btn.classList.add("active");
            btn.addEventListener("click", () => {
                currentAdminPage = i;
                displayAdmins();
                renderAdminPagination();
            });
            paginationContainer.appendChild(btn);
        }
    }

    // Nếu muốn bật tìm kiếm:
    adminSearchInput.addEventListener("input", () => {
        const query = adminSearchInput.value.trim().toLowerCase();
        filteredAdminList = window.adminDataList.filter(admin =>
            admin.username.toLowerCase().includes(query)
        );
        currentAdminPage = 1;
        displayAdmins();
        renderAdminPagination();
    });

    window.editAdminInfo = function (admin) {
        document.getElementById("editName").value = admin.username || "";
        document.getElementById("editPassword").value = admin.password || "";
        document.getElementById("editAdminModal").style.display = "block";
    };

    window.deleteAdminByUsername = function (username) {
        if (confirm(`Bạn có chắc chắn muốn xóa admin "${username}"?`)) {
            fetch(`/api/admin/delete/${username}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    alert("Xóa thành công!");
                    fetchAdmins();
                } else {
                    alert("Không tìm thấy admin.");
                }
            })
            .catch(error => {
                console.error("Lỗi khi xóa:", error);
                alert("Có lỗi xảy ra.");
            });
        }
    };

    document.getElementById("saveEditAdmin").addEventListener("click", function (e) {
        e.preventDefault();
    
        const username = document.getElementById("editName").value.trim();
        const password = document.getElementById("editPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();
    
        // Kiểm tra mật khẩu có trùng nhau không
        if (password !== confirmPassword) {
            alert("Mật khẩu và xác nhận mật khẩu không trùng khớp!");
            return;
        }
    
        const updatedAdmin = {
            username: username,
            password: password
        };
    
        fetch(`/api/admin/put/${username}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedAdmin)
        })
        .then(response => {
            if (response.ok) {
                alert("Cập nhật thành công!");
                document.getElementById("editAdminModal").style.display = "none";
                fetchAdmins(); // Cập nhật danh sách admin
            } else {
                alert("Không thể cập nhật (mật khẩu ít nhất 6 kí tự).");
            }
        })
        .catch(error => {
            console.error("Lỗi cập nhật:", error);
            alert("Lỗi kết nối.");
        });
    });
    

    document.getElementById('addUserForm').addEventListener('submit', function(event) {
        event.preventDefault();
    
        const name = document.getElementById('Username').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmpassword = document.getElementById('confirmpassword').value.trim();
    
        if (password !== confirmpassword) {
            alert('Mật khẩu và xác nhận mật khẩu không trùng khớp!');
            return;
        }
    
        const adminData = {
            username: name,
            password: password
        };
    
        fetch('/api/admin/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(adminData)
        })
        .then(response => {
            if (response.ok) {
                alert('Thêm admin thành công!');
                document.getElementById('addUserModal').style.display = 'none';
                document.getElementById('addUserForm').reset();
                window.location.reload();
            } else {
                alert('Thêm admin thất bại! (mật khẩu ít nhất 6 kí tự)');
            }
        })
        .catch(error => {
            console.error('Lỗi:', error);
            alert('Có lỗi xảy ra!');
        });
    });
    

    document.querySelectorAll(".close-modal, .cancel-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("editAdminModal").style.display = "none";
        });
    });

    fetchAdmins();
}

