import { env } from "cloudflare:workers";
import { NextRequest } from "next/server";
export const runtime="edge";
export async function GET(_request:NextRequest,{params}:{params:Promise<{path:string[]}>}){
  const {path}=await params;const key=path.join("/");
  if(!/^(cover|pdf)\/[a-f0-9-]{36}\.(jpg|png|webp|pdf)$/.test(key))return new Response("Not found",{status:404});
  const object=await env.BUCKET?.get(key);if(!object)return new Response("Not found",{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set("ETag",object.httpEtag);headers.set("Cache-Control","public, max-age=31536000, immutable");headers.set("X-Content-Type-Options","nosniff");
  return new Response(object.body,{status:200,headers});
}
