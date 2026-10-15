# ifywnx — thanh toán và cài đặt

## Luồng cho người dùng

1. Mở trang cài đặt bằng Safari trên iPhone có Shadowrocket.
2. Bấm **Tạo thanh toán 39.000đ**, rồi mở trang payOS.
3. Chuyển đúng số tiền, đúng thông tin trên đơn. QR có thể dùng tài khoản định danh VQR của kênh MB Bank; không sửa về số tài khoản gốc và không tự đổi nội dung.
4. Quay về cùng trang, cùng trình duyệt. Hệ thống kiểm tra thanh toán và điền mã khi đã xác nhận.
5. Bấm **Kích hoạt** một lần. Phiên này được mở danh sách các file để cài từng bước. Mã không kích hoạt được ở phiên khác.
6. Chọn **một** bộ chính: Locket + Caption, cấu hình tổng hợp, hoặc module tổng hợp. GPS và DNS là tuỳ chọn. Không bật các bộ trùng quy tắc.
7. Bật Giải mã HTTPS trong Shadowrocket, cài và tin cậy chứng chỉ do chính Shadowrocket trên máy tạo. Nếu đã có chứng chỉ hợp lệ thì không cần tạo lại.
8. Bật Shadowrocket rồi mở lại Locket.

Bộ file khôi phục từ mốc `11e731e`, trước thay đổi DNS riêng; giữ popup ifywnx. DNS cũ dùng `my.ublockdns.com`, là dịch vụ bên thứ ba. Việc khôi phục mã nguồn chưa chứng minh Gold hoạt động trên phiên bản Locket hiện tại.

## Mã và phiên tải

- Mã mới chỉ kích hoạt một lần; gửi lại yêu cầu từ cùng phiên khi mất mạng không tiêu thụ thêm lượt.
- Phiên đã kích hoạt được tải cấu hình, module, DNS và script phụ trợ. Không khoá sau lượt tải file đầu tiên.
- Giữ cùng trình duyệt, tránh chế độ riêng tư hoặc xoá dữ liệu trang khi đang cài. Nếu mất phiên, liên hệ người quản trị để xử lý, không tự mua lại.
- Liên kết tải trong Shadowrocket là liên kết riêng có quyền truy cập. Không chia sẻ. Cơ chế này không ngăn được sao chép file hoặc chia sẻ liên kết đã nhận.
- Mã thanh toán không đặt hạn tự động trong bản này; quản trị viên có thể thu hồi. Mã thủ công theo số ngày đã chọn.
- Mã cũ trước nâng cấp vẫn giữ cách hoạt động cũ để không làm hỏng cấu hình đang cài.

## Quản trị

Trang: https://ifywnx-install.agilechub512.chatgpt.site/admin

Mã thanh toán có nhãn `payOS #<mã đơn>`. Có thể thu hồi tại trang quản trị. Thu hồi chặn lượt tải/cập nhật mới, không xoá file đã có trên điện thoại.

Các khóa `PAYOS_CLIENT_ID`, `PAYOS_API_KEY`, `PAYOS_CHECKSUM_KEY` nằm ở bí mật của Sites. Không thêm vào HTML, Git, Netlify hoặc ảnh chụp. Mã chưa kích hoạt của đơn được lưu mã hoá bằng khóa suy ra từ Checksum Key; khi đổi khóa cần kế hoạch chuyển mã hoá hoặc cấp lại các mã chưa nhận.

Webhook:
`https://ifywnx-install.agilechub512.chatgpt.site/api/payos/webhook`

Backend xác minh chữ ký, thông tin đơn và trạng thái thanh toán qua API payOS. Callback trên trình duyệt không tự cấp mã. Thông báo lặp không cấp thêm mã.

## Cập nhật Netlify

1. Giải nén `ifywnx-netlify.zip`.
2. Đưa thư mục `ifywnx-netlify` chứa `index.html`, `_redirects`, `_headers` vào mục deploy của dự án **ifywnx** trên Netlify.
3. Giữ nguyên `_redirects`: các đường dẫn `/api/*` chuyển tiếp tới backend Sites.
4. Truy cập https://ifywnx.netlify.app để kiểm tra nút tạo đơn và kích hoạt. URL Netlify được cho phép hiện tại là chính xác tên miền này; đổi tên miền cần cập nhật danh sách origin ở backend.

Bản ZIP chưa tự cập nhật website Netlify đang chạy. Web quản trị và backend vẫn ở Sites của An Nguyen. Web sharpheron32 là bản cũ, không phải backend của bản này.

## Kiểm thử

Đã kiểm thử bằng giao dịch giả trong bộ test cục bộ: chữ ký sai, sai tiền/tài khoản, chưa trả tiền, webhook lặp, hai phiên cùng kích hoạt, tải đủ các file và thu hồi phiên. Đây không phải xác nhận một giao dịch tiền thật đã hoàn tất.

Đã xác nhận trên dịch vụ thật: webhook payOS đăng ký thành công, đúng tài khoản MB gốc; tạo đơn 39.000đ thành công; đơn PENDING không trả mã; đơn kiểm tra đã huỷ. Chưa thực hiện chuyển tiền thật để thử nhánh PAID.
