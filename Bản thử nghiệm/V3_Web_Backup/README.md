# V3 Web — điểm khôi phục mã nguồn gốc

Đây là **điểm tham chiếu** cho bản đang nhúng trong source website, **không** tự khẳng định bản build đã triển khai ngoài Internet giống mã trong GitHub.

- File: `Website hiện tại/lib/private-assets.ts`
- Key trong object `assets`: `Locket_Unlocked.js`
- Mã V3 Web: 1.781 dòng, 80.293 ký tự, 13 nhóm và 118 caption.
- Git blob gốc được xác minh trùng nguyên văn với nội dung mã nhúng: `05e8fba4eec364bcb3c134cbb590ec088ab0d25b`.
- File nguyên bản ở commit trước thay đổi `e65812acc4c71c93fe95b2c6bcb5a4021b5e400a` có thể tìm theo lịch sử Git.
- `Bộ cài gốc/Locket_Unlocked.js` có thể khác bản Web. Không đổi file gốc chỉ để thử nghiệm.
- Bản V3 có cấu hình can thiệp vào cờ quyền tính năng và danh sách camera/filter; KHÔNG sử dụng dữ liệu này làm bằng chứng dịch vụ đã cho phép quyền cao cấp.

Để đối chiếu:
1. Truy cập `Website hiện tại/lib/private-assets.ts`.
2. Lấy giá trị `assets["Locket_Unlocked.js"]`.
3. So sánh với V4 bằng các bài thử riêng. Không tự khôi phục/sao chép toàn bộ logic có thể làm sai trạng thái tài khoản.
4. Không ghi nội dung tài khoản, token, receipt vào log.

Ghi chú: đây là manifest tham chiếu của Git, **không phải bản sao thứ hai của tập tin thực thi**. Git history vẫn giữ nội dung cũ.
