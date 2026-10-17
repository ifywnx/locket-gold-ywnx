// ifywnx Locket_V4_Camera_Diagnostics: experimental, preserves server-owned data.
// NO payment, receipt, subscription or entitlement changes.
(function(){
 var result={};
 try{
  if(typeof $request==="undefined"||!$request||!$request.headers||
     typeof $response==="undefined"||!$response||typeof $response.body!=="string"){
    $done(result);return;
  }
  var ua="",headers=$request.headers;
  for(var k in headers){
    if(Object.prototype.hasOwnProperty.call(headers,k)&&
       k.toLowerCase()==="user-agent"&&typeof headers[k]==="string"){ua=headers[k];break;}
  }
  if(!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)){$done(result);return;}
  var response=JSON.parse($response.body);
  if(!response||typeof response!=="object"||Array.isArray(response)||
     !response.entries||typeof response.entries!=="object"||Array.isArray(response.entries)){
    $done(result);return;
  }
  // Never write camera_filter_config. Logs only type/counts, not user data.
  var raw=response.entries.camera_filter_config, status="absent",groups=0,ids=0,duplicates=0;
  if(typeof raw!=="undefined"&&raw!==null){
   try{
    var conf=typeof raw==="string"?JSON.parse(raw):raw;
    if(conf&&typeof conf==="object"&&!Array.isArray(conf)){
     status="object";
     if(Array.isArray(conf.sheet_filters)){
      groups=conf.sheet_filters.length;var seen=Object.create(null);
      for(var i=0;i<conf.sheet_filters.length;i++){
       var f=conf.sheet_filters[i];
       if(!f||!Array.isArray(f.filter_ids))continue;
       for(var j=0;j<f.filter_ids.length;j++){
        var id=f.filter_ids[j];
        if(typeof id!=="string")continue;
        ids++;if(seen[id])duplicates++;seen[id]=true;
       }
      }
     }
    }else status="unexpected_type";
   }catch(err){status="malformed_json";}
  }
  if(typeof console!=="undefined"&&typeof console.log==="function")
   console.log("[ifywnx V4 camera] status="+status+" groups="+groups+" filter_references="+ids+" repeat_references="+duplicates);
 }catch(error){
  if(typeof console!=="undefined"&&typeof console.log==="function")console.log("[ifywnx V4 Locket_V4_Camera_Diagnostics] invalid data; no rewrite");
 }
 $done(result);
})();
