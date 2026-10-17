# ifywnx · Locket Toolkit

Repo riêng tư lưu bộ cài, nguồn tham khảo và mã website. Cập nhật ngày 17/10/2026.

## Cấu trúc

| Thư mục | Nội dung |
|---|---|
| [Bộ cài gốc](<Bộ cài gốc/>) | Bộ file đang phục vụ trên web; có DNS cũ để khôi phục |
| [Mã nguồn đã clone](<Mã nguồn đã clone/>) | Bản lưu nguồn Module_IOS để đối chiếu, không phải bản mới nhất của upstream |
| [Website hiện tại](<Website hiện tại/>) | Snapshot mã web đang phát hành trên Sites |
| [Các ứng dụng khác](<Các ứng dụng khác/>) | Script và module ngoài Locket, chưa đưa vào dịch vụ hiện tại |

Các bản cũ và file trùng ở gốc đã được dọn. Có thể xem lại trong lịch sử Git. `.github` chứa kiểm tra tự động; `.gitignore` loại file môi trường, dữ liệu cục bộ và bản build.

## Website

[Trang cài đặt](https://ifywnx-install.agilechub512.chatgpt.site/welcome/)

- Gói 39.000đ và 59.000đ thanh toán qua payOS.
- Mỗi mã kích hoạt một lần; phiên đã kích hoạt có thể tiếp tục tải từng file.
- Các bước cài và quyền tải được mở sau khi máy chủ xác thực.
- Thứ tự cài: **Module → Config → DNS**. Hướng dẫn đầy đủ nằm trên web sau kích hoạt.
- DNS hiện tại: **ifywnx · DNS riêng**, dùng NextDNS. Bản trước đổi nằm trong [DNS dự phòng](<Bộ cài gốc/DNS dự phòng/>).

## Mã nguồn và triển khai

`Website hiện tại` là bản sao mã nguồn, **push GitHub không tự cập nhật Sites**. Muốn sửa web đang chạy cần build và triển khai qua Sites. Dữ liệu đơn hàng/mã kích hoạt nằm trong cơ sở dữ liệu máy chủ; các khóa payOS và thông tin tài khoản tải ứng dụng được cấu hình riêng bằng biến bí mật.

File bộ cài giữ nguyên các URL mẫu cũ để máy chủ thay thành đường dẫn tải có xác thực. Không dùng các URL raw cũ ở gốc GitHub để cài: các đường dẫn này đã được dọn. Luồng tải trên website không phụ thuộc các file cũ ở gốc repo.

## Khôi phục DNS

Thay nội dung `ifywnx-Locket-DNS.mobileconfig` trong `Website hiện tại/lib/private-assets.ts` bằng bản ở `Bộ cài gốc/DNS dự phòng/DNS cũ.mobileconfig`, đồng bộ file xuất trong `Bộ cài gốc`, rồi build và triển khai. Trên iPhone cần gỡ hồ sơ mới và cài lại hồ sơ muốn sử dụng.

## Nguồn và kiểm tra

Nguồn tham khảo: [duyvinh09/Module_IOS](https://github.com/duyvinh09/Module_IOS). Xem [ghi chú nguồn](<Mã nguồn đã clone/NGUỒN.md>) về snapshot và các trường chứng chỉ đã loại bỏ. Các app khác là bản lưu chưa kiểm thử; giữ thông tin tác giả trong file.

Chạy kiểm tra cấu trúc và đối chiếu bộ cài:

```sh
node .github/check-structure.cjs
```

Kiểm tra này không thay thế thử nghiệm trực tiếp trên iPhone.
