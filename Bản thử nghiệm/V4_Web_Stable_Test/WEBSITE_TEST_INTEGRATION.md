# Tích hợp V4 vào Shadowrocket bằng website — môi trường thử nghiệm

**Trạng thái:** Mã nguồn đã được commit trong GitHub, **website đang chạy chưa tự động cập nhật**. Cần build/deploy lại site hiện tại trước khi các link bên dưới hoạt động.

## Vị trí được thêm trên website

- `Website hiện tại/lib/v4-test-assets.ts`: 6 script JS an toàn để test, 6 module thử nghiệm và 1 config thử nghiệm, đóng gói riêng không dùng Raw GitHub.
- `Website hiện tại/app/test-download/[token]/[file]/route.ts`: endpoint riêng, kiểm tra quyền bằng hàm `valid(token)` và trả mã 403/404 đúng; dùng header `Cache-Control: no-store`.
- **Không thay** `Website hiện tại/lib/private-assets.ts` hoặc `app/download/[token]/[file]/route.ts`. Khách dùng đường dẫn `/download/` cũ vẫn nhận bản cũ.
- **Không thay** `Bộ cài gốc/ifywnx-Locket-Config.conf` hay `Bộ cài gốc/ifywnx-Locket-Captions.sgmodule`.

## Cách lấy link sau khi deploy website

Từ một link hoạt động trên **cùng website** có dạng:

```text
https://TEN-MIEN-CUA-BAN/download/<TOKEN_CUA_CHINH_BAN>/Locket_ifywnx.sgmodule
```

Sử dụng **cùng TOKEN còn hiệu lực**, đổi thành một trong những link thử:

```text
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/ifywnx-Locket-Config-V4-Test.conf
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/ifywnx-Locket-Captions-V4-Test.sgmodule
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/V4_Captions_118.sgmodule
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/V4_Widget_Test.sgmodule
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/V4_Popup_Test.sgmodule
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/V4_Camera_Diagnostics.sgmodule
https://TEN-MIEN-CUA-BAN/test-download/<TOKEN_CUA_CHINH_BAN>/V4_Core_Diagnostics.sgmodule
```

**KHÔNG gửi TOKEN hoặc link có mã lên GitHub, nhóm chat công khai hoặc cho người khác.** Token trong URL là thông tin xác thực dạng bearer credential. Nếu đã hết hạn/bị thu hồi, server sẽ trả 403. Chỉ dùng mã còn hiệu lực do website cấp cho bạn.

## Cách chạy không xung đột

1. Sao lưu cấu hình Shadowrocket đang dùng.
2. Trong Shadowrocket chọn **cấu hình thử nghiệm riêng**; không chạy đồng thời bộ cài V3 và V4.
3. Cách A: nhập `ifywnx-Locket-Config-V4-Test.conf` — cấu hình độc lập, mặc định chạy chẩn đoán filter.
4. Cách B: nếu đã có cấu hình nền hỗ trợ script/MITM, dùng **một** module `.sgmodule` V4; không cần nhập thêm `.conf` V4 nếu nó đã chạy cùng script.
5. V4 Filter Audit trả log `[ifywnx V4 filter compatibility]` mô tả số nhóm, số ID filter, số ID trùng với website V3. Nó không sửa phản hồi nên không thể tự bật hiệu ứng.
6. Khi muốn test caption/widget/popup, hãy tắt module filter đang thử và thay bằng module tương ứng. Không bật cùng lúc nhiều script rewrite cùng endpoint.
7. Locket Gold/RevenueCat **không có** trong các bản thử này. Không dùng thử nghiệm này để khẳng định thuê bao Gold.

## Kiểm tra website trước khi nhập

- `/test-download/<token>/V4_Core_Diagnostics.sgmodule` trả HTTP 200 và nội dung có `[Script]`.
- URL script-path bên trong trỏ đến **đúng domain của website** và đường dẫn `/test-download/<token>/Locket_V4_Core.js`.
- Nếu trả 404: có thể chưa deploy bản code mới.
- Nếu trả 403: token không hợp lệ hoặc hết hạn. Không chia sẻ token để nhờ debug.
- Nếu script không chạy trên thiết bị: kiểm tra Shadowrocket đã bật, mục MITM, chứng chỉ người dùng, và log (chỉ gửi phần không có token/ID tài khoản).

## Mục tiêu thử filter

Bản website V3 có 6 nhóm/35 filter ID (36 lượt tham chiếu; `bye_brows` ở 2 nhóm). Nếu thấy danh sách nhưng hiệu ứng không chạy, cần so sánh phản hồi gốc, việc tải tài nguyên và hỗ trợ của app. Không tự bật các ID chỉ để hiển thị danh sách rồi coi là sửa xong.
