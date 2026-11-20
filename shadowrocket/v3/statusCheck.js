/*
 * An Store · Trang tự kiểm tra cài đặt (V3)
 *
 * Khách mở http://anstore-check.invalid/ trong Safari khi Shadowrocket đang bật.
 * Địa chỉ .invalid không tồn tại trên internet: nếu trang này hiện ra, module
 * đang chạy và đường đón dữ liệu (script) đang thông. Script trả lời ngay
 * trên máy khách, không gửi gì ra ngoài.
 */
(function () {
  var now = new Date();
  function p(n) { return (n < 10 ? '0' : '') + n; }
  var time = p(now.getDate()) + '/' + p(now.getMonth() + 1) + '/' + now.getFullYear() +
    ' ' + p(now.getHours()) + ':' + p(now.getMinutes()) + ':' + p(now.getSeconds());
  var body = '<!DOCTYPE html><html lang="vi"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>An Store · Kiểm tra cài đặt</title><style>' +
    'body{font-family:-apple-system,system-ui,sans-serif;margin:0;padding:24px;background:#0b0b10;color:#f5f2ea}' +
    'h1{font-size:20px;margin:0 0 4px}.sub{color:#a49e8f;font-size:13px;margin-bottom:20px}' +
    '.row{background:#17171f;border:1px solid #26262f;border-radius:12px;padding:14px 16px;margin-bottom:10px}' +
    '.row b{display:block;font-size:15px}.row span{font-size:13px;color:#a49e8f}' +
    '.foot{margin-top:18px;font-size:13px;color:#a49e8f;line-height:1.6}' +
    '</style></head><body>' +
    '<h1>✅ An Store đang hoạt động</h1>' +
    '<p class="sub">Trang này chỉ hiện khi module đã chạy trên máy bạn. Kiểm tra lúc ' + time + '.</p>' +
    '<div class="row"><b>✅ Module V3 đã bật</b><span>Shadowrocket đã nạp và chạy bộ cài của An Store.</span></div>' +
    '<div class="row"><b>✅ Đường đón dữ liệu thông</b><span>Script kiểm tra trả lời được ngay trên máy — cùng đường mà cơ chế gắn Gold và caption đi qua.</span></div>' +
    '<div class="row"><b>Bước tiếp theo</b><span>Mở app Locket, chờ vài giây rồi kiểm tra huy hiệu Gold. Nếu chưa thấy Gold, tắt hẳn Locket (vuốt khỏi đa nhiệm) rồi mở lại.</span></div>' +
    '<p class="foot">Nếu bạn mở địa chỉ này mà <b>không</b> thấy trang kiểm tra (trình duyệt báo không tìm thấy máy chủ), nghĩa là module chưa chạy: kiểm tra lại trong Shadowrocket — đã bật cấu hình, đã chọn đúng module V3 và đã tin cậy chứng chỉ chưa.</p>' +
    '</body></html>';
  $done({
    response: {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' },
      body: body
    }
  });
})();
