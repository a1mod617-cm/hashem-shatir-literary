import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../../db";
import { journalPosts } from "../../../../db/schema";
import { checkAdmin } from "../../../lib/admin";

export const runtime = "edge";

export async function GET() {
  if (!(await checkAdmin()).isAdmin) return NextResponse.json({ error: "غير مخول" }, { status: 403 });
  try {
    const posts = await getDb().select().from(journalPosts).orderBy(desc(journalPosts.createdAt));
    return NextResponse.json({ posts });
  } catch {
    return NextResponse.json({ error: "تعذر تحميل المقالات" }, { status: 503 });
  }
}

function extract(input: Record<string, unknown>) {
  const slug = String(input.slug ?? "").trim();
  const title = String(input.title ?? "").trim();
  const category = String(input.category ?? "").trim();
  const excerpt = String(input.excerpt ?? "").trim();
  const body = String(input.body ?? "").trim();
  const status = String(input.status ?? "draft");
  if (!/^[a-z][a-z0-9-]{2,65}$/.test(slug) || title.length < 4 || title.length > 140 ||
    category.length < 2 || category.length > 60 || excerpt.length < 10 || excerpt.length > 400 ||
    body.length < 20 || body.length > 40000 || !["draft", "published"].includes(status)) {
    return null;
  }
  return { slug, title, category, excerpt, body, status };
}

export async function POST(request: NextRequest) {
  if (!(await checkAdmin()).isAdmin) return NextResponse.json({ error: "غير مخول" }, { status: 403 });
  let input: Record<string, unknown>;
  try { input = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }); }
  const post = extract(input);
  if (!post) return NextResponse.json({ error: "يرجى ملء الحقول؛ نص المقال لا يقل عن 20 حرفًا" }, { status: 400 });
  try {
    await getDb().insert(journalPosts).values({ ...post, createdAt: Date.now() });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "تعذر إنشاء المقال؛ قد يكون المعرّف مستخدمًا" }, { status: 409 });
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAdmin()).isAdmin) return NextResponse.json({ error: "غير مخول" }, { status: 403 });
  let input: Record<string, unknown>;
  try { input = await request.json() as Record<string, unknown>; }
  catch { return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 }); }
  const post = extract(input);
  if (!post) return NextResponse.json({ error: "بيانات المقال غير صالحة" }, { status: 400 });
  try {
    const changed = await getDb().update(journalPosts).set({ title: post.title, category: post.category, excerpt: post.excerpt, body: post.body, status: post.status }).where(eq(journalPosts.slug, post.slug)).returning({slug:journalPosts.slug});
    return changed.length ? NextResponse.json({ ok: true }) : NextResponse.json({ error: "المقال غير موجود" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "تعذر تحديث المقال" }, { status: 503 });
  }
}
