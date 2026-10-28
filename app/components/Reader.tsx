"use client";

import { useEffect, useRef, useState } from "react";
import Link from "./NativeLink";
import {
  ArrowLeft, ArrowRight, BookOpen, Bookmark, Check, ChevronLeft,
  ChevronRight, Download, ExternalLink, Focus, Maximize2, Minus,
  Moon, Plus, Sun, X,
} from "lucide-react";
import type { Book } from "../data";

type Tone = "warm" | "dark" | "original";
type ViewMode = "pages" | "original";

// These pages were exported from the original PDFs with Poppler to preserve
// the author's Arabic font shapes on Safari and other mobile browsers.
const optimizedBooks: Record<string, number> = {
  "12-12": 112,
  "haribini-bisharaf": 173,
  "la-tuhaddiq-kathiran": 153,
  "warith-al-ahd": 218,
};

function imageUrl(slug: string, page: number) {
  return `/pages/${slug}/${String(page).padStart(3, "0")}.webp`;
}

export default function Reader({ book }: { book: Book }) {
  const optimized = optimizedBooks[book.slug] === book.pages;
  const [page, setPage] = useState(1);
  const [draft, setDraft] = useState("1");
  const total = book.pages;
  const [zoom, setZoom] = useState(1);
  const [tone, setTone] = useState<Tone>("warm");
  const [mode, setMode] = useState<ViewMode>(optimized ? "pages" : "original");
  const [focus, setFocus] = useState(false);
  const [loadedKey, setLoadedKey] = useState("");
  const [failedKey, setFailedKey] = useState("");
  const [saved, setSaved] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [stageWidth, setStageWidth] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchRef = useRef<{ x: number; y: number } | null>(null);
  const pageKey = `${book.slug}:${page}`;
  const busy = mode === "pages" && loadedKey !== pageKey && failedKey !== pageKey;
  const displayWidth = Math.round(Math.max(245, Math.min(990, (stageWidth || 800) - 30)) * zoom);

  useEffect(() => {
    try {
      const last = Number(localStorage.getItem(`read-${book.slug}`));
      if (last > 0 && last <= book.pages) {
        setPage(last);
        setDraft(String(last));
      }
      const preferences = JSON.parse(localStorage.getItem("literary-reader-prefs") || "{}");
      if (["warm", "dark", "original"].includes(preferences.tone)) setTone(preferences.tone);
      if (typeof preferences.zoom === "number" && preferences.zoom >= .75 && preferences.zoom <= 1.8) setZoom(preferences.zoom);
      localStorage.setItem(`recent-${book.slug}`, String(Date.now()));
    } catch {}
    setHydrated(true);
  }, [book.slug, book.pages]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(`read-${book.slug}`, String(page));
      localStorage.setItem(`recent-${book.slug}`, String(Date.now()));
      localStorage.setItem("literary-reader-prefs", JSON.stringify({ tone, zoom }));
    } catch {}
  }, [book.slug, page, tone, zoom, hydrated]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const observer = new ResizeObserver(() => setStageWidth(Math.floor(stage.clientWidth)));
    observer.observe(stage);
    setStageWidth(Math.floor(stage.clientWidth));
    return () => observer.disconnect();
  }, [mode, focus]);

  useEffect(() => {
    if (!optimized || mode !== "pages") return;
    // Only the visible page is rendered; prefetch the adjacent pages for fast turns.
    for (const next of [page - 1, page + 1]) {
      if (next < 1 || next > total) continue;
      const preload = new window.Image();
      preload.src = imageUrl(book.slug, next);
    }
  }, [optimized, mode, page, total, book.slug]);

  useEffect(() => {
    if (!focus) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [focus]);

  function go(value: number) {
    const next = Math.min(total, Math.max(1, Math.floor(value) || 1));
    setPage(next);
    setDraft(String(next));
    stageRef.current?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const element = e.target as HTMLElement | null;
      if (element?.closest("input,textarea,select,button") || e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "ArrowLeft" || e.key === "PageDown") { e.preventDefault(); go(page + 1); }
      if (e.key === "ArrowRight" || e.key === "PageUp") { e.preventDefault(); go(page - 1); }
      if (e.key === "Escape") setFocus(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [page, total]);

  function bookmark() {
    try {
      localStorage.setItem(`read-${book.slug}`, String(page));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch {}
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length !== 1) { touchRef.current = null; return; }
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current || e.changedTouches.length !== 1) return;
    if (zoom > 1.05) { touchRef.current = null; return; }
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    touchRef.current = null;
    if (Math.abs(dx) < 85 || Math.abs(dx) < Math.abs(dy) * 1.7) return;
    // حركة القراءة العربية: سحب إلى اليمين للصفحة التالية.
    go(page + (dx > 0 ? 1 : -1));
  }

  const progress = Math.round((page / Math.max(1, total)) * 100);
  return (
    <main className={`literary-reader reader-tone-${tone} ${focus ? "reader-focus" : ""}`}>
      <div className="reading-layout">
        <div className="reading-heading">
          <div>
            <Link href={`/books/${book.slug}`} className="reading-back"><ArrowRight size={17}/> العودة إلى تفاصيل الكتاب</Link>
            <p className="reading-kicker">مكتبة هاشم خالد شطير • قراءة إلكترونية</p>
            <h1>{book.title}</h1>
          </div>
          <div className="reading-heading-actions">
            <button type="button" onClick={bookmark} className="reading-action" title="حفظ آخر صفحة">
              {saved ? <Check size={17}/> : <Bookmark size={17}/>} {saved ? "حُفظت" : "حفظ الصفحة"}
            </button>
            <a className="reading-action reading-download" href={book.pdf} download><Download size={17}/> تحميل الكتاب</a>
          </div>
        </div>

        <div className="reading-panel">
          <div className="reading-settings">
            <div className="reading-view-buttons" role="group" aria-label="طريقة عرض الكتاب">
              <button type="button" className={mode === "pages" ? "selected" : ""} onClick={() => setMode("pages")} disabled={!optimized}><BookOpen size={16}/> قراءة مريحة</button>
              <button type="button" className={mode === "original" ? "selected" : ""} onClick={() => setMode("original")}>ملف PDF الأصلي</button>
            </div>
            <div className="reading-tools">
              <div className="reading-zoom" role="group" aria-label="تكبير صفحات الكتاب">
                <button type="button" aria-label="تصغير النص" onClick={() => setZoom(v => Math.max(.75, Math.round((v - .15) * 100) / 100))} disabled={mode !== "pages" || zoom <= .75}><Minus size={16}/></button>
                <span title="تكبير الصفحة وحروفها">{Math.round(zoom * 100)}%</span>
                <button type="button" aria-label="تكبير النص" onClick={() => setZoom(v => Math.min(1.8, Math.round((v + .15) * 100) / 100))} disabled={mode !== "pages" || zoom >= 1.8}><Plus size={16}/></button>
              </div>
              <div className="reading-tones" role="group" aria-label="لون صفحة القراءة">
                <button type="button" className={tone === "warm" ? "selected" : ""} onClick={() => setTone("warm")} title="ورق دافئ"><Sun size={16}/></button>
                <button type="button" className={tone === "dark" ? "selected" : ""} onClick={() => setTone("dark")} title="وضع ليلي"><Moon size={16}/></button>
                <button type="button" className={tone === "original" ? "selected" : ""} onClick={() => setTone("original")} title="الألوان الأصلية">◐</button>
              </div>
              <button type="button" className="reading-icon-button" onClick={() => setFocus(value => !value)} aria-label={focus ? "إنهاء وضع التركيز" : "القراءة بملء الشاشة"} title="وضع التركيز">{focus ? <X size={17}/> : <Maximize2 size={17}/>}</button>
            </div>
          </div>

          <div className="reading-page-navigation">
            <button type="button" onClick={() => go(page + 1)} disabled={page >= total}><ChevronRight size={21}/> الصفحة التالية</button>
            <label className="reading-page-jump">صفحة
              <input aria-label="رقم الصفحة" type="number" min="1" max={total} value={draft} onChange={event => setDraft(event.target.value)} onBlur={() => go(Number(draft))} onKeyDown={event => { if (event.key === "Enter") { go(Number(draft)); event.currentTarget.blur(); } }}/>
              <span>من {total}</span>
            </label>
            <button type="button" onClick={() => go(page - 1)} disabled={page <= 1}>السابقة <ChevronLeft size={21}/></button>
          </div>

          <div ref={stageRef} className="reading-stage" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
            {mode === "original" ? (
              <iframe title={`كتاب ${book.title} — الملف الأصلي`} className="reading-original-frame" src={`${book.pdf}#page=${page}&view=FitH`}/>
            ) : (
              <div className="reading-sheet">
                <img
                  key={pageKey}
                  src={imageUrl(book.slug, page)}
                  alt={`الصفحة ${page} من كتاب ${book.title}`}
                  style={{ width: displayWidth }}
                  decoding="async"
                  onLoad={() => { setLoadedKey(pageKey); setFailedKey(""); }}
                  onError={() => setFailedKey(pageKey)}
                />
                {busy && <div className="reading-loading" role="status"><span className="reading-spinner"/> جارٍ تجهيز صفحة الكتاب...</div>}
              </div>
            )}
            {failedKey === pageKey && mode === "pages" && <div className="reading-error" role="alert"><p>تعذّر تحميل هذه الصفحة. يمكنك متابعة القراءة من الملف الأصلي أو تنزيله.</p><button type="button" onClick={() => setMode("original")}>افتح النسخة الأصلية</button></div>}
          </div>

          <div className="reading-progress" aria-label={`أنجزت ${progress} بالمائة من صفحات الكتاب`}>
            <div className="reading-progress-info"><span>{progress}% من الكتاب</span><span>تقدّم القراءة محفوظ تلقائيًا على هذا الجهاز</span></div>
            <input type="range" min="1" max={total} value={page} onChange={event => go(Number(event.target.value))} aria-label="انتقل إلى صفحة في الكتاب" style={{ background: `linear-gradient(to left, #c7a16b ${progress}%, #4a4039 ${progress}%)` }}/>
          </div>
          <div className="reading-bottom-actions">
            <button type="button" onClick={() => go(page + 1)} disabled={page >= total}>تابع القراءة <ArrowLeft size={17}/></button>
            <a href={`${book.pdf}#page=${page}`} target="_blank" rel="noreferrer"><ExternalLink size={15}/> فتح الكتاب خارج الموقع</a>
          </div>
        </div>
        <p className="reading-note"><Focus size={15}/> الصفحات مأخوذة من الكتاب الأصلي بدقة عالية للحفاظ على الحروف العربية وتنسيق المؤلف. كبّر الصفحة عند الحاجة، واسحب أفقيًا على الجوال للتنقل.</p>
      </div>
    </main>
  );
}
