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