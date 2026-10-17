# ifywnx V4 — Website-Parity Stable Test

Đây là **bộ kiểm thử V4**, không phải bản thay thế của website hay bộ cài gốc. Cơ sở đối chiếu là mã nhúng tại `Website hiện tại/lib/private-assets.ts` (V3 dài 1.781 dòng). Bộ 714 dòng trước đó được giữ ở `Bản thử nghiệm/2026-10-17/`.

## Có những gì?

| Thành phần | Đường dẫn | Hành vi |
| --- | --- | --- |
| Core | `scripts/Locket_V4_Core.js` | Chỉ ghi nhận phản hồi hợp lệ; không sửa |
| Captions V4 | `scripts/Locket_V4_Captions_118.js` | Lấy đúng **118 caption / 13 nhóm** từ nguồn website; chỉ thêm ID còn thiếu; giữ tất cả nhóm/mục của server kể cả kiểu bất thường |
| Widget | `scripts/Locket_V4_Widget_Test.js` | Thử ảnh Shin-chan nếu `widget_frame_event` thiếu hoặc trống; không đè widget máy chủ |
| Popup | Dùng `../2026-10-17/popup/Locket_Popup_Test.js` | Thử popup khi trường server thiếu/trống; không thay quyền tài khoản |
| Camera | `scripts/Locket_V4_Camera_Diagnostics.js` | Chỉ báo cấu trúc, số nhóm/ID filter; không ghi lại `camera_filter_config` |
| Test | `tests/regression.test.js` | Bộ kiểm tra đầu vào, caption, widget, popup, dữ liệu gốc |
| Config | `config/` | File `.conf` và module độc lập |

Tất cả script V4 đều giới hạn scope Remote Config. Không giả lập dữ liệu giao dịch, quyền thuê bao, và không bật hàng loạt các cờ bạn bè/chat/video/cache chưa kiểm chứng.

## Cách chạy thử trên máy tính

Clone repository bằng quyền tài khoản GitHub được cấp, sau đó:

```bash
node "Bản thử nghiệm/V4_Web_Stable_Test/tests/regression.test.js"
```

29 tình huống đã được kiểm tra trước khi tạo bộ test. Đây là kiểm thử **mã JavaScript với JSON giả lập**, không phải test iPhone.

## Cách triển khai thử nghiệm trên thiết bị

1. Repository hiện là **private**. Phải có một HTTPS host hợp lệ do bạn quản lý, cung cấp file script cho thiết bị được phép truy cập. Đừng chuyển toàn bộ repo website private thành public chỉ để tải Raw.
2. Đặt các script V4 lên host ở đường dẫn `/ifywnx-v4/scripts/`. Riêng popup đang tham chiếu file thử nghiệm cũ; nếu thử popup, cần đăng nó ở `/ifywnx-v4/popup/Locket_Popup_Test.js`.
3. Thay `YOUR_PUBLIC_HTTPS_HOST` trong file module mình định dùng ở `config/`.
4. Sao lưu cấu hình và tắt mọi module Locket khác. Bật đúng **một** module thử nghiệm.
5. Chạy từ Core → Captions → Widget → Popup → Camera Diagnostics; ghi nhận đối chiếu trên iPhone theo `TEST_PLAN.md`.

**Không nhập file template nguyên trạng:** Placeholder là giá trị cố ý chưa được cấu hình.

## Quan trọng

- Bản V3 Web 1.781 dòng đã được xác minh trùng bản script trong Git history trước commit `e65812a`; tài liệu tham chiếu ở `../V3_Web_Backup/README.md`.
- Caption V4 giữ cấu trúc server và chỉ thêm ID thiếu; không bảo đảm ứng dụng hỗ trợ mọi kiểu caption của website.
- Widget Shin-chan chưa có giải pháp bảo đảm hình không bị crop do tỷ lệ widget iOS.
- Camera/sticker “Tạo diện mạo” **chưa được sửa thực tế**. Module camera chỉ giúp xác định schema cần điều tra.
- Không đụng `Bộ cài gốc` hoặc `Website hiện tại`; việc rollback cũ chưa hoàn tất.
- `COMPATIBILITY.md` có bảng 32 key chênh lệch và tình trạng các vấn đề đã/chưa giải quyết.
