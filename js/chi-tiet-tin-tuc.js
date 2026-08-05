const FIREBASE_NEWS_URL = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/news.json';

// Hàm chuẩn hóa và hàn gắn các ký tự tiếng Việt bị tách dấu (lỗi unicode decomposed)
function normalizeVietnamese(str) {
    if (!str) return '';
    
    // 1. Chuẩn hóa chuẩn NFC Unicode
    let normalized = str.normalize('NFC');
    
    // 2. Bộ lọc sửa lỗi tách dấu phổ biến (ví dụ: "tiế p" -> "tiếp", "đê`" -> "đề")
    const fixMap = {
        'ê`': 'ề', 'ê\'': 'ế', 'ê?': 'ể', 'ê~': 'ễ', 'ê.': 'ệ',
        'e`': 'è', 'e\'': 'é', 'e?': 'ẻ', 'e~': 'ẽ', 'e.': 'ẹ',
        'a`': 'à', 'a\'': 'á', 'a?': 'ả', 'a~': 'ã', 'a.': 'ạ',
        'ă`': 'ằ', 'ă\'': 'ắ', 'ă?': 'ẳ', 'ă~': 'ẵ', 'ă.': 'ặ',
        'â`': 'ầ', 'â\'': 'ấ', 'â?': 'ẩ', 'â~': 'ẫ', 'â.': 'ậ',
        'o`': 'ò', 'o\'': 'ó', 'o?': 'ỏ', 'o~': 'õ', 'o.': 'ọ',
        'ô`': 'ồ', 'ô\'': 'ố', 'ô?': 'ổ', 'ô~': 'ỗ', 'ô.': 'ộ',
        'ơ`': 'ờ', 'ơ\'': 'ớ', 'ơ?': 'ở', 'ơ~': 'ỡ', 'ơ.': 'ợ',
        'u`': 'ù', 'u\'': 'ú', 'u?': 'ủ', 'u~': 'ũ', 'u.': 'ụ',
        'ư`': 'ừ', 'ư\'': 'ứ', 'ư?': 'ử', 'ư~': 'ữ', 'ư.': 'ự',
        'i`': 'ì', 'i\'': 'í', 'i?': 'ỉ', 'i~': 'ĩ', 'i.': 'ị',
        'y`': 'ỳ', 'y\'': 'ý', 'y?': 'ỷ', 'y~': 'ỹ', 'y.': 'ỵ',
        'đ': 'đ', 'Đ': 'Đ'
    };

    // Sửa lỗi các trường hợp bị khoảng trắng hoặc dấu gác ngược tách rời
    normalized = normalized
        .replace(/([aeiouâăôơưêîû])\s+(['`?~.])/g, '$1$2') // Xóa khoảng trắng thừa giữa chữ cái và dấu
        .replace(/e\s*` /g, 'ề')
        .replace(/e\s*\'/g, 'ế')
        .replace(/i\s*\'/g, 'í')
        .replace(/e\s*p/g, 'ếp')
        .replace(/ê\s*p/g, 'ếp');

    return normalized;
}

async function fetchArticleDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    let newsId = urlParams.get('id');

    try {
        const rawRes = await fetch(FIREBASE_NEWS_URL);
        const textData = await rawRes.text();
        const data = textData ? JSON.parse(textData) : null;

        if (!data) {
            document.getElementById('news-title').textContent = "Không tìm thấy dữ liệu bài viết";
            document.getElementById('news-body').innerHTML = '<p class="text-center text-gray-500 py-8">Hệ thống chưa ghi nhận bài viết nào trên Firebase.</p>';
            return;
        }

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
        
        // Chuẩn hóa tiêu đề bài viết
        const postTitle = normalizeVietnamese(post.title || '');
        
        const bannerTitleEl = document.getElementById('news-banner-title');
        if (bannerTitleEl) bannerTitleEl.textContent = postTitle;
        
        const titleEl = document.getElementById('news-title');
        if (titleEl) titleEl.textContent = postTitle;
        
        const dateEl = document.getElementById('news-date');
        if (dateEl) dateEl.textContent = post.created_at ? new Date(post.created_at).toLocaleDateString('vi-VN') : 'Mới cập nhật';
        
        let articleImg = 'https://placehold.co/900x500/3d1c1d/d4af37?text=ChuaVinhHung';
        if (post.image && post.image.trim() !== '') {
            articleImg = post.image;
            const imgEl = document.getElementById('news-image');
            if (imgEl) imgEl.src = articleImg;
        }

        let contentHtml = '';
        if (post.rendered_html && post.rendered_html.trim() !== '') {
            contentHtml = normalizeVietnamese(post.rendered_html);
        } else if (post.content) {
            let rawContent = normalizeVietnamese(post.content);
            contentHtml = rawContent
                .replace(/:::highlight([\s\S]*?):::/g, '<div class="p-4 my-4 bg-amber-50 border-l-4 border-chua-gold rounded-r-xl text-gray-800 shadow-sm font-medium">$1</div>')
                .replace(/^##\s+(.*)$/gm, '<h2 class="text-xl font-serif font-bold text-chua-red mt-6 mb-3 border-b border-amber-200 pb-1">$1</h2>')
                .replace(/^###\s+(.*)$/gm, '<h3 class="text-lg font-serif font-bold text-chua-darkred mt-4 mb-2">$1</h3>')
                .replace(/^>\s+(.*)$/gm, '<blockquote class="border-l-4 border-chua-amber pl-4 py-2.5 my-4 italic text-gray-700 bg-amber-50/50 rounded-r-xl shadow-sm">$1</blockquote>')
                .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
                .replace(/(^|[^*])\*(?!\*)(.*?)\*(?!\*)/g, '$1<em class="italic">$2</em>')
                .replace(/<u>(.*?)<\/u>/g, '<u class="underline decoration-chua-gold font-semibold">$1</u>')
                .replace(/\n\n/g, '</p><p class="mb-3">');

            contentHtml = '<p class="mb-3">' + contentHtml + '</p>';

            if (post.gallery && Array.isArray(post.gallery) && post.gallery.length > 0) {
                contentHtml += '<div class="mt-8 pt-6 border-t border-gray-200"><h4 class="font-serif font-bold text-chua-red uppercase mb-4 text-sm"><i class="fa-solid fa-images mr-2"></i> Bộ sưu tập hình ảnh</h4><div class="grid grid-cols-1 sm:grid-cols-2 gap-4">';
                post.gallery.forEach(imgUrl => {
                    contentHtml += `<div class="rounded-xl overflow-hidden border border-amber-200 bg-gray-50 h-48 shadow-sm"><img src="${imgUrl}" alt="Ảnh chi tiết" class="w-full h-full object-cover"></div>`;
                });
                contentHtml += '</div></div>';
            }
        } else {
            contentHtml = '<p>Đang cập nhật nội dung...</p>';
        }

        const bodyEl = document.getElementById('news-body');
        if (bodyEl) bodyEl.innerHTML = contentHtml;
        
        const pageTitle = postTitle + " | Chùa Vĩnh Hưng";
        const plainSummary = post.content ? normalizeVietnamese(post.content).replace(/<[^>]*>?/gm, '').substring(0, 150) + '...' : 'Cập nhật tin tức phật sự tại Chùa Vĩnh Hưng.';
        const currentUrl = window.location.href;

        document.title = pageTitle;
        const metaTitleEl = document.getElementById('meta-title');
        if (metaTitleEl) metaTitleEl.textContent = pageTitle;
        
        const metaDescEl = document.getElementById('meta-desc');
        if (metaDescEl) metaDescEl.setAttribute('content', plainSummary);
        
        const ogTitleEl = document.getElementById('og-title');
        if (ogTitleEl) ogTitleEl.setAttribute('content', pageTitle);
        
        const ogDescEl = document.getElementById('og-description');
        if (ogDescEl) ogDescEl.setAttribute('content', plainSummary);
        
        const ogImageEl = document.getElementById('og-image');
        if (ogImageEl) ogImageEl.setAttribute('content', articleImg);
        
        const ogUrlEl = document.getElementById('og-url');
        if (ogUrlEl) ogUrlEl.setAttribute('content', currentUrl);

        const relatedArticles = newsArray.filter(item => item.id !== newsId).slice(0, 2);
        const relatedContainer = document.getElementById('related-news-grid');
        
        if (relatedContainer) {
            if (relatedArticles.length > 0) {
                relatedContainer.innerHTML = relatedArticles.map(article => {
                    const imgSrc = (article.image && article.image.trim() !== "") ? article.image : 'https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung';
                    const articleTitle = normalizeVietnamese(article.title || '');
                    const summaryText = article.content ? normalizeVietnamese(article.content).replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '';
                    const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString('vi-VN') : '';
                    
                    return `
                        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                            <div>
                                <img src="${imgSrc}" alt="${articleTitle}" class="w-full h-48 object-cover" onerror="this.src='https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung'">
                                <div class="p-5">
                                    <h4 class="font-heading font-bold text-lg text-buddhist-dark mt-1 line-clamp-2 hover:text-buddhist-maroon transition">
                                        <a href="chi-tiet-tin-tuc.html?id=${article.id}">${articleTitle}</a>
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
        }

    } catch (err) {
        console.error("Lỗi khi tải dữ liệu bài viết:", err);
        const bodyEl = document.getElementById('news-body');
        if (bodyEl) bodyEl.innerHTML = '<p class="text-center text-red-500 py-8">Không thể kết nối lấy dữ liệu bài viết từ Firebase.</p>';
    }
}

document.addEventListener('DOMContentLoaded', fetchArticleDetail);

window.copyLink = function() {
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    
    const alertBox = document.getElementById('copy-alert');
    if (alertBox) {
        alertBox.classList.remove('hidden');
        setTimeout(() => {
            alertBox.classList.add('hidden');
        }, 3000);
    }
};

window.shareArticle = function(platform) {
    const url = encodeURIComponent(window.location.href);
    if (platform === 'facebook') {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    } else if (platform === 'zalo') {
        const title = encodeURIComponent(document.title);
        window.open(`https://zalo.me/share?url=${url}&title=${title}`, '_blank');
    }
};