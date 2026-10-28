"use client";
import { useState } from "react";
import Link from "./NativeLink";
import { Feather, Menu, X, BookOpen } from "lucide-react";
const links = [{href:"/",label:"الرئيسية"},{href:"/#works",label:"المؤلفات"},{href:"/shelf",label:"مكتبتي"},{href:"/#about",label:"عن الكاتب"},{href:"/journal",label:"المدونة"},{href:"/#quotes",label:"اقتباسات"},{href:"/#contact",label:"تواصل"}];
export default function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container nav-inner">
    <Link href="/" className="brand" onClick={() => setOpen(false)}><span className="brand-icon"><Feather size={24}/></span><span><strong>هاشم خالد شطير</strong><small>كاتب وروائي يمني</small></span></Link>
    <nav className={open ? "nav-links open" : "nav-links"} aria-label="القائمة الرئيسية">{links.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>
    <Link className="nav-reading" href="/shelf"><BookOpen size={17}/> مكتبتي</Link>
    <button className="menu-toggle" aria-label={open ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X/> : <Menu/>}</button>
  </div></header>;
}
