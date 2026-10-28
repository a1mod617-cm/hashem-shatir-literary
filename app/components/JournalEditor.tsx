"use client";

import { useEffect, useState } from "react";
import Link from "./NativeLink";
import { BookOpenText, FilePlus2, Save, Send } from "lucide-react";

type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  status: string;
  createdAt: number;
};
const fresh = { title: "", category: "تأملات", excerpt: "", body: "" };

export default function JournalEditor() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selected, setSelected] = useState("");
  const [draft, setDraft] = useState(fresh);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function refresh() {
    const response = await fetch("/api/admin/journal", { cache: "no-store" });
    const data = await response.json() as { posts?: Post[]; error?: string };
    if (!response.ok) throw Error(data.error ?? "تعذر تحميل المقالات");
    setPosts(data.posts ?? []);
  }

  useEffect(() => {
    void Promise.resolve().then(refresh).catch(error => setMessage(error instanceof Error ? error.message : "تعذر الاتصال"))
      .finally(() => setLoading(false));
  }, []);

  function select(slug: string) {
    setSelected(slug);
    const chosen = posts.find(post => post.slug === slug);
    setDraft(chosen ? {
      title: chosen.title, category: chosen.category,
      excerpt: chosen.excerpt, body: chosen.body,
    } : fresh);
    setMessage("");
  }

  function edit(key: keyof typeof fresh, value: string) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  async function save(status: "draft" | "published") {
    setBusy(true);
    setMessage("");
    try {
      const slug = selected || `article-${Date.now()}`;
      const response = await fetch("/api/admin/journal", {
        method: selected ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...draft, slug, status }),
      });
      const data = await response.json() as { error?: string };
      if (!response.ok) throw Error(data.error ?? "تعذر الحفظ");
      await refresh();
      setSelected(slug);
      setMessage(status === "published" ? "نُشر المقال بنجاح. أصبح متاحًا للقراء." : "حُفظ المقال كمسودة لا تظهر للقراء.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "تعذر الحفظ");
    } finally { setBusy(false); }
  }

  return <div className="journal-admin-grid">
    <aside className="journal-admin-list">
      <div className="journal-admin-head"><h2>مقالاتك</h2><button onClick={() => select("")} className="back-link"><FilePlus2 size={16}/> جديد</button></div>
      {loading ? <p className="muted">جارٍ تحميل المقالات...</p> : posts.length === 0 ? <p className="muted">لم تُكتب مقالات بعد. ابدأ بمقالك الأول.</p> : posts.map(post =>
        <button type="button" key={post.slug} onClick={() => select(post.slug)} className={`journal-admin-item ${selected === post.slug ? "active" : ""}`}>
          <span>{post.title}</span>
          <small>{post.status === "published" ? "منشور" : "مسودة"} · {new Date(post.createdAt).toLocaleDateString("ar-YE")}</small>
        </button>
      )}
    </aside>
    <div className="journal-admin-editor">
      <div className="journal-admin-head"><h2>{selected ? "تحرير المقال" : "مقال جديد"}</h2><Link className="back-link" href="/journal"><BookOpenText size={16}/> صفحة المدونة</Link></div>
      <form className="admin-form" onSubmit={event => { event.preventDefault(); void save("draft"); }}>
        <label>عنوان المقال<input required minLength={4} maxLength={140} value={draft.title} onChange={event => edit("title", event.target.value)} placeholder="حين تصبح الكلمات وطنًا"/></label>
        <label>التصنيف<input required minLength={2} maxLength={60} value={draft.category} onChange={event => edit("category", event.target.value)} placeholder="نصوص وتأملات"/></label>
        <label>نبذة قصيرة<textarea required minLength={10} maxLength={400} value={draft.excerpt} onChange={event => edit("excerpt", event.target.value)} placeholder="سطران يعرّفان القارئ بالمقال..."/></label>
        <label>النص الكامل<textarea required minLength={20} maxLength={40000} className="journal-body-field" value={draft.body} onChange={event => edit("body", event.target.value)} placeholder="اكتب نص المقال هنا. افصل الفقرات بسطر فارغ..."/></label>
        <div className="journal-admin-actions"><button disabled={busy} className="btn btn-outline" type="submit"><Save size={16}/> حفظ كمسودة</button><button disabled={busy} className="btn btn-gold" type="button" onClick={() => { void save("published"); }}><Send size={16}/> نشر المقال</button></div>
        {message && <p role="status" className="notice">{message}</p>}
      </form>
    </div>
  </div>;
}
