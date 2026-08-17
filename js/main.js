/**
 * Script dùng chung cho website Chùa Vĩnh Hưng
 */

// 1. Hàm tải thành phần HTML từ file tĩnh (header.html, footer.html)
async function includeHTML(targetId, filePath) {
    const element = document.getElementById(targetId);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (response.ok) {
            element.innerHTML = await response.text();
        } else {
            console.error(`Không thể tải file: ${filePath} (Status: ${response.status})`);
        }
    } catch (error) {
        console.error(`Lỗi khi tải ${filePath}:`, error);
    }
}

// 2. Tự động đánh dấu Menu Active dựa trên URL hiện tại
function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, #mobile-menu a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('text-buddhist-gold', 'font-bold');
            if (link.classList.contains('nav-link')) {
                link.classList.add('border-b-2', 'border-buddhist-gold');
            }
        }
    });
}

// 3. Khởi tạo các sự kiện cho Header (Scroll effect & Mobile Menu)
function initHeaderEvents() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('mobile-menu');
    const header = document.getElementById('header');
    const logoText = document.querySelector('.logo-text');

    // Xử lý bật/tắt Mobile Menu an toàn (không bị đụng độ sự kiện inline onclick cũ)
    if (btn && menu) {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });

        // Click ra ngoài thì tự động đóng menu mobile
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !btn.contains(e.target)) {
                menu.classList.add('hidden');
            }
        });
    }

    // Xử lý hiệu ứng khi cuộn trang (Sticky Header)
    if (header) {
        window.addEventListener('scroll', () => {
            const navLinks = document.querySelectorAll('.nav-link');
            if (window.scrollY > 50) {
                header.classList.add('bg-white', 'shadow-md', 'py-1');
                header.classList.remove('bg-black', 'bg-opacity-40');
                
                navLinks.forEach(link => {
                    if (!link.classList.contains('text-buddhist-gold')) {
                        link.classList.add('text-gray-800');
                        link.classList.remove('text-white');
                    }
                });

                if (logoText) {
                    logoText.classList.remove('text-white');
                    logoText.classList.add('text-buddhist-maroon');
                }
                if (btn) {
                    btn.classList.remove('text-gray-200');
                    btn.classList.add('text-gray-800');
                }
            } else {
                header.classList.remove('bg-white', 'shadow-md', 'py-1');
                header.classList.add('bg-black', 'bg-opacity-40');

                navLinks.forEach(link => {
                    if (!link.classList.contains('text-buddhist-gold')) {
                        link.classList.add('text-white');
                        link.classList.remove('text-gray-800');
                    }
                });

                if (logoText) {
                    logoText.classList.add('text-white');
                    logoText.classList.remove('text-buddhist-maroon');
                }
                if (btn) {
                    btn.classList.add('text-gray-200');
                    btn.classList.remove('text-gray-800');
                }
            }
        });
    }
}

// Khởi chạy khi DOM sẵn sàng
document.addEventListener('DOMContentLoaded', async () => {
    // Tải Header và Footer
    await Promise.all([
        includeHTML('header-container', 'pages/header.html'),
        includeHTML('footer-container', 'pages/footer.html')
    ]);

    // Kích hoạt sự kiện Header & Active Link
    initHeaderEvents();
    setActiveNavLink();
});