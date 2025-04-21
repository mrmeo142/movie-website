let hamburgerbtn = document.querySelector(".hamburger");
let nav_list = document.querySelector(".nav-list");
let closebtn = document.querySelector(".close");
hamburgerbtn.addEventListener("click", () => {
  nav_list.classList.add("active");
});
closebtn.addEventListener("click", () => {
  nav_list.classList.remove("active");
})


// Lấy các modal
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const signBtn = document.getElementById('signinBtn');

// Hàm mở modal đăng nhập
function openLoginModal() {
    loginModal.style.display = 'flex';
    registerModal.style.display = 'none'; // Đảm bảo modal đăng ký bị ẩn
}

// Hàm mở modal đăng ký
function openRegisterModal() {
    registerModal.style.display = 'flex';
    loginModal.style.display = 'none'; // Đảm bảo modal đăng nhập bị ẩn
}

// Hàm đóng modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Khi nhấn nút Sign, mở modal đăng nhập
signBtn.addEventListener('click', openLoginModal);

// Đóng modal khi nhấn ra ngoài form
window.addEventListener('click', function(event) {
    if (event.target === loginModal) {
        closeModal('loginModal');
    } else if (event.target === registerModal) {
        closeModal('registerModal');
    }
});

