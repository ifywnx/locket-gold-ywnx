const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
function run(file, body, ua = 'Locket') {
  let calls = 0, result;
  vm.runInNewContext(fs.readFileSync(file, 'utf8'), {
    $request: { headers: ua ? { 'User-Agent': ua } : {} },
    $response: { body },
    $done(value) { calls++; result = value; }
  }, { timeout: 1000 });
  assert.equal(calls, 1, file + ': must finish exactly once');
  return result;
}
for (const file of ['js/Locket_ifywnx.js', 'js/Locket_Unlocked.js']) {
  for (const body of ['', 'not JSON', 'null']) assert.equal(run(file, body).body, undefined);
  for (const ua of ['', 'AnotherApp']) assert.equal(run(file, '{}', ua).body, undefined);
}
assert.equal(run('js/Locket_ifywnx.js', '{}').body, undefined);
assert.equal(run('js/Locket_Unlocked.js', '{"entries":[]}').body, undefined);
const body = JSON.stringify({ subscriber: { subscriptions: {}, entitlements: {} } });
assert.ok(JSON.parse(run('js/Locket_ifywnx.js', body).body).subscriber.entitlements.Gold);
const config = JSON.parse(run('js/Locket_Unlocked.js', '{"entries":{"existing":"keep"}}').body);
assert.equal(config.entries.existing, 'keep');
const groups = JSON.parse(config.entries.overlay_items);
const items = groups.flatMap(g => g.items);
assert.equal(new Set(items.map(i => i.overlay_id)).size, items.length, 'Duplicate caption IDs');
let urls = 0;
for (const file of cp.execFileSync('git', ['ls-files', '-z'], {encoding:'utf8'}).split('\0').filter(Boolean)) {
  if (file.startsWith('installer/')) continue;
  if (!fs.existsSync(file) || !/\.(js|html|md|conf|sgmodule|yaml|mobileconfig)$/.test(file)) continue;
  const text = fs.readFileSync(file, 'utf8').replace(/%([0-9a-f]{2})/gi, (_, h) => String.fromCharCode(parseInt(h,16)));
  assert.ok(!text.includes('ifywnx/Module_IOS'), file + ': old repository URL');
  for (const m of text.matchAll(/https:\/\/raw\.githubusercontent\.com\/ifywnx\/locket-gold-ywnx\/(?:refs\/heads\/)?main\/([^\s"'<>),`]+)/g)) {
    assert.ok(fs.existsSync(m[1]), file + ': missing target ' + m[1]); urls++;
  }
}
console.log(`PASS: runtime fallback, single completion, unrelated app passthrough, ${items.length} unique captions, ${urls} URL targets.`);

const assetsText = fs.readFileSync('installer/lib/private-assets.ts','utf8');
const assets = JSON.parse(assetsText.slice(assetsText.indexOf('=')+1).trim().replace(/;$/, ''));
assert.deepEqual(Object.keys(assets).sort(), ['Locket_ifywnx.js','Locket_Unlocked.js','deleteHeader.js','ifywnx-Locket-Captions.sgmodule','Locket_ifywnx.sgmodule'].sort());
for (const [name, content] of Object.entries(assets)) {
 assert.ok(!/ublockdns|sub-store|i\.ibb\.co|instagram\.com|tiktok\.com/.test(content), name+': external dependency');
 if(name.endsWith('.js')) {
  assert.equal(content,fs.readFileSync('js/'+name,'utf8'));
  assert.ok(!/\$httpClient|\$task|fetch\(|XMLHttpRequest/.test(content), name+': network call');
 }
}
assert.equal(run('js/deleteHeader.js','{}','AnotherApp').headers,undefined);
assert.ok(run('js/deleteHeader.js','{}','Locket').headers);
console.log('PASS: restricted served assets, source parity, no outbound HTTP APIs in Locket scripts, unrelated headers untouched.');
