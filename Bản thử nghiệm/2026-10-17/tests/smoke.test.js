"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
let passed = 0;
let total = 0;

function run(relativeFile, body, userAgent = "Locket/1.0") {
  const code = fs.readFileSync(path.join(root, relativeFile), "utf8");
  let returned;
  let calls = 0;
  const context = {
    $request: { headers: { "User-Agent": userAgent } },
    $response: { body: typeof body === "string" ? body : JSON.stringify(body) },
    $done: value => { returned = value; calls++; },
    console: { log: () => {} }
  };
  vm.runInNewContext(code, context, { filename: relativeFile, timeout: 2000 });
  assert.equal(calls, 1, relativeFile + " must call $done exactly once");
  return returned;
}

function check(name, fn) {
  total++;
  try {
    fn();
    passed++;
    console.log("PASS", name);
  } catch (error) {
    console.error("FAIL", name, error.message);
    process.exitCode = 1;
  }
}

const original = () => ({
  entries: {
    untouched: "server_value",
    overlay_items: JSON.stringify([{ section: "Unknown server section", metadata: 13,
      items: [{ overlay_id: "caption:remote_original", source: "remote",
        caption: { type: "static_content", text: "Server caption" } }] }])
  },
  server_extra: { keep: true }
});

const diagnosticScripts = [
  "core/Locket_Core_Diagnostics.js",
  "camera/Camera_Filter_Diagnostics.js",
  "diagnostics/Locket_Overlay_Diagnostics.js"
];

for (const f of diagnosticScripts) {
  check(f + " never rewrites payload", () => {
    assert.deepEqual(run(f, original()), {});
  });
}

check("widget: add when absent", () => {
  const out = run("widget/Locket_Widget_Test.js", original());
  const root = JSON.parse(out.body);
  assert.equal(root.entries.untouched, "server_value");
  assert.deepEqual(root.server_extra, { keep: true });
  assert.match(JSON.parse(root.entries.widget_frame_event).url, /^https:\/\//);
});

check("widget: retain existing server config", () => {
  const data = original();
  data.entries.widget_frame_event = JSON.stringify({ url: "https://example.org/server.png", server: 1 });
  assert.deepEqual(run("widget/Locket_Widget_Test.js", data), {});
});

check("popup: add when absent", () => {
  const out = run("popup/Locket_Popup_Test.js", original());
  const root = JSON.parse(out.body);
  assert.equal(root.entries.untouched, "server_value");
  assert.equal(JSON.parse(root.entries.feature_discovery_popup_config).campaign,
    "ifywnx_popup_test_20261017");
});

check("popup: retain existing server config", () => {
  const data = original();
  data.entries.feature_discovery_popup_config = JSON.stringify({ campaign: "server" });
  assert.deepEqual(run("popup/Locket_Popup_Test.js", data), {});
});

check("caption: append one without changing existing section", () => {
  const data = original();
  const out = run("captions/Locket_Captions_Test.js", data);
  const modified = JSON.parse(out.body);
  const sections = JSON.parse(modified.entries.overlay_items);
  assert.equal(sections.length, 2);
  assert.equal(sections[0].metadata, 13);
  assert.equal(sections[0].items[0].overlay_id, "caption:remote_original");
  assert.equal(sections[1].items[0].overlay_id, "caption:ifywnx_minimal_test_20261017");
  assert.deepEqual(modified.server_extra, { keep: true });
});

check("caption: duplicate id is not appended", () => {
  const data = original();
  const sections = JSON.parse(data.entries.overlay_items);
  sections[0].items.push({ overlay_id: "caption:ifywnx_minimal_test_20261017" });
  data.entries.overlay_items = JSON.stringify(sections);
  assert.deepEqual(run("captions/Locket_Captions_Test.js", data), {});
});

check("caption: malformed overlay is untouched", () => {
  const data = original();
  data.entries.overlay_items = "malformed";
  assert.deepEqual(run("captions/Locket_Captions_Test.js", data), {});
});

check("caption: wrong overlay type is untouched", () => {
  const data = original();
  data.entries.overlay_items = JSON.stringify({ sections: [] });
  assert.deepEqual(run("captions/Locket_Captions_Test.js", data), {});
});

check("non Locket User-Agent is ignored", () => {
  assert.deepEqual(run("widget/Locket_Widget_Test.js", original(), "OtherApp/1.0"), {});
  assert.deepEqual(run("captions/Locket_Captions_Test.js", original(), "OtherApp/1.0"), {});
});

check("malformed response JSON is ignored", () => {
  assert.deepEqual(run("widget/Locket_Widget_Test.js", "{not-json"), {});
  assert.deepEqual(run("popup/Locket_Popup_Test.js", "{not-json"), {});
});

check("missing entries are ignored", () => {
  assert.deepEqual(run("widget/Locket_Widget_Test.js", { other: 1 }), {});
  assert.deepEqual(run("popup/Locket_Popup_Test.js", { other: 1 }), {});
});

console.log("Result:", passed + "/" + total);
if (passed !== total) process.exitCode = 1;
