// Request header diagnostic only — DOES NOT delete or alter any headers.
(function () {
    var result = {};
    try {
        if (typeof $request === "undefined" || !$request || !$request.headers) {
            $done(result);
            return;
        }
        var headers = $request.headers;
        var ua = "";
        var hasEtag = false;
        for (var key in headers) {
            if (!Object.prototype.hasOwnProperty.call(headers, key)) continue;
            if (key.toLowerCase() === "user-agent" && typeof headers[key] === "string") {
                ua = headers[key];
            }
            if (key.toLowerCase() === "x-revenuecat-etag") {
                hasEtag = true;
            }
        }
        if (/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua) &&
            typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx header diag] revenuecat_etag_present=" + hasEtag);
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx header diag] invalid request");
        }
    }
    $done(result);
})();
