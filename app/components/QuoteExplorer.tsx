"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Copy, Check } from "lucide-react";
import { quotes } from "../data";
const categories = Array.from(new Set(quotes.map((quote) => quote.category)));
export default function QuoteExplorer() {
  const [category, setCategory] = useState(categories[1]);
  const [index, setIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const current = quotes.filter((quote) => quote.category === category);
  const quote = current[index % current.length];
  async function copy() { await navigator.clipboard.writeText(`«${quote.text}» — هاشم خالد شطير`); setCopied(true); window.setTimeout(() => setCopied(false), 1600); }
  return <div className="quote-explorer"><div className="quote-categories">{categories.map((name) => <button key={name} className={category === name ? "active" : ""} onClick={() => {setCategory(name);setIndex(0)}}>{name}</button>)}</div>
    <div className="quote-panel"><span className="quote-mark">“</span><div className="quote-panel-inner"><p key={`${category}-${index}`}>«{quote.text}»</p><span className="quote-author">— هاشم خالد شطير</span></div>
      <div className="quote-controls"><button aria-label="الاقتباس التالي" onClick={() => setIndex((i) => (i + 1) % current.length)}><ArrowRight size={20}/></button><span className="quote-count">{String(index + 1).padStart(2,"0")} <i>/</i> {String(current.length).padStart(2,"0")}</span><button aria-label="الاقتباس السابق" onClick={() => setIndex((i) => (i + current.length - 1) % current.length)}><ArrowLeft size={20}/></button><button className="copy-quote" onClick={copy} title="نسخ الاقتباس">{copied ? <Check size={17}/> : <Copy size={17}/>}</button></div></div></div>;
}
