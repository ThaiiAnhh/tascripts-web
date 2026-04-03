// --- CẤU HÌNH PHÂN TRANG ---
let currentPage = 1;
const scriptsPerPage = 6; 

// Lấy dữ liệu từ Admin
const localExecutors = JSON.parse(localStorage.getItem('admin_executors')) || [];

// ƯU TIÊN lấy dữ liệu local, nếu trống hoàn toàn mới hiện mẫu
const allExecutorsData = localExecutors.length > 0 ? localExecutors : [
    {
        name: "TAScripts Executor",
        platform: "PC/Mobile",
        version: "v1.0",
        image: "image/logo.png",
        link: "#",
        desc: "Đang Cập Nhật...",
        price: "Miễn Phí"
    }
];


// 2. Hàm lưu lịch sử (Để click ở đâu cũng lưu được)
function saveToHistory(title, image, category, link) {
    let history = JSON.parse(localStorage.getItem('viewHistory')) || [];
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}`;

    const newItem = { title, image, category, link, time: timeString };

    history = history.filter(item => item.link !== link);
    history.push(newItem);
    if (history.length > 10) history.shift(); 

    localStorage.setItem('viewHistory', JSON.stringify(history));
}

const scripts = [
    {
        id: 1,
        title: "Blox Fruits - Auto Farm & Devil Fruit ESP",
        game: "Blox Fruits",
        author: "Thái Anh",
        views: "128.5K",
        thumbnail: "image/bloxfruits-banner.jpg", // Ảnh banner to
        link: "https://link-rut-gon.com/xyz", // Link tới script
        youtube: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", // Link video
        category: "Featured",
        features: [
            "Auto Farm Level (Tự động nhận Quest)",
            "Devil Fruit ESP (Hiển thị trái ác quỷ)",
            "Auto Raid & Auto Awakening",
            "Safe Mode (Chống Ban)"
        ]
    },
    // Thêm các script khác...
];
// --- HÀM 1: LẤY DỮ LIỆU TỪ FORM ADMIN ---
const addScriptForm = document.getElementById('add-script-form');
if (addScriptForm) {
    addScriptForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 1. Lấy ID đang chỉnh sửa (nếu có)
        const editingId = addScriptForm.dataset.editingId;
        let allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];

        // 2. Xử lý ảnh (Giữ nguyên logic của bạn)
        let finalThumbnail = document.getElementById('script-thumb-url').value;
        const fileInput = document.getElementById('script-img-file');
        if (fileInput.files && fileInput.files[0]) {
            finalThumbnail = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (e) => resolve(e.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            });
        }

        // 3. Chuẩn bị dữ liệu từ Form
        const scriptData = {
            name: document.getElementById('script-title').value,
            category: document.getElementById('script-game').value,
            badge: document.getElementById('script-badge').value,
            link: document.getElementById('script-link').value,
            youtube: document.getElementById('script-yt').value || "#",
            tags: document.getElementById('script-tags').value.split(',').map(t => t.trim()).filter(t => t !== ""),
            thumbnail: finalThumbnail || 'image/logo.png',
            desc: document.getElementById('script-desc').value,
        };

        if (editingId) {
            // --- TRƯỜNG HỢP: CẬP NHẬT (Giữ nguyên id, downloads, rating, vnTime) ---
            allScripts = allScripts.map(s => {
                if (s.id == editingId) {
                    return { ...s, ...scriptData }; 
                }
                return s;
            });
            alert('✅ Cập nhật Script thành công!');
        } else {
            // --- TRƯỜNG HỢP: ĐĂNG MỚI ---
            const newScript = {
                id: Date.now(), 
                ...scriptData,
                downloads: Math.floor(Math.random() * 150) + 50,
                rating: (Math.random() * (5.0 - 4.5) + 4.5).toFixed(1)
            };
            allScripts.push(newScript);
            alert('🚀 Đăng Script mới thành công!');
        }

        // 4. Lưu vào LocalStorage
        localStorage.setItem('myScripts', JSON.stringify(allScripts));

        // 5. THOÁT CHẾ ĐỘ CHỈNH SỬA & QUAY VỀ DANH SÁCH
        delete addScriptForm.dataset.editingId;
        addScriptForm.reset();
        
        // Đổi nút về mặc định
        const submitBtn = addScriptForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerHTML = 'Đăng Script';

        // Tự động bấm tab "Danh Sách" để quay lại (Bạn kiểm tra đúng class/id của nút tab nhé)
        const btnTabDanhSach = document.querySelector('[data-tab="content-list"]');
        if (btnTabDanhSach) {
            btnTabDanhSach.click();
        } else {
            // Nếu không dùng hệ thống tab thì load lại trang hoặc về index
            window.location.reload();
        }

        // Vẽ lại danh sách admin nếu hàm tồn tại
        if (typeof renderAdminList === "function") renderAdminList();
    });
}


// --- HÀM TẠO HTML CHO TỪNG THẺ SCRIPT (Dùng chung cho cả 2 phần) ---
function createScriptCard(s) {
    // 0. Đảm bảo lấy được ID dù viết hoa hay thường
    const scriptId = s.id || s.ID;
    
    // 1. Xử lý thời gian (Việt Nam)
    let vnTime = "Đang cập nhật";
    try {
        // Kiểm tra nếu id là timestamp (số) thì mới đổi ngày
        const idNum = Number(scriptId);
        if (!isNaN(idNum) && idNum > 1000000000000) {
            const dateObj = new Date(idNum);
            vnTime = new Intl.DateTimeFormat('vi-VN', {
                dateStyle: 'short',
                timeStyle: 'short',
                timeZone: 'Asia/Ho_Chi_Minh'
            }).format(dateObj);
        }
    } catch (e) { console.error("Lỗi định dạng ngày:", e); }

    // 2. Xử lý Tags
    const tagsHTML = (Array.isArray(s.tags) ? s.tags : [])
        .filter(tag => tag && tag.trim() !== "")
        .map(tag => `<span class="px-2 py-0.5 rounded-full border border-white/10 text-[10px] text-gray-400">${tag.trim()}</span>`)
        .join('');

    const displayThumb = (s.thumbnail && s.thumbnail.trim() !== "") ? s.thumbnail : 'image/logo.png';

    return `
    <div class="group bg-[#0f0f15] border border-white/5 rounded-2xl overflow-hidden hover:border-cyan-500/30 transition-all duration-300 flex flex-col h-full shadow-lg">
        <div class="relative aspect-video overflow-hidden bg-[#1a1a25]">
            <img src="${displayThumb}" 
                 alt="${s.name}"
                 class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                 onerror="this.onerror=null; this.src='image/logo.png';">
            
            <div class="absolute inset-0 bg-gradient-to-t from-[#0f0f15] to-transparent opacity-60"></div>
            
            ${s.badge ? `<span class="absolute top-3 left-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider z-10">${s.badge}</span>` : ''}
            
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <a href="Scriptid.html?id=${scriptId}" 
                   onclick="increaseDownload('${scriptId}')" 
                   class="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-xs font-bold hover:bg-white/20 transition-all">
                    Xem Chi Tiết
                </a>
            </div>
        </div>
        
        <div class="p-5 flex flex-col flex-1">
            <div class="flex items-center gap-2 mb-3">
                <img src="image/logo.png" class="w-5 h-5 rounded-full ring-1 ring-white/10" alt="TA Gamer">
                <span class="text-cyan-400 text-[11px] font-bold">${s.category || 'Roblox'}</span>
                <span class="text-gray-600 text-[11px]">•</span>
                <span class="text-gray-500 text-[11px]">TA Gamer</span>
            </div>
            
            <h3 class="text-white font-bold text-base leading-tight mb-2 line-clamp-1 group-hover:text-cyan-400 transition-colors">${s.name}</h3>
            <p class="text-gray-500 text-xs line-clamp-2 mb-4 flex-1">${s.desc || 'Không có mô tả cho script này.'}</p>
            
            <div class="flex items-center justify-between mb-4">
                <div class="flex items-center gap-3">
                    <div class="flex items-center gap-1">
                        <i class="ri-star-fill text-yellow-500 text-[10px]"></i>
                        <span class="text-gray-400 text-[11px] font-bold">${s.rating || '5.0'}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <i class="ri-download-cloud-2-line text-gray-500 text-[10px]"></i>
                        <span class="text-gray-400 text-[11px] font-bold">${s.downloads || 0}</span>
                    </div>
                </div>
                <span class="text-[10px] text-gray-500 font-medium bg-white/5 px-2 py-1 rounded border border-white/5">
                    <i class="ri-time-line mr-1 text-cyan-500"></i>${vnTime}
                </span>
            </div>
            
            <div class="flex flex-wrap gap-1.5 mb-5">${tagsHTML}</div>
            
            <div class="flex items-center gap-2 mt-auto">
                <a href="Scriptid.html?id=${scriptId}" 
                   onclick="increaseDownload('${scriptId}')" 
                   class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-cyan-500 text-black text-[11px] font-black uppercase italic hover:bg-cyan-400 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                    <i class="ri-terminal-box-line text-sm"></i> 
                    GET SCRIPT
                </a>
                
                ${s.youtube && s.youtube !== "#" ? `
                    <a href="${s.youtube}" target="_blank" rel="noopener" class="w-11 flex items-center justify-center py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all">
                        <i class="ri-play-circle-line text-lg"></i>
                    </a>
                ` : `
                    <button disabled class="w-11 flex items-center justify-center py-2.5 rounded-xl bg-white/5 border border-white/5 text-gray-800 cursor-not-allowed">
                        <i class="ri-play-circle-line text-lg"></i>
                    </button>
                `}
            </div>
        </div>
    </div>`;
}

// --- HÀM 2: HIỂN THỊ DỮ LIỆU ---
function loadAllScripts() {
    const allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
    const reversedScripts = [...allScripts].reverse();

    // 1. HIỂN THỊ SCRIPT HOT NHẤT (Top 3 bài có Badge HOT/FEATURED)
    const featuredContainer = document.getElementById('featured-scripts-container');
    if (featuredContainer) {
        const featuredList = reversedScripts.filter(s => s.badge === 'HOT' || s.badge === 'FEATURED').slice(0, 3);
        if (featuredList.length > 0) {
            featuredContainer.innerHTML = featuredList.map(s => createScriptCard(s)).join('');
        } else {
            featuredContainer.innerHTML = `<p class="col-span-full text-center py-10 text-gray-600 italic">Chưa có script nổi bật.</p>`;
        }
    }

    // 2. HIỂN THỊ TẤT CẢ SCRIPT (Có phân trang)
    const allContainer = document.getElementById('all-scripts-container');
    if (allContainer) {
        const startIndex = (currentPage - 1) * scriptsPerPage;
        const currentScripts = reversedScripts.slice(startIndex, startIndex + scriptsPerPage);
        
        document.getElementById('script-count').innerText = `(${allScripts.length} script)`;
        
        if (allScripts.length === 0) {
            allContainer.innerHTML = `<p class="col-span-full text-center py-10 text-gray-600 italic">Chưa có script nào.</p>`;
        } else {
            allContainer.innerHTML = currentScripts.map(s => createScriptCard(s)).join('');
        }
        renderPagination(allScripts.length);
    }
}

// --- HÀM 3: VẼ PHÂN TRANG ---
function renderPagination(total) {
    const container = document.getElementById('pagination-container');
    const info = document.getElementById('pagination-info');
    if (!container) return;

    const totalPages = Math.ceil(total / scriptsPerPage);
    info.innerText = `Trang ${currentPage} trên ${totalPages || 1}`;

    let html = "";
    for (let i = 1; i <= totalPages; i++) {
        const active = i === currentPage ? 'bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10';
        html += `<button onclick="changePage(${i})" class="w-10 h-10 rounded-xl font-bold text-sm transition-all ${active}">${i}</button>`;
    }
    container.innerHTML = html;
}

function changePage(page) {
    currentPage = page;
    loadAllScripts();
    window.scrollTo({ top: document.getElementById('scripts-grid-section').offsetTop - 100, behavior: 'smooth' });
}

// 1. Hàm hiển thị danh sách bài viết trong trang Admin
// 1. Render Script
function renderAdminList() {
    const wrapper = document.getElementById('admin-script-wrapper');
    const countLabel = document.getElementById('total-script-count');
    if (!wrapper) return;

    const allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
    if (countLabel) countLabel.innerText = `${allScripts.length} Bài viết`;

    if (allScripts.length === 0) {
        wrapper.innerHTML = `<div class="p-10 text-center text-gray-500 italic">Chưa có script nào.</div>`;
        return;
    }

    wrapper.innerHTML = allScripts.reverse().map(s => `
        <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
            <div class="flex items-center gap-4">
                <img src="${s.thumbnail}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='image/logo.png'">
                <div>
                    <h4 class="text-white font-bold text-sm">${s.name}</h4>
                    <span class="text-[10px] text-cyan-400 font-bold uppercase">${s.category || 'Script'}</span>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="editScript(${s.id})" class="text-orange-400 p-2 hover:bg-orange-400/10 rounded-lg transition-all">
                    <i class="ri-edit-line text-lg"></i>
                </button>
                <button onclick="deleteScript(${s.id})" class="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all">
                    <i class="ri-delete-bin-line text-lg"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// --- 2. Render Danh sách Executor ---
function renderAdminExecutorList() {
    const wrapper = document.getElementById('admin-executor-wrapper'); 
    const countLabel = document.getElementById('total-executor-count');
    if (!wrapper) return;

    const allExecutors = JSON.parse(localStorage.getItem('admin_executors')) || [];
    if (countLabel) countLabel.innerText = `${allExecutors.length} Executor`;

    if (allExecutors.length === 0) {
        wrapper.innerHTML = `<div class="p-10 text-center text-gray-500 italic">Chưa có Executor nào.</div>`;
        return;
    }

    wrapper.innerHTML = allExecutors.reverse().map(exec => `
        <div class="flex items-center justify-between bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-all">
            <div class="flex items-center gap-4">
                <img src="${exec.thumbnail}" class="w-12 h-12 rounded-xl object-cover" onerror="this.src='image/logo.png'">
                <div>
                    <h4 class="text-white font-bold text-sm">${exec.name}</h4>
                    <span class="text-[10px] text-teal-400 font-bold uppercase">${exec.platform}</span>
                </div>
            </div>
            <button onclick="deleteExecutor(${exec.id})" class="text-red-500 p-2 hover:bg-red-500/10 rounded-lg transition-all">
                <i class="ri-delete-bin-line text-lg"></i>
            </button>
        </div>
    `).join('');
}

// --- 3. Render Thông báo hợp tác ---
function renderAdminCollabList() {
    const wrapper = document.getElementById('admin-collab-wrapper');
    const countLabel = document.getElementById('total-collab-count');
    if (!wrapper) return;

    // Giả sử lấy từ key 'myCollabs' hoặc để trống
    const allCollabs = JSON.parse(localStorage.getItem('myCollabs')) || [];
    if (countLabel) countLabel.innerText = `${allCollabs.length} Thông báo`;

    wrapper.innerHTML = allCollabs.length === 0 
        ? `<div class="p-10 text-center text-gray-500 italic text-[10px] uppercase tracking-widest">Không có thông báo mới.</div>`
        : allCollabs.map(c => `<div class="p-4 bg-orange-500/5 rounded-xl border border-orange-500/10 text-white text-sm">${c.title}</div>`).join('');
}

function updateAdminStats() {
    // 1. Lấy dữ liệu từ LocalStorage
    const allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
    const allExecutors = JSON.parse(localStorage.getItem('admin_executors')) || [];

    // 2. Tính toán các con số
    const totalScripts = allScripts.length;
    const totalExecutors = allExecutors.length;
    
    // Tính tổng lượt tải từ cả Scripts và Executors (nếu muốn tổng quát)
    const scriptViews = allScripts.reduce((sum, s) => sum + (Number(s.downloads) || 0), 0);
    const execViews = allExecutors.reduce((sum, e) => sum + (Number(e.downloads) || 0), 0);
    const totalViews = scriptViews + execViews;

    // 3. Hàm định dạng số (85400 -> 85.4K)
    const formatNumber = (num) => {
        if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
        if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
        return num.toLocaleString();
    };

    // 4. Cập nhật vào các Element (Dùng cho cả trang Admin và trang Public)

    // --- Trang Public Executor (3 ô thống kê đầu trang) ---
    const publicExecCount = document.querySelector('.text-cyan-400.font-black.text-lg.leading-none');
    const publicViewCount = document.querySelector('.text-emerald-400.font-black.text-lg.leading-none');

    if (publicExecCount) publicExecCount.innerText = totalExecutors;
    // Nếu ô view có chứa chữ "M+" như mẫu của bạn, hãy cẩn thận khi ghi đè
    if (publicViewCount) publicViewCount.innerText = formatNumber(totalViews) + (totalViews < 1000000 ? "" : "+");

    // --- Trang Admin (Thẻ thống kê Dashboard) ---
    const adminScriptElem = document.getElementById('admin-total-scripts');
    const adminExecutorElem = document.getElementById('admin-total-executors');
    const adminViewElem = document.getElementById('admin-total-views');

    if (adminScriptElem) adminScriptElem.innerText = totalScripts.toLocaleString();
    if (adminExecutorElem) adminExecutorElem.innerText = totalExecutors.toLocaleString(); // Bỏ số 15 mặc định để tránh gây nhầm lẫn
    if (adminViewElem) adminViewElem.innerText = formatNumber(totalViews);
}

// Hàm xóa Executor
window.deleteExecutor = function(id) {
    if (confirm('Xóa Executor này?')) {
        let all = JSON.parse(localStorage.getItem('admin_executors')) || []; // Kiểm tra key này
        all = all.filter(e => e.id !== id);
        localStorage.setItem('admin_executors', JSON.stringify(all)); // Kiểm tra key này
        renderAdminExecutorList();
        updateAdminStats();
    }
};

// js/database.js

// Hàm lưu lịch sử xem bài viết
function saveToHistory(title, image, category, link) {
    let history = JSON.parse(localStorage.getItem('viewHistory')) || [];
    
    const now = new Date();
    const timeString = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} - ${now.getDate()}/${now.getMonth() + 1}`;

    const newItem = {
        title: title,
        image: image,
        category: category,
        link: link,
        time: timeString
    };

    // Xóa trùng lặp để đưa bài mới lên đầu
    history = history.filter(item => item.link !== link);

    history.push(newItem);
    if (history.length > 10) history.shift(); 

    localStorage.setItem('viewHistory', JSON.stringify(history));
}

function loadPublicExecutors() {
    const container = document.getElementById('public-executor-list');
    if (!container) return;

    const allExecutors = JSON.parse(localStorage.getItem('admin_executors')) || [];
    
    // Nếu không có dữ liệu, hiện thông báo hoặc giữ nguyên Synapse X (tùy bạn)
    if (allExecutors.length === 0) {
        // container.innerHTML = `<p class="col-span-full text-center text-gray-500 py-20">Đang cập nhật...</p>`;
        return; 
    }

    // Render dữ liệu (giữ lại cấu trúc đẹp mà bạn đã viết)
    container.innerHTML = allExecutors.reverse().map(exec => `
        <div class="group bg-gradient-to-br from-teal-600/10 to-emerald-700/5 border border-teal-500/20 rounded-2xl p-6 flex flex-col gap-4 hover:border-teal-500/40 hover:scale-[1.02] transition-all duration-300">
            <div class="flex items-start justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 flex items-center justify-center rounded-xl border border-teal-500/30 bg-black/40 overflow-hidden">
                        <img src="${exec.thumbnail}" class="w-full h-full object-cover" onerror="this.src='image/logo.png'">
                    </div>
                    <div>
                        <h2 class="text-white font-black text-lg leading-tight">${exec.name}</h2>
                        <div class="flex items-center gap-1.5 mt-1 flex-wrap">
                            <span class="text-[10px] px-2 py-0.5 rounded-full border font-bold bg-teal-500/20 text-teal-400 border-teal-500/30">${exec.platform}</span>
                            <span class="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 font-medium border border-white/5">${exec.keySystem}</span>
                        </div>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-black text-sm text-white">${exec.price}</p>
                    <div class="flex items-center gap-0.5 justify-end mt-0.5">
                        <i class="ri-star-fill text-yellow-400 text-[10px]"></i>
                        <span class="text-gray-400 text-xs">5.0</span>
                    </div>
                </div>
            </div>
            <p class="text-gray-400 text-sm leading-relaxed line-clamp-3">${exec.desc}</p>
            <div class="grid grid-cols-2 gap-y-2">
                <div class="flex items-center gap-1.5 text-[11px] text-gray-300"><i class="ri-check-line text-emerald-400"></i>Hỗ trợ ${exec.platform}</div>
                <div class="flex items-center gap-1.5 text-[11px] text-gray-300"><i class="ri-check-line text-emerald-400"></i>Anti-Ban</div>
            </div>
            <div class="flex gap-2 pt-2 mt-auto">
                <a href="${exec.link}" target="_blank" class="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white transition-all shadow-lg shadow-teal-500/10">Tải Ngay</a>
                <a href="https://www.youtube.com/@tagamerr" target="_blank" class="w-11 flex items-center justify-center rounded-xl border border-white/10 text-gray-400 hover:text-red-400 transition-all"><i class="ri-youtube-line text-lg"></i></a>
            </div>
        </div>
    `).join('');
}


// 2. Chức năng Xóa bài viết
window.deleteScript = function(id) {
    if (confirm('⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn bài này?')) {
        let allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
        allScripts = allScripts.filter(item => item.id !== id);
        localStorage.setItem('myScripts', JSON.stringify(allScripts));
        
        renderAdminList(); // Vẽ lại danh sách sau khi xóa
    }
};

// 3. Chức năng Chỉnh sửa (Gán dữ liệu vào Form)
window.editScript = function(id) {
    const allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
    // Dùng == để so sánh không phân biệt kiểu dữ liệu (String/Number)
    const script = allScripts.find(item => item.id == id); 
    
    if (script) {
        const form = document.getElementById('add-script-form');
        document.getElementById('script-title').value = script.name;
        document.getElementById('script-game').value = script.category;
        document.getElementById('script-badge').value = script.badge || "";
        document.getElementById('script-link').value = script.link;
        document.getElementById('script-yt').value = script.youtube || "#";
        document.getElementById('script-tags').value = script.tags ? script.tags.join(', ') : "";
        document.getElementById('script-desc').value = script.desc;
        document.getElementById('script-thumb-url').value = script.thumbnail;

        form.dataset.editingId = id; // Lưu ID vào dataset

        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            submitBtn.innerHTML = '<i class="ri-save-line"></i> Cập Nhật Script';
            submitBtn.className = "flex-1 py-3 rounded-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"; 
        }
        
        // Chuyển tab thủ công nếu không tìm thấy nút
        const tabForm = document.querySelector('[data-tab="add-script"]');
        if (tabForm) tabForm.click();
    }
};

// --- HÀM XỬ LÝ RIÊNG CHO EXECUTOR ---
const addExecutorForm = document.getElementById('form-executor');

if (addExecutorForm) {
    addExecutorForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // 1. Lấy dữ liệu hiện tại từ LocalStorage
        let allExecutors = JSON.parse(localStorage.getItem('admin_executors')) || [];

        // 2. XỬ LÝ ẢNH (Ưu tiên File > Link URL)
        let finalThumbnail = "";
        const fileInput = document.getElementById('exec-img'); // Ô input type="file"
        const linkInput = document.getElementById('exec-thumb-url'); // Ô input nhập Link

        if (fileInput.files && fileInput.files[0]) {
            // Nếu có chọn file từ máy, chuyển nó sang Base64
            finalThumbnail = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = (event) => resolve(event.target.result);
                reader.readAsDataURL(fileInput.files[0]);
            });
        } else if (linkInput.value.trim() !== "") {
            // Nếu không chọn file nhưng có dán Link
            finalThumbnail = linkInput.value.trim();
        } else {
            // Nếu cả hai đều trống, dùng ảnh mặc định (logo của bạn)
            finalThumbnail = 'image/logo.png'; 
        }

        // 3. Chuẩn bị dữ liệu để lưu
        const executorData = {
            id: Date.now(),
            name: document.getElementById('exec-name').value,
            platform: document.getElementById('exec-platform').value,
            price: document.getElementById('exec-price').value,
            keySystem: document.getElementById('exec-key').value,
            link: document.getElementById('exec-link').value,
            thumbnail: finalThumbnail, // Ảnh đã xử lý ở trên
            desc: document.getElementById('exec-desc').value,
            downloads: Math.floor(Math.random() * 50) + 10 // Số ảo
        };

        // 4. Lưu và thông báo
        allExecutors.push(executorData);
        localStorage.setItem('admin_executors', JSON.stringify(allExecutors));

        alert('🚀 Đăng Executor thành công!');
        addExecutorForm.reset();
        
        // Cập nhật giao diện ngay lập tức
        if (typeof renderAdminExecutorList === "function") renderAdminExecutorList();
        if (typeof updateAdminStats === "function") updateAdminStats();
    });
}

// Gọi hàm ngay khi trang Admin được mở
document.addEventListener('DOMContentLoaded', () => {
    updateAdminStats();

    // Kiểm tra chính xác xem các wrapper có tồn tại không mới chạy
    if (document.getElementById('admin-script-wrapper')) {
        renderAdminList(); 
        renderAdminExecutorList();
        renderAdminCollabList(); // Thêm dòng này
    }
    
    // Các hàm cho trang chủ
    if (typeof loadAllScripts === 'function') loadAllScripts(); 
    if (typeof loadPublicExecutors === 'function') loadPublicExecutors();
    
});
// Hàm tăng lượt tải khi khách bấm nút
window.increaseDownload = function(scriptId) {
    let allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
    
    allScripts = allScripts.map(s => {
        if (s.id == scriptId) {
            return { ...s, downloads: (Number(s.downloads) || 0) + 1 };
        }
        return s;
    });

    localStorage.setItem('myScripts', JSON.stringify(allScripts));
};
document.addEventListener('DOMContentLoaded', () => {
    // CHỈ CHẠY NẾU ĐANG Ở TRANG CHI TIẾT (Scriptid.html)
    // Kiểm tra xem có element đặc trưng của trang chi tiết không (ví dụ h1 hoặc container chi tiết)
    const isDetailPage = window.location.pathname.includes('Scriptid.html');

    if (isDetailPage) {
        const urlParams = new URLSearchParams(window.location.search);
        const scriptId = urlParams.get('id');

        if (!scriptId) {
            // Thay vì alert, hãy log lỗi để không làm phiền người dùng
            console.warn("Trang chi tiết yêu cầu một ID hợp lệ.");
            return;
        }

        const allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
        // Dùng == để so sánh chuỗi và số cho chắc ăn
        const s = allScripts.find(item => item.id == scriptId);

        if (s) {
            // ... (Giữ nguyên đoạn code đổ dữ liệu vào giao diện của bạn ở đây) ...
            document.querySelector('h1').innerText = s.name;
            // v.v...
        } else {
            alert("Script này không tồn tại hoặc đã bị xóa!");
            window.location.href = 'index.html'; // Chuyển hướng về chủ nếu không tìm thấy
        }
    }

    const searchInput = document.getElementById('search-input');
if (searchInput) {
    searchInput.addEventListener('input', (e) => {
        const key = e.target.value.toLowerCase().trim();
        const allScripts = JSON.parse(localStorage.getItem('myScripts')) || [];
        
        // Lọc script theo tên hoặc tên game
        const filtered = allScripts.filter(s => 
            s.name.toLowerCase().includes(key) || 
            (s.game && s.game.toLowerCase().includes(key))
        );

        // Gọi hàm render của m để hiện kết quả (thay 'renderScripts' bằng tên hàm render của m)
        if (typeof renderScripts === 'function') renderScripts(filtered);
    });
}

    
});