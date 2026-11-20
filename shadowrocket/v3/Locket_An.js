(function () {
  var result = {};
  try { result = rewrite(); } catch (error) { /* Preserve original response. */ }
  $done(result);
  function rewrite() {
// ========= ID ========= //
// Gán thẳng gói và quyền Gold của Locket. Trước đây đoạn này dùng danh sách
// ánh xạ và toán tử phẩy: chỉ chạy đúng vì danh sách có đúng 1 phần tử, và
// bỏ qua phản hồi nếu thiếu mục subscriptions/entitlements. Nay gán trực
// tiếp và tự tạo hai mục này nếu phản hồi gốc chưa có.
// =========  @ifywnx ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"] || "",
  obj = JSON.parse($response.body);
if (!ua.includes("Locket") || !obj || !obj.subscriber) return {};
obj.subscriber.subscriptions = obj.subscriber.subscriptions || {};
obj.subscriber.entitlements = obj.subscriber.entitlements || {};
var ifywnx = {
      auto_resume_date: null,
      display_name: "locket_1600_1y",
      is_sandbox: false,
      ownership_type: "PURCHASED",
      billing_issues_detected_at: null,
      management_url: "https://apps.apple.com/account/subscriptions",
      period_type: "normal",
      price: {
          "amount": 399000.0,
          "currency": "VND"
      },
      expires_date: "9999-01-09T10:10:14Z",
      grace_period_expires_date: null,
      refunded_at: null,
      unsubscribe_detected_at: null,
      original_purchase_date: "2006-01-09T10:10:15Z",
      purchase_date: "2006-01-09T10:10:14Z",
      store: "app_store",
      store_transaction_id: "2000001108724193",
  },
  locketGold = {
      grace_period_expires_date: null,
      purchase_date: "2006-01-09T10:10:14Z",
      product_identifier: "locket_1600_1y",
      expires_date: "9999-01-09T10:10:14Z"
  };
obj.subscriber.subscriptions["locket_1600_1y"] = ifywnx;
obj.subscriber.entitlements["Gold"] = locketGold;
return { body: JSON.stringify(obj) };

  }
})();
