const FIREBASE_NEWS_URL = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/news.json';
async function fetchArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    let newsId = urlParams.get('id');

    try {
        const response = await fetch(FIREBASE_NEWS_URL);
        const data = await response.json();

        if (!data) {
            document.getElementById('news-title').textContent = "Không tìm thấy dữ liệu bài viết";
            document.getElementById('news-body').innerHTML = '<p class="text-center text-gray-500 py-8">Hệ thống chưa ghi nhận bài viết nào trên Firebase.</p>';
            return;
        }

        // Nếu không có id trên URL, lấy tự động bài viết đầu tiên hoặc mới nhất
        const newsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        newsArray.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

        let post = null;
        if (newsId && data[newsId]) {
            post = data[newsId];
        } else if (newsArray.length > 0) {
            post = newsArray[0];
            newsId = post.id;
        }

        if (!post) {
            document.getElementById('news-title').textContent = "Bài viết không tồn tại";
            document.getElementById('news-body').innerHTML = '<p class="text-center text-gray-500 py-8">Bài viết bạn đang tìm kiếm có thể đã bị xóa.</p>';
            return;
        }
        
        // Cập nhật thông tin lên giao diện
        document.getElementById('news-banner-title').textContent = post.title || '';
        document.getElementById('news-title').textContent = post.title || '';
        document.getElementById('news-date').textContent = post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật';
        
        if (post.image && post.image.trim() !== '') {
            document.getElementById('news-image').src = post.image;
        }

        document.getElementById('news-body').innerHTML = post.content || '<p>Đang cập nhật nội dung...</p>';
        document.title = (post.title || 'Chi Tiết Tin Tức') + " | Chùa Vĩnh Hưng";

        // Hiển thị danh sách tin tức liên quan khác
        const relatedArticles = newsArray.filter(item => item.id !== newsId).slice(0, 2);
        const relatedContainer = document.getElementById('related-news-grid');
        
        if (relatedArticles.length > 0) {
            relatedContainer.innerHTML = relatedArticles.map(article => {
                const imgSrc = (article.image && article.image.trim() !== "") ? article.image : 'https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung';
                const summaryText = article.content ? article.content.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '';
                const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString('vi-VN') : '';
                
                return `
                    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                        <div>
                            <img src="${imgSrc}" alt="${article.title}" class="w-full h-48 object-cover" onerror="this.src='https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung'">
                            <div class="p-5">
                                <h4 class="font-heading font-bold text-lg text-buddhist-dark mt-1 line-clamp-2 hover:text-buddhist-maroon transition">
                                    <a href="chi-tiet-tin-tuc.html?id=${article.id}">${article.title}</a>
                                </h4>
                                <p class="text-gray-600 text-sm mt-2 line-clamp-2">${summaryText}</p>
                            </div>
                        </div>
                        <div class="p-5 pt-0 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 mt-2">
                            <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                            <a href="chi-tiet-tin-tuc.html?id=${article.id}" class="text-buddhist-maroon font-semibold hover:underline">Đọc tiếp <i class="fa-solid fa-arrow-right ml-1"></i></a>
                        </div>
                    </div>
                `;
            }).join('');
        } else {
            relatedContainer.innerHTML = '<p class="text-gray-500 text-sm col-span-2">Chưa có bài viết liên quan nào khác.</p>';
        }

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu bài viết:", err);
        document.getElementById('news-body').innerHTML = '<p class="text-center text-red-500 py-8">Không thể kết nối lấy dữ liệu bài viết từ Firebase.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchArticleDetail);

// Tiện ích chia sẻ và sao chép link
window.copyLink = function() {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    
    const alertBox = document.getElementById('copy-alert');
    alertBox.classList.remove('hidden');
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 3000);
};

window.shareArticle = function(platform) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.title);
    if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'zalo') {
        window.open(`https://zalo.me/share?url=${url}&title=${title}`, '_blank');
    }
};