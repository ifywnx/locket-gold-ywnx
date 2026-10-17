// Camera-filter diagnostics — isolated Remote Config experiment.
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
        // Read-only: reports presence/shape, never logs filter IDs or raw data.
        var value = response.entries.camera_filter_config;
        var status = "absent";
        if (typeof value !== "undefined" && value !== null) {
            status = "non_object";
            try {
                var parsed = typeof value === "string" ? JSON.parse(value) : value;
                if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
                    status = "json_object";
                }
            } catch (parseError) {
                status = "malformed_json";
            }
        }
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx camera] camera_filter_config status=" + status);
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx test] Camera-filter diagnostics: processing error");
        }
    }
    $done(result);
})();
