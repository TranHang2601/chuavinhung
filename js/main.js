// ==========================================
// HEADER DEFAULTS & LOGIC
// ==========================================
const DEFAULT_HEADER_HTML = `
<header id="header" class="fixed w-full top-0 z-50 transition-all duration-300 text-white bg-black/50 backdrop-blur-sm border-b border-white/10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-20">
            <!-- Logo và Tên Chùa -->
            <div class="flex-shrink-0 flex items-center cursor-pointer" onclick="window.location.href='index.html'">
                <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white p-1 shadow-md flex-shrink-0 border-2 border-amber-400 overflow-hidden flex items-center justify-center">
                    <img src="images/logo.png" alt="Logo Chùa Vĩnh Hưng" onerror="this.src='https://placehold.co/100x100/e11d48/ffffff?text=VH'">
                </div>
                <span id="logo-text" class="text-lg sm:text-2xl font-serif font-bold tracking-wider transition-colors duration-300 ml-3 text-amber-200">
                    CHÙA VĨNH HƯNG
                </span>
            </div>
            
            <!-- Desktop Navigation Menu -->
            <nav id="desktop-menu-nav" class="hidden md:flex space-x-6 lg:space-x-8 items-center">
                <a href="index.html" class="nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-bold pb-1 border-b-2 text-amber-400 border-amber-400">Trang Chủ</a>
                <a href="gioi-thieu.html" class="nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-semibold text-white hover:text-amber-300">Giới Thiệu</a>
                <a href="tin-tuc.html" class="nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-semibold text-white hover:text-amber-300">Tin Tức & Khóa Tu</a>
                <a href="video.html" class="nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-semibold text-white hover:text-amber-300">Giảng Pháp</a>
                <a href="lien-he.html" class="nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-semibold text-white hover:text-amber-300">Liên Hệ</a>
            </nav>

            <!-- Mobile Hamburger Button -->
            <div class="md:hidden flex items-center">
                <button id="mobile-menu-btn" onclick="toggleMobileMenu()" class="text-amber-200 hover:text-white focus:outline-none p-2 rounded-xl bg-white/10 border border-amber-400/30 transition-colors">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- Mobile Drawer Container -->
    <div id="mobile-menu" class="hidden md:hidden bg-white/95 backdrop-blur-md shadow-2xl absolute w-full left-0 top-20 border-t border-amber-200 text-slate-800">
        <div id="mobile-menu-container" class="px-4 py-4 space-y-2">
            <a href="index.html" class="block px-4 py-2.5 text-sm rounded-xl transition bg-amber-50 text-amber-800 font-bold">Trang Chủ</a>
            <a href="gioi-thieu.html" class="block px-4 py-2.5 text-sm rounded-xl transition text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-semibold">Giới Thiệu</a>
            <a href="tin-tuc.html" class="block px-4 py-2.5 text-sm rounded-xl transition text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-semibold">Tin Tức & Khóa Tu</a>
            <a href="video.html" class="block px-4 py-2.5 text-sm rounded-xl transition text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-semibold">Giảng Pháp</a>
            <a href="lien-he.html" class="block px-4 py-2.5 text-sm rounded-xl transition text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-semibold">Liên Hệ</a>
        </div>
    </div>
</header>
`;

// ==========================================
// FOOTER DEFAULTS & LOGIC
// ==========================================
const DEFAULT_FOOTER_HTML = `
<footer id="lien-he" class="bg-buddhist-dark text-gray-300 pt-16 pb-8 border-t-[6px] border-buddhist-gold">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <!-- Cột 1 -->
            <div>
                <div class="flex items-center mb-6">
                    <i class="fa-solid fa-dharmachakra text-3xl text-buddhist-gold mr-3"></i>
                    <span class="text-2xl font-heading font-bold tracking-wider text-white">
                        CHÙA VĨNH HƯNG
                    </span>
                </div>
                <p class="text-sm leading-relaxed mb-6">
                    Ngôi chùa thanh tịnh, nơi lan tỏa ánh sáng Phật pháp, giúp mọi người tìm thấy sự bình an trong tâm hồn và hướng tới nếp sống chân - thiện - mỹ.
                </p>
                <div class="flex space-x-4">
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-buddhist-gold hover:text-buddhist-dark transition">
                        <i class="fa-brands fa-facebook-f"></i>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-buddhist-gold hover:text-buddhist-dark transition">
                        <i class="fa-brands fa-youtube"></i>
                    </a>
                    <a href="#" class="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-buddhist-gold hover:text-buddhist-dark transition">
                        <i class="fa-brands fa-tiktok"></i>
                    </a>
                </div>
            </div>

            <!-- Cột 2 -->
            <div>
                <h4 class="text-white font-heading font-bold text-lg mb-6 uppercase tracking-wider relative inline-block">
                    Liên Kết Nhanh
                    <span class="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-buddhist-gold"></span>
                </h4>
                <ul class="space-y-3 text-sm">
                    <li><a href="gioi-thieu.html" class="hover:text-buddhist-gold transition"><i class="fa-solid fa-chevron-right text-xs text-buddhist-gold mr-2"></i> Giới thiệu Chùa</a></li>
                    <li><a href="tin-tuc.html" class="hover:text-buddhist-gold transition"><i class="fa-solid fa-chevron-right text-xs text-buddhist-gold mr-2"></i> Lịch hoạt động & Khóa tu</a></li>
                    <li><a href="video.html" class="hover:text-buddhist-gold transition"><i class="fa-solid fa-chevron-right text-xs text-buddhist-gold mr-2"></i> Thư viện Video Bài Giảng</a></li>
                    <li><a href="tin-tuc.html" class="hover:text-buddhist-gold transition"><i class="fa-solid fa-chevron-right text-xs text-buddhist-gold mr-2"></i> Hoạt động Từ Thiện</a></li>
                    <li><a href="lien-he.html" class="hover:text-buddhist-gold transition"><i class="fa-solid fa-chevron-right text-xs text-buddhist-gold mr-2"></i> Quỹ Cúng Dường</a></li>
                </ul>
            </div>

            <!-- Cột 3 -->
            <div>
                <h4 class="text-white font-heading font-bold text-lg mb-6 uppercase tracking-wider relative inline-block">
                    Thông Tin Liên Hệ
                    <span class="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-buddhist-gold"></span>
                </h4>
                <ul class="space-y-4 text-sm">
                    <li class="flex items-start">
                        <i class="fa-solid fa-location-dot mt-1 text-buddhist-gold mr-3"></i>
                        <span>Khu Phố Vĩnh Hiệp - Phường Tân Triều - Thành Phố Đồng Nai</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fa-solid fa-phone text-buddhist-gold mr-3"></i>
                        <span>(028) 3812 3456</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fa-solid fa-envelope text-buddhist-gold mr-3"></i>
                        <span>chuavinhhung@gmail.com</span>
                    </li>
                    <li class="flex items-center">
                        <i class="fa-regular fa-clock text-buddhist-gold mr-3"></i>
                        <span>Mở cửa: 04:30 - 21:00 mỗi ngày</span>
                    </li>
                </ul>
            </div>

            <!-- Cột 4 -->
            <div>
                <h4 class="text-white font-heading font-bold text-lg mb-6 uppercase tracking-wider relative inline-block">
                    Đăng Ký Nhận Tin
                    <span class="absolute bottom-[-8px] left-0 w-1/2 h-1 bg-buddhist-gold"></span>
                </h4>
                <p class="text-sm mb-4">Để lại email để nhận thông báo về các khóa tu và bản tin Phật sự mới nhất.</p>
                <form class="flex flex-col space-y-3" onsubmit="event.preventDefault();">
                    <input type="email" placeholder="Nhập địa chỉ email..." class="bg-gray-800 text-white border border-gray-700 px-4 py-2 rounded focus:outline-none focus:border-buddhist-gold">
                    <button type="submit" class="bg-buddhist-gold text-buddhist-dark font-bold py-2 rounded hover:bg-yellow-500 transition">
                        Đăng Ký
                    </button>
                </form>
            </div>
        </div>

        <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
            <p>&copy; 2026 Chùa Vĩnh Hưng. Tất cả các quyền được bảo lưu.</p>
            <div class="mt-4 md:mt-0 space-x-4">
                <a href="#" class="hover:text-white transition">Chính sách bảo mật</a>
                <a href="#" class="hover:text-white transition">Điều khoản sử dụng</a>
            </div>
        </div>
    </div>
</footer>
`;

// Mobile Menu Toggle Function
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('hidden');
    }
}

// Dynamically Load Menus for Header
async function loadHeaderDynamicMenus() {
    const desktopNav = document.getElementById('desktop-menu-nav');
    const mobileContainer = document.getElementById('mobile-menu-container');

    if (!desktopNav || !mobileContainer) return;

    try {
        let menuData = null;
        if (typeof firebase !== 'undefined' && firebase.database) {
            const snapshot = await firebase.database().ref('menus').once('value');
            menuData = snapshot.val();
        } else {
            const response = await fetch('https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/menus.json');
            if (response.ok) {
                menuData = await response.json();
            }
        }

        if (!menuData || Object.keys(menuData).length === 0) {
            updateNavColorsOnScroll();
            return;
        }

        const sortedKeys = Object.keys(menuData).sort((a, b) => (menuData[a].order || 0) - (menuData[b].order || 0));
        
        let desktopHtml = '';
        let mobileHtml = '';
        let rawPath = window.location.pathname.split('/').pop() || 'index.html';
        const currentPath = rawPath.split('?')[0];
        const isScrolled = window.scrollY > 50;

        sortedKeys.forEach(key => {
            const item = menuData[key];
            const title = item.title || '';
            const url = item.url || '#';
            const isActive = currentPath === url || (currentPath === '' && url === 'index.html');

            const desktopClass = isActive 
                ? (isScrolled ? 'text-amber-600 border-b-2 border-amber-600 pb-1 font-bold' : 'text-amber-400 border-b-2 border-amber-400 pb-1 font-bold')
                : (isScrolled ? 'text-slate-700 hover:text-amber-700 font-semibold' : 'text-white hover:text-amber-300 font-semibold');

            const mobileClass = isActive 
                ? 'bg-amber-50 text-amber-800 font-bold' 
                : 'text-slate-700 hover:bg-amber-50 hover:text-amber-700 font-semibold';

            desktopHtml += `<a href="${url}" data-url="${url}" data-active="${isActive}" class="nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors ${desktopClass}">${title}</a>`;
            mobileHtml += `<a href="${url}" class="block px-4 py-2.5 text-sm rounded-xl transition ${mobileClass}">${title}</a>`;
        });

        desktopNav.innerHTML = desktopHtml;
        mobileContainer.innerHTML = mobileHtml;

        updateNavColorsOnScroll();
    } catch (err) {
        console.warn("Dùng menu mặc định:", err);
        updateNavColorsOnScroll();
    }
}

// Handle scroll effects for Header
function updateNavColorsOnScroll() {
    const isScrolled = window.scrollY > 50;
    let rawPath = window.location.pathname.split('/').pop() || 'index.html';
    const currentPath = rawPath.split('?')[0];
    const navLinks = document.querySelectorAll('#desktop-menu-nav .nav-link');

    navLinks.forEach(link => {
        const href = (link.getAttribute('href') || link.getAttribute('data-url') || '').split('/').pop().split('?')[0];
        const isActive = link.getAttribute('data-active') === 'true' || href === currentPath || (currentPath === '' && href === 'index.html');
        if (isActive) {
            link.setAttribute('data-active', 'true');
            link.className = `nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-bold pb-1 border-b-2 ${
                isScrolled ? 'text-amber-600 border-amber-600' : 'text-amber-400 border-amber-400'
            }`;
        } else {
            link.setAttribute('data-active', 'false');
            link.className = `nav-link text-xs lg:text-sm uppercase tracking-wider transition-colors font-semibold ${
                isScrolled ? 'text-slate-700 hover:text-amber-700' : 'text-white hover:text-amber-300'
            }`;
        }
    });
}

function setupHeaderScrollEffect() {
    const header = document.getElementById('header');
    const logoText = document.getElementById('logo-text');
    const mobileBtn = document.getElementById('mobile-menu-btn');

    if (!header) return;

    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.remove('bg-black/50', 'bg-black', 'bg-opacity-40', 'text-white', 'border-white/10');
            header.classList.add('bg-white', 'text-slate-800', 'shadow-md', 'border-b', 'border-slate-200');
            if (logoText) {
                logoText.classList.remove('text-amber-200');
                logoText.classList.add('text-amber-700');
            }
            if (mobileBtn) {
                mobileBtn.classList.remove('text-amber-200', 'bg-white/10', 'border-amber-400/30');
                mobileBtn.classList.add('text-amber-800', 'bg-slate-100', 'border-slate-300');
            }
        } else {
            header.classList.add('bg-black/50', 'text-white', 'border-white/10');
            header.classList.remove('bg-white', 'text-slate-800', 'shadow-md', 'border-b', 'border-slate-200');
            if (logoText) {
                logoText.classList.add('text-amber-200');
                logoText.classList.remove('text-amber-700');
            }
            if (mobileBtn) {
                mobileBtn.classList.add('text-amber-200', 'bg-white/10', 'border-amber-400/30');
                mobileBtn.classList.remove('text-amber-800', 'bg-slate-100', 'border-slate-300');
            }
        }
        updateNavColorsOnScroll();
    };

    window.removeEventListener('scroll', handleScroll);
    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

function initHeader() {
    loadHeaderDynamicMenus();
    setupHeaderScrollEffect();
}

// Load Header Dynamic Content
async function loadHeaderContainer() {
    const container = document.getElementById('header-container');
    if (!container) return;

    let loaded = false;
    const pathsToTry = ['header.html', 'pages/header.html', './header.html'];

    for (const path of pathsToTry) {
        try {
            const res = await fetch(path);
            if (res.ok) {
                const html = await res.text();
                container.innerHTML = html;
                loaded = true;
                break;
            }
        } catch (e) {
            // Thử đường dẫn tiếp theo
        }
    }

    if (!loaded) {
        container.innerHTML = DEFAULT_HEADER_HTML;
    }

    initHeader();
}

// Load Footer Dynamic Content
async function loadFooterContainer() {
    const container = document.getElementById('footer-container');
    if (!container) return;

    let loaded = false;
    const pathsToTry = ['footer.html', 'pages/footer.html', './footer.html'];

    for (const path of pathsToTry) {
        try {
            const res = await fetch(path);
            if (res.ok) {
                const html = await res.text();
                container.innerHTML = html;
                loaded = true;
                break;
            }
        } catch (e) {
            // Thử đường dẫn tiếp theo
        }
    }

    if (!loaded) {
        container.innerHTML = DEFAULT_FOOTER_HTML;
    }
}

// Init layout components when DOM is ready
function initLayoutComponents() {
    loadHeaderContainer();
    loadFooterContainer();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLayoutComponents);
} else {
    initLayoutComponents();
}