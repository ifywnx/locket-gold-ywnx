"use strict";
const fs = require("node:fs");
const path = require("node:path");
const scripts = {};
scripts["captions"] = fs.readFileSync(path.resolve(__dirname, "../scripts/Locket_V4_Captions_118.js"), "utf8");
scripts["core"] = fs.readFileSync(path.resolve(__dirname, "../scripts/Locket_V4_Core.js"), "utf8");
scripts["widget"] = fs.readFileSync(path.resolve(__dirname, "../scripts/Locket_V4_Widget_Test.js"), "utf8");
scripts["camera"] = fs.readFileSync(path.resolve(__dirname, "../scripts/Locket_V4_Camera_Diagnostics.js"), "utf8");
scripts["popup"] = fs.readFileSync(path.resolve(__dirname, "../../2026-10-17/popup/Locket_Popup_Test.js"), "utf8");
const tests = (function(){

let pass=0,fail=0,results=[];
const assert=(value,msg)=>{if(!value)throw new Error(msg||"assertion failed")};
const deepEq=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function check(name,cb){
 try{cb();pass++;results.push({name,ok:true})}catch(err){fail++;results.push({name,ok:false,error:String(err.message||err)})}
}
function fixture(){
 return {entries:{overlay_items:"[]",camera_filter_config:JSON.stringify({sheet_filters:[{filter_ids:["a","b"]},{filter_ids:["b"]}]}),server_feature:"server",widget_frame_event:undefined},other:{private:"keep"}};
}
function run(name,body,ua="Locket/1.0"){
 const list=[],logs=[];
 const ctxRequest={headers:{"User-Agent":ua}};
 const ctxResponse={body:typeof body==="string"?body:JSON.stringify(body)};
 (new Function("$request","$response","$done","console",scripts[name]))(ctxRequest,ctxResponse,x=>list.push(x),{log:x=>logs.push(String(x))});
 assert(list.length===1,"$done must be called once");
 return {output:JSON.parse(JSON.stringify(list[0]||{})),logs};
}
function getChanged(name,body){return JSON.parse(run(name,body).output.body)}
check("core read only",()=>assert(!run("core",fixture()).output.body));
check("camera read only",()=>assert(!run("camera",fixture()).output.body));
check("camera counts (no content)",()=>{const x=run("camera",fixture());assert(x.logs.some(l=>l.includes("repeat_references=1")))});
check("caption 118 append to empty",()=>{const v=getChanged("captions",fixture());const sections=JSON.parse(v.entries.overlay_items);assert(sections.length===13);assert(sections.reduce((s,g)=>s+g.items.length,0)===118)});
check("caption 118 unique",()=>{const v=getChanged("captions",fixture());const ids=JSON.parse(v.entries.overlay_items).flatMap(g=>g.items.map(i=>i.overlay_id));assert(new Set(ids).size===118)});
check("caption preserves unrelated keys",()=>{const v=getChanged("captions",fixture());assert(v.entries.server_feature==="server"&&v.other.private==="keep")});
check("caption does not inject entitlements",()=>{const v=getChanged("captions",fixture());assert(!("subscriber" in v)&&!("entitlements" in v))});
check("caption preserves server-only item",()=>{const f=fixture();f.entries.overlay_items=JSON.stringify([{section:"🎨 General",meta:{priority:4},items:[{overlay_id:"custom:unknown",data:{server:1}}]}]);const v=getChanged("captions",f);const grp=JSON.parse(v.entries.overlay_items)[0];assert(grp.items[0].data.server===1&&grp.meta.priority===4&&grp.items.length===12)});
check("caption preserves unexpected section type",()=>{const f=fixture();f.entries.overlay_items=JSON.stringify([null,"freeform",1,{items:"not array"}]);const v=getChanged("captions",f);const s=JSON.parse(v.entries.overlay_items);assert(s[0]===null&&s[1]==="freeform"&&s[2]===1&&s[3].items==="not array")});
check("caption malformed server JSON untouched",()=>{const f=fixture();f.entries.overlay_items="{oops";assert(!run("captions",f).output.body)});
check("caption nonarray original untouched",()=>{const f=fixture();f.entries.overlay_items=JSON.stringify({sections:[]});assert(!run("captions",f).output.body)});
check("caption null original untouched",()=>{const f=fixture();f.entries.overlay_items=null;assert(!run("captions",f).output.body)});
check("caption missing original untouched",()=>{const f=fixture();delete f.entries.overlay_items;assert(!run("captions",f).output.body)});
check("caption idempotent",()=>{const first=getChanged("captions",fixture());assert(!run("captions",first).output.body)});
check("caption retains own server caption id",()=>{const f=fixture();f.entries.overlay_items=JSON.stringify([{section:"Z",items:[{overlay_id:"caption:standard",source:"server"}]}]);const v=getChanged("captions",f);const all=JSON.parse(v.entries.overlay_items).flatMap(g=>g.items);assert(all.length===118&&all.find(x=>x.overlay_id==="caption:standard").source==="server")});
check("widget inserts when absent",()=>{const f=fixture();delete f.entries.widget_frame_event;const v=getChanged("widget",f);assert(JSON.parse(v.entries.widget_frame_event).url.includes("Shin-chan-1.png"))});
check("widget ignores existing config",()=>{const f=fixture();f.entries.widget_frame_event=JSON.stringify({url:"https://example.com/server.png"});assert(!run("widget",f).output.body)});
check("widget ignores malformed but nonempty server config",()=>{const f=fixture();f.entries.widget_frame_event="{bad";assert(!run("widget",f).output.body)});
check("widget retains other fields",()=>{const f=fixture();delete f.entries.widget_frame_event;const v=getChanged("widget",f);assert(v.other.private==="keep"&&v.entries.server_feature==="server")});
check("popup test only if absent",()=>{const f=fixture();const v=getChanged("popup",f);assert(JSON.parse(v.entries.feature_discovery_popup_config).campaign)});
check("popup preserves existing",()=>{const f=fixture();f.entries.feature_discovery_popup_config=JSON.stringify({uid:"server"});assert(!run("popup",f).output.body)});
check("other User-Agent untouched",()=>{for(const name of ["captions","widget","popup","camera","core"])assert(!run(name,fixture(),"OtherApp/2").output.body)});
check("prefix/suffix User-Agent not accepted",()=>{for(const ua of ["myLocket","UnLocketClient"])assert(!run("captions",fixture(),ua).output.body)});
check("lowercase Locket UA accepted",()=>{assert(getChanged("captions",fixture()).entries.overlay_items)});
check("invalid JSON safe",()=>{for(const name of ["captions","widget","popup","camera","core"])assert(!run(name,"{broken").output.body)});
check("missing entries safe",()=>{for(const name of ["captions","widget","popup","camera","core"])assert(!run(name,{other:1}).output.body)});
check("entries array safe",()=>{for(const name of ["captions","widget","popup","camera","core"])assert(!run(name,{entries:[]}).output.body)});
check("widget idempotent",()=>{const f=fixture();delete f.entries.widget_frame_event;const once=getChanged("widget",f);assert(!run("widget",once).output.body)});
check("popup idempotent",()=>{const once=getChanged("popup",fixture());assert(!run("popup",once).output.body)});
if(fail)throw Error(JSON.stringify(results.filter(x=>!x.ok)));
return {pass,fail,total:pass+fail,results};

})();
console.log("V4 regression:", tests.pass + "/" + tests.total);
