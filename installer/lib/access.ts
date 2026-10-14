import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { accessCodes } from '../db/schema';
import { getChatGPTUser } from '../app/chatgpt-auth';
export async function digest(token:string){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(token));return Array.from(new Uint8Array(b),x=>x.toString(16).padStart(2,'0')).join('')}
export function newToken(){return Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('')}
export async function valid(token:string){if(!/^[a-f0-9]{64}$/.test(token))return false;const [row]=await getDb().select().from(accessCodes).where(eq(accessCodes.hash,await digest(token))).limit(1);return !!row&&!row.revoked&&row.expires>Date.now()}
export async function admin(){const u=await getChatGPTUser();return !!u && u.email.toLowerCase()===(env as unknown as Record<string,string>).OWNER_EMAIL?.toLowerCase()}
export const secureHeaders={'Cache-Control':'no-store, private','Referrer-Policy':'no-referrer','X-Content-Type-Options':'nosniff'};
export function json(data:unknown,status=200){return Response.json(data,{status,headers:secureHeaders})}
export function sameOrigin(r:Request){return r.headers.get('origin')===new URL(r.url).origin}
