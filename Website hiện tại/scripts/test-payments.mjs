import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import path from 'node:path';
import ts from 'typescript';
const sql=new DatabaseSync(':memory:');
for(const f of ['0000_colorful_trish_tilby.sql','0001_left_master_chief.sql','0002_payment_account.sql'])sql.exec(await readFile('drizzle/'+f,'utf8'));
function statement(query,args=[]){return {bind(...v){return statement(query,v)},async raw(){const s=sql.prepare(query);s.setReturnArrays(true);return s.all(...args)},async all(){return {results:sql.prepare(query).all(...args)}},async run(){return {meta:{changes:Number(sql.prepare(query).run(...args).changes)}}}}}
const DB={prepare:statement,async batch(list){sql.exec('BEGIN');try{const r=[];for(const q of list)r.push({results:await q.raw()});sql.exec('COMMIT');return r}catch(e){sql.exec('ROLLBACK');throw e}}};
const env={DB,PAYOS_CLIENT_ID:'test',PAYOS_API_KEY:'test',PAYOS_CHECKSUM_KEY:'test-secret'};
let paid=false;
const context=vm.createContext({crypto,TextEncoder,TextDecoder,Uint8Array,Uint32Array,Request,Response,URL,AbortSignal,btoa,atob,console,fetch:async()=>{const data={id:'link-test',orderCode:42,amount:39000,amountPaid:paid?39000:0,status:paid?'PAID':'PENDING'};return Response.json({code:'00',data,signature:await c.sign(data,env.PAYOS_CHECKSUM_KEY)})}}),cache=new Map();
async function load(f){f=path.resolve(f);if(cache.has(f))return cache.get(f);const m=new vm.SourceTextModule(ts.transpileModule(await readFile(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText,{context,identifier:f});cache.set(f,m);await m.link(async(s,parent)=>{let v;if(s==='cloudflare:workers')v={env};else if(s.endsWith('chatgpt-auth'))v={getChatGPTUser:async()=>null};else if(!s.startsWith('.'))v=await import(s);if(v)return new vm.SyntheticModule(Object.keys(v),function(){for(const k of Object.keys(v))this.setExport(k,v[k])},{context});let file=path.resolve(path.dirname(parent.identifier),s);if(file.endsWith('/db'))file+='/index';return load(file+'.ts')});return m}
async function ns(f){const m=await load(f);if(m.status==='linked')await m.evaluate();return m.namespace}
const c=await ns('lib/payment-crypto.ts'),a=await ns('lib/access.ts'),activate=await ns('app/api/access/route.ts'),h=await ns('app/api/payos/webhook/route.ts'),dl=await ns('app/download/[token]/[file]/route.ts');
const data={orderCode:42,amount:39000,currency:'VND',accountNumber:'0366663940',paymentLinkId:'link-test',code:'00',reference:'test'};
const sig=await c.sign(data,env.PAYOS_CHECKSUM_KEY);assert(await c.verify(data,sig,env.PAYOS_CHECKSUM_KEY));assert(!await c.verify({...data,amount:1},sig,env.PAYOS_CHECKSUM_KEY));assert.equal(await c.unseal(await c.seal('abc',env.PAYOS_CHECKSUM_KEY),env.PAYOS_CHECKSUM_KEY),'abc');
const code='a'.repeat(64),one='b'.repeat(64),two='c'.repeat(64);
sql.prepare('INSERT INTO orders(id,owner_hash,amount,status,link_id,code_cipher,code_hash,created) VALUES (?,?,?,?,?,?,?,?)').run(42,'owner',39000,'PENDING','link-test',await c.seal(code,env.PAYOS_CHECKSUM_KEY),await a.digest(code),Date.now());
const hook=async(d=data,s)=>h.POST(new Request('https://site.test/api/payos/webhook',{method:'POST',body:JSON.stringify({code:'00',success:true,data:d,signature:s??await c.sign(d,env.PAYOS_CHECKSUM_KEY)})}));
assert.equal((await hook(data,'0'.repeat(64))).status,401);assert.equal((await hook({...data,amount:1})).status,400);assert.equal((await hook({...data,accountNumber:'wrong'})).status,400);assert.equal((await hook()).status,409);assert.equal(sql.prepare('SELECT count(*) n FROM access_codes').get().n,0);
paid=true;assert.equal((await hook()).status,200);assert.equal((await hook()).status,200);assert.equal(sql.prepare('SELECT count(*) n FROM access_codes').get().n,1);assert.equal(await a.valid(code),false);
const redeem=(session,origin='https://site.test')=>activate.POST(new Request('https://site.test/api/access',{method:'POST',headers:{Origin:origin},body:JSON.stringify({code,session})}));assert.equal((await redeem(one,'https://evil.test')).status,403);
const race=await Promise.all([redeem(one),redeem(two)]);assert.deepEqual(race.map(r=>r.status).sort(),[200,409]);const winner=race[0].status===200?one:two;assert.equal((await redeem(winner)).status,200);assert.equal(await a.valid(winner),true);
for(const file of ['ifywnx-Locket-Captions.sgmodule','ifywnx-AllApps-Config.conf','ifywnx-GPS-Module.sgmodule','ifywnx-Locket-DNS.mobileconfig','Locket_Unlocked.js']){const r=await dl.GET(new Request('https://site.test/download/'+winner+'/'+file),{params:Promise.resolve({token:winner,file})});assert.equal(r.status,200);if(file.endsWith('.sgmodule'))assert(!(await r.text()).includes('raw.githubusercontent.com/ifywnx'));}
sql.prepare('UPDATE access_codes SET revoked=1').run();assert.equal(await a.valid(winner),false);
console.log('PASS signature tamper, encryption, wrong amount/account, unpaid rejection, duplicate webhook, single activation race, retry, legacy downloads, revocation.');
