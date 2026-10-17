# ifywnx V6 — Caption + Widget Theme Picker (TEST)

**Tình trạng:** Đã tạo mã nguồn website và mã thử nghiệm trong GitHub. **Chưa deploy website / chưa xác nhận hoạt động trên iPhone.** Không thay `Bộ cài gốc`, `Website hiện tại/lib/private-assets.ts` hoặc tuyến tải `/download` chính.

## Mục tiêu

Giữ mô hình **3 file cài đặt** của người dùng:

1. `ifywnx-Locket-Config.conf`: cấu hình Shadowrocket độc lập.
2. `ifywnx-Locket-Captions.sgmodule`: module dùng thay config nếu đã có cấu hình nền.
3. `ifywnx-Locket-DNS.mobileconfig`: DNS NextDNS tùy chọn, hoạt động độc lập.

**.conf và .sgmodule là hai phương thức thay thế nhau, KHÔNG bật đồng thời.** Khi tải qua website, 2 file đầu tự trỏ về cùng JS với chủ đề đã chọn.

Script hỗ trợ `scripts/Locket_V6_Creative.js` do website phân phối; người dùng **không cần tải riêng**. Gói này không can thiệp quyền thuê bao, không sửa RevenueCat.

## Những tính năng đã xây dựng

| Tính năng | Trong JS V6 | Trên iPhone |
|---|---|---|
| 118 caption gốc từ mã website + 18 caption chủ đề (tổng 136) | Có, tránh trùng ID và giữ caption máy chủ | Chưa test |
| Chủ đề widget **Khung gốc** | Giữ nguyên `widget_frame_event` máy chủ | Chưa test |
| Chủ đề widget **Shin-chan** | Nếu người dùng chủ động chọn, thử thay URL widget | Chưa test |
| Capybara, Chihuahua, Kittycore, Meme, ảnh riêng | Cho phép nhập **Direct Link ImgBB** vào chủ đề đã chọn | Chưa test |
| Xem trước ảnh khung | Trên website `/v6-widget/<token>` | Có trong source, chưa deploy |
| Popup chào mừng V6 | Bật theo lựa chọn; không thay popup máy chủ đã có | Chưa test |
| Camera/filter | Log cấu trúc `camera_filter_config` **không đổi** | Chưa sửa lỗi hiệu ứng |
| Dữ liệu máy chủ và thuê bao | Không chỉnh sửa | Kiểm thử giả lập |

**Giới hạn thực tế:** Không có mã nguồn ứng dụng Locket iOS. Ta **không thể tự thêm nút chọn chủ đề vào giao diện gốc** chỉ với Shadowrocket. Bộ chọn chủ đề này nằm **trên website ifywnx** và sinh cấu hình tải về. Locket có áp dụng widget ảnh được chọn hay không cần kiểm thử thiết bị; remote config có thể bị app bỏ qua hoặc cache.

### Hình chủ đề

- **Khung gốc:** giữ ảnh widget do Locket đang cung cấp.
- **Shin-chan:** ảnh https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png đã xuất hiện trong mã website cũ.
- **Capybara / Chihuahua / Kittycore / Meme / Ảnh của bạn:** ô giao diện đã dựng, nhưng chưa có ảnh preset được xác minh. Người dùng tải ảnh có quyền sử dụng lên ImgBB, dán URL Direct Link **https://i.ibb.co/.../filename.png** (hoặc JPG/WebP).
- Thay khung có thể cần cập nhật config/module và khởi động lại ứng dụng; không có cơ chế thay ảnh tức thì bên trong Locket.

## Nơi triển khai trên website

- `Website hiện tại/lib/v6-test-assets.ts`: snapshot server-side của 3 file + V6 JS.
- `Website hiện tại/lib/v6-widget-choice.ts`: kiểm tra chủ đề/URL ảnh ImgBB và lựa chọn popup.
- `Website hiện tại/app/v6-widget/[token]/route.ts`: trang chọn khung, xem trước, có xác minh mã truy cập.
- `Website hiện tại/app/v6-download/[token]/[file]/route.ts`: trả về config/module đã chọn (URL script đúng token/chủ đề), hoặc JS theo lựa chọn.
- `Website hiện tại/public/welcome/app.js`: sau khi người dùng kích hoạt mã, hiện mục **“🧪 Thử nghiệm V6 · Chọn khung widget”** (thu gọn). Tất cả nút cài bản gốc còn nguyên.

## Cách dùng sau khi site được build/deploy lại

1. Trên website ifywnx, đăng nhập/kích hoạt bằng mã của chính bạn.
2. Mở mục `🧪 Thử nghiệm V6 · Chọn khung widget` trong phần cài đặt, bấm vào trang chủ đề.
3. Chọn khung. Với Capybara, Chihuahua, Kittycore, Meme hoặc ảnh riêng, dán Direct Link ImgBB PNG/JPG/WebP; ô preview hiện ảnh thực tế.
4. Bật popup nếu muốn. Bấm **một trong hai**: `.conf` **hoặc** `.sgmodule`.
5. Trên Shadowrocket, sao lưu/tắt toàn bộ module Locket V3/V4/V5 để tránh cùng bắt Remote Config. Sau đó nhập file V6 được tải qua trang web. Cần HTTPS MITM được cấu hình hợp lệ.
6. DNS là tùy chọn. V6 dùng **NextDNS `dcc5ee`** của file chính (định danh profile thử riêng). uBlockDNS cũ không được chuyển mặc định; xem file dự phòng riêng nếu cần đối chiếu DNS.
7. Mở Locket, kiểm tra 136 caption, ảnh widget nếu được hỗ trợ và popup (chỉ khi server thiếu popup). Test một lần với DNS tự động trước để cô lập lỗi.
8. Nếu có sự cố: tắt bản V6 và bật lại config cũ. Không cần xóa cài đặt ứng dụng hoặc xóa dữ liệu để thử nhanh.

Các URL chỉ sau khi deploy và với **token thật còn hiệu lực**:

```text
https://YOUR_SITE/v6-widget/<TOKEN>
https://YOUR_SITE/v6-download/<TOKEN>/ifywnx-Locket-Config.conf?theme=shinchan
https://YOUR_SITE/v6-download/<TOKEN>/ifywnx-Locket-Captions.sgmodule?theme=shinchan
https://YOUR_SITE/v6-download/<TOKEN>/ifywnx-Locket-DNS.mobileconfig
```

**Đừng gửi link chứa TOKEN cho người lạ**: đó là thông tin xác thực. Với code single-use, phải dùng session token do website trả về, không tự đoán/mượn token khác. Repo vẫn private.

## Những việc còn thiếu

- Deploy website; GitHub commit **không** cập nhật website đang chạy.
- Thử Shadowrocket trên iPhone và xác định schema widget của phiên bản ứng dụng.
- Kiểm thử chiều rộng/crop widget để chọn kích thước ảnh hợp.
- Lỗi có danh sách filter nhưng bấm không tạo hiệu ứng **chưa sửa xong**. Việc gán tên và ID `camera_filter_config` không chứng minh app có tài nguyên filter; V6 không tự bật các ID đó.
- Không giả lập quyền Gold. Nếu dùng bản V6 thay V3, trạng thái Gold giả lập từ bản cũ có thể không còn hiển thị.
- Bổ sung bộ ảnh mẫu có quyền sử dụng cho Capybara, Chihuahua, Kittycore và Meme nếu muốn lựa chọn sẵn không cần dán link.

## Kiểm thử mã tại Mac/PC

```bash
node "Bản thử nghiệm/V6_Widget_Themes/tests/regression.test.js"
```

Kiểm thử mã nguồn chỉ xác nhận logic JSON (24 ca), không xác nhận iOS hay hỗ trợ native filter.

**Điểm quan trọng:** Nếu người dùng muốn *chọn ngay trong camera hoặc ứng dụng Locket* như menu chủ đề nguyên bản, sẽ cần API/schema có sẵn được Locket hỗ trợ hoặc sửa ứng dụng khi có quyền và mã nguồn phù hợp. Không thể cam kết thực hiện bằng chỉnh Remote Config ngoài ứng dụng.
