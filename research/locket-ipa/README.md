# Locket thật — kiểm tra IPA trước khi sửa

Nhánh này phục vụ phân tích các bản IPA Locket mà người dùng có, thay vì tạo ứng dụng SwiftUI độc lập AN Moments.

**Đây là công cụ kiểm tra tĩnh: chưa chỉnh sửa, tái ký, giải mã, mở khóa Gold hoặc tạo bản IPA mới.** Không thay đổi website, DNS hay bộ cài khách hàng trên main.

## Chạy trên Mac

    gh repo clone ifywnx/locket-gold-ywnx locket-review -- --branch research/locket-original-ipa
    cd locket-review/research/locket-ipa

    find "$HOME/Downloads" "$HOME/Desktop" -type f -iname "*.ipa" -print

Thay đường dẫn bằng vị trí thật của IPA trên Mac:

    python3 audit_ipa.py "$HOME/Downloads/Locket_clean.ipa" \
      "$HOME/Downloads/com.locket.Locket_1600525061_2.70.0(1).ipa"

Kết quả: locket-ipa-report.json. Có thể bổ sung đường dẫn của những IPA khác vào lệnh.

## Công cụ phân tích được gì?

- SHA-256 để phát hiện IPA trùng nội dung.
- Bundle ID, version, build, executable trong Info.plist.
- App extensions .appex, frameworks, .dylib nhúng.
- Mach-O linked dynamic libraries (otool có sẵn trên macOS).
- Chỉ dấu văn bản Telegram, RevenueCat, MobileSubstrate.
- Có/không có CodeResources và embedded.mobileprovision.

Chỉ có dấu hiệu không chứng minh tính an toàn, Gold hoặc việc yêu cầu Telegram.

## Phân biệt đúng các loại app

| Loại | Thực chất |
| --- | --- |
| Locket IPA chính thức | App của Locket, chức năng chính được cung cấp bởi Locket và backend của họ |
| IPA Locket chỉnh sửa | Vẫn có thể chứa binary Locket nhưng thay đổi thư viện/chữ ký; quyền Gold server-side không bảo đảm |
| Shadowrocket module | Script chặn/viết lại network response; không thêm source code native vào app |
| AN Moments | Ứng dụng SwiftUI độc lập, backend riêng; không phải app Locket |

## Giới hạn quan trọng

- Không được khẳng định tất cả Gold hoạt động chỉ vì app hiển thị huy hiệu hoặc menu.
- Đổi Bundle ID / tái ký có thể ảnh hưởng widget, App Groups, Push entitlements.
- Không nhập Apple ID, OTP Locket, mật khẩu Telegram hoặc thông tin thanh toán vào IPA không đáng tin cậy.
- Không đưa tài khoản, token, private key, full IPA hoặc log cá nhân lên repo công khai.
- Chưa có kết quả kiểm thử tài khoản Locket hoặc iPhone thật.

## Nghiệm thu kỹ thuật tiếp theo

1. Đối chiếu bản 2.70.0, Clean, NSMOD, ModVip, VTUYN và Patched.
2. Xác minh version nội bộ, extension widget, linked libraries, cơ chế mở app.
3. Kiểm tra chữ ký trên Mac/iPhone và ảnh hưởng entitlement.
4. Chỉ sửa phần có mã nguồn và quyền sửa phù hợp; xác minh hoạt động đầu-cuối thực tế.

Không thay thế bản gốc, không bật Gold hoặc triển khai dịch vụ khi chưa được xác minh.
