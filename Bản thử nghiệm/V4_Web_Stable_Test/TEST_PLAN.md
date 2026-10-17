# Kiểm thử theo từng giai đoạn — V4 Web Parity

## Chuẩn bị

- Sao lưu cấu hình Locket trên thiết bị và kiểm tra phiên bản ứng dụng, iOS, proxy.
- Cần HTTPS host cho các script vì repo GitHub đang private; module tại `config/` hiện là **template**.
- Chỉ thử trên thiết bị/tài khoản bạn được phép sử dụng.
- Không kích hoạt song song với bản V3 hoặc bản 714 dòng.
- Không ghi token, ID tài khoản, receipt, hình ảnh cá nhân hoặc toàn bộ phản hồi vào log.

## A. Kiểm thử không thay đổi dữ liệu

Kích hoạt `config/V4_Core_Diagnostics.sgmodule`. Mọi thay đổi trong Locket lúc này không được quy cho script vì script không sửa JSON. Nếu gây lỗi, kiểm tra MITM và các module khác.

## B. Caption 118

Kích hoạt **riêng** `config/V4_Captions_118.sgmodule`.

Kiểm tra:
- Có tối đa 118 ID thuộc 13 nhóm được bổ sung tùy theo server đã có gì.
- Caption gốc và nhóm không quen thuộc từ server vẫn còn.
- Chạy nhiều lần không làm caption nhân đôi.
- Caption động và các kiểu chưa hỗ trợ của ứng dụng không được coi là đã hoạt động chỉ vì có ID trong JSON.

Nếu các caption không hiển thị, ghi phiên bản Locket, có/không có nhóm mẫu, số nhóm và số mục, không ghi nội dung tài khoản.

## C. Widget Shin-chan

Kích hoạt riêng `config/V4_Widget_Test.sgmodule`.

Kiểm tra:
- Nếu server đã có widget không rỗng thì V4 giữ nguyên, vì vậy có thể không xuất hiện Shin-chan.
- Nếu server không có widget, thử xem ảnh Shin-chan có hiển thị.
- Chụp ví dụ tỷ lệ khung và vị trí crop (che tên và ảnh cá nhân), so sánh widget nhỏ/vừa/lớn nếu có.
- Không khẳng định lỗi tỷ lệ đã được sửa, vì đó là cách ứng dụng render ảnh.

## D. Popup

Kích hoạt riêng `config/V4_Popup_Test.sgmodule`. Script đích là file popup thử nghiệm trước đó ở `2026-10-17/popup/`, được host tại đường dẫn chỉ định trong README.

- Nếu server có popup không trống, V4 không ghi đè.
- Nếu không có popup, xem ứng dụng có hiển thị thông báo V4 thử nghiệm không.
- Không gọi popup là chứng nhận tài khoản Gold.

## E. Camera / sticker / Tạo diện mạo

Kích hoạt riêng `config/V4_Camera_Diagnostics.sgmodule`.

- Ghi trạng thái `camera_filter_config` theo nhóm: absent / object / malformed_json / unexpected_type.
- Ghi số nhóm, số lần tham chiếu filter, số tham chiếu lặp.
- Tắt module, thử nút “Tạo diện mạo” trên Locket gốc rồi so sánh.
- Nếu lỗi vẫn xuất hiện ở app gốc, cần xác định nó đến từ app, tài nguyên tải về hay phản hồi máy chủ; chỉ chỉnh Remote Config khi có dữ liệu xác nhận.
- **Script camera không sửa sticker/filter** nên không gọi đây là bản vá sticker.

## F. Cổng vào / phân phối

- Kiểm tra domain script thực tế trả về HTTPS 200 và đúng nội dung JavaScript; không thể dùng placeholder `YOUR_PUBLIC_HTTPS_HOST`.
- Kiểm tra bộ cài không trỏ tới `/js/` hoặc `/downloads/` trong repo private mà tưởng là public.
- Không sửa config bộ cài đang dùng chỉ để triển khai thử V4.

## Tiêu chí đánh giá

| Kết quả | Điều kiện |
| --- | --- |
| PASS (unit) | Trường hợp JSON giả lập chạy đúng, không mất cấu hình server |
| PASS (device) | Hành vi mong muốn quan sát được trên iPhone, lặp lại được |
| NEEDS DATA | Cần thông tin app/endpoint/log an toàn để xác định nguyên nhân |
| FAIL | Script gây mất dữ liệu cấu hình, không tải được hoặc ứng dụng lỗi |
| NOT APPLICABLE | Server đã cấu hình widget/popup nên module thử V4 không đụng tới |

**Chỉ xem xét nâng cấp tính năng mới sau khi các kiểm thử cần thiết trên thiết bị đạt.**
