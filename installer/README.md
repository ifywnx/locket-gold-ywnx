# Cổng cài đặt ifywnx

Trang `/` cho người dùng nhập mã rồi cài module Locket bằng Shadowrocket.
Trang `/admin` yêu cầu đăng nhập ChatGPT bằng tài khoản chủ sở hữu đã cấu hình trong secret `OWNER_EMAIL`.

## Cấp quyền

1. Mở `/admin`, đăng nhập bằng tài khoản chủ site.
2. Nhập tên người nhận và số ngày (1–365), bấm Tạo mã.
3. Sao chép mã ngay; máy chủ chỉ lưu SHA-256, không hiển thị lại mã gốc.
4. Gửi URL trang chủ và mã riêng cho người nhận.
5. Thu hồi mã trong trang quản trị để chặn các lượt tải mới.

Mã và link cài là bearer credential: ai có đều sử dụng được. Không có ràng buộc thiết bị. Thu hồi hoặc hết hạn chỉ chặn tải mới, không gỡ script đã cache hay lấy lại bản sao. Không đặt token GitHub trong trình duyệt hoặc module.

## Kiến trúc

- `app/api/access`: xác minh mã và trả đường dẫn module riêng.
- `app/download/[token]/[file]`: kiểm tra mã ở mỗi request; chỉ cho tải module và 3 script trong allowlist.
- `app/api/admin`: kiểm tra danh tính chủ site, tạo và thu hồi mã.
- `db/schema.ts`: D1 lưu mã băm, tên, thời hạn và trạng thái.
- `lib/private-assets.ts`: snapshot script server-side từ repo private; không đặt trong `public/`.
- Các phản hồi có mã hoặc file riêng đặt `Cache-Control: no-store` và `Referrer-Policy: no-referrer`.

## Cập nhật script

Tạo lại `lib/private-assets.ts` từ các file `js/Locket_ifywnx.js`, `js/Locket_Unlocked.js`, `js/deleteHeader.js` và `modules/Locket_ifywnx.sgmodule` của repo chính rồi build/deploy lại. Site không tự đồng bộ GitHub. Giữ các đường dẫn gốc trong template: máy chủ sẽ thay chúng bằng URL tải có mã của người nhận.

## Phát triển

Dùng workflow Sites với Vinext. Cần Node >=22.13. Cài dependency theo lockfile; tạo migration bằng `npm run db:generate`, build bằng helper Sites. Không chỉnh migration đã áp dụng. Biến `OWNER_EMAIL` được đặt ở runtime, không đưa giá trị thật vào source.

Kiểm thử local bằng fixture ở database local; không đưa mã thử vào production. Kiểm tra invalid/expired/revoked code, tải module, tải script, path ngoài allowlist và quyền admin trước khi phát hành.

## Các file cài đặt tên rõ ràng

Bản cập nhật giao diện có 5 lựa chọn (cần triển khai lại Sites để xuất hiện trên web):

| Tệp | Công dụng |
|---|---|
| `ifywnx-Locket-Captions.sgmodule` | Module Locket và caption |
| `ifywnx-AllApps-Config.conf` | Cấu hình tổng hợp đầy đủ |
| `ifywnx-AllApps-Module.sgmodule` | Module tổng hợp thêm vào cấu hình hiện có |
| `ifywnx-GPS-Module.sgmodule` | Giả phản hồi vị trí, mặc định Tokyo |
| `ifywnx-Locket-DNS.mobileconfig` | Hồ sơ DNS tuỳ chọn của mục “config duy trì” |

Các tệp có tên mới nằm trong `downloads/`. Giữ tên cũ để không làm hỏng các cài đặt đang dùng. Chọn một bộ chính; không bật trùng cấu hình tổng hợp, module tổng hợp và module Locket. GPS/DNS không bắt buộc.

Hồ sơ DNS dùng `https://my.ublockdns.com/z451ak95`, có thể áp dụng ngoài Shadowrocket. Không bảo đảm duy trì Gold. Cài bằng Safari rồi vào Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị. Gỡ hồ sơ ở cùng mục để ngừng sử dụng; tắt Shadowrocket không tự gỡ DNS. Nhà cung cấp DNS có thể nhận truy vấn tên miền.

Các script Sub-Store bên ngoài trong All Apps vẫn dùng nguồn công khai gốc, không chứa mã truy cập riêng. Các script nội bộ đều đi qua endpoint kiểm tra mã.
