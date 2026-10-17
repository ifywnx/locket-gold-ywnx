import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'locket-v8-test-'));
const write=(name,content)=>{const p=path.join(tmp,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,content)};
try{
 const source='camera_filter_config: JSON.stringify({sheet_filters:[{filter_ids:["a","b"]}]}), microphone_enabled: "true", camera_microphone_enabled: "true", video_sound_enabled: "true"';
 write('Website hiện tại/lib/private-assets.ts','export const assets: Record<string,string> = '+JSON.stringify({'Locket_Unlocked.js':source})+';');
 write('Bộ cài gốc/Locket_Unlocked.js','feature_gates: {}');
 write('Bộ cài gốc/Locket_ifywnx.sgmodule','revenuecat = script-path=https://raw.githubusercontent.com/x/x/file.js\nlocket_rc = 1\ndeleteHeader = 1');
 write('Bộ cài gốc/ifywnx-Locket-Config.conf','revenuecat = script-path=https://raw.githubusercontent.com/x/x/file.js\nlocket_rc = 1\ndeleteHeader = 1');
 write('Bộ cài gốc/ifywnx-Locket-DNS.mobileconfig','<key>ServerURL</key><string>https://dns.example.org/a</string>');
 write('Bộ cài gốc/DNS dự phòng/DNS cũ.mobileconfig','<key>ServerURL</key><string>https://old.example.org/a</string>');
 const run=output=>spawnSync(process.execPath,[path.join(here,'audit.mjs'),tmp,path.join(tmp,output)],{encoding:'utf8'});
 const p=run('out');assert.equal(p.status,0,p.stderr);
 const result=JSON.parse(fs.readFileSync(path.join(tmp,'out/audit.json'),'utf8'));
 assert.equal(result.snapshotParsed,true);
 assert.equal(result.filterIdsDeclared,2);
 for(const id of ['DRIFT','FILTER_IDS','MICROPHONE','DUPLICATE_RULES','PRIVATE_RAW_URLS','DNS_DRIFT','AI_LOOK','FRIEND_BADGE'])
   assert.ok(result.findings.some(f=>f.id===id),id);
 fs.unlinkSync(path.join(tmp,'Website hiện tại/lib/private-assets.ts'));
 const q=run('out2');assert.equal(q.status,0,q.stderr);
 const result2=JSON.parse(fs.readFileSync(path.join(tmp,'out2/audit.json'),'utf8'));
 assert.equal(result2.snapshotParsed,false);
 assert.ok(result2.findings.some(f=>f.id==='SITE_SNAPSHOT'));
 console.log('PASS: 12 kiểm tra nguồn/fixture; không gọi API, không sửa quyền truy cập.');
}finally{fs.rmSync(tmp,{recursive:true,force:true})}
