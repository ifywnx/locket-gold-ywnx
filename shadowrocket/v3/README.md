# Shadowrocket · An Locket V3

Nguồn: `ifywnx/locketgold-r/v3` — bản V3 với 705 caption tĩnh và 11 kiểu overlay động được khai báo trong mã.

## Cài module bằng một URL

```
https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/main/shadowrocket/v3/An-Locket.sgmodule
```

Vào Shadowrocket → Configuration → Modules → dấu + → dán URL trên và lưu. Các tham chiếu `script-path` đã trỏ đến các file JS công khai trong cùng thư mục.

## Cấu trúc

- `An-Locket.sgmodule`: module dùng cho Shadowrocket.
- `Locket_Unlocked.js`: Remote Config/caption.
- `Locket_An.js`: logic RevenueCat.
- `deleteHeader.js`: xử lý cache header.
- `statusCheck.js`: trang kiểm tra cài đặt.

Nguồn cấu hình cần MITM/HTTPS Decryption, chỉ bật nếu hiểu rõ rủi ro. Đây là bản phát hành mã nguồn để nhập module, chưa xác minh các tính năng trong Locket trên thiết bị thực, không phải sản phẩm chính thức của Locket hoặc Shadowrocket.
