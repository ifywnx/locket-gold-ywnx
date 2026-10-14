# Locket • ifywnx

Bộ cấu hình và script dành cho các ứng dụng proxy trên iOS. Repo có module Locket riêng, cấu hình All In One và các module ứng dụng khác.

Các script sửa phản hồi trên thiết bị; chúng không tạo giao dịch mua hay thay đổi quyền thuê bao trên máy chủ. Tính năng thực tế phụ thuộc phiên bản ứng dụng và cấu trúc phản hồi. Chưa kiểm thử bản cập nhật này trực tiếp trên iPhone.

## 1. Chọn đúng cấu hình

| Nhu cầu | Tệp |
|---|---|
| Chỉ dùng Locket, gồm caption | [Locket_ifywnx.sgmodule](https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/refs/heads/main/modules/Locket_ifywnx.sgmodule) |
| Module nhiều ứng dụng | [All_In_One.sgmodule](https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/refs/heads/main/All_In_One.sgmodule) |
| Cấu hình đầy đủ | [All_In_One.conf](https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/refs/heads/main/All_In_One.conf) |

**Khuyến nghị bắt đầu bằng module Locket riêng.** Chỉ bật một bộ quy tắc xử lý Locket: không bật đồng thời module riêng và All In One. Sao lưu cấu hình đang dùng trước khi nhập một tệp `.conf`, vì tệp cấu hình đầy đủ còn chứa quy tắc mạng ngoài Locket.

## 2. Cài trên Shadowrocket

Tên mục có thể khác theo phiên bản/ngôn ngữ của ứng dụng.

1. Cài Shadowrocket từ [App Store](https://apps.apple.com/app/id932747118).
2. Sao chép URL module Locket:

   ```text
   https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/refs/heads/main/modules/Locket_ifywnx.sgmodule
   ```

3. Mở Shadowrocket, vào phần cấu hình đang sử dụng và tìm mục **Module**. Thêm module bằng URL ở trên, tải về rồi bật module.
4. Trong cấu hình, bật chức năng giải mã HTTPS (**MITM**). Nếu chưa có chứng chỉ riêng, dùng chức năng tạo chứng chỉ CA của ứng dụng rồi chọn cài chứng chỉ.
5. Khi iOS yêu cầu, vào **Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị**, mở hồ sơ chứng chỉ vừa tải và cài đặt.
6. Vào **Cài đặt → Cài đặt chung → Giới thiệu → Cài đặt tin cậy chứng nhận**, bật tin cậy cho đúng chứng chỉ bạn vừa tạo. Chứng chỉ này cho phép proxy đọc/sửa HTTPS ở những hostname cấu hình; chỉ dùng chứng chỉ do chính bạn tạo và không chia sẻ khóa riêng.
7. Quay lại Shadowrocket, kiểm tra module đang bật và bật kết nối VPN. Cho phép thêm cấu hình VPN nếu iOS hỏi.
8. Đóng hoàn toàn Locket rồi mở lại để ứng dụng có cơ hội tải Remote Config mới. Vào màn hình chụp ảnh và mở danh sách caption.

Module riêng có ba phần: xử lý phản hồi Locket qua RevenueCat, xử lý header cache, và xử lý Firebase Remote Config để cung cấp caption. Hai hostname MITM cần thiết được khai báo sẵn trong module.

## 3. Cập nhật sau khi repo thay đổi

1. Trong ứng dụng proxy, cập nhật/tải lại module từ URL.
2. Nếu ứng dụng có bộ nhớ đệm script, làm mới script hoặc xoá bản script đã cache bằng chức năng của ứng dụng.
3. Kiểm tra chỉ còn một bộ quy tắc Locket đang bật.
4. Tắt/bật lại kết nối proxy, sau đó đóng và mở lại Locket.
5. Remote Config có thể được Locket cache riêng; việc cập nhật GitHub không có nghĩa danh sách caption trên điện thoại đổi ngay lập tức. Kiểm tra log xem yêu cầu tới `firebaseremoteconfig.googleapis.com` có chạy script hay chưa.

Không cần cài lại chứng chỉ mỗi lần chỉnh caption.

## 4. Chỉnh caption

Sửa [js/Locket_Unlocked.js](js/Locket_Unlocked.js), tìm `OVERLAY & CUSTOM CAPTIONS`, sau đó tìm `overlay_items`.

| Thuộc tính | Cách dùng |
|---|---|
| `section` | Tên nhóm caption |
| `overlay_id` | ID duy nhất; không trùng với caption khác |
| `caption.text` | Nội dung mặc định |
| `caption.localized_text` | Nội dung theo ngôn ngữ; khi đổi chữ cần sửa cả các bản này nếu có |
| `caption.icon.data` | Emoji |
| `caption.background.colors` | Danh sách mã màu nền |
| `caption.text_color` | Mã màu chữ |
| `caption.max_lines` | Số dòng đề nghị |
| `daily_start_hour`, `daily_end_hour` | Giới hạn giờ khai báo ở cấp item; bỏ cả hai nếu muốn không giới hạn giờ |

Ví dụ một item để thêm vào mảng `items` của nhóm phù hợp:

```js
{
    overlay_id: "caption:ifywnx_hello",
    source: "remote",
    caption: {
        background: { colors: ["#B8E7FF", "#DCCBFF"] },
        icon: { data: "✨", type: "emoji" },
        max_lines: 1,
        text: "Một ngày thật vui",
        text_color: "#183153",
        type: "static_content"
    }
}
```

Nhớ dấu phẩy giữa các item. File hiện khai báo 107 caption tĩnh và 11 loại caption động. Good morning có khoảng giờ 05:00–10:00; Goodnight là 19:30–24:00. Đây là cấu hình gửi cho ứng dụng, không bảo đảm mọi phiên bản Locket đều hỗ trợ đầy đủ. Không đổi `type` của caption động thành kiểu tuỳ ý.

## 5. Vai trò các file

- `modules/Locket_ifywnx.sgmodule`: kết nối các script và hostname cho module Locket riêng.
- `js/Locket_Unlocked.js`: Remote Config, caption và các cờ tính năng.
- `js/Locket_ifywnx.js`: xử lý phản hồi RevenueCat của Locket.
- `js/deleteHeader.js`: xử lý header cache của RevenueCat.
- `index.html`: trang hướng dẫn và nút sao chép/cài cấu hình.
- `Egern_LockGold.yaml`: cấu hình Egern riêng, hiện dùng script RevenueCat trong repo này; chưa tích hợp phần caption như module Shadowrocket. Không nhập nguyên trạng nếu chưa kiểm tra policy, module ngoài và chứng chỉ cục bộ `egern.p12`.

## 6. Xử lý lỗi

| Hiện tượng | Cần kiểm tra |
|---|---|
| Link tải không đúng | Dùng URL `ifywnx/locket-gold-ywnx`, không dùng repo cũ `Module_IOS` |
| Không có caption mới | Module đã cập nhật, script không còn cache, MITM hoạt động và có request Remote Config mới |
| Chỉ có caption mặc định | Đang dùng module có quy tắc `locket_rc`; chỉ bật một bộ quy tắc Locket |
| Không thấy Good morning/Goodnight | Khoảng giờ được khai báo trong item |
| Kết nối lỗi sau khi bật MITM | Kiểm tra chứng chỉ đã cài và được tin cậy; tạm tắt module để xác định nguyên nhân |
| Script không thay đổi phản hồi | Khi dữ liệu lỗi, thiếu cấu trúc cần thiết hoặc User-Agent không phải Locket, script chủ động giữ nguyên phản hồi |
| Nút sao chép trên web lỗi | Hộp thoại hiện URL để sao chép thủ công |
| Tính năng vẫn bị giới hạn | Có thể được máy chủ kiểm soát hoặc phiên bản app không hỗ trợ cờ cấu hình này |

Khi báo lỗi, gửi phiên bản iOS, Locket, ứng dụng proxy, module đang dùng và thông báo lỗi đã che token/thông tin cá nhân.

## 7. Kiểm tra trước khi đẩy code

Cần Node.js; chạy tại thư mục repo:

```sh
node scripts/check.cjs
git diff --check
```

Bộ kiểm tra xác nhận script hoàn thành đúng một lần, giữ nguyên phản hồi lỗi/ứng dụng khác, không trùng ID caption và các URL nội bộ (kể cả URL mã hoá) trỏ tới tệp tồn tại. GitHub Actions tự chạy kiểm tra khi push hoặc mở pull request. Các kiểm tra này không thay thế kiểm thử trên thiết bị.
