const FIREBASE_NEWS_URL = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/news.json';
async function fetchNews() {
    const grid = document.getElementById('news-grid');
    try {
        const response = await fetch(FIREBASE_NEWS_URL);
        const data = await response.json();
        
        grid.innerHTML = '';
        
        if (!data) {
            grid.innerHTML = '<div class="col-span-full text-center py-10">Chưa có bài viết nào.</div>';
            return;
        }

        const newsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        newsArray.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

        newsArray.forEach(post => {
            const article = document.createElement('article');
            article.className = "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between";
            
            const imgSrc = (post.image && post.image.trim() !== "") ? post.image : 'https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung';
            const plainContent = post.content ? post.content.replace(/<[^>]*>?/gm, '') : '';

            article.innerHTML = `
                <div>
                    <img src="${imgSrc}" class="w-full h-56 object-cover" onerror="this.src='https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung'">
                    <div class="p-6">
                        <div class="text-sm text-gray-500 mb-2">${post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : ''}</div>
                        <h3 class="text-xl font-heading font-bold mb-3 hover:text-buddhist-maroon transition cursor-pointer">
                            <a href="chi-tiet-tin-tuc.html?id=${post.id}">${post.title || ''}</a>
                        </h3>
                        <p class="text-gray-600 mb-4 line-clamp-3">${plainContent}</p>
                    </div>
                </div>
                <div class="px-6 pb-6">
                    <a href="chi-tiet-tin-tuc.html?id=${post.id}" class="text-buddhist-gold font-semibold hover:text-buddhist-maroon transition inline-flex items-center gap-1">Đọc tiếp <i class="fa-solid fa-arrow-right text-xs"></i></a>
                </div>
            `;
            grid.appendChild(article);
        });
    } catch (err) {
        console.error("Lỗi tải tin tức:", err);
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-600">Không thể tải dữ liệu từ hệ thống.</div>';
    }
}

document.addEventListener('DOMContentLoaded', fetchNews);