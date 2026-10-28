import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { bookOverrides, extraBooks } from "../../../../db/schema";
import { books } from "../../../data";
import { checkAdmin } from "../../../lib/admin";
import { isCrossOriginWrite, readBoundedJson } from "../../../lib/request-security";
export const runtime="edge";
export async function PUT(request:NextRequest){if(!(await checkAdmin()).isAdmin)return NextResponse.json({error:"غير مخول"},{status:403});if(isCrossOriginWrite(request))return NextResponse.json({error:"مصدر غير موثوق"},{status:403});const value=await readBoundedJson(request,8192);if(!value)return NextResponse.json({error:"بيانات غير صالحة"},{status:400});
  const slug=String(value.slug??"");const title=String(value.title??"").trim();const description=String(value.description??"").trim();const genre=String(value.genre??"").trim();if(!/^[a-z0-9-]+$/.test(slug)||!title||title.length>100||description.length<10||description.length>3000||!genre||genre.length>100)return NextResponse.json({error:"تحقق من الحقول"},{status:400});
  try{if(books.some(b=>b.slug===slug)){await getDb().insert(bookOverrides).values({slug,title,description,genre,updatedAt:Date.now()}).onConflictDoUpdate({target:bookOverrides.slug,set:{title,description,genre,updatedAt:Date.now()}})}else{await getDb().update(extraBooks).set({title,description,genre}).where(eq(extraBooks.slug,slug))}return NextResponse.json({ok:true})}catch{return NextResponse.json({error:"تعذر حفظ التغييرات"},{status:503})}}

export async function POST(request:NextRequest){
  if(!(await checkAdmin()).isAdmin)return NextResponse.json({error:"غير مخول"},{status:403});
  if(isCrossOriginWrite(request))return NextResponse.json({error:"مصدر غير موثوق"},{status:403});
  const v=await readBoundedJson(request,8192);if(!v)return NextResponse.json({error:"بيانات غير صالحة"},{status:400});
  const slug=String(v.slug??"").trim(),title=String(v.title??"").trim(),description=String(v.description??"").trim(),genre=String(v.genre??"").trim(),type=String(v.type??"").trim(),year=String(v.year??"").trim(),subtitle=String(v.subtitle??"").trim(),cover=String(v.cover??""),pdf=String(v.pdf??""),pages=Number(v.pages);
  if(!/^[a-z][a-z0-9-]{2,65}$/.test(slug)||books.some(b=>b.slug===slug)||!title||title.length>100||description.length<10||description.length>3000||!genre||genre.length>100||!type||type.length>60||!/^[12][0-9]{3}$/.test(year)||!Number.isInteger(pages)||pages<1||pages>5000||!/^\/files\/cover\/[a-f0-9-]{36}\.(jpg|png|webp)$/.test(cover)||!/^\/files\/pdf\/[a-f0-9-]{36}\.pdf$/.test(pdf))return NextResponse.json({error:"تحقق من جميع الحقول والملفات"},{status:400});
  try{await getDb().insert(extraBooks).values({slug,title,subtitle:subtitle||null,description,genre,type,year,pages,cover,pdf,createdAt:Date.now()});return NextResponse.json({ok:true},{status:201})}catch{return NextResponse.json({error:"تعذر إضافة الكتاب؛ قد يكون المعرّف مستخدمًا"},{status:409})}
}
