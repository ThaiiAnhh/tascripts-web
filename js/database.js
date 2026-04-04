function getYouTubeID(url) {
    if (!url || url === "#") return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

let currentPage = 1;
const scriptsPerPage = 6;
const DATA_FILE = 'scripts-data.json';

// ==========================================
// 2. HÀM TẠO HTML CHO CARD SCRIPT (Giao diện chuẩn)
// ==========================================
function createScriptCard(s) {
    // 0. Hàm bổ trợ lấy ID YouTube (để lấy thumbnail)
    const getYTID = (url) => {
        if (!url || url === "#") return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // 1. Lấy ID (ưu tiên id số từ timestamp)
    const scriptId = s.id || s.ID || Date.now();
    
    // 2. Định dạng ngày tháng Việt Nam
    let vnTime = "Mới cập nhật";
    if (typeof scriptId === 'number' && scriptId > 1000000000000) {
        vnTime = new Date(scriptId).toLocaleDateString('vi-VN');
    }

    // 3. Xử lý mảng Tags
    const tagsHTML = (Array.isArray(s.tags) ? s.tags : [])
        .filter(t => t && t.trim() !== "")
        .map(t => `<span class="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-gray-400">${t.trim()}</span>`)
        .join('');

    // 4. XỬ LÝ ẢNH (Ưu tiên YouTube Thumbnail)
    let displayThumb = s.thumbnail || s.thumb || s.image;
    const ytId = getYTID(s.youtube);

    // Nếu không có ảnh thủ công hoặc ảnh để trống, tự động lấy ảnh YouTube
    if (!displayThumb || displayThumb === "" || displayThumb === "image/logo.png") {
        if (ytId) {
            displayThumb = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
        } else {
            displayThumb = 'image/logo.png';
        }
    } else {
        // Nếu có ảnh thủ công, kiểm tra đường dẫn xem có phải link ngoài hay file nội bộ
        if (!displayThumb.startsWith('http') && !displayThumb.startsWith('data:') && !displayThumb.startsWith('/')) {
            displayThumb = 'image/' + displayThumb; 
        }
    }

    // 5. TRẢ VỀ HTML
    return `
    <div class="group bg-[#0f0f15] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full shadow-lg">
        <div class="relative aspect-video overflow-hidden bg-[#1a1a25]">
            <img src="${displayThumb}" 
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                 onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${ytId}/hqdefault.jpg';">
            
            ${s.badge ? `<span class="absolute top-3 left-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase z-10">${s.badge}</span>` : ''}
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <a href="Scriptid.html?id=${scriptId}" class="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-bold hover:bg-white/20">Xem Chi Tiết</a>
            </div>
        </div>

        <div class="p-5 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-3">
                <img src="image/logo.png" class="w-4 h-4 rounded-full ring-1 ring-white/10">
                <span class="text-cyan-400 text-[10px] font-bold uppercase tracking-wider">${s.category || s.game || 'Roblox'}</span>
            </div>
            
            <h3 class="text-white font-bold text-base leading-tight mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">
                ${s.name || s.title || 'Script Chưa Có Tên'}
            </h3>
            
            <p class="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">${s.desc || 'Không có mô tả cho script này.'}</p>
            
            <div class="flex items-center justify-between mb-4 text-[10px] text-gray-500">
                <span><i class="ri-download-cloud-2-line"></i> ${s.downloads || 0} lượt tải</span>
                <span><i class="ri-time-line"></i> ${vnTime}</span>
            </div>

            <div class="flex flex-wrap gap-1.5 mb-5">${tagsHTML}</div>
            
            <div class="flex items-center gap-2 mt-auto">
                <a href="Scriptid.html?id=${scriptId}" class="btn-get-script flex-1 text-center py-2 bg-cyan-500 text-black text-xs font-black rounded-lg hover:bg-cyan-400 transition-colors uppercase">
                    <i class="ri-code-s-slash-line"></i> GET SCRIPT
                </a>
                
                ${s.youtube && s.youtube !== "#" ? `
                    <a href="${s.youtube}" target="_blank" class="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 transition-all">
                        <i class="ri-youtube-line text-lg"></i>
                    </a>
                ` : ''}
            </div>
        </div>
    </div>`;
}

// ==========================================
// 3. QUẢN LÝ DỮ LIỆU (JSON + LOCALSTORAGE)
// ==========================================
async function loadAllScripts() {
    // Lấy dữ liệu từ Admin (LocalStorage)
    const localScripts = JSON.parse(localStorage.getItem('myScripts')) || JSON.parse(localStorage.getItem('admin_scripts')) || [];
    
    // Lấy dữ liệu từ file JSON
    let apiScripts = [];
    try {
        const response = await fetch(`${DATA_FILE}?v=${Date.now()}`);
        if (response.ok) apiScripts = await response.json();
    } catch (e) {
        console.warn("Đang chạy ở chế độ Local (Không tìm thấy file JSON)");
    }

    // Gộp dữ liệu: Bài mới nhất (LocalStorage) lên đầu
    const allScripts = [...localScripts, ...apiScripts].reverse();

    // --- RENDER PHẦN SCRIPT HOT (Nếu có container) ---
    const featuredContainer = document.getElementById('featured-scripts-container');
    if (featuredContainer) {
        const featuredList = allScripts.filter(s => s.badge === 'HOT' || s.badge === 'FEATURED').slice(0, 3);
        featuredContainer.innerHTML = featuredList.length > 0 
            ? featuredList.map(s => createScriptCard(s)).join('') 
            : `<p class="col-span-full text-center py-10 text-gray-600 italic text-sm">Chưa có script nổi bật.</p>`;
    }

    // --- RENDER DANH SÁCH CHÍNH (Có phân trang) ---
    const allContainer = document.getElementById('all-scripts-container');
    if (allContainer) {
        const startIndex = (currentPage - 1) * scriptsPerPage;
        const currentScripts = allScripts.slice(startIndex, startIndex + scriptsPerPage);
        
        // Cập nhật số lượng
        const countEl = document.getElementById('script-count');
        if (countEl) countEl.innerText = `(${allScripts.length} script)`;

        if (allScripts.length === 0) {
            allContainer.innerHTML = `<p class="col-span-full text-center py-20 text-gray-600 italic">Dữ liệu đang được tải...</p>`;
        } else {
            allContainer.innerHTML = currentScripts.map(s => createScriptCard(s)).join('');
        }
        
        renderPagination(allScripts.length);
    }
}

// ==========================================
// 4. HÀM PHÂN TRANG & ĐIỀU HƯỚNG
// ==========================================
function renderPagination(total) {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    const totalPages = Math.ceil(total / scriptsPerPage);
    if (totalPages <= 1) {
        container.innerHTML = "";
        return;
    }

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        const activeClass = i === currentPage 
            ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white';
        
        html += `<button onclick="changePage(${i})" class="w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 ${activeClass}">${i}</button>`;
    }
    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadAllScripts();
    // Cuộn lên phần danh sách script
    const section = document.getElementById('scripts-grid-section');
    if (section) {
        window.scrollTo({ top: section.offsetTop - 80, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ==========================================
// 5. KHỞI CHẠY KHI TRANG SẴN SÀNG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    loadAllScripts();
    
    // Nếu có ô tìm kiếm thì kích hoạt luôn logic search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const key = e.target.value.toLowerCase().trim();
            if (key === "") {
                loadAllScripts();
                return;
            }
            // Logic tìm kiếm nhanh (chỉ tìm trong dữ liệu hiện có)
            const allScripts = JSON.parse(localStorage.getItem('myScripts')) || []; 
            const filtered = allScripts.filter(s => 
                (s.name && s.name.toLowerCase().includes(key)) || 
                (s.category && s.category.toLowerCase().includes(key))
            );
            const container = document.getElementById('all-scripts-container');
            if (container) container.innerHTML = filtered.map(s => createScriptCard(s)).join('');
        });
    }
});