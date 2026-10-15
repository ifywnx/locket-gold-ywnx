# Bộ cài ifywnx đầy đủ

Có 5 lựa chọn: Locket + Caption, All Apps Config, All Apps Module, GPS và NextDNS tuỳ chọn. Chỉ chọn một bộ chính, không bật các bộ trùng quy tắc.

All Apps đã bỏ Sub-Store và tác vụ tự tải script từ bên ngoài. Các script được phục vụ từ snapshot trong backend của bạn; bản gốc vẫn có trong repo. Đây không phải chứng nhận an toàn toàn bộ script: YouTube có thể gọi dịch vụ dịch Google; GPS có thể gọi dịch vụ bản đồ/độ cao tuỳ chế độ. GPS mặc định Tokyo. Không thay đổi DNS hoặc proxy của thiết bị bằng việc chỉ truy cập web.

DNS cũ my.ublockdns.com không được phục vụ. NextDNS dcc5ee do bạn quản lý, dùng chung hạn mức và bộ lọc; không bảo đảm giữ Gold. Người dùng cần tự gỡ hồ sơ DNS cũ. Nút NextDNS mở trình tạo chính thức, không bật Trust NextDNS Root CA.

## Upload Netlify
Giải nén ifywnx-netlify.zip và tải cả thư mục vào đúng dự án ifywnx đang có. Giữ index.html, _redirects, _headers. Không tạo site mới. Backend cấp mã: https://ifywnx-install.agilechub512.chatgpt.site/admin .

Sau khi upload, thử mã hợp lệ, hết hạn, thu hồi; mã hợp lệ hiện bốn file Shadowrocket và mục NextDNS riêng. Chưa thử mọi ứng dụng trên iPhone. Cập nhật module/script để nhận thay đổi; không cần xoá Locket.
