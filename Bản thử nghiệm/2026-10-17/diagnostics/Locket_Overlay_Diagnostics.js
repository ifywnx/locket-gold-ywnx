// Caption diagnostics — isolated Remote Config experiment.
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
        // Read-only: summarize array count and types, never log caption text.
        var value = response.entries.overlay_items;
        var status = "absent";
        var sectionCount = 0;
        var itemCount = 0;
        if (typeof value !== "undefined" && value !== null) {
            try {
                var parsed = typeof value === "string" ? JSON.parse(value) : value;
                if (Array.isArray(parsed)) {
                    status = "array";
                    sectionCount = parsed.length;
                    for (var i = 0; i < parsed.length; i++) {
                        if (parsed[i] && Array.isArray(parsed[i].items)) {
                            itemCount += parsed[i].items.length;
                        }
                    }
                } else {
                    status = "unexpected_type";
                }
            } catch (parseError) {
                status = "malformed_json";
            }
        }
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx captions] status=" + status +
                " sections=" + sectionCount + " items=" + itemCount);
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx test] Caption diagnostics: processing error");
        }
    }
    $done(result);
})();
