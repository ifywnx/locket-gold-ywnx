# ifywnx V5 — chỉ 3 file cài đặt, chạy thử trước khi nâng cấp

> Đây là BẢN THỬ NGHIỆM riêng, chưa được kiểm thử trên iPhone và **không** thay thế bản website/bộ cài gốc đang phục vụ người dùng.

## Ba file người dùng nhìn thấy

| File | Khi nào dùng | Tác dụng |
| --- | --- | --- |
| `ifywnx-Locket-Config.conf` | Dùng làm **cấu hình Shadowrocket chính** trong lần test | Một quy tắc HTTPS Remote Config chạy script V5 |
| `ifywnx-Locket-Captions.sgmodule` | Dùng **thay cho .conf V5** khi có cấu hình nền hỗ trợ MITM | Cũng gọi đúng script V5 |
| `ifywnx-Locket-DNS.mobileconfig` | Tùy chọn, không phụ thuộc Shadowrocket | DNS DoH qua **NextDNS `dcc5ee`**, giống bản DNS chính hiện tại, dùng định danh profile mới cho test |

**Không bật `.conf` V5 và `.sgmodule` V5 cùng lúc**: chúng chạy cùng script, cùng endpoint. Và không bật đồng thời V3 cũ hoặc V4 rewrite trong lần thử này.

### DNS cũ thực sự là cái nào?

- `Bộ cài gốc/ifywnx-Locket-DNS.mobileconfig`: **NextDNS** `https://apple.dns.nextdns.io/dcc5ee`.
- `Bộ cài gốc/DNS dự phòng/DNS cũ.mobileconfig`: **uBlockDNS** `https://my.ublockdns.com/z451ak95`.

V5 chỉ **sao chép DNS NextDNS đang có**, không chuyển mặc định sang uBlockDNS chưa xác thực chủ sở hữu endpoint. Nếu muốn so sánh bằng uBlockDNS, dùng riêng bản `Bản thử nghiệm/V4_Web_Stable_Test/dns/ifywnx-uBlockDNS-Legacy-Test.mobileconfig` đã tạo trước; **chỉ chọn một DNS đang hoạt động**. DNS không tự cấp, gia hạn hay xác thực quyền thuê bao Gold.

## V5 script đã gộp gì?

File hỗ trợ `scripts/Locket_V5_Creative.js` **không cần cài riêng** nếu dùng link được cấp từ website.

1. **118 caption website** trong 13 nhóm.
2. **18 caption thử mới** trong 6 nhóm: Mood Check, Capybara Chill, Chihuahua Energy, Kittycore, Love & Match, Gen Z & Meme.
3. **Widget Shin-chan dự phòng**, chỉ khi máy chủ không gửi widget không rỗng.
4. **Chẩn đoán camera/filter** (ghi log số nhóm, trạng thái JSON), không ghi đè `camera_filter_config`.
5. **Bảo toàn** nhóm caption từ server, ID có sẵn, cấu hình tài khoản, popup, CDN, các cờ tính năng và dữ liệu thuê bao. Không sửa RevenueCat.

**Cần Locket hỗ trợ kiểu dữ liệu:** caption mới hoặc widget chưa chắc hiển thị chỉ vì script bổ sung được cấu hình JSON. V5 **không sửa** lỗi filter “Tạo diện mạo” không có hiệu ứng; phải kiểm tra tài nguyên và khả năng tương thích ứng dụng.

**Chuyển sang cấu hình V5 có thể làm mất trạng thái Gold đang hiển thị trong cấu hình cũ**, vì V5 không có logic giả lập giao dịch/entitlement.

## Tải qua website riêng sau khi deploy lại

Code hỗ trợ đã thêm:

- `Website hiện tại/lib/v5-test-assets.ts` lưu an toàn 3 file + script trên server.
- `Website hiện tại/app/v5-test-download/[token]/[file]/route.ts` phục vụ file sau khi kiểm tra token; không đổi tuyến `/download/` sản xuất.

Sau khi **build và deploy website phiên bản GitHub mới**, thay `DOMAIN` và `TOKEN` bằng tên miền thực tế và token còn hiệu lực **của chính bạn**:

```text
https://DOMAIN/v5-test-download/TOKEN/ifywnx-Locket-Config.conf
https://DOMAIN/v5-test-download/TOKEN/ifywnx-Locket-Captions.sgmodule
https://DOMAIN/v5-test-download/TOKEN/ifywnx-Locket-DNS.mobileconfig
```

Hai file `.conf` và `.sgmodule` khi tải qua website sẽ tự có script-path cùng domain đi đến `/v5-test-download/TOKEN/Locket_V5_Creative.js`.

**KHÔNG** nhập trực tiếp file cấu hình lấy bằng GitHub Raw vì trong mã nguồn GitHub còn placeholder `__V5_ASSET_BASE__` dùng để website thay. Repo private không cung cấp link Raw công khai. Không công khai token do quyền truy cập được xác minh qua token đó.

## Kiểm thử an toàn

1. Sao lưu cấu hình đang chạy, không thay bộ cài sản xuất.
2. Deploy website thử nghiệm, xác nhận URL file trả HTTP 200 cho token của bạn. 403 = sai/hết hạn; 404 = chưa deploy hoặc sai tên file.
3. Tắt module V3 trước khi kiểm tra, chọn **duy nhất config V5 hoặc module V5**. DNS là tùy chọn độc lập; giữ NextDNS hoặc DNS tự động để cô lập biến trong lần thử đầu.
4. Mở Locket, kiểm tra có 6 nhóm caption mới và tối đa 18 caption mới không. Sau đó thử widget Shin-chan **chỉ nếu server thiếu cấu hình widget**.
5. Xem log `[ifywnx V5]` với trạng thái filter (không log nội dung riêng tư). Thử filter trên Wi-Fi và 4G với DNS tự động/NextDNS, không phối hợp nhiều bộ lọc cùng lúc.
6. Thấy sự cố, chuyển về cấu hình cũ; không thay đổi dữ liệu tài khoản hoặc cài lại ứng dụng để chẩn đoán vội vàng.

## Kiểm thử mã nguồn

```bash
node "Bản thử nghiệm/V5_Three_File_Bundle/tests/regression.test.js"
```

30 tình huống đã được thử giả lập: giữ dữ liệu server, dedupe 136 ID, fallback widget, an toàn khi JSON lỗi, giữ camera và dữ liệu tài khoản.

## Khi nào mới được đưa vào 3 file gốc?

Sau khi cả **kiểm thử mã + thử thiết bị** đạt trên phiên bản Locket thực tế, mới cân nhắc phát hành các phần đã xác nhận. Không thay bản đang dùng theo giả định rằng toàn bộ tính năng đều đã được sửa.

Ghi chú: Website đang chạy **không** tự cập nhật từ GitHub. Cần redeploy; việc commit các file chưa tạo ra URL hoạt động ngay.
