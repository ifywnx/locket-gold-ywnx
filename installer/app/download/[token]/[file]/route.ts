import {valid,secureHeaders} from '../../../../lib/access';
import {scripts,moduleTemplate} from '../../../../lib/private-assets';
export async function GET(r:Request,{params}:{params:Promise<{token:string,file:string}>}){const {token,file}=await params;if(!await valid(token))return new Response('Access denied',{status:403,headers:secureHeaders});let body:string;
if(file==='Locket_ifywnx.sgmodule'){const base=new URL(r.url).origin+'/download/'+token+'/';body=moduleTemplate.replace(/https:\/\/raw\.githubusercontent\.com\/ifywnx\/locket-gold-ywnx\/refs\/heads\/main\/(?:modules|js)\//g,base)}else if(Object.hasOwn(scripts,file)){body=scripts[file]}else{return new Response('Not found',{status:404,headers:secureHeaders})}
return new Response(body,{headers:{...secureHeaders,'Content-Type':file.endsWith('.js')?'application/javascript; charset=utf-8':'text/plain; charset=utf-8'}})}
