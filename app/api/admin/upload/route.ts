import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { checkAdmin } from "../../../lib/admin";
import { isCrossOriginWrite } from "../../../lib/request-security";
export const runtime="edge";
export async function POST(request:NextRequest){
  if(!(await checkAdmin()).isAdmin)return NextResponse.json({error:"غير مخول"},{status:403});
  if(isCrossOriginWrite(request))return NextResponse.json({error:"مصدر الطلب غير موثوق"},{status:403});
  const contentLength=Number(request.headers.get("content-length"));
  if(Number.isFinite(contentLength)&&contentLength>27*1024*1024)return NextResponse.json({error:"حجم الطلب كبير جدًا"},{status:413});
  let form:FormData;try{form=await request.formData()}catch{return NextResponse.json({error:"طلب رفع غير صالح"},{status:400})}
  const file=form.get("file");const kind=String(form.get("kind")??"");
  if(!(file instanceof File)||!["cover","pdf"].includes(kind))return NextResponse.json({error:"ملف غير صالح"},{status:400});
  const types:Record<string,string>={"application/pdf":"pdf","image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
  const ext=types[file.type];if(!ext||(kind==="pdf"&&ext!=="pdf")||(kind==="cover"&&ext==="pdf"))return NextResponse.json({error:"نوع الملف غير مسموح"},{status:400});
  const max=kind==="pdf"?25*1024*1024:8*1024*1024;if(file.size<100||file.size>max)return NextResponse.json({error:"حجم الملف غير مسموح"},{status:400});
  // Content-Type is supplied by the browser; also check the actual file signature.
  const signature=new Uint8Array(await file.slice(0,16).arrayBuffer());
  const starts=(...bytes:number[])=>bytes.every((byte,index)=>signature[index]===byte);
  const valid=ext==="pdf"?starts(0x25,0x50,0x44,0x46,0x2d):ext==="jpg"?starts(0xff,0xd8,0xff):ext==="png"?starts(0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a):starts(0x52,0x49,0x46,0x46)&&String.fromCharCode(...signature.slice(8,12))==="WEBP";
  if(!valid)return NextResponse.json({error:"محتوى الملف لا يطابق نوعه"},{status:400});
  const bucket=env.BUCKET;if(!bucket)return NextResponse.json({error:"تخزين الملفات غير متاح"},{status:503});
  const key=`${kind}/${crypto.randomUUID()}.${ext}`;
  try{await bucket.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});return NextResponse.json({url:`/files/${key}`},{status:201})}
  catch{return NextResponse.json({error:"فشل رفع الملف"},{status:503})}
}
