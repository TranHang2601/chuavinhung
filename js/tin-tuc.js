const FIREBASE_NEWS_URL = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/news.json';
async function fetchNews() {
    const grid = document.getElementById('news-grid');
    try {
        const response = await fetch('https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/news.json');
        const data = await response.json();
        
        grid.innerHTML = '';
        
        if (!data) {
            grid.innerHTML = '<div class="col-span-full text-center py-10">Chưa có bài viết nào.</div>';
            return;
        }

        const newsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        newsArray.sort((a, b) => b.created_at - a.created_at);

        newsArray.forEach(post => {
            const article = document.createElement('article');
            article.className = "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300";
            
            // Logic xử lý ảnh: Nếu không có ảnh hoặc link ảnh trống, dùng ảnh mặc định.
            // Nếu link ảnh bắt đầu bằng "images/", nó sẽ tìm trong folder local của bạn.
            // Thay thế dòng 111 hiện tại bằng dòng này:
            const imgSrc = (post.image && post.image.trim() !== "") ? post.image : 'https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung';

            article.innerHTML = `
                <img src="${imgSrc}" class="w-full h-56 object-cover" onerror="this.src='https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung'">
                <div class="p-6">
                    <div class="text-sm text-gray-500 mb-2">${post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : ''}</div>
                    <h3 class="text-xl font-heading font-bold mb-3 hover:text-buddhist-maroon transition cursor-pointer">${post.title}</h3>
                    <p class="text-gray-600 mb-4 line-clamp-3">${post.content.replace(/<[^>]*>?/gm, '')}</p>
                    <a href="#" class="text-buddhist-gold font-semibold hover:text-buddhist-maroon transition">Đọc tiếp &rarr;</a>
                </div>
            `;
            grid.appendChild(article);
        });
    } catch (err) {
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-600">Không thể tải dữ liệu.</div>';
    }
}
// Thay thế window.onload bằng addEventListener
document.addEventListener('DOMContentLoaded', fetchNews);