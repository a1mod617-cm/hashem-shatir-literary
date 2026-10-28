"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, X, RotateCcw, RefreshCw, Search, MessageCircle, Clock3, ShieldCheck } from "lucide-react";
import type { Book } from "../data";

type Review = { id:string;bookSlug:string;name:string;rating:number;content:string;status:string;createdAt:number };
type Filter = "pending" | "approved" | "rejected" | "all";

export default function AdminDashboard() {
  const [reviews,setReviews] = useState<Review[]>([]);
  const [books,setBooks] = useState<Book[]>([]);
  const [filter,setFilter] = useState<Filter>("pending");
  const [query,setQuery] = useState("");
  const [message,setMessage] = useState("جارٍ تحميل البيانات...");
  const [busy,setBusy] = useState("");

  async function reload() {
    try {
      const result = await fetch("/api/admin/reviews",{cache:"no-store"});
      const data = await result.json() as { error?:string;reviews?:Review[] };
      if (!result.ok) throw Error(data.error || "تعذر تحميل المراجعات");
      setReviews(data.reviews ?? []);
      setMessage("");
    } catch(error) { setMessage(error instanceof Error ? error.message : "تعذر الاتصال"); }
  }

  useEffect(() => {
    void Promise.resolve().then(reload);
    fetch("/api/books").then(r=>r.json() as Promise<{books?:Book[]}>).then(d=>setBooks(d.books??[])).catch(()=>{});
  }, []);

  async function change(id:string,status:string) {
    setBusy(id);
    setMessage("");
    try {
      const response = await fetch("/api/admin/reviews",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});
      if (!response.ok) throw Error("تعذر اعتماد التغيير");
      await reload();
    } catch(error) {setMessage(error instanceof Error ? error.message : "تعذر الاتصال");}
    finally {setBusy("");}
  }

  const totals = useMemo(() => ({
    pending:reviews.filter(r=>r.status==="pending").length,
    approved:reviews.filter(r=>r.status==="approved").length,
    rejected:reviews.filter(r=>r.status==="rejected").length,
  }),[reviews]);

  const titles = useMemo(() => new Map(books.map(b=>[b.slug,b.title])),[books]);
  const filtered = useMemo(() => reviews.filter(review =>
    (filter === "all" || review.status === filter) &&
    `${review.name} ${review.content} ${titles.get(review.bookSlug)??review.bookSlug}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase())
  ),[reviews,filter,query,titles]);

  return <div className="review-admin">
    <div className="admin-section-head"><div><span className="eyebrow">تفاعل القرّاء</span><h2>مراجعات <em>القرّاء</em></h2></div><button className="btn btn-outline" onClick={()=>void reload()}><RefreshCw size={16}/> تحديث</button></div>
    <div className="admin-insights"><div><Clock3 size={20}/><strong>{totals.pending}</strong><span>تنتظر الموافقة</span></div><div><ShieldCheck size={20}/><strong>{totals.approved}</strong><span>منشورة للقرّاء</span></div><div><MessageCircle size={20}/><strong>{reviews.length}</strong><span>مراجعات مستلمة</span></div></div>
    <div className="admin-review-tools"><div className="filter-tabs" aria-label="تصفية المراجعات">
      {([{key:"pending",label:"بانتظار المراجعة"},{key:"approved",label:"منشورة"},{key:"rejected",label:"مرفوضة"},{key:"all",label:"الجميع"}] as {key:Filter;label:string}[]).map(item=><button key={item.key} aria-pressed={filter===item.key} className={filter===item.key?"active":""} onClick={()=>setFilter(item.key)}>{item.label}</button>)}
    </div><label className="book-search"><Search size={17}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="ابحث في آراء القرّاء..." aria-label="ابحث في المراجعات"/></label></div>
    {message && <p className="notice" role="status">{message}</p>}
    <div className="admin-review-list">{filtered.map(review=><article className="admin-review-card" key={review.id}>
      <div className="admin-review-top"><div><span className="admin-review-avatar">{review.name[0]??"ق"}</span><strong>{review.name}</strong><small>{new Date(review.createdAt).toLocaleDateString("ar-YE")}</small></div><span className={`admin-review-status ${review.status}`}>{review.status==="approved"?"منشور":review.status==="rejected"?"مرفوض":"قيد المراجعة"}</span></div>
      <div className="admin-review-book">عن «{titles.get(review.bookSlug)??review.bookSlug}» <span>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div>
      <p>{review.content}</p><div className="admin-review-actions"><button disabled={busy===review.id||review.status==="approved"} onClick={()=>void change(review.id,"approved")}><Check size={16}/> قبول ونشر</button><button disabled={busy===review.id||review.status==="rejected"} onClick={()=>void change(review.id,"rejected")}><X size={16}/> رفض</button><button disabled={busy===review.id||review.status==="pending"} onClick={()=>void change(review.id,"pending")}><RotateCcw size={16}/> إعادة للمراجعة</button></div>
    </article>)}</div>
    {filtered.length===0 && !message && <div className="admin-review-empty"><ShieldCheck size={32}/><h3>{filter==="pending"?"لا توجد مراجعات تنتظر الموافقة":"لا توجد مراجعات مطابقة"}</h3><p>ستظهر آراء القرّاء هنا بمجرد إرسالها.</p></div>}
  </div>;
}
