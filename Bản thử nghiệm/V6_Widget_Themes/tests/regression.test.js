"use strict";
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const template = fs.readFileSync(path.join(__dirname, '../scripts/Locket_V6_Creative.js'), 'utf8');
let pass = 0;
function test(name, callback) {
  try { callback(); pass++; console.log('PASS', name); }
  catch (err) { console.error('FAIL', name, err.message); process.exitCode = 1; }
}
function compile(frame = '', popup = false) {
  const code = template
    .replaceAll('__V6_SELECTED_FRAME_JSON__', JSON.stringify(frame))
    .replaceAll('__V6_ENABLE_POPUP__', popup ? 'true' : 'false');
  return new Function('$request', '$response', '$done', 'console', code);
}
function run(body, frame = '', popup = false, ua = 'Locket/1.0') {
  let calls = [];
  const logs = [];
  compile(frame, popup)(
    { headers: { 'User-Agent': ua } },
    { body: typeof body === 'string' ? body : JSON.stringify(body) },
    value => calls.push(value),
    { log: value => logs.push(String(value)) },
  );
  assert.equal(calls.length, 1, 'must call $done once');
  return { result: calls[0], logs };
}
function fixture(entries = {}) {
  return { entries: {
    overlay_items: '[]',
    widget_frame_event: JSON.stringify({ url: 'https://i.ibb.co/existing/photo.png', uid: 'from_server' }),
    feature_discovery_popup_config: 'server-popup',
    camera_filter_config: JSON.stringify({ sheet_filters: [{filter_ids:['test']}] }),
    ...entries
  }, special: { server: true }};
}
const shin = 'https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png';
const own = 'https://i.ibb.co/ABCDE1234/my-photo.jpg';
test('1 default adds 136 captions', () => {
  const out = JSON.parse(run(fixture()).result.body);
  const groups = JSON.parse(out.entries.overlay_items);
  assert.equal(groups.length, 19);
  assert.equal(groups.flatMap(g=>g.items).length, 136);
});
test('2 all caption IDs distinct', () => {
  const obj = JSON.parse(run(fixture()).result.body);
  const ids = JSON.parse(obj.entries.overlay_items).flatMap(g => g.items.map(i => i.overlay_id));
  assert.equal(new Set(ids).size, 136);
});
test('3 default preserves existing widget', () => {
  const initial = fixture(); const out = JSON.parse(run(initial).result.body);
  assert.equal(out.entries.widget_frame_event, initial.entries.widget_frame_event);
});
test('4 explicit Shin-chan changes chosen widget', () => {
  const out = JSON.parse(run(fixture(), shin).result.body);
  assert.equal(JSON.parse(out.entries.widget_frame_event).url, shin);
});
test('5 custom ImgBB URL can be applied', () => {
  const out = JSON.parse(run(fixture(), own).result.body);
  assert.equal(JSON.parse(out.entries.widget_frame_event).url, own);
});
test('6 external domain fails widget guard', () => {
  const before=fixture(); const out=JSON.parse(run(before,'https://untrusted.example/a.png').result.body);
  assert.equal(out.entries.widget_frame_event,before.entries.widget_frame_event);
});
test('7 query-bearing ImgBB URL fails widget guard', () => {
  const before=fixture(); const out=JSON.parse(run(before, shin+'?token=1').result.body);
  assert.equal(out.entries.widget_frame_event,before.entries.widget_frame_event);
});
test('8 existing popup preserved with toggle on', () => {
  const out=JSON.parse(run(fixture(),'',true).result.body);
  assert.equal(out.entries.feature_discovery_popup_config,'server-popup');
});
test('9 optional popup when absent', () => {
  const f=fixture(); delete f.entries.feature_discovery_popup_config;
  const out=JSON.parse(run(f,'',true).result.body);
  assert.equal(JSON.parse(out.entries.feature_discovery_popup_config).campaign,'ifywnx_v6_welcome_202610');
});
test('10 popup remains absent by default', () => {
  const f=fixture(); delete f.entries.feature_discovery_popup_config;
  const out=JSON.parse(run(f).result.body);
  assert.equal(out.entries.feature_discovery_popup_config,undefined);
});
test('11 original camera data retained', () => {
  const f=fixture(); const out=JSON.parse(run(f,shin,true).result.body);
  assert.equal(out.entries.camera_filter_config,f.entries.camera_filter_config);
});
test('12 unknown response keys retained', () => {
  const out=JSON.parse(run(fixture()).result.body);
  assert.deepEqual(out.special,{server:true});
});
test('13 caption input from server retained', () => {
  const f=fixture({overlay_items:JSON.stringify([{section:'🎨 General',meta:42,items:[{overlay_id:'server:custom',value:'server'}]}])});
  const out=JSON.parse(run(f).result.body);
  const arr=JSON.parse(out.entries.overlay_items);
  assert.equal(arr[0].meta,42);assert.equal(arr[0].items[0].value,'server');
});
test('14 unknown malformed sections retained', () => {
  const f=fixture({overlay_items:JSON.stringify([null,{section:'broken',items:'??'}])});
  const out=JSON.parse(run(f).result.body),groups=JSON.parse(out.entries.overlay_items);
  assert.equal(groups[0],null);assert.equal(groups[1].items,'??');
});
test('15 repeated run idempotent', () => {
  const after=JSON.parse(run(fixture(),shin,true).result.body);
  assert.equal(run(after,shin,true).result.body,undefined);
});
test('16 malformed JSON untouched', () => {
  assert.equal(run('{oops',shin,true).result.body,undefined);
});
test('17 malformed overlays untouched', () => {
  assert.equal(run(fixture({overlay_items:'{broken'}),shin,true).result.body,undefined);
});
test('18 other app untouched', () => {
  assert.equal(run(fixture(),shin,true,'OtherApp/1.0').result.body,undefined);
});
test('19 lowercase User-Agent supported', () => {
  assert.ok(run(fixture(),shin,false,'locket/1.0').result.body);
});
test('20 missing entries safe', () => {
  assert.equal(run({other:1},shin,true).result.body,undefined);
});
test('21 no subscription fields invented', () => {
  const f=fixture();f.subscriber={entitlements:{real:true}};
  const out=JSON.parse(run(f,shin,true).result.body);
  assert.deepEqual(out.subscriber,f.subscriber);
});
test('22 no personal data in diagnostic logs', () => {
  const v=run(fixture(),shin,true);
  assert.ok(v.logs.every(x=>!/(token|receipt|email|customer_id)/i.test(x)));
});
test('23 oversized rewritten response skipped', () => {
  const f=fixture({large:'z'.repeat(120000)});
  assert.equal(run(f,shin,true).result.body,undefined);
});
test('24 invalid array entries rejected', () => {
  assert.equal(run({entries:[]},shin,true).result.body,undefined);
});
console.log('V6 regression:',pass+'/24 passed');
if (pass!==24) process.exitCode=1;
