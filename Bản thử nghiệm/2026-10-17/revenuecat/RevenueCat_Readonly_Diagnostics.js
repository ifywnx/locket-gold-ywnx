// RevenueCat shape diagnostic only — no transaction, subscription or entitlement changes.
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
        for (var key in $request.headers) {
            if (Object.prototype.hasOwnProperty.call($request.headers, key) &&
                key.toLowerCase() === "user-agent" &&
                typeof $request.headers[key] === "string") {
                ua = $request.headers[key];
                break;
            }
        }
        if (!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)) {
            $done(result);
            return;
        }
        var response = JSON.parse($response.body);
        var subscriber = response && typeof response === "object" ? response.subscriber : null;
        var hasSubscriber = !!(subscriber && typeof subscriber === "object" && !Array.isArray(subscriber));
        var hasSubscriptions = hasSubscriber && !!(subscriber.subscriptions &&
            typeof subscriber.subscriptions === "object" && !Array.isArray(subscriber.subscriptions));
        var hasEntitlements = hasSubscriber && !!(subscriber.entitlements &&
            typeof subscriber.entitlements === "object" && !Array.isArray(subscriber.entitlements));
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx RC diag] subscriber=" + hasSubscriber +
                " subscriptions_object=" + hasSubscriptions +
                " entitlements_object=" + hasEntitlements);
        }
    } catch (error) {
        if (typeof console !== "undefined" && typeof console.log === "function") {
            console.log("[ifywnx RC diag] invalid response or runtime");
        }
    }
    $done(result);
})();
