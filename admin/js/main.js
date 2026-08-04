const FIREBASE_BASE = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app';
        
let newsData = {};
let videosData = {};
let monksData = {};
let adminAccountsData = {};
let confirmResolver = null;
let selectedLoginRole = 'super';
let currentAdminRole = 'super'; // 'super', 'editor', 'viewer'

document.addEventListener('DOMContentLoaded', () => {
    const isAuth = sessionStorage.getItem('vinhhung_admin_logged');
    const savedRole = sessionStorage.getItem('vinhhung_admin_role');
    if (isAuth === 'true' && savedRole) {
        currentAdminRole = savedRole;
        document.getElementById('admin-lock-screen').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        document.getElementById('welcome-msg').classList.remove('hidden');
        applyRolePermissions();
        loadAllData();
    }
});

function selectRole(role) {
    selectedLoginRole = role;
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('border-chua-red', 'bg-amber-50/60');
        card.classList.add('border-gray-200');
    });
    const activeCard = document.getElementById(`role-card-${role}`);
    if (activeCard) {
        activeCard.classList.remove('border-gray-200');
        activeCard.classList.add('border-chua-red', 'bg-amber-50/60');
    }
    const pinInput = document.getElementById('admin-pin-input');
    if (role === 'super') pinInput.placeholder = "Mã PIN Tối Cao (Mặc định: 8888)...";
    if (role === 'editor') pinInput.placeholder = "Mã PIN Biên Tập (Mặc định: 6666)...";
    if (role === 'viewer') pinInput.placeholder = "Mã PIN Theo Dõi (Mặc định: 1111)...";
}

async function unlockAdmin() {
    const pin = document.getElementById('admin-pin-input').value.trim();
    
    // Lấy danh sách tài khoản quản trị từ Firebase hoặc mặc định
    await loadAdminAccounts();
    
    let authenticatedRole = '';
    let matchedAccountName = '';

    // Kiểm tra các mã PIN mặc định trước
    const defaultSuper = localStorage.getItem('pin_super') || '8888';
    const defaultEditor = localStorage.getItem('pin_editor') || '6666';
    const defaultViewer = localStorage.getItem('pin_viewer') || '1111';

    if (selectedLoginRole === 'super' && pin === defaultSuper) { authenticatedRole = 'super'; matchedAccountName = 'Super Admin Mặc Định'; }
    else if (selectedLoginRole === 'editor' && pin === defaultEditor) { authenticatedRole = 'editor'; matchedAccountName = 'Biên Tập Viên Mặc Định'; }
    else if (selectedLoginRole === 'viewer' && pin === defaultViewer) { authenticatedRole = 'viewer'; matchedAccountName = 'Theo Dõi Mặc Định'; }
    else {
        // Kiểm tra trong danh sách tài khoản custom đã thêm
        for (const key in adminAccountsData) {
            const acc = adminAccountsData[key];
            if (acc.pin === pin) {
                authenticatedRole = acc.role;
                matchedAccountName = acc.name;
                break;
            }
        }
        // Nếu chưa khớp theo role card, thử quét toàn bộ PIN mặc định
        if (!authenticatedRole) {
            if (pin === defaultSuper) { authenticatedRole = 'super'; matchedAccountName = 'Super Admin'; }
            else if (pin === defaultEditor) { authenticatedRole = 'editor'; matchedAccountName = 'Biên Tập Viên'; }
            else if (pin === defaultViewer) { authenticatedRole = 'viewer'; matchedAccountName = 'Theo Dõi'; }
        }
    }

    if (authenticatedRole) {
        currentAdminRole = authenticatedRole;
        sessionStorage.setItem('vinhhung_admin_logged', 'true');
        sessionStorage.setItem('vinhhung_admin_role', authenticatedRole);
        sessionStorage.setItem('vinhhung_admin_name', matchedAccountName);

        document.getElementById('admin-lock-screen').classList.add('hidden');
        document.getElementById('admin-content').classList.remove('hidden');
        document.getElementById('welcome-msg').classList.remove('hidden');
        
        applyRolePermissions();
        showToast(`Đăng nhập thành công (${matchedAccountName})`);
        loadAllData();
    } else {
        showToast("Mã PIN không đúng! (Thử: 8888, 6666 hoặc 1111)", true);
    }
}

function applyRolePermissions() {
    const badge = document.getElementById('sidebar-role-badge');
    const nameDisplay = document.getElementById('admin-display-name');
    const permTabWrapper = document.getElementById('nav-permissions-wrapper');
    const quickButtons = document.getElementById('quick-action-buttons');
    const savedName = sessionStorage.getItem('vinhhung_admin_name') || 'Quản Trị Viên';

    if (currentAdminRole === 'super') {
        badge.textContent = "Quyền: Tối Cao (Super)";
        badge.className = "inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-red-100 text-chua-red font-bold uppercase";
        nameDisplay.textContent = savedName;
        if (permTabWrapper) permTabWrapper.style.display = 'block';
        if (quickButtons) quickButtons.style.display = 'grid';
    } else if (currentAdminRole === 'editor') {
        badge.textContent = "Quyền: Biên Tập";
        badge.className = "inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-blue-100 text-blue-700 font-bold uppercase";
        nameDisplay.textContent = savedName;
        if (permTabWrapper) permTabWrapper.style.display = 'none';
        if (quickButtons) quickButtons.style.display = 'grid';
    } else {
        badge.textContent = "Quyền: Theo Dõi";
        badge.className = "inline-block mt-1 px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-bold uppercase";
        nameDisplay.textContent = savedName;
        if (permTabWrapper) permTabWrapper.style.display = 'none';
        if (quickButtons) quickButtons.style.display = 'none';
        
        ['btn-add-news', 'btn-add-video', 'btn-add-monk'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.style.display = 'none';
        });
    }
}

function logoutAdmin() {
    sessionStorage.removeItem('vinhhung_admin_logged');
    sessionStorage.removeItem('vinhhung_admin_role');
    sessionStorage.removeItem('vinhhung_admin_name');
    location.reload();
}

function showToast(msg, isError = false) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `px-4 py-3 rounded-xl text-xs font-semibold shadow-lg text-white flex items-center space-x-2 pointer-events-none transition transform duration-300 ${isError ? 'bg-red-600' : 'bg-emerald-600'}`;
    toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-exclamation' : 'fa-circle-check'} text-base"></i><span>${msg}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function switchTab(tabName) {
    if (currentAdminRole === 'viewer' && (tabName === 'permissions')) {
        showToast("Tài khoản Theo dõi không có quyền truy cập mục này!", true);
        return;
    }
    document.querySelectorAll('section[id^="tab-sec-"]').forEach(sec => sec.classList.add('hidden'));
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    const targetSec = document.getElementById(`tab-sec-${tabName}`);
    const targetBtn = document.getElementById(`tab-btn-${tabName}`);

    if (targetSec && targetBtn) {
        targetSec.classList.remove('hidden');
        targetBtn.classList.add('active');
    }
}

async function loadAllData() {
    await Promise.all([loadNews(), loadVideos(), loadMonks(), loadAdminAccounts()]);
}

// ================= QUẢN LÝ TÀI KHOẢN PHÂN QUYỀN =================
async function loadAdminAccounts() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/admin_accounts.json`);
        const data = await res.json();
        adminAccountsData = data || {};
        renderAdminAccountsTable();
    } catch (err) {
        console.error("Lỗi tải danh sách tài khoản:", err);
    }
}

function renderAdminAccountsTable() {
    const tbody = document.getElementById('admin-accounts-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    const keys = Object.keys(adminAccountsData);
    
    // Luôn hiển thị 3 tài khoản mặc định hệ thống
    let html = `
        <tr class="bg-amber-50/30">
            <td class="py-3 px-4 font-bold text-gray-800">Super Admin (Mặc định)</td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 bg-red-100 text-chua-red text-[10px] font-bold rounded uppercase">Tối Cao</span></td>
            <td class="py-3 px-4 font-mono font-bold text-gray-600">${localStorage.getItem('pin_super') || '8888'}</td>
            <td class="py-3 px-4 text-center text-xs text-gray-400 italic">Mặc định hệ thống</td>
        </tr>
        <tr class="bg-amber-50/30">
            <td class="py-3 px-4 font-bold text-gray-800">Biên Tập Viên (Mặc định)</td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Biên Tập</span></td>
            <td class="py-3 px-4 font-mono font-bold text-gray-600">${localStorage.getItem('pin_editor') || '6666'}</td>
            <td class="py-3 px-4 text-center text-xs text-gray-400 italic">Mặc định hệ thống</td>
        </tr>
        <tr class="bg-amber-50/30">
            <td class="py-3 px-4 font-bold text-gray-800">Theo Dõi (Mặc định)</td>
            <td class="py-3 px-4"><span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Theo Dõi</span></td>
            <td class="py-3 px-4 font-mono font-bold text-gray-600">${localStorage.getItem('pin_viewer') || '1111'}</td>
            <td class="py-3 px-4 text-center text-xs text-gray-400 italic">Mặc định hệ thống</td>
        </tr>
    `;

    if (keys.length > 0) {
        keys.forEach(key => {
            const acc = adminAccountsData[key];
            let roleBadge = '';
            if (acc.role === 'super') roleBadge = '<span class="px-2 py-0.5 bg-red-100 text-chua-red text-[10px] font-bold rounded uppercase">Tối Cao</span>';
            else if (acc.role === 'editor') roleBadge = '<span class="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase">Biên Tập</span>';
            else roleBadge = '<span class="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded uppercase">Theo Dõi</span>';

            let delBtn = currentAdminRole === 'super' ? `<button onclick="deleteAdminAccount('${key}')" class="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><i class="fa-solid fa-trash"></i> Xóa</button>` : '';

            html += `
                <tr class="hover:bg-amber-50/40 transition">
                    <td class="py-3 px-4 font-semibold text-gray-800">${acc.name}</td>
                    <td class="py-3 px-4">${roleBadge}</td>
                    <td class="py-3 px-4 font-mono font-bold text-gray-700">${acc.pin}</td>
                    <td class="py-3 px-4 text-center">${delBtn}</td>
                </tr>
            `;
        });
    }
    tbody.innerHTML = html;
}

function openAddAdminModal() {
    if (currentAdminRole !== 'super') {
        showToast("Chỉ Super Admin mới có quyền thêm tài khoản quản trị!", true);
        return;
    }
    document.getElementById('admin-acc-name').value = '';
    document.getElementById('admin-acc-pin').value = '';
    document.getElementById('admin-acc-role').value = 'editor';
    document.getElementById('modal-admin-account').classList.remove('hidden');
}

function closeAddAdminModal() {
    document.getElementById('modal-admin-account').classList.add('hidden');
}

async function saveAdminAccount(e) {
    e.preventDefault();
    const name = document.getElementById('admin-acc-name').value.trim();
    const role = document.getElementById('admin-acc-role').value;
    const pin = document.getElementById('admin-acc-pin').value.trim();

    if (!name || !pin) {
        showToast("Vui lòng nhập đầy đủ thông tin tài khoản và mã PIN!", true);
        return;
    }

    try {
        const res = await fetch(`${FIREBASE_BASE}/admin_accounts.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role, pin, created_at: Date.now() })
        });
        if (res.ok) {
            showToast("Đã cấp tài khoản quản trị thành công!");
            closeAddAdminModal();
            loadAdminAccounts();
        } else {
            showToast("Không thể lưu tài khoản lên Firebase.", true);
        }
    } catch (err) {
        console.error("Lỗi:", err);
        showToast("Lỗi kết nối khi lưu tài khoản.", true);
    }
}

async function deleteAdminAccount(key) {
    if (currentAdminRole !== 'super') {
        showToast("Chỉ Super Admin mới có quyền xóa tài khoản!", true);
        return;
    }
    if (confirm("Bạn có chắc chắn muốn xóa tài khoản quản trị này?")) {
        try {
            await fetch(`${FIREBASE_BASE}/admin_accounts/${key}.json`, { method: 'DELETE' });
            showToast("Đã xóa tài khoản thành công!");
            loadAdminAccounts();
        } catch (err) {
            showToast("Lỗi khi xóa tài khoản.", true);
        }
    }
}

// ================= XỬ LÝ ẢNH BASE64 =================
function previewNewsImage(event) {
    const file = event.target.files[0];
    if (!file) return;
    document.getElementById('news-file-name').textContent = file.name;
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        document.getElementById('news-input-image').value = base64;
        document.getElementById('news-preview-img').src = base64;
        document.getElementById('news-preview-container').classList.remove('hidden');
    };
    reader.readAsDataURL(file);
}

function clearNewsImage() {
    document.getElementById('news-input-image').value = '';
    document.getElementById('news-file-input').value = '';
    document.getElementById('news-file-name').textContent = 'Chưa có tệp nào được chọn';
    document.getElementById('news-preview-container').classList.add('hidden');
}

// ================= QUẢN LÝ TIN TỨC =================
async function loadNews() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/news.json`);
        const data = await res.json();
        newsData = data || {};
        renderNewsTable();
        document.getElementById('stat-news-count').textContent = Object.keys(newsData).length;
    } catch (err) {
        console.error("Lỗi tải tin tức:", err);
    }
}

function renderNewsTable() {
    const tbody = document.getElementById('news-table-body');
    const searchVal = (document.getElementById('news-search')?.value || '').toLowerCase();
    tbody.innerHTML = '';

    const keys = Object.keys(newsData);
    if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="py-8 text-center text-gray-400">Chưa có bài viết nào trên hệ thống.</td></tr>';
        return;
    }

    let count = 0;
    keys.reverse().forEach(key => {
        const item = newsData[key];
        if (searchVal && !item.title.toLowerCase().includes(searchVal)) return;
        count++;

        const tr = document.createElement('tr');
        tr.className = "hover:bg-amber-50/40 transition";
        const dateStr = item.created_at ? new Date(item.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật';

        let actionHtml = '';
        if (currentAdminRole === 'viewer') {
            actionHtml = `<span class="text-xs text-gray-400 italic">Chỉ xem</span>`;
        } else if (currentAdminRole === 'editor') {
            actionHtml = `<button onclick="editNews('${key}')" class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><i class="fa-solid fa-pen"></i> Sửa</button>`;
        } else {
            actionHtml = `
                <button onclick="editNews('${key}')" class="px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"><i class="fa-solid fa-pen"></i></button>
                <button onclick="confirmDeleteNews('${key}')" class="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"><i class="fa-solid fa-trash"></i></button>
            `;
        }

        tr.innerHTML = `
            <td class="py-3 px-4 text-center font-bold text-gray-500">${count}</td>
            <td class="py-3 px-4 text-gray-600 text-xs">${dateStr}</td>
            <td class="py-3 px-4 font-semibold text-gray-800">${item.title || ''}</td>
            <td class="py-3 px-4 text-center space-x-2">${actionHtml}</td>
        `;
        tbody.appendChild(tr);
    });
}

function openNewsModal() {
    if (currentAdminRole === 'viewer') {
        showToast("Tài khoản Theo dõi không có quyền thêm bài viết!", true);
        return;
    }
    document.getElementById('news-key').value = '';
    document.getElementById('news-title').value = '';
    document.getElementById('news-input-image').value = '';
    document.getElementById('news-content').value = '';
    clearNewsImage();
    document.getElementById('news-modal-title').textContent = 'Thêm Bài Viết Mới';
    document.getElementById('modal-news').classList.remove('hidden');
}

function closeNewsModal() {
    document.getElementById('modal-news').classList.add('hidden');
}

async function saveNews(e) {
    e.preventDefault();
    const key = document.getElementById('news-key').value;
    const title = document.getElementById('news-title').value;
    const image = document.getElementById('news-input-image').value;
    const content = document.getElementById('news-content').value;

    const postData = {
        title,
        image,
        content,
        created_at: key && newsData[key]?.created_at ? newsData[key].created_at : Date.now()
    };

    const url = key ? `${FIREBASE_BASE}/news/${key}.json` : `${FIREBASE_BASE}/news.json`;
    const method = key ? 'PUT' : 'POST';

    try {
        const res = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(postData)
        });
        if (res.ok) {
            showToast(key ? "Đã cập nhật bài viết thành công!" : "Đã thêm bài viết mới thành công!");
            closeNewsModal();
            loadNews();
        } else {
            showToast("Không thể lưu bài viết lên Firebase.", true);
        }
    } catch (err) {
        console.error("Lỗi lưu:", err);
        showToast("Lỗi kết nối mạng khi lưu.", true);
    }
}

function editNews(key) {
    if (currentAdminRole === 'viewer') {
        showToast("Tài khoản Theo dõi không được phép chỉnh sửa!", true);
        return;
    }
    const item = newsData[key];
    if (!item) return;
    document.getElementById('news-key').value = key;
    document.getElementById('news-title').value = item.title || '';
    document.getElementById('news-input-image').value = item.image || '';
    document.getElementById('news-content').value = item.content || '';
    
    if (item.image) {
        document.getElementById('news-preview-img').src = item.image;
        document.getElementById('news-preview-container').classList.remove('hidden');
        document.getElementById('news-file-name').textContent = 'Ảnh đã có sẵn';
    } else {
        clearNewsImage();
    }

    document.getElementById('news-modal-title').textContent = 'Chỉnh Sửa Bài Viết';
    document.getElementById('modal-news').classList.remove('hidden');
}

function confirmDeleteNews(key) {
    if (currentAdminRole !== 'super') {
        showToast("Chỉ Super Admin mới có quyền xóa bài viết!", true);
        return;
    }
    document.getElementById('confirm-msg').textContent = "Bạn có chắc chắn muốn xóa bài viết này không?";
    document.getElementById('modal-confirm').classList.remove('hidden');
    confirmResolver = async (res) => {
        if (res) {
            await fetch(`${FIREBASE_BASE}/news/${key}.json`, { method: 'DELETE' });
            showToast("Đã xóa bài viết thành công!");
            loadNews();
        }
    };
}

function closeConfirmModal(result) {
    document.getElementById('modal-confirm').classList.add('hidden');
    if (confirmResolver) {
        confirmResolver(result);
        confirmResolver = null;
    }
}

// ================= QUẢN LÝ VIDEO =================
async function loadVideos() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/videos.json`);
        const data = await res.json();
        videosData = data || {};
        const tbody = document.getElementById('video-table-body');
        tbody.innerHTML = '';
        const keys = Object.keys(videosData);
        document.getElementById('stat-video-count').textContent = keys.length;

        if (keys.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="py-6 text-center text-gray-400">Chưa có video nào.</td></tr>';
            return;
        }

        keys.forEach(key => {
            const item = videosData[key];
            const tr = document.createElement('tr');
            tr.className = "hover:bg-amber-50/40 transition";
            
            let delBtn = currentAdminRole === 'super' ? `<button onclick="deleteVideo('${key}')" class="px-2.5 py-1 bg-red-50 text-red-600 rounded-lg"><i class="fa-solid fa-trash"></i></button>` : '';

            tr.innerHTML = `
                <td class="py-3 px-4 font-semibold text-gray-800">${item.title || ''}</td>
                <td class="py-3 px-4 text-blue-600 truncate max-w-xs"><a href="${item.url}" target="_blank">${item.url}</a></td>
                <td class="py-3 px-4 text-center space-x-2">${delBtn}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (err) { console.error(err); }
}

function openVideoModal() {
    if (currentAdminRole === 'viewer') {
        showToast("Tài khoản Theo dõi không có quyền thêm video!", true);
        return;
    }
    document.getElementById('video-key').value = '';
    document.getElementById('video-title').value = '';
    document.getElementById('video-url').value = '';
    document.getElementById('modal-video').classList.remove('hidden');
}

function closeVideoModal() {
    document.getElementById('modal-video').classList.add('hidden');
}

async function saveVideo(e) {
    e.preventDefault();
    const title = document.getElementById('video-title').value;
    const url = document.getElementById('video-url').value;
    await fetch(`${FIREBASE_BASE}/videos.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, url })
    });
    showToast("Đã thêm video thành công!");
    closeVideoModal();
    loadVideos();
}

async function deleteVideo(key) {
    if (currentAdminRole !== 'super') {
        showToast("Chỉ Super Admin mới có quyền xóa video!", true);
        return;
    }
    if (confirm("Xóa video này?")) {
        await fetch(`${FIREBASE_BASE}/videos/${key}.json`, { method: 'DELETE' });
        showToast("Đã xóa video!");
        loadVideos();
    }
}

// ================= QUẢN LÝ CHƯ TĂNG =================
async function loadMonks() {
    try {
        const res = await fetch(`${FIREBASE_BASE}/monks.json`);
        const data = await res.json();
        monksData = data || {};
        const grid = document.getElementById('monk-grid');
        grid.innerHTML = '';
        const keys = Object.keys(monksData);
        document.getElementById('stat-monk-count').textContent = keys.length;

        if (keys.length === 0) {
            grid.innerHTML = '<p class="text-gray-400 text-sm">Chưa có thông tin chư tăng.</p>';
            return;
        }

        keys.forEach(key => {
            const item = monksData[key];
            const div = document.createElement('div');
            div.className = "bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center space-x-4";
            
            let delBtn = currentAdminRole === 'super' ? `<button onclick="deleteMonk('${key}')" class="text-red-500 hover:text-red-700 p-2"><i class="fa-solid fa-trash"></i></button>` : '';

            div.innerHTML = `
                <img src="${item.avatar || 'https://placehold.co/100x100/3d1c1d/d4af37?text=Ảnh'}" class="w-14 h-14 rounded-full object-cover border border-amber-300">
                <div class="flex-1 overflow-hidden">
                    <h4 class="font-bold text-gray-800 text-sm truncate">${item.name}</h4>
                    <p class="text-xs text-chua-red font-semibold">${item.role}</p>
                </div>
                ${delBtn}
            `;
            grid.appendChild(div);
        });
    } catch (err) { console.error(err); }
}

function openMonkModal() {
    if (currentAdminRole !== 'super') {
        showToast("Chỉ Super Admin mới có quyền thêm thành viên chư tăng!", true);
        return;
    }
    document.getElementById('monk-key').value = '';
    document.getElementById('monk-name').value = '';
    document.getElementById('monk-role').value = '';
    document.getElementById('monk-avatar').value = '';
    document.getElementById('modal-monk').classList.remove('hidden');
}

function closeMonkModal() {
    document.getElementById('modal-monk').classList.add('hidden');
}

async function saveMonk(e) {
    e.preventDefault();
    const name = document.getElementById('monk-name').value;
    const role = document.getElementById('monk-role').value;
    const avatar = document.getElementById('monk-avatar').value;
    await fetch(`${FIREBASE_BASE}/monks.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, avatar })
    });
    showToast("Đã thêm thành viên thành công!");
    closeMonkModal();
    loadMonks();
}

async function deleteMonk(key) {
    if (currentAdminRole !== 'super') {
        showToast("Chỉ Super Admin mới có quyền xóa!", true);
        return;
    }
    if (confirm("Xóa thành viên này?")) {
        await fetch(`${FIREBASE_BASE}/monks/${key}.json`, { method: 'DELETE' });
        showToast("Đã xóa thành viên!");
        loadMonks();
    }
}

function testCloudConnection() {
    const status = document.getElementById('connection-status');
    status.textContent = "Đang kiểm tra kết nối...";
    fetch(`${FIREBASE_BASE}/news.json`)
        .then(r => r.json())
        .then(() => {
            status.textContent = "Kết nối Firebase Realtime Database thành công!";
            status.className = "text-xs font-semibold text-emerald-600";
        })
        .catch(() => {
            status.textContent = "Không thể kết nối tới Firebase!";
            status.className = "text-xs font-semibold text-red-600";
        });
}