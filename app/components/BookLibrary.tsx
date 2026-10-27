"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Eye, Search, X, Sparkles, Rotate3D } from "lucide-react";
import { books as initialBooks, type Book } from "../data";
import Book3D from "./Book3D";

const filters = ["الكل", "رواية", "كتاب"];

function BookQuickView({ book, onClose }: { book: Book; onClose: () => void }) {
  const panel = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [flipped,setFlipped] = useState(false);

  useEffect(() => {
    const original = document.body.style.overflow;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
      if (event.key !== "Tab" || !panel.current) return;
      const elements = Array.from(panel.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled])'));
      const first = elements[0], last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    document.addEventListener("keydown", keydown);
    return () => { document.body.style.overflow = original; document.removeEventListener("keydown", keydown); previousFocus?.focus(); };
  }, [onClose]);

  return <div className="quick-view-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="quick-view-panel" ref={panel} role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
      <button className="quick-view-close" type="button" onClick={onClose} aria-label="إغلاق المعاينة" ref={closeRef}><X size={22}/></button>
      <div className="quick-view-art" style={{"--book-accent":book.color} as React.CSSProperties}>
        <div className="quick-view-halo"/>
        <Book3D cover={book.cover} title={book.title} accent={book.color} back={book.gallery?.find(g => g.label.includes("الخلفي"))?.src} flipped={flipped} variant="modal" />
        <button className="book3d-modal-turn" type="button" aria-pressed={flipped} onClick={()=>setFlipped(value=>!value)}><Rotate3D size={17}/>{flipped?"شاهد الغلاف الأمامي":"اقلب الكتاب واكتشف خلفه"}</button>
      </div>
      <div className="quick-view-copy">
        <span className="eyebrow"><Sparkles size={15}/> اكتشف العمل عن قرب</span>
        <h2 id="quick-view-title">{book.title}</h2>
        {book.subtitle && <p className="quick-view-subtitle">{book.subtitle}</p>}
        <div className="quick-view-meta"><span>{book.type}</span><span>{book.genre}</span><span>{book.year}</span></div>
        <p className="quick-view-description">{book.description}</p>
        <p className="quick-view-pages">{book.pages} صفحة تنتظرك بين دفّتي الكتاب.</p>
        <div className="quick-view-actions"><Link href={`/read/${book.slug}`} className="btn btn-gold"><BookOpen size={17}/> ابدأ القراءة</Link><Link href={`/books/${book.slug}`} className="btn btn-outline"><Eye size={17}/> تفاصيل الكتاب</Link></div>
        <a className="quick-view-download" href={book.pdf} download><Download size={16}/> تحميل النسخة الإلكترونية PDF</a>
      </div>
    </section>
  </div>;
}

function BookCard({book,index,onPreview}:{book:Book;index:number;onPreview:(book:Book)=>void}) {
  function tilt(event:React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect=event.currentTarget.getBoundingClientRect();
    const x=(event.clientX-rect.left)/rect.width;
    const y=(event.clientY-rect.top)/rect.height;
    event.currentTarget.style.setProperty("--rx", `${(0.5-y)*5}deg`);
    event.currentTarget.style.setProperty("--ry", `${(x-0.5)*5}deg`);
    event.currentTarget.style.setProperty("--mx", `${x*100}%`);
    event.currentTarget.style.setProperty("--my", `${y*100}%`);
  }
  function reset(event:React.PointerEvent<HTMLElement>) {
    event.currentTarget.style.setProperty("--rx","0deg");
    event.currentTarget.style.setProperty("--ry","0deg");
  }
  return <article className="book-card" onPointerMove={tilt} onPointerLeave={reset}>
    <div className="book-image">
      <Link href={`/books/${book.slug}`} className="book-cover-link" aria-label={`تفاصيل ${book.title}`}>
        <Book3D cover={book.cover} title={book.title} accent={book.color} variant="card" />
        <span className="book-category">{book.genre}</span>
        <span className="book-hover"><BookOpen size={24}/> ادخل عالم الكتاب <ArrowLeft size={16}/></span>
      </Link>
      <button type="button" className="book-quick-btn" onClick={()=>onPreview(book)}><Eye size={16}/> نظرة سريعة</button>
      <div className="book-reflection" aria-hidden="true"/>
    </div>
    <div className="book-info"><span className="book-index">{String(index+1).padStart(2,"0")} / {book.year}</span><h3><Link href={`/books/${book.slug}`}>{book.title}</Link></h3><p>{book.subtitle || book.type}</p><Link href={`/read/${book.slug}`} className="book-read-direct"><BookOpen size={16}/> اقرأ الكتاب الآن <ArrowLeft size={14}/></Link><button type="button" className="book-arrow" aria-label={`معاينة ${book.title}`} onClick={()=>onPreview(book)}><ArrowLeft size={19}/></button></div>
  </article>;
}

export default function BookLibrary() {
  const [books,setBooks]=useState<Book[]>(initialBooks);
  const [filter,setFilter]=useState("الكل");
  const [query,setQuery]=useState("");
  const [preview,setPreview]=useState<Book|null>(null);

  useEffect(()=>{fetch("/api/books").then(r=>r.json() as Promise<{books?:Book[]}>).then(data=>{if(data.books)setBooks(data.books)}).catch(()=>{})},[]);
  const visible=useMemo(()=>books.filter(book=>(filter==="الكل"||book.type.includes(filter))&&`${book.title} ${book.subtitle??""} ${book.genre}`.includes(query.trim())),[books,filter,query]);

  return <>
    <div className="library-tools"><div className="filter-tabs" aria-label="تصفية المؤلفات">{filters.map(item=><button key={item} className={item===filter?"active":""} aria-pressed={item===filter} onClick={()=>setFilter(item)}>{item==="الكل"?"جميع الأعمال":item==="رواية"?"الروايات":"الكتب والخواطر"}</button>)}</div>
      <label className="book-search"><Search size={18}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="ابحث عن كتاب..." aria-label="ابحث عن كتاب"/>{query&&<button aria-label="مسح البحث" onClick={()=>setQuery("")}><X size={15}/></button>}</label></div>
    <div className="books-grid">{visible.map((book,index)=><BookCard key={book.slug} book={book} index={index} onPreview={setPreview}/>)}</div>
    {visible.length===0&&<div className="empty-state">لم نجد عملًا مطابقًا للبحث. جرّب عنوانًا آخر.</div>}
    {preview && <BookQuickView book={preview} onClose={()=>setPreview(null)}/>}
  </>;
}
