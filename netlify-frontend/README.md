# Web người dùng ifywnx trên Netlify

## Cài bằng kéo thả
1. Giải nén `ifywnx-netlify.zip`.
2. Đăng nhập Netlify của bạn, mở https://app.netlify.com/drop .
3. Kéo **cả thư mục ifywnx-netlify** (chứa index.html, _redirects, _headers) vào vùng tải lên. Không chỉ kéo file HTML.
4. Đợi triển khai xong, mở địa chỉ Netlify được cấp. Có thể đổi tên site trong phần quản lý tên miền nếu tên còn trống.
5. Thử bằng một mã còn hạn bạn tạo ở web quản trị. Trang phải hiện đủ 5 lựa chọn. Thử mã sai và mã thu hồi để kiểm tra chặn tải.
6. Gửi đường dẫn Netlify và mã cho người dùng. Người dùng nên mở bằng Safari trên iPhone.

## Hệ thống mã giữ nguyên
Quản lý mã: https://ifywnx-install.agilechub512.chatgpt.site/admin

Trang Netlify không lưu cơ sở dữ liệu hay tài khoản quản trị. Mỗi lần nhập mã, Netlify chuyển yêu cầu kiểm tra tới file được bảo vệ của hệ thống hiện tại. Mã đúng mới hiện nút cài. Mỗi lần tải, hệ thống hiện tại vẫn kiểm tra hết hạn/thu hồi. Không có mã riêng hay nội dung script trong gói web này.

Không cần thêm API key, cài Node.js, hoặc chuyển dữ liệu mã. File `_redirects` bắt buộc để kiểm tra mã cùng nguồn, tránh lỗi CORS. Trang chỉ proxy tuyến kiểm tra; không proxy trang quản trị.

Các liên kết tải và địa chỉ script trong Shadowrocket vẫn có `chatgpt.site`. Địa chỉ trang chia sẻ cho người dùng là Netlify. Hệ thống cũ phải tiếp tục hoạt động và giữ quyền truy cập công khai cho các tuyến tải có mã.

## Cập nhật
Kéo lại cùng thư mục vào mục triển khai thủ công của **đúng site đã tạo**, tránh tạo site mới mỗi lần. Cập nhật nội dung script vẫn thực hiện ở backend hiện tại.

## Trạng thái bản sửa tên
Đã sửa nguồn `Locket_Unlocked.js` và tài nguyên backend: “Chào mừng đến với ifywnx ✨”, bỏ @duyvinh.09. Đã đẩy GitHub commit 4e082d1. Chưa triển khai được lên backend agilechub512 vì kết nối Sites đang ở tài khoản philiprose750@gmail.com; cần chuyển sang annguyen.ub0@gmail.com rồi triển khai bản sửa. Upload Netlify không tự cập nhật backend.

Sau khi backend được cập nhật, cập nhật module/script trong Shadowrocket, ngắt rồi bật lại kết nối, đóng/mở Locket. Không cần xoá app. Popup đã cache có thể chưa đổi ngay.

## Giới hạn kiểm thử
Đã kiểm tra mã nguồn, đủ 5 file, cú pháp JavaScript và phản hồi từ chối mã sai ở backend. Chưa triển khai lên tài khoản Netlify của bạn và chưa kiểm tra bằng mã thật trên iPhone. Sau khi upload, kiểm tra như bước 5.

Tài liệu Netlify: https://docs.netlify.com/manage/routing/redirects/overview/ và https://docs.netlify.com/manage/deploys/create-deploys/ .
