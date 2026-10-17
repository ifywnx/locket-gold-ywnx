# V3 Website vs V4 — Đối chiếu cấu hình

## Nguồn đối chiếu

- Website source: `Website hiện tại/lib/private-assets.ts`, giá trị `assets["Locket_Unlocked.js"]`.
- Bản V3 website: 1.781 dòng, 80.293 ký tự.
- Bản thay thế 714 dòng: `Bản thử nghiệm/2026-10-17/Locket_Unlocked.js`.
- V4 mới: `Bản thử nghiệm/V4_Web_Stable_Test/scripts/`. Mọi tính năng đều chạy riêng, không kế thừa toàn bộ cấu hình V3.

Các con số đến từ phân tích mã nguồn lưu trong Git, **không xác nhận bản build website trực tuyến**.

## Khác biệt đã xác nhận

| Mục | V3 Web | Bản 714 dòng | V4 Minimal |
| --- | --- | --- | --- |
| Caption | 13 nhóm / 118 ID; gán lại cả mảng | 13 nhóm / 118 ID; lọc + gộp | 13 nhóm / 118 ID; chỉ nối ID chưa có và giữ mọi nhóm/mục gốc |
| Widget Shin-chan | Ghi đè widget từ server | Dùng fallback khi URL server bị đánh giá không hợp lệ | Chỉ thêm khi trường server thiếu/trống |
| Popup | Gán lại cấu hình | Gán lại cấu hình | Chỉ thêm khi server thiếu/trống (dùng module thử cũ) |
| Camera filter | Gán `camera_filter_config` cố định | Không gán trường này | Chỉ đọc cấu trúc và số lượng ID; không sửa |
| Cờ bạn bè, chat, cache, beta | Có nhiều ghi đè | Ít ghi đè hơn | Không động đến các trường này |
| RevenueCat | Có script riêng | Có script riêng trong bộ cài | V4 không tạo dữ liệu mua hàng, không viết quyền thuê bao |
| Kiểm soát JSON/UA | Có một số thiếu sót | Có phòng vệ đầu vào tốt hơn | Kiểm tra đầu vào và thoát không thay đổi khi không đủ điều kiện |

Phép đếm top-level key chủ động gán trong source: V3 Web 167, bản 714 dòng 135, trong đó 32 key chỉ V3 có gán. Đây không phải số lượng tính năng thực tế, và việc ngừng gán một key **không tự động có nghĩa tính năng đó bị mất**.

## Lỗi và tình trạng

| Vấn đề | Cách xử lý trong V4 | Trạng thái |
| --- | --- | --- |
| JSON không hợp lệ / thiếu entries | Không sửa phản hồi | Đã thử giả lập |
| Caption bị loại nhầm | Giữ nguyên nhóm không đúng định dạng dự đoán | Đã thử giả lập |
| ID caption bị trùng | Không thêm ID vốn có | Đã thử giả lập |
| Mất 118 caption từ website | Trích nguyên 118 ID rồi chỉ thêm mục còn thiếu | Đã đối chiếu nguồn |
| Widget ghi đè ảnh máy chủ | Không thay trường widget server không trống | Đã thử giả lập |
| Popup ghi đè cấu hình máy chủ | Không thay trường popup server không trống | Đã thử giả lập trong module độc lập cũ |
| Lỗi “Tạo diện mạo” / sticker | Chẩn đoán cấu trúc `camera_filter_config`, chưa can thiệp vào filter | **Chưa xác định nguyên nhân thực tế** |
| Sai khung ảnh widget | Cần kiểm thử tỷ lệ ảnh và cách iOS render | **Chưa giải quyết** |
| Đường dẫn tải của bộ cài | V4 dùng template host HTTPS và không chỉnh file gốc | **Cần host truy cập được** |
| Tương thích nhiều ứng dụng proxy | Chưa xác minh bằng ứng dụng thiết bị | **Chờ test** |
| Khôi phục bộ cài gốc | Không thay file gốc trong gói thử này | **Chưa hoàn tất** |

## Quy tắc

Không copy toàn bộ file V3 thành V4 hoạt động mặc định: điều đó mang theo các cờ không kiểm chứng và hành vi ghi đè. Dùng V3 làm **đường chuẩn kiểm tra những gì cần giữ**, chỉ chuyển thành V4 các tính năng đã xác nhận về mặt dữ liệu và thử nghiệm thực tế.
