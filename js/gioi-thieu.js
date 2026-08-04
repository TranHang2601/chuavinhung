function setActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'gioithieu.html';
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
function showTab(tabId) {
    // Ẩn tất cả nội dung
    document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
    // Hiện nội dung được chọn
    document.getElementById('tab-' + tabId).classList.remove('hidden');

    // Cập nhật nút active
    document.querySelectorAll('button[id^="btn-"]').forEach(btn => {
        btn.classList.remove('bg-buddhist-lightgold/30', 'border-buddhist-gold', 'text-buddhist-maroon');
        btn.classList.add('border-gray-200', 'text-gray-700');
    });
    document.getElementById('btn-' + tabId).classList.add('bg-buddhist-lightgold/30', 'border-buddhist-gold', 'text-buddhist-maroon');
}