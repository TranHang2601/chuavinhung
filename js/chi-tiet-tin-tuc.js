// const FIREBASE_NEWS_URL = 'https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app/news.json';

        // Hàm tạo slug tự động từ tiêu đề
        function createSlug(str) {
            if (!str) return '';
            str = str.toLowerCase();
            str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            str = str.replace(/[đĐ]/g, 'd');
            str = str.replace(/([^0-9a-z-\s])/g, '');
            str = str.replace(/(\s+)/g, '-');
            str = str.replace(/-+/g, '-');
            str = str.replace(/^-+|-+$/g, '');
            return str;
        }

        // Hàm chuẩn hóa tiếng Việt
        function normalizeVietnamese(str) {
            if (!str) return '';
            let normalized = str.normalize('NFC');
            normalized = normalized
                .replace(/([aeiouâăôơưêîû])\s+(['`?~.])/g, '$1$2')
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
            let newsSlug = urlParams.get('slug');

            try {
                const rawRes = await fetch(FIREBASE_NEWS_URL);
                const textData = await rawRes.text();
                const data = textData ? JSON.parse(textData) : null;

                if (!data) {
                    showNotFoundError("Hệ thống chưa ghi nhận bài viết nào trên Firebase.");
                    return;
                }

                const newsArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                newsArray.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

                let post = null;
                
                // Tìm kiếm theo ID hoặc Slug
                if (newsId && data[newsId]) {
                    post = data[newsId];
                } else if (newsSlug) {
                    post = newsArray.find(item => {
                        const itemSlug = item.slug ? item.slug.replace(/^\//, '') : createSlug(item.title);
                        return itemSlug === newsSlug.replace(/^\//, '');
                    });
                } else if (newsArray.length > 0) {
                    // Lấy bài viết công khai mới nhất nếu không có tham số
                    const visibleList = newsArray.filter(item => !item.hidden);
                    if (visibleList.length > 0) {
                        post = visibleList[0];
                    }
                }

                // Kiểm tra xem bài viết có tồn tại và KHÔNG BỊ ẨN (hidden !== true)
                if (!post || post.hidden === true) {
                    showNotFoundError("Bài viết này không tồn tại hoặc đã bị ẩn bởi ban quản trị.");
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
                } else {
                    const imgWrapper = document.getElementById('news-image-wrapper');
                    if (imgWrapper) imgWrapper.style.display = 'none';
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

                // Lọc các bài viết liên quan CHỈ HIỂN THỊ (bỏ qua bài ẩn và bài hiện tại)
                const relatedArticles = newsArray.filter(item => item.id !== post.id && !item.hidden).slice(0, 2);
                const relatedContainer = document.getElementById('related-news-grid');
                const relatedSection = document.getElementById('related-section');
                
                if (relatedContainer && relatedSection) {
                    if (relatedArticles.length > 0) {
                        relatedContainer.innerHTML = relatedArticles.map(article => {
                            const imgSrc = (article.image && article.image.trim() !== "") ? article.image : 'https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung';
                            const articleTitle = normalizeVietnamese(article.title || '');
                            const summaryText = article.content ? normalizeVietnamese(article.content).replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : '';
                            const dateStr = article.created_at ? new Date(article.created_at).toLocaleDateString('vi-VN') : '';
                            const articleSlug = article.slug ? article.slug : createSlug(article.title);
                            
                            return `
                                <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                                    <div>
                                        <img src="${imgSrc}" alt="${articleTitle}" class="w-full h-48 object-cover" onerror="this.src='https://placehold.co/600x400/3d1c1d/d4af37?text=ChuaVinhHung'">
                                        <div class="p-5">
                                            <h4 class="font-heading font-bold text-lg text-buddhist-dark mt-1 line-clamp-2 hover:text-buddhist-maroon transition">
                                                <a href="chi-tiet-tin-tuc.html?slug=${articleSlug}">${articleTitle}</a>
                                            </h4>
                                            <p class="text-gray-600 text-sm mt-2 line-clamp-2">${summaryText}</p>
                                        </div>
                                    </div>
                                    <div class="p-5 pt-0 flex items-center justify-between text-xs text-gray-400 border-t border-gray-50 mt-2">
                                        <span><i class="fa-regular fa-calendar"></i> ${dateStr}</span>
                                        <a href="chi-tiet-tin-tuc.html?slug=${articleSlug}" class="text-buddhist-maroon font-semibold hover:underline">Đọc tiếp <i class="fa-solid fa-arrow-right ml-1"></i></a>
                                    </div>
                                </div>
                            `;
                        }).join('');
                    } else {
                        relatedSection.style.display = 'none';
                    }
                }

            } catch (err) {
                console.error("Lỗi khi tải dữ liệu bài viết:", err);
                showNotFoundError("Không thể kết nối lấy dữ liệu bài viết từ hệ thống.");
            }
        }

        function showNotFoundError(message) {
            const bannerTitleEl = document.getElementById('news-banner-title');
            if (bannerTitleEl) bannerTitleEl.textContent = "Thông Báo";

            const titleEl = document.getElementById('news-title');
            if (titleEl) titleEl.textContent = "Bài Viết Không Khả Dụng";

            const metaInfo = document.getElementById('article-meta-info');
            if (metaInfo) metaInfo.style.display = 'none';

            const imgWrapper = document.getElementById('news-image-wrapper');
            if (imgWrapper) imgWrapper.style.display = 'none';

            const shareTools = document.getElementById('share-tools-container');
            if (shareTools) shareTools.style.display = 'none';

            const bodyEl = document.getElementById('news-body');
            if (bodyEl) {
                bodyEl.innerHTML = `
                    <div class="text-center py-10 space-y-4">
                        <div class="w-16 h-16 bg-amber-50 text-buddhist-maroon rounded-full flex items-center justify-center mx-auto text-2xl shadow-inner">
                            <i class="fa-solid fa-triangle-exclamation"></i>
                        </div>
                        <p class="text-gray-600 font-medium text-lg">${message}</p>
                        <div class="pt-4">
                            <a href="tin-tuc.html" class="inline-block bg-buddhist-maroon text-white px-6 py-3 rounded-xl font-semibold shadow hover:bg-opacity-90 transition">
                                <i class="fa-solid fa-arrow-left mr-2"></i> Quay lại trang Tin Tức
                            </a>
                        </div>
                    </div>
                `;
            }

            const relatedSection = document.getElementById('related-section');
            if (relatedSection) relatedSection.style.display = 'none';
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