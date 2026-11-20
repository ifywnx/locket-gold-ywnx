# AN · Locket V3 — Shadowrocket (bản công khai)

**Nguồn đối chiếu:** `ifywnx/locketgold-r` → `v3/`, tại commit production `63d34645a9c6c385093acde6900df4a742b29bcc` của AN Store trên Vercel.

## 1. Cài V3 giống bộ cấu hình chính trên website

**Cài cấu hình (.conf) — tương đương định dạng mà nút “Cài lại V3 gốc vào Shadowrocket” trên web xuất ra:**

```text
https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/main/shadowrocket/v3/An-Locket.conf
```

Mở Shadowrocket → Cấu hình (Configuration) → thêm từ URL → dán URL trên → chọn cấu hình làm cấu hình đang chạy.

**Chỉ khi đã có cấu hình Shadowrocket riêng và muốn thêm một module (.sgmodule) vào đó:**

```text
https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/main/shadowrocket/v3/An-Locket.sgmodule
```

Vào Modules/Phân hệ → dấu + → nhập URL. **Không bật đồng thời cả file .conf V3 và module V3** để tránh can thiệp trùng trên cùng request.

## 2. Đã so sánh với bản production

- `An-Locket.sgmodule` có cùng nội dung nguồn V3 sau khi chuyển `__ASSET_BASE__` thành Raw URL công khai và thêm `#!url`.
- 4 script `Locket_Unlocked.js`, `Locket_An.js`, `deleteHeader.js`, `statusCheck.js` khớp bản nguồn V3 sau chuyển URL.
- `An-Locket.conf` được tạo đúng thuật toán `standaloneConfig()` của website: giữ các section `[General]`, `[Header Rewrite]`, `[Script]`, `[Rule]`, `[Host]`, `[MITM]`; thêm `dns-server = system`, `FINAL,DIRECT`, bỏ `%APPEND%` của MITM.
- Các cờ video của mã nguồn vẫn giữ nguyên: camera roll upload được khai báo, thời lượng cấu hình 30 giây, bitrate 0,9 Mbps, âm thanh và micro.
- Không trộn các bản thử Upload Compat / Community / PhotoBooth vào bản V3 gốc.

**Không thể đồng nhất 100% với link có chữ ký riêng của khách hàng**: website có thể chèn caption và khung PNG đã lưu, gắn dấu nhận diện file theo tài khoản, rồi trả JS qua API `/api/workspace/install/[ticket]/`. Bản này chỉ phân phối **V3 gốc chung**, không chứa mã phiên, dữ liệu hoặc ảnh cá nhân.

Hồ sơ DNS trong bộ cài web là **bước tùy chọn riêng**, không được tự động cài bằng file .conf này. Do đó nếu trên web bạn đã cài DNS riêng thì hành vi mạng có thể khác; không nên đưa ID DNS gắn với tài khoản lên repo công khai.

## 3. Kiểm tra gửi video

Mã Remote Config khai báo hỗ trợ video **không chứng minh ứng dụng và máy chủ sẽ chấp nhận upload**. Để so sánh công bằng với V3 web:

1. Chỉ bật một cấu hình/module V3; tắt module Locket trùng chức năng.
2. Kiểm tra script `Locket_Unlocked.js` và `Locket_An.js` đã tải và chạy; cấu hình MITM/chứng chỉ HTTPS của Shadowrocket hoạt động ở các hostname mà module khai báo. Chỉ tin cậy chứng chỉ trên thiết bị và phiên cấu hình của chính bạn.
3. Đóng hẳn, mở lại Locket; gửi **cùng video**, cùng tài khoản, cùng người nhận trên cả hai bộ cài. So sánh kết quả, lỗi, thời lượng và dung lượng.
4. Nếu web gửi được nhưng Raw lỗi, so sánh **cấu hình đang hoạt động, DNS, các module chồng nhau, 304/cache Remote Config và nhật ký lỗi của Shadowrocket** trước khi sửa cờ video.

Không chia sẻ ticket cài đặt có chữ ký, tài khoản, receipt hay log chứa dữ liệu riêng. Không cam kết Gold, Filter, micro, PhotoBooth hoặc upload sẽ hoạt động với mọi bản iOS/Locket.

## 4. Kiểm tra cấu trúc

Tại gốc repo, chạy:

```bash
node shadowrocket/v3/verify-v3.mjs
```

Kiểm tra nội bộ cấu trúc/đường dẫn và cờ video, không phải kiểm thử trên iPhone.
