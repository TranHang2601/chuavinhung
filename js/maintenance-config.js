/**
 * maintenance-config.js - Quản lý chế độ bảo trì thông minh
 * Chạy trên Live Server (127.0.0.1 / localhost): KHÔNG BAO GIỜ bị chuyển hướng bảo trì.
 * Chạy trên Domain chính (Cloudflare): Tự động bật/tắt màn hình bảo trì theo Admin.
 */

(async function () {
    const hostname = window.location.hostname;
    const currentPath = window.location.pathname;

    // 1. Nhận diện tuyệt đối môi trường lập trình cục bộ (Live Server, Localhost, IP nội bộ)
    const isLocalhost = 
        hostname === 'localhost' || 
        hostname === '127.0.0.1' || 
        hostname === '' || 
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.includes('localtunnel') ||
        hostname.includes('ngrok') ||
        window.location.protocol === 'file:';

    // Nếu đang chạy ở máy tính cá nhân (Live Server), dừng hoàn toàn để không bao giờ bị bảo trì
    if (isLocalhost) {
        console.log("⚙️ Đang chạy ở Live Server / Localhost: Chế độ bảo trì đã bị VÔ HIỆU HÓA hoàn toàn để bạn lập trình.");
        return;
    }

    // 2. Chỉ chạy kiểm tra bảo trì trên Domain chính thức (Cloudflare)
    const firebaseConfig = {
        databaseURL: "https://chuavinhhung-web-default-rtdb.asia-southeast1.firebasedatabase.app"
    };

    if (typeof firebase !== 'undefined' && !firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }

    if (typeof window.vinhhungMaintenanceConfigLoaded === 'undefined') {
        window.vinhhungMaintenanceConfigLoaded = true;

        if (typeof firebase !== 'undefined' && firebase.database) {
            firebase.database().ref('settings/maintenance_mode').on('value', (snapshot) => {
                const isMaintenance = snapshot.val() === true;
                const pathNow = window.location.pathname;
                const isAtAdmin = pathNow.includes('admin.html');
                const isAtMaint = pathNow.includes('bao-tri.html');

                // Tuyệt đối không chuyển hướng nếu Admin đang ở trang quản trị
                if (isAtAdmin) return;

                // Trên Domain chính: Nếu bật bảo trì và khách không ở trang bảo trì -> chuyển hướng sang bao-tri.html
                if (isMaintenance && !isAtMaint) {
                    window.location.href = 'bao-tri.html';
                }
                // Nếu tắt bảo trì và đang ở trang bao-tri.html -> tự động quay về trang chủ
                else if (!isMaintenance && isAtMaint) {
                    window.location.href = 'index.html';
                }
            });
        }
    }
})();