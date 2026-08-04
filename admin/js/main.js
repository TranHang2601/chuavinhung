const FIREBASE_BASE = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app';
        
let newsData = {};
let videosData = {};
let monksData = {};
let confirmResolver = null;

window.showToast = function(msg, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-xl text-xs font-semibold shadow-lg text-white flex items-center space-x-2 pointer-events-none transition transform duration-300 ${isError ? 'bg-red-600' : 'bg-emerald-600'}`;
    toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'} text-base"></i><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
};

window.askConfirm = function(message) {
    document.getElementById('confirm-msg').textContent = message || 'Bạn có chắc chắn muốn thực hiện thao tác này?';
    document.getElementById('modal-confirm').classList.remove('hidden');
    return new Promise((resolve) => {
        confirmResolver = resolve;
    });
};

window.closeConfirmModal = function(result) {
    document.getElementById('modal-confirm').classList.add('hidden');
    if (confirmResolver) {
        confirmResolver(result);
        confirmResolver = null;
    }
};

window.switchTab = function(tabName) {
    document.querySelectorAll('section[id^="tab-sec-"]').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetSec = document.getElementById(`tab-sec-${tabName}`);
    const targetBtn = document.getElementById(`tab-btn-${tabName}`);

    if (targetSec && targetBtn) {
        targetSec.classList.remove('hidden');
        targetBtn.classList.add('active');
    }
};

window.unlockAdmin = async function() {
    const pin = document.getElementById('admin-pin-input').value;
    const MASTER_PIN = "8888"; // MÃ CỨU HỘ KHẨN CẤP (BẠN NÊN ĐỔI MÃ NÀY)

    if (!pin) return window.showToast("Vui lòng nhập mã PIN!", true);
    
    // Kiểm tra mã cứu hộ khẩn cấp
    if (pin === MASTER_PIN) {
        sessionStorage.setItem("admin_name", "Quản Trị Viên Hệ Thống");
        sessionStorage.setItem("admin_role", "superadmin");
        
        document.getElementById('admin-lock-screen').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        document.getElementById('tab-btn-permissions').classList.remove('hidden');
        
        // Cập nhật tên và hiển thị
        document.getElementById('admin-display-name').textContent = "Quản Trị Viên Hệ Thống";
        document.getElementById('welcome-msg').classList.remove('hidden');
        
        window.loadAllData();
        window.showToast("Đã đăng nhập bằng quyền cứu hộ!");
        return;
    }

    try {
        const res = await fetch(`${FIREBASE_BASE}/admins/${pin}.json`);
        const admin = await res.json();
        
        if (admin) {
            sessionStorage.setItem("admin_name", admin.name);
            sessionStorage.setItem("admin_role", admin.role);
            
            document.getElementById('admin-lock-screen').classList.add('hidden');
            document.getElementById('admin-content').classList.remove('hidden');
            
            // Cập nhật tên và hiển thị
            document.getElementById('admin-display-name').textContent = admin.name;
            document.getElementById('welcome-msg').classList.remove('hidden');
            
            const permTab = document.getElementById('tab-btn-permissions');
            if (admin.role === 'superadmin') {
                permTab.classList.remove('hidden');
            } else {
                permTab.classList.add('hidden');
            }

            window.loadAllData();
            window.showToast(`Chào mừng ${admin.name}!`);
        } else {
            window.showToast("Mã PIN không đúng!", true);
        }
    } catch (e) {
        window.showToast("Lỗi kết nối máy chủ!", true);
    }
};
window.logoutAdmin = function() {
    sessionStorage.clear();
    document.getElementById('admin-lock-screen').classList.remove('hidden');
    document.getElementById('admin-content').classList.add('hidden');
    document.getElementById('welcome-msg').classList.add('hidden'); // Ẩn khi logout
    window.showToast("Đã khóa bảng điều khiển!");
};
window.logoutAdmin = function() {
    sessionStorage.clear();
    document.getElementById('admin-lock-screen').classList.remove('hidden');
    document.getElementById('admin-content').classList.add('hidden');
    window.showToast("Đã khóa bảng điều khiển!");
};
window.loadAllData = async function() {
    await Promise.all([fetchNews(), fetchVideos(), fetchMonks()]);
    updateStats();
};

function updateStats() {
    document.getElementById('stat-news-count').textContent = Object.keys(newsData).length;
    document.getElementById('stat-video-count').textContent = Object.keys(videosData).length;
    document.getElementById('stat-monk-count').textContent = Object.keys(monksData).length;
}

async function fetchNews() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/news.json`);
        newsData = (await res.json()) || {};
        renderNewsTable();
    } catch (e) {
        window.showToast("Lỗi tải danh sách tin tức", true);
    }
}

window.renderNewsTable = function() {
    const tbody = document.getElementById('news-table-body');
    const search = (document.getElementById('news-search')?.value || '').toLowerCase();
    tbody.innerHTML = '';

    const keys = Object.keys(newsData).filter(k => (newsData[k].title || '').toLowerCase().includes(search));

    if (keys.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="py-8 text-center text-gray-400 italic">Không tìm thấy bài viết nào.</td></tr>`;
        return;
    }

    keys.forEach((key, idx) => {
        const item = newsData[key];
        const dateStr = new Date(item.created_at || Date.now()).toLocaleDateString('vi-VN');
        const tr = document.createElement('tr');
        tr.className = "hover:bg-amber-50/50 transition border-b border-gray-100";
        tr.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-400">#${idx + 1}</td>
            <td class="py-3 px-4 text-xs text-gray-500">${dateStr}</td>
            <td class="py-3 px-4 font-semibold text-gray-800">${item.title || ''}</td>
            <td class="py-3 px-4 text-xs font-mono text-chua-amber">${item.slug || '-'}</td>
            <td class="py-3 px-4 text-center space-x-1">
                <button onclick="window.editNews('${key}')" class="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition" title="Sửa"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="window.deleteNews('${key}')" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updateStats();
};

window.openNewsModal = function() {
    document.getElementById('news-form').reset();
    document.getElementById('news-key').value = '';
    document.getElementById('news-modal-title').textContent = "Thêm Bài Viết Mới";
    document.getElementById('modal-news').classList.remove('hidden');
};

window.closeNewsModal = function() {
    document.getElementById('modal-news').classList.add('hidden');
};

window.autoSlug = function() {
    const title = document.getElementById('news-title').value;
    const slug = title.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/([^0-9a-z-\s])/g, '')
        .replace(/(\s+)/g, '-');
    document.getElementById('news-slug').value = slug;
};

window.editNews = function(key) {
    const item = newsData[key];
    if (!item) return;
    document.getElementById('news-key').value = key;
    document.getElementById('news-title').value = item.title || '';
    document.getElementById('news-slug').value = item.slug || '';
    document.getElementById('news-image').value = item.image || '';
    document.getElementById('news-content').value = item.content || '';
    document.getElementById('news-modal-title').textContent = "Chỉnh Sửa Bài Viết";
    document.getElementById('modal-news').classList.remove('hidden');
};

window.saveNews = async function(e) {
    e.preventDefault();
    const key = document.getElementById('news-key').value;
    const payload = {
        title: document.getElementById('news-title').value,
        slug: document.getElementById('news-slug').value,
        image: document.getElementById('news-image').value,
        content: document.getElementById('news-content').value,
        created_at: key && newsData[key] ? (newsData[key].created_at || Date.now()) : Date.now()
    };

    if (key) {
        await fetch(`${FIREBASE_BASE}/news/${key}.json`, { method: 'PUT', body: JSON.stringify(payload) });
        window.showToast("Đã cập nhật bài viết!");
    } else {
        await fetch(`${FIREBASE_BASE}/news.json`, { method: 'POST', body: JSON.stringify(payload) });
        window.showToast("Đã thêm bài viết mới!");
    }
    window.closeNewsModal();
    fetchNews();
};

window.deleteNews = async function(key) {
    const ok = await window.askConfirm("Bạn có chắc chắn muốn xóa bài viết này không?");
    if (ok) {
        await fetch(`${FIREBASE_BASE}/news/${key}.json`, { method: 'DELETE' });
        window.showToast("Đã xóa bài viết!");
        fetchNews();
    }
};

function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = (url || '').match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

async function fetchVideos() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/videos.json`);
        videosData = (await res.json()) || {};
        renderVideosTable();
    } catch (e) {
        window.showToast("Lỗi tải danh sách video", true);
    }
}

function renderVideosTable() {
    const tbody = document.getElementById('video-table-body');
    tbody.innerHTML = '';
    const keys = Object.keys(videosData);

    if (keys.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="py-8 text-center text-gray-400 italic">Chưa có video nào.</td></tr>`;
        return;
    }

    keys.forEach(key => {
        const item = videosData[key];
        const yid = getYouTubeID(item.url);
        const thumb = yid ? `https://img.youtube.com/vi/${yid}/mqdefault.jpg` : 'https://placehold.co/120x80/3d1c1d/d4af37?text=Video';
        
        const tr = document.createElement('tr');
        tr.className = "hover:bg-amber-50/50 transition border-b border-gray-100";
        tr.innerHTML = `
            <td class="py-2 px-4 text-center">
                <img src="${thumb}" class="w-16 h-10 object-cover rounded-md mx-auto shadow-sm" alt="Thumbnail">
            </td>
            <td class="py-3 px-4 font-semibold text-gray-800">${item.title}</td>
            <td class="py-3 px-4 text-xs text-blue-600 font-mono truncate max-w-[200px]"><a href="${item.url}" target="_blank">${item.url}</a></td>
            <td class="py-3 px-4 text-center space-x-1">
                <button onclick="window.editVideo('${key}')" class="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition" title="Sửa"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="window.deleteVideo('${key}')" class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition" title="Xóa"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(tr);
    });
    updateStats();
}

window.openVideoModal = function() {
    document.getElementById('video-form').reset();
    document.getElementById('video-key').value = '';
    document.getElementById('modal-video').classList.remove('hidden');
};

window.closeVideoModal = function() {
    document.getElementById('modal-video').classList.add('hidden');
};

window.editVideo = function(key) {
    const v = videosData[key];
    if (!v) return;
    document.getElementById('video-key').value = key;
    document.getElementById('video-title').value = v.title || '';
    document.getElementById('video-url').value = v.url || '';
    document.getElementById('modal-video').classList.remove('hidden');
};

window.saveVideo = async function(e) {
    e.preventDefault();
    const key = document.getElementById('video-key').value;
    const payload = {
        title: document.getElementById('video-title').value,
        url: document.getElementById('video-url').value,
        created_at: Date.now()
    };

    if (key) {
        await fetch(`${FIREBASE_BASE}/videos/${key}.json`, { method: 'PUT', body: JSON.stringify(payload) });
        window.showToast("Đã lưu video!");
    } else {
        await fetch(`${FIREBASE_BASE}/videos.json`, { method: 'POST', body: JSON.stringify(payload) });
        window.showToast("Đã thêm video pháp thoại mới!");
    }
    window.closeVideoModal();
    fetchVideos();
};

window.deleteVideo = async function(key) {
    const ok = await window.askConfirm("Bạn có chắc chắn muốn xóa video này không?");
    if (ok) {
        await fetch(`${FIREBASE_BASE}/videos/${key}.json`, { method: 'DELETE' });
        window.showToast("Đã xóa video!");
        fetchVideos();
    }
};

async function fetchMonks() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/monks.json`);
        monksData = (await res.json()) || {};
        renderMonksGrid();
    } catch (e) {
        window.showToast("Lỗi tải danh sách Ban quản trị", true);
    }
}

function renderMonksGrid() {
    const grid = document.getElementById('monk-grid');
    grid.innerHTML = '';
    const keys = Object.keys(monksData);

    if (keys.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-8 text-gray-400 italic">Chưa có thông tin chư Tăng hay Ban quản trị.</div>`;
        return;
    }

    keys.forEach(key => {
        const m = monksData[key];
        const card = document.createElement('div');
        card.className = "bg-gray-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3 relative group";
        card.innerHTML = `
            <img src="${m.avatar || 'https://placehold.co/100x100/3d1c1d/d4af37?text=T%C6%B0%E1 meng'}" class="w-16 h-16 rounded-xl object-cover border border-amber-300" alt="${m.name}">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold font-serif text-chua-darkred text-sm truncate">${m.name}</h4>
                <p class="text-xs font-semibold text-chua-amber">${m.role || ''}</p>
                <p class="text-[11px] text-gray-500 mt-1 line-clamp-2">${m.desc || ''}</p>
            </div>
            <div class="flex flex-col space-y-1">
                <button onclick="window.editMonk('${key}')" class="text-amber-600 hover:text-amber-800 text-xs p-1"><i class="fa-solid fa-pen-to-square"></i></button>
                <button onclick="window.deleteMonk('${key}')" class="text-red-500 hover:text-red-700 text-xs p-1"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        grid.appendChild(card);
    });
    updateStats();
}

window.openMonkModal = function() {
    document.getElementById('monk-form').reset();
    document.getElementById('monk-key').value = '';
    document.getElementById('modal-monk').classList.remove('hidden');
};

window.closeMonkModal = function() {
    document.getElementById('modal-monk').classList.add('hidden');
};

window.editMonk = function(key) {
    const m = monksData[key];
    if (!m) return;
    document.getElementById('monk-key').value = key;
    document.getElementById('monk-name').value = m.name || '';
    document.getElementById('monk-role').value = m.role || '';
    document.getElementById('monk-avatar').value = m.avatar || '';
    document.getElementById('monk-desc').value = m.desc || '';
    document.getElementById('modal-monk').classList.remove('hidden');
};

window.saveMonk = async function(e) {
    e.preventDefault();
    const key = document.getElementById('monk-key').value;
    const payload = {
        name: document.getElementById('monk-name').value,
        role: document.getElementById('monk-role').value,
        avatar: document.getElementById('monk-avatar').value,
        desc: document.getElementById('monk-desc').value
    };

    if (key) {
        await fetch(`${FIREBASE_BASE}/monks/${key}.json`, { method: 'PUT', body: JSON.stringify(payload) });
        window.showToast("Đã cập nhật thông tin!");
    } else {
        await fetch(`${FIREBASE_BASE}/monks.json`, { method: 'POST', body: JSON.stringify(payload) });
        window.showToast("Đã thêm thành viên mới!");
    }
    window.closeMonkModal();
    fetchMonks();
};

window.deleteMonk = async function(key) {
    const ok = await window.askConfirm("Bạn có muốn xóa vị này khỏi danh sách Ban Quản Trị?");
    if (ok) {
        await fetch(`${FIREBASE_BASE}/monks/${key}.json`, { method: 'DELETE' });
        window.showToast("Đã xóa thành viên!");
        fetchMonks();
    }
};

window.testCloudConnection = async function() {
    const statusEl = document.getElementById('connection-status');
    statusEl.textContent = "Đang kiểm tra kết nối...";
    statusEl.className = "text-xs text-center font-semibold text-amber-600";
    
    try {
        const res = await fetch(`${FIREBASE_BASE}/.json?shallow=true`);
        if (res.ok) {
            statusEl.textContent = "✓ Kết nối thành công! Máy chủ Firebase Realtime Database phản hồi tốt.";
            statusEl.className = "text-xs text-center font-semibold text-emerald-600";
            window.showToast("Kết nối Cloud tốt!");
        } else {
            throw new Error("Không thể đọc phản hồi");
        }
    } catch (err) {
        statusEl.textContent = "✕ Thất bại! Vui lòng kiểm tra lại kết nối mạng hoặc quy tắc Firebase.";
        statusEl.className = "text-xs text-center font-semibold text-red-600";
        window.showToast("Kết nối Cloud thất bại", true);
    }
};
let adminsData = {};

window.loadAllData = async function() {
    await Promise.all([fetchNews(), fetchVideos(), fetchMonks(), fetchAdmins()]);
    updateStats();
};

async function fetchAdmins() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/admins.json`);
        adminsData = (await res.json()) || {};
        const tbody = document.getElementById('admin-table-body');
        tbody.innerHTML = '';
        
        Object.keys(adminsData).forEach(pin => {
            const admin = adminsData[pin];
            tbody.innerHTML += `
                <tr class="hover:bg-amber-50/50">
                    <td class="py-3 font-semibold text-gray-700">${admin.name}</td>
                    <td class="py-3 font-mono text-gray-500">${pin}</td>
                    <td class="py-3"><span class="bg-amber-100 text-amber-800 px-2 py-0.5 rounded text-[10px] uppercase font-bold">${admin.role}</span></td>
                    <td class="py-3 text-center">
                        <button onclick="deleteAdmin('${pin}')" class="text-red-500 hover:text-red-700 text-xs"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `;
        });
    } catch (e) {
        window.showToast("Lỗi tải danh sách Admin", true);
    }
}

window.deleteAdmin = async function(pin) {
    const ok = await window.askConfirm("Bạn có chắc chắn muốn xóa quyền truy cập của quản trị viên này?");
    if (ok) {
        await fetch(`${FIREBASE_BASE}/admins/${pin}.json`, { method: 'DELETE' });
        window.showToast("Đã xóa quản trị viên!");
        fetchAdmins();
    }
};

window.saveNewAdmin = async function() {
    const name = document.getElementById('new-admin-name').value;
    const pin = document.getElementById('new-admin-pin').value;
    const role = document.getElementById('new-admin-role').value;

    if (!name || !pin) return window.showToast("Vui lòng nhập đầy đủ tên và mã PIN!", true);

    try {
        const response = await fetch(`${FIREBASE_BASE}/admins/${pin}.json`, {
            method: 'PUT',
            body: JSON.stringify({ name, role, status: "Hoạt động" })
        });

        if (response.ok) {
            window.showToast("Đã thêm Admin thành công!");
            document.getElementById('admin-modal').classList.add('hidden');
            document.getElementById('new-admin-name').value = '';
            document.getElementById('new-admin-pin').value = '';
            fetchAdmins();
        }
    } catch (error) {
        window.showToast("Lỗi kết nối Firebase!", true);
    }
};