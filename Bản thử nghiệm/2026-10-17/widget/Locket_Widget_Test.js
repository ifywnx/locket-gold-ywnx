// Shin-chan widget — isolated Remote Config experiment.
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
        // Do not overwrite any existing nonempty server widget value.
        var currentWidget = response.entries.widget_frame_event;
        if (typeof currentWidget === "undefined" || currentWidget === null || currentWidget === "") {
            response.entries.widget_frame_event = JSON.stringify({
                uid: "ifywnx_shinchan_widget_test_20261017",
                url: "https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png",
                use_local_time_zone: true,
                placement: "below",
                start_at: "2020-01-01T00:00:00",
                end_at: "2099-12-31T23:59:59"
            });
            result = { body: JSON.stringify(response) };
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx test] Shin-chan widget: processing error");
        }
    }
    $done(result);
})();
