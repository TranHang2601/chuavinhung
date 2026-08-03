async function loadComponent(targetId, filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error("Không tìm thấy file");
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
        
        // Sau khi load xong, nếu có các script bên trong, 
        // bạn có thể cần kích hoạt lại chúng ở đây nếu cần
    } catch (error) {
        console.error("Lỗi khi load component:", error);
    }
}