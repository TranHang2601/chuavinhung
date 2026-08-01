const DB_URL = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/videos.json';
function getYouTubeID(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

async function fetchVideos() {
    const grid = document.getElementById('video-grid');
    try {
        const response = await fetch(DB_URL);
        const data = await response.json();
        
        grid.innerHTML = '';
        
        if (!data) {
            grid.innerHTML = '<div class="col-span-full text-center py-10">Hiện chưa có video nào được đăng.</div>';
            return;
        }

        Object.keys(data).forEach(key => {
            const v = data[key];
            const vId = getYouTubeID(v.url);
            
            if (vId) {
                const card = document.createElement('div');
                card.className = "bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300";
                card.innerHTML = `
                    <a href="${v.url}" target="_blank" class="block relative group overflow-hidden">
                        <!-- Đổi mqdefault.jpg thành maxresdefault.jpg để lấy ảnh nét nhất -->
                        <img src="https://img.youtube.com/vi/${vId}/maxresdefault.jpg" alt="${v.title}" class="w-full aspect-video object-cover transition duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition">
                            <i class="fa-solid fa-play text-white text-4xl opacity-80"></i>
                        </div>
                    </a>
                    <div class="p-6">
                        <h3 class="text-lg font-heading font-bold mb-3 hover:text-buddhist-maroon transition cursor-pointer line-clamp-2">${v.title}</h3>
                        <a href="${v.url}" target="_blank" class="text-buddhist-gold font-semibold hover:text-buddhist-maroon transition">Xem trên YouTube &rarr;</a>
                    </div>
                `;
                grid.appendChild(card);
            }
        });
    } catch (err) {
        grid.innerHTML = '<div class="col-span-full text-center py-10 text-red-600">Không thể tải dữ liệu video.</div>';
    }
}

document.addEventListener('DOMContentLoaded', fetchVideos);