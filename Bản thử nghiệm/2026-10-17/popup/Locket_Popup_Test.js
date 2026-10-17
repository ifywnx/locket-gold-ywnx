// Welcome popup — isolated Remote Config experiment.
// Opt-in test only. Preserve all unknown server fields and subscription data.
(function () {
    var result = {};
    try {
        if (typeof $request === "undefined" || !$request || !$request.headers ||
            typeof $response === "undefined" || !$response ||
            typeof $response.body !== "string") {
            $done(result);
            return;
        }

        var ua = "";
        var headers = $request.headers;
        for (var header in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, header) &&
                header.toLowerCase() === "user-agent" &&
                typeof headers[header] === "string") {
                ua = headers[header];
                break;
            }
        }
        if (!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)) {
            $done(result);
            return;
        }

        var response = JSON.parse($response.body);
        if (!response || typeof response !== "object" ||
            Array.isArray(response) || !response.entries ||
            typeof response.entries !== "object" ||
            Array.isArray(response.entries)) {
            $done(result);
            return;
        }
        // Add a harmless welcome popup only if the server did not configure one.
        var existingPopup = response.entries.feature_discovery_popup_config;
        if (typeof existingPopup === "undefined" || existingPopup === null || existingPopup === "") {
            response.entries.feature_discovery_popup_config = JSON.stringify({
                uid: "ifywnx_welcome_test_20261017",
                tag: "IFYWNX",
                title: "Chào mừng đến với ifywnx ✨",
                feature_set: [{
                    title: "Phiên bản thử nghiệm",
                    body: "Thử giao diện chào mừng, không thay đổi quyền tài khoản."
                }],
                primary_button_title: "Xong",
                campaign: "ifywnx_popup_test_20261017",
                start_at: "2020-01-01T00:00:00",
                end_at: "2099-12-31T23:59:59",
                use_local_time_zone: true
            });
            result = { body: JSON.stringify(response) };
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx test] Welcome popup: processing error");
        }
    }
    $done(result);
})();
