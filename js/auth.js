function renderAuth() {
    const loginBtn = document.getElementById('login-btn');
    const userInfo = document.getElementById('user-info');
    const navUserName = document.getElementById('nav-user-name');
    const navUserAvatar = document.getElementById('nav-user-avatar');
    
    // Lấy nút Admin bằng ID đã thêm ở Bước 1
    const adminBtn = document.getElementById('admin-nav-btn');

    const userData = JSON.parse(localStorage.getItem('currentUser'));

    if (userData && userData.username) {
        // --- ĐÃ ĐĂNG NHẬP ---
        if (loginBtn) loginBtn.classList.add('hidden');
        
        if (userInfo) {
            userInfo.classList.remove('hidden');
            userInfo.classList.add('flex');
        }

        if (navUserName) {
            navUserName.textContent = userData.username; 
        }
        
        if (navUserAvatar) {
            navUserAvatar.src = userData.avatar || 'image/logo.png';
        }

        // KIỂM TRA QUYỀN ADMIN ĐỂ HIỆN NÚT
        if (adminBtn) {
            if (userData.role === 'admin') {
                adminBtn.classList.remove('hidden'); // Hiện nút nếu role là admin
            } else {
                adminBtn.classList.add('hidden');    // Ẩn nút nếu là member
            }
        }

    } else {
        // --- CHƯA ĐĂNG NHẬP ---
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userInfo) {
            userInfo.classList.add('hidden');
            userInfo.classList.remove('flex');
        }
        // Chưa đăng nhập thì chắc chắn phải ẩn nút Admin
        if (adminBtn) adminBtn.classList.add('hidden');
    }
}

// Đảm bảo hàm này chạy khi trang load xong
document.addEventListener('DOMContentLoaded', renderAuth);

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', renderAuth);