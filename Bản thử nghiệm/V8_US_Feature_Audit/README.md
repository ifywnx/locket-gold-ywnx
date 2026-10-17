# Locket V8 — US Feature Compatibility Audit (18/10/2026)

**Chế độ chẩn đoán, không thay đổi V3, DNS, website hoặc quyền subscription.**

## Kết quả đối chiếu ban đầu
- Locket Gold chính thức: đổi icon ứng dụng, Camera Roll, bạn bè không giới hạn, video dài, streak recovery, bỏ quảng cáo, camera themes, tùy biến huy hiệu.
- Theo Locket, tính năng mới có thể chỉ phát cho một nhóm tài khoản.
- Bản snapshot `Website hiện tại/lib/private-assets.ts` có `camera_filter_config`, `microphone_enabled`, `camera_microphone_enabled`, `video_sound_enabled`; `Bộ cài gốc/Locket_Unlocked.js` không có đầy đủ các khóa đó.
- Module và Config có các quy tắc trùng nhau; không bật đồng thời.
- Manifest nguồn của repo private chứa raw GitHub URL mẫu: xác minh website đã thay bằng endpoint tải hợp lệ.
- DNS cũ `my.ublockdns.com` khác file DNS hiện tại trong GitHub; DNS không tạo engine filter, mic hoặc AI.
- Tên filter trong JSON chỉ là dữ liệu cấu hình. Không được tính là filter chạy thật.
- Trạng thái Gold phía client không xác nhận tài khoản được backend cho phép sử dụng tính năng hoặc huy hiệu được các tài khoản khác nhìn thấy.

## Chạy trên Mac (Node.js >=18)
Từ thư mục gốc repo:

```bash
node "Bản thử nghiệm/V8_US_Feature_Audit/audit.mjs" . ./v8-output
node "Bản thử nghiệm/V8_US_Feature_Audit/test.mjs"
```

Báo cáo tạo `v8-output/audit.md` và `audit.json`.

Nếu đã xuất được video do hai bên đồng ý thử nghiệm ra Mac, có thể kiểm tra track âm thanh cục bộ:

```bash
brew install ffmpeg
node "Bản thử nghiệm/V8_US_Feature_Audit/check-video-audio.mjs" /path/sender.mp4 /path/receiver.mp4
```

Không có track audio ở file gửi: kiểm tra ghi và mã hóa âm thanh. Có audio ở file gửi nhưng mất ở file nhận: kiểm tra đường upload/processing/download. Cả hai có audio mà người nhận không nghe: kiểm tra playback, mute và nội dung track.

## Tình trạng theo kết quả trên iPhone thật
| Hạng mục | Trạng thái |
|---|---|
| Camera, mở thư viện | Đã xác minh hoạt động |
| Micro/video người nhận nghe | Chưa hoạt động theo báo cáo người dùng; thiếu bằng chứng track |
| Filter | Giao diện xuất hiện, chưa chứng minh hiệu ứng hoạt động |
| Tạo diện mạo/AI | Không phản hồi khi nhấn ✓ trên điện thoại kiểm thử |
| Widget trong app | Đã xác minh thủ công |
| Widget ngoài Home Screen | Chưa kiểm tra cập nhật thực sự |
| Gold badge thấy ở máy khác | Chưa xác minh, phụ thuộc dữ liệu phía server |

## Nguồn chính thức
- https://help.locket.com/en/articles/11057185-what-is-locket-gold-and-what-features-are-included
- https://help.locket.com/en/articles/14294631-why-does-my-friend-have-a-new-feature-and-i-don-t
- https://help.locket.com/en/articles/7915017-how-do-i-capture-video-on-locket
- https://help.locket.com/en/articles/5859739-why-isn-t-my-locket-widget-updating
- https://apps.apple.com/us/app/locket-widget/id1600525061

**Kiểm tra tĩnh không phải kiểm thử Locket server và không tự bật hoặc làm hoạt động tính năng của bên thứ ba.**
