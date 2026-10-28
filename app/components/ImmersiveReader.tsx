"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "./NativeLink";
import {
  ArrowRight, BookOpen, Check, ChevronLeft, ChevronRight, Download,
  ExternalLink, Maximize2, Minus, Moon, Plus, Settings2, Sun, X,
} from "lucide-react";
import type { Book } from "../data";

type Tone = "warm" | "dark";

// Entirely empty sheets in the source PDFs. Keep their real page numbers for
// accurate citations and direct jumps, but do not interrupt sequential reading.
const blankSheets: Record<string, number[]> = {
  "12-12": [4],
  "haribini-bisharaf": [],
  "la-tuhaddiq-kathiran": [4, 6, 8, 30, 40, 66, 98, 104, 138],
  "warith-al-ahd": [4, 6, 10],
};
const optimizedBooks: Record<string, number> = {
  "12-12": 112,
  "haribini-bisharaf": 173,
  "la-tuhaddiq-kathiran": 153,
  "warith-al-ahd": 218,
};

function pageImage(slug: string, page: number) {
  return `/pages/${slug}/${String(page).padStart(3, "0")}.webp`;
}

function nextReadable(current: number, direction: 1 | -1, total: number, excluded: Set<number>) {
  let result = current + direction;
  while (result >= 1 && result <= total && excluded.has(result)) result += direction;
  return Math.min(total, Math.max(1, result));
}

export default function ImmersiveReader({ book }: { book: Book }) {
  const total = book.pages;
  const hasPages = optimizedBooks[book.slug] === total;
  const emptyPages = useMemo(() => new Set(blankSheets[book.slug] || []), [book.slug]);
  const [page, setPage] = useState(1);
  const [inputPage, setInputPage] = useState("1");
  const [hydrated, setHydrated] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [tone, setTone] = useState<Tone>("warm");
  const [showSettings, setShowSettings] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [original, setOriginal] = useState(!hasPages);
  const [loaded, setLoaded] = useState("");
  const [failed, setFailed] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const pageKey = `${book.slug}:${page}`;
  const pageWidth = Math.round(Math.max(265, Math.min(940, (stageWidth || 760) - 22)) * zoom);
  const progress = Math.round((page / Math.max(1, total)) * 100);

  const changePage = useCallback((value: number) => {
    const target = Math.min(total, Math.max(1, Math.round(value) || 1));
    setPage(target);
    setInputPage(String(target));
    stageRef.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
    setShowHint(false);
    try { localStorage.setItem("literary-reader-hint-seen", "1"); } catch {}
  }, [total]);

  const turn = useCallback((direction: 1 | -1) => {
    changePage(nextReadable(page, direction, total, emptyPages));
  }, [page, total, emptyPages, changePage]);

  useEffect(() => {
    // Restore browser-only preferences after hydration; server markup stays stable.
    try {
      const saved = Number(localStorage.getItem(`read-${book.slug}`));
      if (Number.isFinite(saved) && saved > 0 && saved <= total) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPage(Math.floor(saved));
        setInputPage(String(Math.floor(saved)));
      }
      const prefs = JSON.parse(localStorage.getItem("literary-reader-prefs") || "{}");
      if (prefs.tone === "dark" || prefs.tone === "warm") setTone(prefs.tone);
      if (typeof prefs.zoom === "number" && prefs.zoom >= .8 && prefs.zoom <= 1.8) setZoom(prefs.zoom);
      setShowHint(!localStorage.getItem("literary-reader-hint-seen"));
      localStorage.setItem(`recent-${book.slug}`, String(Date.now()));
    } catch {}
    setHydrated(true);
  }, [book.slug, total]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`read-${book.slug}`, String(page));
      localStorage.setItem(`recent-${book.slug}`, String(Date.now()));
      localStorage.setItem("literary-reader-prefs", JSON.stringify({ tone, zoom }));
    } catch {}
  }, [book.slug, page, tone, zoom, hydrated]);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new ResizeObserver(() => setStageWidth(node.clientWidth));
    observer.observe(node);
    setStageWidth(node.clientWidth);
    return () => observer.disconnect();
  }, [original]);

  useEffect(() => {
    if (!hasPages || original) return;
    const adjoining = [nextReadable(page, 1, total, emptyPages), nextReadable(page, -1, total, emptyPages)];
    for (const number of adjoining) {
      if (number === page) continue;
      const img = new Image();
      img.src = pageImage(book.slug, number);
    }
  }, [page, total, hasPages, original, book.slug, emptyPages]);

  useEffect(() => {
    function keyboard(event: KeyboardEvent) {
      if (event.target instanceof HTMLElement && event.target.closest("input,textarea,select,button")) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === "ArrowRight" || event.key === "PageDown") {
        event.preventDefault(); turn(1);
      }
      if (event.key === "ArrowLeft" || event.key === "PageUp") {
        event.preventDefault(); turn(-1);
      }
      if (event.key === "Escape") setShowSettings(false);
    }
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [turn]);

  function onTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    if (event.touches.length !== 1) { swipeRef.current = null; return; }
    swipeRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }
  function onTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    if (!swipeRef.current || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - swipeRef.current.x;
    const dy = event.changedTouches[0].clientY - swipeRef.current.y;
    swipeRef.current = null;
    if (zoom > 1.05 || Math.abs(dx) < 65 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    // Arabic page progression: swipe right for the next sheet, left for previous.
    turn(dx > 0 ? 1 : -1);
  }

  function confirmJump() { changePage(Number(inputPage) || page); }
  function savePage() {
    try { localStorage.setItem(`read-${book.slug}`, String(page)); } catch {}
    setShowSaved(true);
    window.setTimeout(() => setShowSaved(false), 1600);
  }

  return <main className={`ebook-reader ebook-${tone}`} dir="rtl">
    <header className="ebook-topbar">
      <Link href="/#works" className="ebook-home-link" aria-label="العودة إلى مكتبة الكتب"><ArrowRight size={20}/><span>المكتبة</span></Link>
      <div className="ebook-heading"><BookOpen size={18}/><div><h1>{book.title}</h1><span>هاشم خالد شطير</span></div></div>
      <div className="ebook-head-actions">
        <button type="button" className="ebook-round-button" onClick={() => setShowSettings(v => !v)} aria-label="إعدادات القراءة" aria-expanded={showSettings} title="إعدادات القراءة">{showSettings ? <X size={20}/> : <Settings2 size={20}/>}</button>
        <a href={book.pdf} download className="ebook-round-button ebook-download" aria-label="تحميل الكتاب PDF" title="تحميل الكتاب"><Download size={19}/></a>
      </div>
    </header>

    {showSettings && <section className="ebook-settings" aria-label="إعدادات القراءة">
      <div className="ebook-settings-title"><Settings2 size={17}/> تخصيص القراءة <button type="button" onClick={() => setShowSettings(false)} aria-label="إغلاق الإعدادات"><X size={17}/></button></div>
      <div className="ebook-setting-row"><span>حجم الصفحة</span><div className="ebook-setting-buttons">
        <button type="button" onClick={() => setZoom(v => Math.max(.8, Math.round((v - .15) * 100) / 100))} disabled={original || zoom <= .8} aria-label="تصغير"><Minus size={17}/></button>
        <b>{Math.round(zoom * 100)}%</b>
        <button type="button" onClick={() => setZoom(v => Math.min(1.8, Math.round((v + .15) * 100) / 100))} disabled={original || zoom >= 1.8} aria-label="تكبير"><Plus size={17}/></button>
      </div></div>
      <div className="ebook-setting-row"><span>أجواء القراءة</span><div className="ebook-setting-buttons"><button type="button" className={tone === "warm" ? "active" : ""} onClick={() => setTone("warm")}><Sun size={15}/> دافئ</button><button type="button" className={tone === "dark" ? "active" : ""} onClick={() => setTone("dark")}><Moon size={15}/> ليلي</button></div></div>
      <div className="ebook-setting-row"><span>عرض الكتاب</span><button type="button" className="ebook-text-button" onClick={() => setOriginal(v => !v)}><Maximize2 size={16}/>{original ? "القراءة المريحة" : "PDF الأصلي"}</button></div>
      <a className="ebook-external-link" href={`${book.pdf}#page=${page}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/> افتح الملف الأصلي في تبويب جديد</a>
    </section>}

    <div className="ebook-space">
      <div className="ebook-page-stage" ref={stageRef} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {original ? <iframe className="ebook-pdf-frame" src={`${book.pdf}#page=${page}&view=FitH`} title={`كتاب ${book.title} — PDF`}/> : <div className="ebook-paper-wrap">
          <img key={pageKey} className="ebook-paper" src={pageImage(book.slug, page)} style={{ width: pageWidth }} alt={`الصفحة ${page} من كتاب ${book.title}`} decoding="async" onLoad={() => { setLoaded(pageKey); setFailed(""); }} onError={() => setFailed(pageKey)}/>
          {loaded !== pageKey && failed !== pageKey && <div className="ebook-loading" role="status"><span className="ebook-spinner"/> جارٍ فتح الصفحة...</div>}
          {failed === pageKey && <div className="ebook-error"><p>حدثت مشكلة في تحميل هذه الصفحة.</p><button type="button" onClick={() => setOriginal(true)}>افتح الكتاب الأصلي</button></div>}
        </div>}
      </div>
      {!original && <><button className="ebook-edge ebook-edge-next" aria-label="الصفحة التالية" type="button" onClick={() => turn(1)} disabled={page >= total}><ChevronRight size={23}/></button>
      <button className="ebook-edge ebook-edge-previous" aria-label="الصفحة السابقة" type="button" onClick={() => turn(-1)} disabled={page <= 1}><ChevronLeft size={23}/></button></>}
      {showHint && hasPages && !original && <div className="ebook-hint" role="status">للتقليب اسحب الصفحة يمينًا، أو استخدم زر «التالية» بالأسفل <button aria-label="إخفاء المساعدة" type="button" onClick={() => { setShowHint(false); try { localStorage.setItem("literary-reader-hint-seen", "1"); } catch {} }}><X size={15}/></button></div>}
    </div>

    <footer className="ebook-footer">
      <div className="ebook-progress-line"><span>تقدّم القراءة</span><input type="range" aria-label="التنقل بين صفحات الكتاب" min="1" max={total} value={page} onChange={event => changePage(Number(event.target.value))}/><strong>{progress}%</strong></div>
      <div className="ebook-turn-controls">
        <button type="button" className="ebook-turn ebook-turn-next" onClick={() => turn(1)} disabled={page >= total}><ChevronRight size={21}/><span>الصفحة التالية</span></button>
        <div className="ebook-page-field"><span>صفحة</span><input type="number" inputMode="numeric" min="1" max={total} aria-label="رقم الصفحة" value={inputPage} onChange={event => setInputPage(event.target.value)} onBlur={confirmJump} onKeyDown={event => { if (event.key === "Enter") event.currentTarget.blur(); }}/><span>من {total}</span></div>
        <button type="button" className="ebook-turn ebook-turn-prev" onClick={() => turn(-1)} disabled={page <= 1}><span>السابقة</span><ChevronLeft size={21}/></button>
      </div>
      <button type="button" className="ebook-save-page" onClick={savePage} aria-label="حفظ موقع القراءة">{showSaved ? <Check size={14}/> : <BookOpen size={14}/>} {showSaved ? "حُفظت" : "محفوظ تلقائيًا"}</button>
    </footer>
  </main>;
}
