// Isolated caption experiment. Preserves all original Remote Config fields.
// This script does not modify paid entitlements, feature gates, camera or filters.
(function () {
    var result = {};
    try {
        result = rewrite();
    } catch (error) {
        if (typeof console !== "undefined" && console.log) {
            console.log("[ifywnx_captions_test] rewrite error");
        }
    }
    $done(result);

    function rewrite() {
        if (typeof $request === "undefined" || !$request || !$request.headers ||
            typeof $response === "undefined" || !$response ||
            typeof $response.body !== "string") {
            return {};
        }

        var userAgent = "";
        var headers = $request.headers;
        for (var key in headers) {
            if (Object.prototype.hasOwnProperty.call(headers, key) &&
                key.toLowerCase() === "user-agent" && typeof headers[key] === "string") {
                userAgent = headers[key];
                break;
            }
        }
        if (!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(userAgent)) {
            return {};
        }

        var response;
        try {
            response = JSON.parse($response.body);
        } catch (error) {
            return {};
        }
        if (!response || typeof response !== "object" || Array.isArray(response) ||
            !response.entries || typeof response.entries !== "object" ||
            Array.isArray(response.entries) ||
            typeof response.entries.overlay_items !== "string") {
            return {};
        }

        var sections;
        try {
            sections = JSON.parse(response.entries.overlay_items);
        } catch (error) {
            return {};
        }
        if (!Array.isArray(sections)) {
            return {};
        }

        var testId = "caption:ifywnx_minimal_test_20261017";
        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            if (section && typeof section === "object" && Array.isArray(section.items)) {
                for (var j = 0; j < section.items.length; j++) {
                    var item = section.items[j];
                    if (item && item.overlay_id === testId) {
                        return {};
                    }
                }
            }
        }

        var testSection = {
            section: "🧪 ifywnx thử nghiệm",
            items: [{
                overlay_id: testId,
                source: "remote",
                caption: {
                    type: "static_content",
                    text: "ifywnx Test ✨",
                    max_lines: 1,
                    background: { colors: ["#DDF4FF", "#BDEBD7"] },
                    text_color: "#183153"
                }
            }]
        };

        // Preserve the original array, including any unfamiliar server sections.
        sections.push(testSection);
        response.entries.overlay_items = JSON.stringify(sections);
        return { body: JSON.stringify(response) };
    }
})();