/**
 * Integrated, non-invasive V3 -> V6 regression audit.
 * Does not execute historical V3 entitlement rewriting or change purchases.
 * node "Bản thử nghiệm/V7_Full_Regression/tests/full_regression.mjs"
 */
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../..');
const read = rel => fs.readFileSync(path.join(root, rel), 'utf8');
const inventory = JSON.parse(read('Bản thử nghiệm/V7_Full_Regression/v3_feature_inventory.json'));
const website = read('Website hiện tại/lib/private-assets.ts');
const encoded = website.slice(website.indexOf('=') + 1).trim().replace(/;\s*$/, '');
const assets = JSON.parse(encoded);
const source = assets['Locket_Unlocked.js'];
const v6 = read('Bản thử nghiệm/V6_Widget_Themes/scripts/Locket_V6_Creative.js');
const allKeys = inventory.categories.flatMap(g => g.keys).concat(inventory.directKeys);
const findings = [];
function test(name, fn) {
  try { fn(); findings.push({ name, status: 'PASS' }); }
  catch (e) { findings.push({ name, status: 'FAIL', detail: String(e.message || e) }); }
}
function makeEntries() {
  const entries = Object.fromEntries(allKeys.map(key => [key, 'original-value:' + key]));
  entries.overlay_items = JSON.stringify([{ section: 'Native', items: [{ overlay_id: 'native:caption', text: 'native' }] }]);
  entries.widget_frame_event = JSON.stringify({ uid: 'native_widget', url: 'https://example.test/native.png' });
  entries.feature_discovery_popup_config = JSON.stringify({ campaign: 'native_popup' });
  entries.camera_filter_config = JSON.stringify({ sheet_filters: [{ title: { en: 'Native' }, filter_ids: ['native-id'] }] });
  return entries;
}
function execute(payload, selectedFrame = '', popup = false, ua = 'Locket/1.0') {
  const script = v6
    .replaceAll('__V6_SELECTED_FRAME_JSON__', JSON.stringify(selectedFrame))
    .replaceAll('__V6_ENABLE_POPUP__', popup ? 'true' : 'false');
  const calls = [], logs = [];
  new Function('$request', '$response', '$done', 'console', script)(
    { headers: { 'User-Agent': ua } },
    { body: typeof payload === 'string' ? payload : JSON.stringify(payload) },
    answer => calls.push(answer),
    { log: message => logs.push(String(message)) },
  );
  assert.equal(calls.length, 1, 'exactly one $done()');
  return { answer: calls[0], logs };
}
const fixture = { entries: makeEntries(), nativeRoot: true };
const baseline = execute(fixture);
const result = JSON.parse(baseline.answer.body);
const originalOverlay = JSON.parse(fixture.entries.overlay_items);
const resultOverlay = JSON.parse(result.entries.overlay_items);
const allItems = resultOverlay.flatMap(group => group && Array.isArray(group.items) ? group.items : []);
const safeCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b);

test('01 baseline has eight config groups', () => assert.equal(inventory.categories.length, 8));
test('02 baseline has exactly 167 distinct property names', () => {
  assert.equal(allKeys.length, 167); assert.equal(new Set(allKeys).size, 167);
});
test('03 V3 snapshot exists and defines filter config', () => {
  assert.ok(source.includes('camera_filter_config:'));
  assert.ok(source.includes('overlay_items:'));
});
test('04 all baseline keys retained in V6 output', () => {
  assert.deepEqual(allKeys.filter(k => !Object.hasOwn(result.entries, k)), []);
});
test('05 every non-overlay baseline key value retained', () => {
  assert.deepEqual(allKeys.filter(k => k !== 'overlay_items' &&
    !safeCompare(fixture.entries[k], result.entries[k])), []);
});
test('06 root server data preserved', () => assert.equal(result.nativeRoot, true));
test('07 V6 adds 136 creative captions to one native item', () => assert.equal(allItems.length, 137));
test('08 no overlay IDs removed or duplicated', () => {
  assert.equal(new Set(allItems.map(item => item.overlay_id)).size, 137);
  assert.equal(allItems[0].overlay_id, originalOverlay[0].items[0].overlay_id);
});
test('09 server widget preserved when no theme selected', () =>
  assert.equal(result.entries.widget_frame_event, fixture.entries.widget_frame_event));
test('10 server popup preserved when not opted-in', () =>
  assert.equal(result.entries.feature_discovery_popup_config, fixture.entries.feature_discovery_popup_config));
test('11 existing camera/filter config preserved', () =>
  assert.equal(result.entries.camera_filter_config, fixture.entries.camera_filter_config));
test('12 explicitly selected widget image applies only to widget', () => {
  const link = 'https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png';
  const selected = JSON.parse(execute(fixture, link).answer.body);
  assert.equal(JSON.parse(selected.entries.widget_frame_event).url, link);
  assert.equal(selected.entries.camera_filter_config, fixture.entries.camera_filter_config);
});
test('13 optional popup does not replace a native popup', () => {
  const selected = JSON.parse(execute(fixture, '', true).answer.body);
  assert.equal(selected.entries.feature_discovery_popup_config, fixture.entries.feature_discovery_popup_config);
});
test('14 do not touch actual subscriber data', () => {
  const input = { ...fixture, subscriber: { entitlements: { owned: true } } };
  const outcome = JSON.parse(execute(input).answer.body);
  assert.deepEqual(outcome.subscriber, input.subscriber);
});
test('15 malformed inputs preserve original response', () => {
  assert.equal(execute('{not-json').answer.body, undefined);
  assert.equal(execute({ entries: [] }).answer.body, undefined);
});
test('16 other application UA ignored', () => {
  assert.equal(execute(fixture, '', false, 'OtherApp').answer.body, undefined);
});
test('17 fallback never assumes native camera functionality', () => {
  assert.ok(!/entries\.camera_filter_config\s*=(?!=)/.test(v6));
});
test('18 source and fixture contain no private tokens', () => {
  assert.ok(!JSON.stringify(findings).includes('sk-'));
});

const passed = findings.filter(x => x.status === 'PASS').length;
const summary = {
  kind: 'SOURCE_AND_MOCK_TESTS_ONLY',
  baselineKeys: allKeys.length,
  nonOverlayValuesPreserved: allKeys.filter(k => k !== 'overlay_items' &&
    safeCompare(fixture.entries[k], result.entries[k])).length,
  creativeCaptionItems: 136,
  simulatedTests: { passed, total: findings.length },
  deviceTests: { passed: 0, total: 0, status: 'NOT_RUN' },
  note: 'Preserving fields in a mocked response is not equivalent to retaining V3 overrides or proving real app features.',
  findings,
};
console.log(JSON.stringify(summary, null, 2));
if (passed !== findings.length) process.exitCode = 1;
