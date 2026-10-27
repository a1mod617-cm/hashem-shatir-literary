import { NextRequest, NextResponse } from "next/server";
import { env } from "cloudflare:workers";
import { checkAdmin } from "../../../lib/admin";
export const runtime="edge";
export async function POST(request:NextRequest){
  if(!(await checkAdmin()).isAdmin)return NextResponse.json({error:"غير مخول"},{status:403});
  const form=await request.formData();const file=form.get("file");const kind=String(form.get("kind")??"");
  if(!(file instanceof File)||!["cover","pdf"].includes(kind))return NextResponse.json({error:"ملف غير صالح"},{status:400});
  const types:Record<string,string>={"application/pdf":"pdf","image/jpeg":"jpg","image/png":"png","image/webp":"webp"};
  const ext=types[file.type];if(!ext||(kind==="pdf"&&ext!=="pdf")||(kind==="cover"&&ext==="pdf"))return NextResponse.json({error:"نوع الملف غير مسموح"},{status:400});
  const max=kind==="pdf"?25*1024*1024:8*1024*1024;if(file.size<100||file.size>max)return NextResponse.json({error:"حجم الملف غير مسموح"},{status:400});
  const bucket=env.BUCKET;if(!bucket)return NextResponse.json({error:"تخزين الملفات غير متاح"},{status:503});
  const key=`${kind}/${crypto.randomUUID()}.${ext}`;
  try{await bucket.put(key,await file.arrayBuffer(),{httpMetadata:{contentType:file.type}});return NextResponse.json({url:`/files/${key}`},{status:201})}
  catch{return NextResponse.json({error:"فشل رفع الملف"},{status:503})}
}
