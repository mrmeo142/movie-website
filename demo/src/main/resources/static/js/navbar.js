// ===== Hamburger Menu =====
let hamburgerbtn = document.querySelector(".hamburger");
let nav_list = document.querySelector(".nav-list");
let closebtn = document.querySelector(".close");

hamburgerbtn?.addEventListener("click", () => {
  nav_list?.classList.add("active");
});

closebtn?.addEventListener("click", () => {
  nav_list?.classList.remove("active");
});

// ===== Modal =====
const loginModal = document.getElementById('loginModal');
const signBtn = document.getElementById('signinBtn');

// Mở modal đăng nhập
function openLoginModal() {
  if (loginModal) loginModal.style.display = 'flex';
}

// Đóng modal theo id
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.style.display = 'none';
}

// ===== Xử lý khi nhấn SIGN IN =====
signBtn?.addEventListener('click', () => {
  const user = localStorage.getItem('loggedInUser');
  if (user) {
    window.location.href = 'admin.html'; // Nếu đã đăng nhập thì chuyển trang
  } else {
    openLoginModal(); // Nếu chưa thì mở modal
  }
});

// ===== Đóng modal khi click ngoài form =====
window.addEventListener('click', function(event) {
  if (event.target === loginModal) {
    closeModal('loginModal');
  }
});

// ===== Đăng nhập =====
function loginUser(event) {
  event.preventDefault();

  const username = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  fetch('http://localhost:8081/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => {
      if (!res.ok) throw new Error("Login failed");
      return res.text();
    })
    .then(() => {
      localStorage.setItem('loggedInUser', username);
      updateSignInButton(username);
      closeModal('loginModal'); // Chỉ đóng modal, không chuyển trang
    })
    .catch(() => {
      alert("Invalid username or password");
    });
}

// ===== Hiển thị tên người dùng sau đăng nhập =====
function updateSignInButton(username) {
  const btn = document.getElementById('signinBtn');
  if (btn) {
    btn.textContent = username;
    btn.onclick = () => window.location.href = 'admin.html'; // Chuyển trang khi click
  }
}

// ===== Kiểm tra trạng thái đăng nhập khi tải trang =====
window.addEventListener('DOMContentLoaded', () => {
  const user = localStorage.getItem('loggedInUser');

  // Luôn ẩn modal khi tải lại trang
  if (loginModal) {
    loginModal.style.display = 'none';
  }

  if (user) {
    updateSignInButton(user);
  }
});

// ===== Gửi form đăng nhập =====
document.getElementById('login-form')?.addEventListener('submit', loginUser);
