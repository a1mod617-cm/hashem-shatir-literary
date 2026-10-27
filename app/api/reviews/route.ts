import { NextRequest, NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { reviews } from "../../../db/schema";
import { getBook } from "../../lib/books";
export const runtime = "edge";
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("book") ?? "";
  if (!(await getBook(slug))) return NextResponse.json({error:"عمل غير موجود"},{status:404});
  try { const list=await getDb().select({id:reviews.id,name:reviews.name,rating:reviews.rating,content:reviews.content,createdAt:reviews.createdAt}).from(reviews).where(and(eq(reviews.bookSlug,slug),eq(reviews.status,"approved"))).orderBy(desc(reviews.createdAt)).limit(30);return NextResponse.json({reviews:list}); }
  catch {return NextResponse.json({reviews:[],unavailable:true});}
}
export async function POST(request: NextRequest) {
  let data:Record<string,unknown>;
  try {data=await request.json() as Record<string,unknown>}catch{return NextResponse.json({error:"بيانات غير صالحة"},{status:400})}
  if(data.website) return NextResponse.json({message:"استُلم الرأي للمراجعة"});
  const slug=String(data.bookSlug??"");const name=String(data.name??"").trim();const content=String(data.content??"").trim();const rating=Number(data.rating);
  if(!(await getBook(slug))||name.length<2||name.length>60||content.length<10||content.length>1200||!Number.isInteger(rating)||rating<1||rating>5) return NextResponse.json({error:"تحقق من الاسم والرأي والتقييم"},{status:400});
  try {
    const db=getDb();
    const duplicate=await db.select({id:reviews.id}).from(reviews).where(and(eq(reviews.bookSlug,slug),eq(reviews.name,name),eq(reviews.content,content))).limit(1);
    if(duplicate.length)return NextResponse.json({message:"سبق أن استلمنا هذا الرأي، وسيظهر بعد مراجعته."});
    await db.insert(reviews).values({id:crypto.randomUUID(),bookSlug:slug,name,rating,content,status:"pending",createdAt:Date.now()});
    return NextResponse.json({message:"شكرًا لك! سيظهر رأيك بعد مراجعته."},{status:201});
  }
  catch { return NextResponse.json({error:"تعذّر إرسال الرأي مؤقتًا"},{status:503}); }
}
