// ifywnx Locket_V4_Core: experimental, preserves server-owned data.
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
  // Intentionally read-only: baseline that does not alter response.
  if(typeof console!=="undefined"&&typeof console.log==="function"){
   console.log("[ifywnx V4 core] valid Remote Config response");
  }
 }catch(error){
  if(typeof console!=="undefined"&&typeof console.log==="function")console.log("[ifywnx V4 Locket_V4_Core] invalid data; no rewrite");
 }
 $done(result);
})();
