# ifywnx — bản Locket riêng

## Đưa web lên Netlify
Giải nén ifywnx-netlify.zip, kéo cả thư mục ifywnx-netlify vào https://app.netlify.com/drop . Giữ đủ index.html, _redirects và _headers. Dùng mã đang có tại https://ifywnx-install.agilechub512.chatgpt.site/admin .

## Nội dung đã thay đổi
Chỉ hiện một module Locket; không phân phối DNS kế thừa, All Apps, GPS hoặc Sub-Store. Nguồn backend mới chỉ cho tải module Locket và ba script cần thiết. Bỏ ảnh i.ibb.co và liên kết mạng xã hội được chèn bởi script. Header rewrite chỉ chạy với User-Agent Locket. MITM vẫn có hai hostname RevenueCat và Firebase Remote Config; đây là hostname dùng chung, không phải bảo đảm cô lập tuyệt đối theo ứng dụng.

## Quan trọng: chuyển từ bản cũ
1. Gỡ hồ sơ DNS cũ trong Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị. Không cần gỡ chứng chỉ Shadowrocket tự tạo nếu vẫn dùng.
2. Tắt module All Apps, GPS và Sub-Store; nếu dùng cấu hình tổng hợp cũ, chuyển sang cấu hình cơ bản của bạn không có các script đó.
3. Cài module Locket mới; giữ Giải mã HTTPS và chứng chỉ tự tạo đã được tin cậy.
4. Sau khi backend cập nhật, cập nhật script/module trong Shadowrocket, ngắt/bật kết nối và mở lại Locket. Không cần xoá ứng dụng.

## Trạng thái triển khai
Backend agilechub512 đã triển khai bản 2 ngày 15/10/2026: chỉ phục vụ Locket, bỏ DNS/All Apps/GPS và sửa popup tên cũ. Cơ sở dữ liệu mã giữ nguyên. ZIP Netlify mới có bản sửa thông báo lỗi; cần upload lại vào site ifywnx hiện có. Các file tổng hợp còn trong repo chỉ dùng tham khảo.

## DNS riêng
Bản này không cấu hình DNS: máy tiếp tục dùng DNS từ mạng hoặc cài đặt hiện có. Không đổi DNS không có nghĩa nhà cung cấp mạng không thấy truy vấn.
Có thể tự vận hành AdGuard Home trên máy chủ do bạn quản lý, hoặc tạo cấu hình DNS trong tài khoản riêng tại nhà cung cấp. Cách thứ hai vẫn phụ thuộc nhà cung cấp. Cần máy chủ/tài khoản và endpoint thật trước khi tạo hồ sơ cài đặt; không có DNS riêng hoạt động trong gói này. Netlify tĩnh không phải máy chủ DNS.
Tài liệu: https://adguard-dns.io/kb/adguard-home/getting-started/

## Username
Username chỉ là định danh công khai; không thay thế đăng nhập, mã truy cập, chứng chỉ hay cài module. Không có tích hợp API chính thức được thiết lập để thực hiện việc đó. Trang này không yêu cầu mật khẩu Locket.

## Kiểm tra sau triển khai
Thử mã hợp lệ, mã hết hạn và mã bị thu hồi; mã hợp lệ chỉ hiện một module. Kiểm tra tải DNS/All Apps cũ trả 404 sau khi backend được cập nhật. Chưa kiểm thử trực tiếp trên iPhone; không bảo đảm quyền Gold hay mọi tính năng máy chủ. Mã thu hồi không xoá được file đã tải trước đó.
