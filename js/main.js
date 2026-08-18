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
<footer id="lien-he" class="bg-gradient-to-b from-[#ffffff] via-[#fcfaf7] to-[#f4efe6] text-gray-800 pt-16 pb-12 relative overflow-hidden border-t border-amber-200/60 shadow-inner">
    <!-- Họa tiết hào quang ánh sáng thiền định tinh tế ở trung tâm -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-400/10 blur-[140px] pointer-events-none rounded-full"></div>

    <!-- Kiểu chữ chạy mới: Dải huy hiệu badge nổi bật, mượt mà -->
    <div class="w-full bg-amber-500/10 border-y border-amber-500/20 py-3.5 mb-14 overflow-hidden relative shadow-inner">
        <div class="flex whitespace-nowrap animate-marquee text-amber-900 text-xs sm:text-sm font-serif tracking-[0.2em] uppercase font-semibold">
            <span class="mx-4 flex items-center bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                <i class="fa-solid fa-spa text-amber-600 mr-2"></i> Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
            </span>
            <span class="mx-4 flex items-center bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                ✦ Tâm Tịnh Thế Giới Bình ✦
            </span>
            <span class="mx-4 flex items-center bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                <i class="fa-solid fa-leaf text-amber-600 mr-2"></i> Sống Tỉnh Thức Trong Hơi Thở Trở Về
            </span>
            <span class="mx-4 flex items-center bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                ✦ Ánh Đạo Vàng Soi Sáng Muôn Phương ✦
            </span>
            <!-- Lặp lại nội dung để chạy liên tục không đứt quãng -->
            <span class="mx-4 flex items-center bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                <i class="fa-solid fa-spa text-amber-600 mr-2"></i> Nam Mô Bổn Sư Thích Ca Mâu Ni Phật
            </span>
            <span class="mx-4 flex items-center bg-white/80 px-4 py-1.5 rounded-full border border-amber-200 shadow-xs">
                ✦ Tâm Tịnh Thế Giới Bình ✦
            </span>
        </div>
    </div>

    <div class="container mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        
        <!-- Phần trung tâm: Slogan tĩnh thức -->
        <div class="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-700 shadow-sm mb-2">
                <i class="fa-solid fa-dharmachakra text-3xl"></i>
            </div>
            <h3 class="text-3xl font-heading font-bold text-gray-900 tracking-wider">CHÙA VĨNH HƯNG</h3>
            <p class="text-xs sm:text-sm text-amber-800 tracking-[0.3em] uppercase font-semibold">
                ✦ Nơi Trở Về Của Tâm Hồn An Lạc ✦
            </p>
            <p class="text-gray-600 font-serif italic text-base mt-3">
                "Gửi lại giông bão ngoài kia, giữ trọn tâm an giữa cửa thiền."
            </p>
        </div>

        <!-- Bố cục 2 cột cân xứng: Địa chỉ bên trái & Thông tin kết nối bên phải -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-amber-200/80 items-stretch">
            
            <!-- Cột 1: Thông tin bản tự & Giờ mở cửa (6 phần) -->
            <div class="lg:col-span-6 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-amber-200/90 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                    <h4 class="text-gray-900 font-heading font-bold text-lg uppercase tracking-wider mb-6 flex items-center border-b border-amber-100 pb-3">
                        <span class="w-3 h-3 rounded-full bg-amber-600 mr-3"></span> Địa Chỉ Bổn Tự
                    </h4>
                    <ul class="space-y-4 text-sm sm:text-base text-gray-700">
                        <li class="flex items-start space-x-3.5">
                            <i class="fa-solid fa-location-dot text-amber-700 mt-1 shrink-0 text-lg"></i>
                            <span class="leading-relaxed font-medium">Khu Phố Vĩnh Hiệp, Phường Tân Triều, Thành Phố Đồng Nai</span>
                        </li>
                        <li class="flex items-center space-x-3.5">
                            <i class="fa-solid fa-clock text-amber-700 shrink-0 text-lg"></i>
                            <span class="font-medium">Mở cửa đón Phật tử: 04:30 - 21:00 hằng ngày</span>
                        </li>
                    </ul>
                </div>
                <div class="pt-4 border-t border-amber-100 text-xs text-amber-900 font-medium italic">
                    Hoan hỷ đón tiếp quý Phật tử gần xa phát tâm chiêm bái, tu học.
                </div>
            </div>

            <!-- Cột 2: Liên lạc trực tiếp & Mạng xã hội (6 phần) -->
            <div class="lg:col-span-6 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-amber-200/90 shadow-xl flex flex-col justify-between space-y-6">
                <div>
                    <h4 class="text-gray-900 font-heading font-bold text-lg uppercase tracking-wider mb-6 flex items-center border-b border-amber-100 pb-3">
                        <span class="w-3 h-3 rounded-full bg-amber-600 mr-3"></span> Kết Nối Trực Tiếp
                    </h4>
                    <ul class="space-y-4 text-sm sm:text-base text-gray-700">
                        <li class="flex items-center space-x-3.5">
                            <i class="fa-solid fa-phone-volume text-amber-700 shrink-0 text-lg"></i>
                            <span class="font-bold text-gray-900">(028) 3812 3456 - 0912 345 678</span>
                        </li>
                        <li class="flex items-center space-x-3.5">
                            <i class="fa-solid fa-envelope-open-text text-amber-700 shrink-0 text-lg"></i>
                            <span class="font-bold text-gray-900">chuavinhhung.dongnai@gmail.com</span>
                        </li>
                    </ul>
                </div>

                <!-- Kênh mạng xã hội tinh tế -->
                <div class="pt-4 border-t border-amber-100 flex items-center justify-between">
                    <span class="text-xs font-bold text-gray-500 uppercase tracking-wider">Kênh Truyền Thông</span>
                    <div class="flex space-x-3">
                        <a href="#" aria-label="Facebook" class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center text-gray-700 transition shadow-xs">
                            <i class="fa-brands fa-facebook-f text-sm"></i>
                        </a>
                        <a href="#" aria-label="YouTube" class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center text-gray-700 transition shadow-xs">
                            <i class="fa-brands fa-youtube text-sm"></i>
                        </a>
                        <a href="#" aria-label="TikTok" class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center text-gray-700 transition shadow-xs">
                            <i class="fa-brands fa-tiktok text-sm"></i>
                        </a>
                        <a href="#" aria-label="Zalo" class="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-600 hover:text-white hover:border-amber-600 flex items-center justify-center text-gray-700 transition shadow-xs">
                            <i class="fa-solid fa-comment-dots text-sm"></i>
                        </a>
                    </div>
                </div>
            </div>

        </div>

        <!-- Phần dưới cùng: Bản quyền & Liên kết -->
        <div class="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 font-medium">
            <p>&copy; 2026 Chùa Vĩnh Hưng. Trang thông tin Phật sự chính thức.</p>
            <div class="mt-4 sm:mt-0 space-x-8">
                <a href="#" class="hover:text-amber-800 transition">Quy Định Đạo Tràng</a>
                <a href="#" class="hover:text-amber-800 transition">Chính Sách Bảo Mật</a>
            </div>
        </div>

    </div>
</footer>

<style>
@keyframes marquee {
    0% { transform: translateX(0%); }
    100% { transform: translateX(-50%); }
}
.animate-marquee {
    display: inline-flex;
    animation: marquee 35s linear infinite;
}
.animate-marquee:hover {
    animation-play-state: paused;
}
</style>
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