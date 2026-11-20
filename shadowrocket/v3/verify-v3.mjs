// Verify public Shadowrocket V3 against the same standalone-config conversion
// used by the AN Store website. No network access, secrets or user tickets.
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const folder = dirname(fileURLToPath(import.meta.url));
const base = 'https://raw.githubusercontent.com/ifywnx/locket-gold-ywnx/main/shadowrocket/v3/';
const read = name => readFileSync(join(folder, name), 'utf8');

function standaloneConfig(moduleText) {
  const cleaned = moduleText
    .replace(/^#![^\r\n]*(?:\r?\n|$)/gm, '')
    .replace(/^(hostname\s*=\s*)%APPEND%\s*/gm, '$1')
    .trim();
  const sections = cleaned.split(/(?=^\[[^\]\r\n]+\]\s*$)/m);
  let hasGeneral = false, hasRule = false;
  const normalized = sections.map(section => {
    if (/^\[General\]\s*$/m.test(section.split(/\r?\n/, 1)[0])) {
      hasGeneral = true;
      return /^\s*dns-server\s*=/mi.test(section)
        ? section
        : section.replace(/^\[General\]\s*\r?\n/m, '[General]\ndns-server = system\n');
    }
    if (/^\[Rule\]\s*$/m.test(section.split(/\r?\n/, 1)[0])) {
      hasRule = true;
      return /^\s*FINAL\s*,/mi.test(section)
        ? section
        : section.trimEnd() + '\nFINAL,DIRECT\n';
    }
    return section;
  });
  if (!hasGeneral) normalized.unshift('[General]\ndns-server = system\n\n');
  if (!hasRule) normalized.push('\n[Rule]\nFINAL,DIRECT\n');
  return '# An Store - personal Shadowrocket configuration\n' +
    '# Requires Shadowrocket, available from its official App Store listing.\n\n' +
    normalized.join('').trim() + '\n';
}

const moduleText = read('An-Locket.sgmodule');
const configText = read('An-Locket.conf');
assert.equal(moduleText.split('\n')[0], '#!url=' + base + 'An-Locket.sgmodule');
assert.equal(standaloneConfig(moduleText), configText, 'CONF differs from web-style conversion');

const scripts = ['deleteHeader.js', 'Locket_An.js', 'Locket_Unlocked.js', 'statusCheck.js'];
for (const name of scripts) {
  assert(moduleText.includes('script-path=' + base + name), 'Missing module dependency: ' + name);
  assert(configText.includes('script-path=' + base + name), 'Missing config dependency: ' + name);
  const content = read(name);
  assert(content.trim().length > 100, 'Empty dependency: ' + name);
  assert(!content.includes('__ASSET_BASE__'), 'Unresolved URL placeholder in ' + name);
}
assert.equal((moduleText.match(/script-path=/g) || []).length, 5, 'Unexpected module hooks');
assert.equal((configText.match(/script-path=/g) || []).length, 5, 'Unexpected config hooks');
assert(!moduleText.includes('__ASSET_BASE__') && !configText.includes('__ASSET_BASE__'));
assert(configText.includes('dns-server = system') && configText.includes('FINAL,DIRECT'));
assert(configText.includes('[MITM]') && !configText.includes('hostname = %APPEND%'));
assert(moduleText.includes('hostname = %APPEND%'));

const remote = read('Locket_Unlocked.js');
// Every image URL served from our own public V3 repo must exist in the same
// repository. This caught the 404 popup asset even though all JS links worked.
const ownRawPrefix = base;
const publicAssets = [...remote.matchAll(/https:\/\/raw\.githubusercontent\.com\/ifywnx\/locket-gold-ywnx\/main\/shadowrocket\/v3\/([A-Za-z0-9._/-]+\.(?:png|jpg|jpeg|webp))/gi)];
for (const item of publicAssets) {
  const relative = item[1];
  assert(!relative.includes('..'), 'Unsafe image path');
  assert(existsSync(join(folder, relative)), 'Public V3 asset missing: '+relative);
}
assert(publicAssets.length>0, 'Expected at least one branded asset link');
const welcomePng = readFileSync(join(folder, 'assets', 'locket-gold-an.png'));
assert(welcomePng.length>1000 && welcomePng.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), 'Popup image must be a real PNG');
assert(remote.includes(ownRawPrefix+'assets/locket-gold-an.png'), 'Popup should use the public V3 image');

const expected = [
  'camera_roll_video_upload_enabled: "true"',
  'video_quality_mbps: "0.9"',
  'microphone_enabled: "true"',
  'video_upload_max_duration: "30.0"',
];
for (const setting of expected) assert(remote.includes(setting), 'Missing V3 media setting: ' + setting);
assert(!moduleText.includes('An-PhotoBooth-Bridge.js'), 'Trial bridge must not be in stable V3');
console.log('PASS: V3 files, script URLs, popup PNG, web-style .conf transform and media settings.');
console.log('NOTE: This does not test live video uploads, iPhone permissions or account personalization.');
