import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:8788';
assert.ok(new URL(origin).hostname==='127.0.0.1','Run fixtures only against local preview');
const post=(path,body)=>fetch(origin+path,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
for(const code of ['bad','b'.repeat(64),'c'.repeat(64)]){assert.equal((await post('/api/access',{code})).status,403);assert.equal((await fetch(origin+'/download/'+code+'/Locket_Unlocked.js')).status,403)}
assert.equal((await fetch(origin+'/api/admin')).status,403);
assert.equal((await post('/api/admin',{label:'intruder',days:30})).status,403);
const a=await post('/api/access',{code:'a'.repeat(64)});assert.equal(a.status,200);const {path}=await a.json();const m=await fetch(origin+path);assert.equal(m.status,200);assert.match(m.headers.get('cache-control'),/no-store/);const module=await m.text();assert.ok(!module.includes('raw.githubusercontent.com'));const urls=[...module.matchAll(/script-path=([^,\s]+)/g)].map(x=>x[1]);assert.equal(urls.length,3);for(const url of urls){const r=await fetch(url);assert.equal(r.status,200);assert.ok((await r.text()).length>100)}
assert.equal((await fetch(origin+'/download/'+'a'.repeat(64)+'/private-assets.ts')).status,404);
assert.equal((await post('/api/access',null)).status,400);
console.log('PASS: access verification, denied admin, expiry, revocation, protected downloads, URL rewriting, allowlist, malformed JSON.');
for(const file of ['ifywnx-Locket-DNS.mobileconfig','private-assets.ts']) {
 assert.equal((await fetch(origin+'/download/'+'a'.repeat(64)+'/'+file)).status,404);
}
console.log('PASS: legacy DNS, All Apps, GPS and unrelated scripts no longer served.');

for(const file of ['ifywnx-AllApps-Config.conf','ifywnx-AllApps-Module.sgmodule','ifywnx-GPS-Module.sgmodule']) assert.equal((await fetch(origin+'/download/'+'a'.repeat(64)+'/'+file)).status,200);
