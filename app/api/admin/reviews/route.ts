import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { reviews } from "../../../../db/schema";
import { checkAdmin } from "../../../lib/admin";
import { isCrossOriginWrite, readBoundedJson } from "../../../lib/request-security";
export const runtime="edge";
export async function GET(){if(!(await checkAdmin()).isAdmin)return NextResponse.json({error:"غير مخول"},{status:403});try{return NextResponse.json({reviews:await getDb().select().from(reviews).orderBy(desc(reviews.createdAt)).limit(200)})}catch{return NextResponse.json({error:"تعذر الاتصال بقاعدة البيانات"},{status:503})}}
export async function PATCH(req:NextRequest){if(!(await checkAdmin()).isAdmin)return NextResponse.json({error:"غير مخول"},{status:403});if(isCrossOriginWrite(req))return NextResponse.json({error:"مصدر غير موثوق"},{status:403});const body=await readBoundedJson(req,2048);if(!body)return NextResponse.json({error:"طلب غير صالح"},{status:400});if(typeof body.id!=="string"||!/^[0-9a-f-]{36}$/i.test(body.id)||!["approved","rejected","pending"].includes(String(body.status??"")))return NextResponse.json({error:"طلب غير صالح"},{status:400});try{const updated=await getDb().update(reviews).set({status:String(body.status)}).where(eq(reviews.id,body.id)).returning({id:reviews.id});return updated.length?NextResponse.json({ok:true}):NextResponse.json({error:"المراجعة غير موجودة"},{status:404})}catch{return NextResponse.json({error:"تعذر تحديث المراجعة"},{status:503})}}
