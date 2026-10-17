# uBlockDNS — bản thử riêng từ DNS cũ

## Mục đích

Dùng **đúng máy chủ DoH từng có trong `Bộ cài gốc/DNS dự phòng/DNS cũ.mobileconfig`**:

`https://my.ublockdns.com/z451ak95`

Bản thử: `ifywnx-uBlockDNS-Legacy-Test.mobileconfig`.

Đây là bản clone **chức năng DNS** của file cũ: cùng URL máy chủ DoH, cùng 7 `NeverConnect` ngoại lệ trong `OnDemandRules`. Các trường nhận diện profile và UUID đã đổi để phân biệt với file cũ và NextDNS hiện tại. Cả hai profile **không nên bật đồng thời**.

## Khác với file NextDNS đang dùng

- NextDNS hiện tại: `https://apple.dns.nextdns.io/dcc5ee`.
- uBlockDNS test: `https://my.ublockdns.com/z451ak95`.
- Hai dịch vụ có bộ lọc riêng cấu hình trên máy chủ. Profile Apple chỉ trỏ đến dịch vụ; nó không chứa những blocklist đó.
- `test.nextdns.io` dùng để kiểm tra NextDNS, do đó khi chuyển qua uBlockDNS nó có thể trả `unconfigured` hoàn toàn bình thường.
- Có thể kiểm tra hoạt động bằng dashboard/log của tài khoản uBlockDNS quản lý endpoint, hoặc công cụ kiểm tra DNS độc lập.

## Quyền riêng tư và quyền quản trị

**Không xác minh được ID `z451ak95` thuộc sở hữu của bạn.** Bất cứ bên nào kiểm soát profile uBlockDNS gốc có thể thay đổi bộ lọc và xem lịch sử truy vấn DNS theo chính sách dịch vụ. Để có cấu hình cá nhân, cần tạo profile của chính mình tại https://ublockdns.com/ rồi thay URL `ServerURL` bằng URL DoH riêng được cấp.

Đây là cấu hình .mobileconfig **chưa ký**, chỉ cài khi đã tự xác minh nguồn và địa chỉ DoH.

## Cách thử an toàn

1. Sao lưu/ghi nhớ DNS NextDNS đang dùng; không cần gỡ file gốc.
2. Cài `ifywnx-uBlockDNS-Legacy-Test.mobileconfig` qua Safari hoặc AirDrop.
3. Tắt Shadowrocket/VPN hoàn toàn. Chọn **một** profile DNS trong Cài đặt → Cài đặt chung → VPN & Quản lý thiết bị → DNS.
4. So sánh hoạt động truy cập web trên Wi-Fi và 4G/5G, chú ý captive portal và các ứng dụng tải chậm.
5. Đóng hẳn Locket và mở lại, ghi lại ứng dụng đang hiển thị loại tài khoản nào và các tính năng nào thực sự dùng được. **Không suy luận DNS đã cấp quyền Gold chỉ vì giao diện còn Gold.**
6. Khi hoàn tất, đổi về NextDNS và gỡ profile thử nếu không cần nữa.

## Phạm vi

DNS chỉ phân giải/lọc tên miền, **không thể cấp quyền thuê bao Gold hoặc tạo giao dịch mua hợp lệ**. Chưa có kết quả kiểm thử iPhone cho profile mới. Bộ cài gốc và website giữ nguyên.
