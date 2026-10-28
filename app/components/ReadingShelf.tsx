"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "./NativeLink";
import { ArrowLeft, BookOpen, BookmarkCheck, CheckCircle2, RotateCcw, Sparkles } from "lucide-react";
import { books as initialBooks, type Book } from "../data";
import Book3D from "./Book3D";

type ReadingState = { page: number; completed: boolean; recent: number };
type Tab = "all" | "reading" | "completed";

function readProgress(books: Book[]): Record<string, ReadingState> {
  const progress: Record<string, ReadingState> = {};
  for (const book of books) {
    try {
      const saved = Number(localStorage.getItem(`read-${book.slug}`));
      const page = Number.isFinite(saved) ? Math.min(book.pages, Math.max(1, Math.floor(saved))) : 1;
      progress[book.slug] = {
        page,
        completed: localStorage.getItem(`done-${book.slug}`) === "true" || page >= book.pages,
        recent: Number(localStorage.getItem(`recent-${book.slug}`)) || 0,
      };
    } catch {
      progress[book.slug] = { page: 1, completed: false, recent: 0 };
    }
  }
  return progress;
}

export default function ReadingShelf() {
  const [books, setBooks] = useState<Book[]>(initialBooks);
  const [progress, setProgress] = useState<Record<string, ReadingState>>({});
  const [tab, setTab] = useState<Tab>("all");
  const refresh = useCallback(() => setProgress(readProgress(books)), [books]);

  useEffect(() => {
    fetch("/api/books").then(res => res.json() as Promise<{ books?: Book[] }>).then(data => {
      if (data.books) setBooks(data.books);
    }).catch(() => {});
  }, []);
  useEffect(() => {
    const frame = requestAnimationFrame(refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("focus", refresh); window.removeEventListener("storage", refresh); };
  }, [refresh]);

  const stats = useMemo(() => {
    const values = books.map(book => progress[book.slug] ?? { page:1, completed:false, recent:0 });
    return {
      reading: values.filter(value => value.recent && !value.completed).length,
      finished: values.filter(value => value.completed).length,
      pages: values.reduce((sum, value) => sum + Math.max(0, value.page - 1), 0),
    };
  }, [books, progress]);

  const displayed = useMemo(() => [...books]
    .sort((a,b) => (progress[b.slug]?.recent ?? 0) - (progress[a.slug]?.recent ?? 0))
    .filter(book => {
      const state = progress[book.slug];
      return tab === "all" || (tab === "completed" ? Boolean(state?.completed) : Boolean(state?.recent && !state.completed));
    }), [books, progress, tab]);

  function toggleCompleted(slug: string) {
    const done = !(progress[slug]?.completed ?? false);
    try { localStorage.setItem(`done-${slug}`, String(done)); } catch {}
    setProgress(current => ({ ...current, [slug]: { ...(current[slug] ?? { page:1, recent:0, completed:false }), completed:done } }));
  }

  return <>
    <div className="shelf-stats">
      <div><BookOpen size={22}/><strong>{stats.reading}</strong><span>أقرأ حاليًا</span></div>
      <div><CheckCircle2 size={22}/><strong>{stats.finished}</strong><span>أنهيت قراءتها</span></div>
      <div><BookmarkCheck size={22}/><strong>{stats.pages}</strong><span>صفحة تجاوزتها</span></div>
    </div>
    <div className="shelf-tools">
      <div className="filter-tabs" aria-label="تصفية مكتبتي">
        {([{key:"all",label:"كل المؤلفات"},{key:"reading",label:"أكمل القراءة"},{key:"completed",label:"كتب أنهيتها"}] as {key:Tab;label:string}[]).map(item =>
          <button key={item.key} aria-pressed={tab === item.key} className={tab === item.key ? "active" : ""} onClick={() => setTab(item.key)}>{item.label}</button>
        )}
      </div>
      <span className="shelf-device-note"><Sparkles size={15}/> تقدّمك محفوظ على هذا الجهاز</span>
    </div>
    {displayed.length > 0 ? <div className="shelf-books">{displayed.map(book => {
      const state = progress[book.slug] ?? { page:1, completed:false, recent:0 };
      const percentage = state.completed ? 100 : Math.round(Math.max(0, state.page - 1) / book.pages * 100);
      return <article key={book.slug} className="shelf-book">
        <Link className="shelf-cover" href={`/read/${book.slug}`} aria-label={`افتح كتاب ${book.title} مباشرة`}><Book3D cover={book.cover} title={book.title} accent={book.color} variant="shelf" /></Link>
        <div className="shelf-book-content"><span className="eyebrow">{book.genre} · {book.year}</span><h2>{book.title}</h2>{book.subtitle && <p className="shelf-subtitle">{book.subtitle}</p>}
          <div className="shelf-progress-label"><span>{state.completed ? "أحسنت، أنهيت الكتاب!" : state.recent ? `آخر صفحة: ${state.page} من ${book.pages}` : "رحلتك لم تبدأ بعد"}</span><strong>{percentage}%</strong></div>
          <div className="shelf-progress-track" role="progressbar" aria-label={`تقدّم قراءة ${book.title}`} aria-valuenow={percentage} aria-valuemin={0} aria-valuemax={100}><span style={{width:`${percentage}%`}}/></div>
          <div className="shelf-book-actions"><Link className="btn btn-gold" href={`/read/${book.slug}`}><BookOpen size={16}/>{state.recent ? "واصل القراءة" : "ابدأ القراءة"}<ArrowLeft size={15}/></Link>
            <button type="button" className="shelf-done" onClick={() => toggleCompleted(book.slug)}>{state.completed ? <RotateCcw size={15}/> : <CheckCircle2 size={15}/>} {state.completed ? "إلغاء الإكمال" : "تحديد كمكتمل"}</button></div>
        </div>
      </article>;
    })}</div> : <div className="shelf-empty"><BookmarkCheck size={35}/><h2>{tab === "completed" ? "لم تُكمل كتابًا بعد" : "ابدأ حكاية جديدة"}</h2><p>اختر أحد المؤلفات، وسيظهر تقدّمك في هذه المساحة تلقائيًا.</p><button className="btn btn-outline" onClick={() => setTab("all")}>عرض كل المؤلفات <ArrowLeft size={16}/></button></div>}
  </>;
}
