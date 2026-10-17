// ifywnx Locket_V4_Widget_Test: experimental, preserves server-owned data.
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
  // Only insert when server has no widget event at all; never replace real server assets.
  var original=response.entries.widget_frame_event;
  if(typeof original==="undefined"||original===null||original===""){
   response.entries.widget_frame_event=JSON.stringify({
    uid:"ifywnx_shinchan_v4_test",
    url:"https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png",
    use_local_time_zone:true,
    placement:"below",
    start_at:"2020-01-01T00:00:00",
    end_at:"2099-12-31T23:59:59"
   });
   result={body:JSON.stringify(response)};
  }
 }catch(error){
  if(typeof console!=="undefined"&&typeof console.log==="function")console.log("[ifywnx V4 Locket_V4_Widget_Test] invalid data; no rewrite");
 }
 $done(result);
})();
