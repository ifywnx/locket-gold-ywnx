const fs = require('node:fs');
const assert = require('node:assert/strict');
const cp = require('node:child_process');
const folders = ['Bộ cài gốc','Mã nguồn đã clone','Website hiện tại','Các ứng dụng khác'];
const allowed = new Set([...folders,'README.md','.github','.gitignore']);
for (const folder of folders) assert.ok(fs.statSync(folder).isDirectory());
for (const file of cp.execFileSync('git',['ls-files','-z'],{encoding:'utf8'}).split('\0').filter(Boolean)) {
 assert.ok(allowed.has(file.split('/')[0]),'Unexpected root entry: '+file);
 assert.ok(!/(^|\/)(?:\.env(?:\.|$)|\.dev.vars|node_modules|\.wrangler)(?:\/|$)/.test(file),'Local-only file: '+file);
}
const source=fs.readFileSync('Website hiện tại/lib/private-assets.ts','utf8');
const assets=JSON.parse(source.slice(source.indexOf('=')+1).trim().replace(/;$/, ''));
const normalize=s=>s.split(/\r?\n/).map(line=>line.trimEnd()).join('\n').trimEnd();
for(const [name,content] of Object.entries(assets)) {
 assert.equal(normalize(fs.readFileSync('Bộ cài gốc/'+name,'utf8')),normalize(content),name+': snapshot mismatch');
 for(const match of content.matchAll(/https:\/\/raw\.githubusercontent\.com\/ifywnx\/locket-gold-ywnx\/(?:refs\/heads\/)?main\/(?:js|modules|downloads)\/([^\s"'<>),`]+)/g)) {
  assert.ok(Object.hasOwn(assets,match[1]),name+': missing authenticated asset '+match[1]);
 }
}
const route=fs.readFileSync('Website hiện tại/app/download/[token]/[file]/route.ts','utf8');
assert.ok(route.includes('assets[file]') && route.includes('replace('));
assert.ok(fs.existsSync('Bộ cài gốc/DNS dự phòng/DNS cũ.mobileconfig'));
console.log('PASS: four source folders, matching install exports, authenticated asset targets, DNS backup.');

const page=fs.readFileSync('Website hiện tại/public/welcome/index.html','utf8');
const installer=fs.readFileSync('Website hiện tại/public/welcome/app.js','utf8');
assert.ok(page.includes('Không bật cả hai bộ quy tắc Locket cùng lúc'));
assert.ok(installer.includes('Cài Module thay thế'));
assert.ok(!page.includes('Module → Config → DNS'));
for (const script of ['Bộ cài gốc/Locket_ifywnx.js','Bộ cài gốc/Locket_Unlocked.js','Bộ cài gốc/deleteHeader.js']) {
  cp.execFileSync(process.execPath,['--check',script]);
}
console.log('PASS: single setup path and script syntax.');
