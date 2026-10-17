# Bộ thử nghiệm Locket tối giản — 2026-10-17

**Mục đích:** thử từng thay đổi Remote Config độc lập, tránh bật hàng loạt cờ không được kiểm chứng. Thư mục này không phải bộ cài sản xuất.

## Cấu trúc

| File | Mục đích | Có sửa phản hồi? |
| --- | --- | --- |
| `core/Locket_Core_Diagnostics.js` | Kiểm tra cấu trúc phản hồi (log không có dữ liệu cá nhân) | Không |
| `captions/Locket_Captions_Test.js` | Thêm đúng 1 caption mẫu nếu `overlay_items` là mảng hợp lệ | Chỉ `overlay_items` |
| `widget/Locket_Widget_Test.js` | Chèn ảnh Shin-chan **chỉ khi server thiếu** `widget_frame_event` | Chỉ `widget_frame_event` |
| `popup/Locket_Popup_Test.js` | Thêm popup mẫu **chỉ khi server thiếu** popup | Chỉ `feature_discovery_popup_config` |
| `camera/Camera_Filter_Diagnostics.js` | Kiểm tra trạng thái `camera_filter_config` | Không |
| `diagnostics/Locket_Overlay_Diagnostics.js` | Thống kê số nhóm/mục caption, không đọc nội dung riêng tư vào log | Không |
| `*/ifywnx-*.sgmodule` | Module riêng cho từng trường hợp | Không, chỉ gọi script |
| `config/ifywnx-Locket-Test.conf` | Mẫu cấu hình thử cho Shadowrocket | Chỉ gọi 1 script |
| `config/ifywnx-Locket-Test.sgmodule` | Mẫu module thử | Chỉ gọi 1 script |
| `tests/smoke.test.js` | Kiểm thử Node.js với JSON giả lập | Không tác động thiết bị |
| `TEST_PLAN.md` | Danh sách bước kiểm thử và tiêu chí đánh giá | Không |

`Locket_Unlocked.js` nằm ở gốc thư mục ngày là **bản lưu thử nghiệm cũ 714 dòng**, KHÔNG phải bản Minimal. Không nhập bản đó cùng các module Minimal vì nó thay nhiều cờ khác.

## Trước khi dùng trên iPhone

1. **Repository `ifywnx/locket-gold-ywnx` đang private.** URL `raw.githubusercontent.com` thông thường không tải công khai được. Các module trong thư mục này cố ý dùng placeholder `https://YOUR_PUBLIC_HTTPS_HOST/ifywnx-tests`. Tự cung cấp một máy chủ HTTPS được phép phân phối script, hoặc tạo repo công khai **chỉ chứa mã thử nghiệm đã kiểm tra**, không đưa token, file nội bộ hoặc dữ liệu riêng tư lên.
2. Đăng các script bằng các đường dẫn con trùng cấu trúc trong bảng; sau đó thay `YOUR_PUBLIC_HTTPS_HOST` trong đúng module bạn muốn thử.
3. Chỉ bật **một** module thử nghiệm mỗi lượt; tắt các module Locket khác trước khi kiểm tra. Sao lưu cấu hình hiện có.
4. Kiểm tra chứng chỉ và tên miền, tránh MITM lưu dữ liệu tài khoản. Không ghi nội dung response hoặc token vào log.
5. Xem `TEST_PLAN.md` và thử bằng tài khoản/dữ liệu được phép sử dụng.

## Nguyên tắc

- Không giả lập giao dịch, receipt, ngày mua hoặc quyền thuê bao.
- Không thay `camera_filter_config` trong các script thử này. Module camera chỉ kiểm tra kiểu dữ liệu để phục vụ chẩn đoán.
- Không ghi đè các nhóm caption máy chủ bất thường; `Captions_Test` chỉ bổ sung nếu `overlay_items` có định dạng mảng hợp lệ.
- Widget và popup chỉ thêm khi trường gốc vắng/blank; nếu máy chủ đã gửi cấu hình, giữ nguyên.
- Không khẳng định UI sẽ xuất hiện hoặc tính năng có hiệu lực trên iPhone chỉ từ thử nghiệm JSON.

## Trạng thái bộ cài gốc

Tại thời điểm tạo gói này, việc phục hồi `Bộ cài gốc/Locket_Unlocked.js` về commit trước vẫn **chưa hoàn tất**. Gói thử nghiệm không chỉnh sửa `Bộ cài gốc`, `Website hiện tại`, bản DNS hoặc RevenueCat.

## Chạy thử mã tại máy tính

Cần Node.js. Clone repo qua quyền GitHub đã kết nối, vào thư mục `Bản thử nghiệm/2026-10-17`, sau đó chạy:

```bash
node tests/smoke.test.js
```

Bài thử chỉ kiểm tra logic JavaScript bằng phản hồi giả lập; phải kiểm thử riêng trên ứng dụng và phiên bản thực tế.
