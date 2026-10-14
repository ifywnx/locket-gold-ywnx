import { z } from 'zod';
import {valid,json,sameOrigin} from '../../../lib/access';
export async function POST(r:Request){if(!sameOrigin(r))return json({error:'Yêu cầu không hợp lệ.'},403);let b;try{b=z.object({code:z.string().max(128)}).parse(await r.json())}catch{return json({error:'Mã không hợp lệ.'},400)};if(typeof b.code!=='string'||!await valid(b.code.trim()))return json({error:'Mã không đúng, đã hết hạn hoặc bị thu hồi.'},403);return json({path:'/download/'+b.code.trim()+'/Locket_ifywnx.sgmodule'})}
