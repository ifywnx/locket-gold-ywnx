// Read-only V4 filter compatibility audit. Preserves original HTTP response.
(function(){
var output={};
try{
 if(typeof $request==="undefined"||!$request||!$request.headers||
    typeof $response==="undefined"||!$response||typeof $response.body!=="string"){
  $done(output);return;
 }
 var headers=$request.headers,ua="";
 for(var h in headers)if(Object.prototype.hasOwnProperty.call(headers,h)&&
    h.toLowerCase()==="user-agent"&&typeof headers[h]==="string"){ua=headers[h];break;}
 if(!/(?:^|[^a-z0-9])locket(?=$|[^a-z0-9])/i.test(ua)){$done(output);return;}
 var response=JSON.parse($response.body);
 if(!response||typeof response!=="object"||Array.isArray(response)||
    !response.entries||typeof response.entries!=="object"||
    Array.isArray(response.entries)){$done(output);return;}
 var raw=response.entries.camera_filter_config,status="absent",groups=0,
 refs=0,unique=0,picker=0,missingFromPicker=0,pickerExtra=0,
 sitePresent=0,button="unset",sheet="unset",siteIds=["okay_wig","influencer","looks_maxxing","toothless","bye_brows","bowling_ball","blonde_bleached","beard","bob_cut","buns","tatted","mohawk","braces","slimed","princess","disco_lights","cash_money","happy_birthday","cutesy","sticker_face","flower_crown","love_bug","wedding","cowboy_cowgirl","giraffe","clown","easter_bunney_cutout","easter_chick_cutout","bearded","leprechaun","lucky_face","sweet_hearts","elf_cutout","santa_cutout","frosty"];
 if(typeof raw!=="undefined"&&raw!==null){
  try{
   var config=typeof raw==="string"?JSON.parse(raw):raw;
   if(config&&typeof config==="object"&&!Array.isArray(config)){
    status="object";
    if(typeof config.show_filter_button==="boolean")button=String(config.show_filter_button);
    if(typeof config.sheet_enabled==="boolean")sheet=String(config.sheet_enabled);
    var a=Object.create(null),b=Object.create(null);
    if(Array.isArray(config.sheet_filters)){
     groups=config.sheet_filters.length;
     for(var i=0;i<config.sheet_filters.length;i++){
      var g=config.sheet_filters[i];
      if(g&&Array.isArray(g.filter_ids))for(var j=0;j<g.filter_ids.length;j++){
       var id=g.filter_ids[j];
       if(typeof id==="string"&&id.length<=128){refs++;a[id]=true;}
      }
     }
    }
    if(Array.isArray(config.picker_filters))for(var k=0;k<config.picker_filters.length;k++){
     var pick=config.picker_filters[k];
     if(typeof pick==="string"&&pick.length<=128){picker++;b[pick]=true;}
    }
    for(var key in a)if(Object.prototype.hasOwnProperty.call(a,key)){
     unique++;if(!b[key])missingFromPicker++;
    }
    for(var key2 in b)if(Object.prototype.hasOwnProperty.call(b,key2)&&!a[key2])pickerExtra++;
    for(var x=0;x<siteIds.length;x++)if(a[siteIds[x]])sitePresent++;
   }else status="unexpected_type";
  }catch(err){status="malformed_json";}
 }
 if(typeof console!=="undefined"&&typeof console.log==="function")
 console.log("[ifywnx V4 filter compatibility] status="+status+
  " groups="+groups+" references="+refs+" unique="+unique+
  " picker="+picker+" groups_missing_in_picker="+missingFromPicker+
  " picker_not_in_groups="+pickerExtra+" website_ids_present="+sitePresent+
  "/35 button="+button+" sheet="+sheet);
}catch(err){
 if(typeof console!=="undefined"&&typeof console.log==="function")
 console.log("[ifywnx V4 filter compatibility] invalid response; preserved");
}
$done(output);
})();