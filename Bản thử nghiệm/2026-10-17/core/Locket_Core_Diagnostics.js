// Core diagnostics — isolated Remote Config experiment.
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
        // Read-only: no response rewriting, no account identifiers or tokens in logs.
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx core] Remote Config JSON and entries valid");
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx test] Core diagnostics: processing error");
        }
    }
    $done(result);
})();
