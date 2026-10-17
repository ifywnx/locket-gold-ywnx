"use strict";
const fs = require("node:fs");
const path = require("node:path");
const script = fs.readFileSync(path.resolve(__dirname,"../scripts/Locket_V5_Creative.js"),"utf8");
function run(input,ua="Locket/1.0"){const calls=[],logs=[];const body=typeof input==="string"?input:JSON.stringify(input);const f=new Function("$request","$response","$done","console",script);f({headers:{"User-Agent":ua}},{body},r=>calls.push(r),{log:m=>logs.push(m)});if(calls.length!==1)throw Error("called $done="+calls.length);return {result:calls[0],logs};}
function make(extra={}){return {entries:{overlay_items:"[]",server_special:"yes",...extra},other:{server:true}}}
function inspect(result){return JSON.parse(result.body)}
const tests=[];
function check(desc,fn){try{if(!fn())throw Error("condition false");tests.push([desc,"PASS"]);console.log("PASS",desc)}catch(e){tests.push([desc,"FAIL "+String(e)]);console.log("FAIL",desc,String(e))}}
const first=run(make());const entry=inspect(first.result);const all=JSON.parse(entry.entries.overlay_items),ids=all.flatMap(x=>x.items.map(y=>y.overlay_id));
check("01 baseline emits body",()=>typeof first.result.body==="string");
check("02 correct 19 groups",()=>all.length===19);
check("03 exactly 136 items",()=>ids.length===136);
check("04 every ID unique",()=>new Set(ids).size===136);
check("05 server root fields preserved",()=>entry.other.server===true&&entry.entries.server_special==="yes");
check("06 widget fallback present",()=>JSON.parse(entry.entries.widget_frame_event).url.includes("Shin-chan-1.png"));
check("07 repeat is idempotent",()=>!run(entry).result.body);
check("08 no subscriber injected",()=>!entry.subscriber&&(!entry.entries.subscriber));
check("09 no camera filter forced",()=>!Object.hasOwn(entry.entries,"camera_filter_config"));
check("10 no feature gates forced",()=>!Object.hasOwn(entry.entries,"feature_gates"));
const original=make({overlay_items:JSON.stringify([{section:"🎨 General",note:{keep:true},items:[{overlay_id:"caption:standard",source:"server"},{overlay_id:"my:custom",value:42}]},null,{"items":"bad"}]),widget_frame_event:JSON.stringify({url:"https://example.com/server.jpg"})});const merged=inspect(run(original).result),groups=JSON.parse(merged.entries.overlay_items);
check("11 server group metadata preserved",()=>groups[0].note.keep===true);
check("12 server existing caption untouched",()=>groups[0].items[0].source==="server");
check("13 non-catalog caption retained",()=>groups[0].items[1].value===42);
check("14 malformed section unchanged",()=>groups[1]===null&&groups[2].items==="bad");
check("15 server widget unchanged",()=>merged.entries.widget_frame_event===original.entries.widget_frame_event);
check("16 merged catalog size 137",()=>groups.flatMap(x=>x&&Array.isArray(x.items)?x.items:[]).length===137);
check("17 duplicate ID not inserted",()=>groups.flatMap(x=>x&&Array.isArray(x.items)?x.items:[]).filter(i=>i.overlay_id==="caption:standard").length===1);
check("18 unchanged on nonlocket UA",()=>!run(make(),"OtherApp/1").result.body);
check("19 lowercase UA accepted",()=>!!run(make(),"locket/1").result.body);
check("20 wrong prefix rejected",()=>!run(make(),"UnLocketClient").result.body);
check("21 invalid top JSON no rewrite",()=>!run("{invalid").result.body);
check("22 entries absent no rewrite",()=>!run({other:1}).result.body);
check("23 entries array no rewrite",()=>!run({entries:[]}).result.body);
check("24 malformed overlay no rewrite",()=>!run(make({overlay_items:"{broken"})).result.body);
check("25 non-array overlay no rewrite when widget exists",()=>!run(make({overlay_items:JSON.stringify({entries:[]}),widget_frame_event:"existing"})).result.body);
check("26 server camera config retained",()=>{const data=make({camera_filter_config:JSON.stringify({sheet_filters:[{filter_ids:["a"]}]})}); const result=inspect(run(data).result);return result.entries.camera_filter_config===data.entries.camera_filter_config;});
check("27 no secret in logs",()=>!first.logs.some(x=>/token|receipt|session|user_id/i.test(x)));
check("28 oversized rewritten body skipped",()=>!run(make({large:"x".repeat(120000)})).result.body);
check("29 existing popup unchanged",()=>{const d=make({feature_discovery_popup_config:JSON.stringify({campaign:"original"})});return inspect(run(d).result).entries.feature_discovery_popup_config===d.entries.feature_discovery_popup_config});
check("30 response preserves account entitlements",()=>{const d=make();d.subscriber={entitlements:{real:true}};return JSON.stringify(inspect(run(d).result).subscriber)===JSON.stringify(d.subscriber)});
const failed=tests.filter(x=>x[1]!=="PASS");
console.log("RESULT "+(tests.length-failed.length)+"/"+tests.length);
if(failed.length)process.exitCode=1;
