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
