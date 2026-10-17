# Phiếu kiểm thử Locket trên iPhone (bản thử nghiệm)

**Mục tiêu:** xác định lỗi chức năng, tránh gán nguyên nhân khi chưa có bằng chứng. Không thử trên tài khoản có dữ liệu chưa sao lưu.

## Điều kiện thử
- Ngày giờ, mẫu iPhone, iOS, phiên bản Locket.
- Phiên bản Shadowrocket và bộ Config/Module đang dùng (chỉ bật **một** bộ quy tắc Locket).
- Loại DNS (NextDNS, DNS cũ hoặc DNS mặc định), trạng thái VPN và Wi-Fi/4G.
- Không chụp token, cookie, mật khẩu, mã kích hoạt hoặc phản hồi mạng có dữ liệu cá nhân.

## Kịch bản
| STT | Chức năng | Thao tác | Quan sát / kết quả kỳ vọng |
|---|---|---|---|
| 1 | Widget Shin | Mở widget đã thiết lập | Hình hiển thị, không lỗi |
| 2 | Sticker/filter | Chọn một hiệu ứng và chụp thử | Ghi rõ tên filter; hiệu ứng có xuất hiện trên ảnh thực không |
| 3 | Tạo diện mạo | Bấm dấu tích vàng | Ghi màn hình trước/sau, trạng thái tải và thông báo lỗi |
| 4 | Khởi động | Đóng hẳn app rồi mở, đo 3 lần | Ghi thời gian đến khi giao diện sẵn sàng và trạng thái thuê bao chính thức |
| 5 | Caption | Giữ công cụ web ẩn; thử caption chuẩn trong app | Ghi liệu caption chuẩn có áp dụng được |
| 6 | Video | Quay 15 giây và 30 giây, có âm thanh, trên tài khoản được cấp quyền | Ghi thời lượng thực tế, gửi thành công, nhận và phát lại |
| 7 | Kết nối | So sánh Wi-Fi / mạng di động, DNS đang dùng và DNS mặc định | Không suy diễn DNS chậm nếu thiếu số liệu |

## Mẫu ghi lỗi
- Mã test, thời gian, thiết bị/phiên bản.
- Kết quả: **PASS / FAIL / CHƯA TEST**.
- Thời gian tải (giây), thao tác gây lỗi, thông báo hiện trên màn hình.
- Ảnh/video quay màn hình đã che thông tin cá nhân.
- Có tái hiện được sau khi đóng/mở lại ứng dụng không?

## Tiêu chí phát hành
- Widget Shin còn hoạt động.
- Chụp ảnh, gửi/nhận cơ bản và khởi động không thoái lui so với bản cũ.
- Không cam kết sticker, tạo diện mạo, video 30 giây hoặc Gold vĩnh viễn nếu chưa kiểm thử được.
- DNS là một lớp phân giải tên; chỉ thay DNS không có nghĩa đã cấp quyền thuê bao.
- Nhánh thử nghiệm không tự triển khai lên Sites; thay đổi website cần quy trình build/deploy riêng.
