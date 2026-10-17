# Kế hoạch kiểm thử Locket Minimal

## 0. Chuẩn bị

- Sao lưu cấu hình hiện tại và kiểm tra HTTPS host phân phối riêng các script.
- Tắt những module/script Locket khác; không chạy chồng cùng endpoint.
- Ghi lại phiên bản iOS, phiên bản Locket, phiên bản Shadowrocket/Surge/Loon; không ghi ID tài khoản, token hay nội dung riêng tư.
- Kiểm tra phản hồi từ endpoint dự kiến chỉ với tài khoản/môi trường được phép thử.

## 1. Core — không thay dữ liệu

- Kích hoạt `core/ifywnx-Core-Diagnostics.sgmodule`.
- Kiểm tra log báo phản hồi hợp lệ; nội dung và chức năng Locket phải không thay đổi.
- Thử phản hồi bị lỗi JSON khi test tại máy tính: script trả `{}`.

## 2. Captions — 1 mục duy nhất

- Tắt Core, bật `captions/ifywnx-Locket-Captions-Test.sgmodule`.
- Tìm nhóm `🧪 ifywnx thử nghiệm`, mục `ifywnx Test ✨`.
- Kiểm tra danh sách caption gốc còn nguyên, không xuất hiện ID trùng.
- Nếu không có `overlay_items` hợp lệ, script giữ nguyên phản hồi, không tạo cấu trúc giả.

## 3. Widget — chỉ khi cấu hình máy chủ thiếu

- Tắt Captions, bật `widget/ifywnx-Shinchan-Widget-Test.sgmodule`.
- Nếu máy chủ không cung cấp `widget_frame_event`, theo dõi việc xuất hiện ảnh Shin-chan.
- Nếu máy chủ có `widget_frame_event` không rỗng, script không đụng tới dữ liệu đó.
- Kiểm tra tỷ lệ, cắt ảnh, nền hiển thị riêng trên widget thực tế.

## 4. Popup — chỉ khi cấu hình máy chủ thiếu

- Tắt Widget, bật `popup/ifywnx-Popup-Test.sgmodule`.
- Chỉ chờ popup xuất hiện nếu máy chủ không có cấu hình popup. Nếu server có sẵn cấu hình, kết quả không xuất hiện popup mới là đúng dự kiến.
- Không sử dụng popup để tuyên bố tài khoản đã có quyền thuê bao.

## 5. Camera và caption diagnostics — chỉ đọc

- Bật riêng `camera/ifywnx-Camera-Diagnostics.sgmodule` rồi kiểm tra log `camera_filter_config status`.
- Bật riêng `diagnostics/ifywnx-Overlay-Diagnostics.sgmodule` để đọc số nhóm caption và số mục.
- Thử giao diện bộ lọc, sticker, nút “Tạo diện mạo” trên app nguyên bản để có số liệu đối chứng.
- Hai script chẩn đoán không thay đổi `camera_filter_config` hoặc mở khóa sticker.

## Tiêu chí nghiệm thu

- Mỗi lượt chỉ có 1 module thử nghiệm.
- Không crash, không mất cấu hình của server, không ảnh hưởng chức năng không liên quan.
- Nếu app không hiển thị tính năng thử nghiệm, ghi nhận **chưa hoạt động**, không tự suy diễn Remote Config đã mở được.
- Khi có lỗi: tắt module → thử app gốc → ghi lại điều kiện tái hiện → chỉ sửa module đang thử.
- Không phân phối bộ thử cho khách hoặc coi đây là bản Gold chính thức.
