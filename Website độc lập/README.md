# Website độc lập

Next.js chạy trên Node.js, SQLite/libSQL lưu trên volume /data. Không phụ thuộc Sites.

Railway: Root Directory = /Website độc lập; Build = npm run build; Start = npm start; volume /data; chỉ 1 replica.

Biến môi trường: DATABASE_URL=file:/data/app.db, DATA_DIR=/data, ADMIN_PASSWORD (ít nhất 24 ký tự), PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY, SHARED_APPLE_EMAIL, SHARED_APPLE_PASSWORD. Không commit giá trị bí mật.

Quản trị /admin đăng nhập admin và ADMIN_PASSWORD. Web /welcome/. Nối repo GitHub và nhánh main để tự deploy khi push. Cơ sở dữ liệu mới trống; đơn/mã từ Sites chưa tự chuyển. Giữ site cũ để phục vụ đơn cũ đến khi hoàn tất nhập dữ liệu. Webhook payOS: /api/payos/webhook trên tên miền mới.

Bản đầu tạm tắt thanh toán (`public/welcome/config.js`) đến khi cấu hình khóa payOS và xác minh kênh thanh toán trên hosting mới.
