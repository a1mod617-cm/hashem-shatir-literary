import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { biography } from "../data";
export const metadata: Metadata = {title:"عن الكاتب"};
export default function AboutPage(){return <main><section className="page-top"><div className="container"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / عن الكاتب</div><span className="eyebrow" style={{marginTop:30}}>القصة وراء كل حكاية</span><h1>هاشم خالد <em>شطير</em></h1><p>كاتب وروائي يمني، بين عالم الصيدلة وعوالم الأدب، يكتب عن الإنسان وما لا تتسع له الحياة اليومية.</p></div></section><section className="content-section"><div className="container bio-prose"><img src="/media/author.jpg" className="bio-portrait" alt="هاشم خالد شطير"/>{biography.map((para,i)=><p key={i}>{para}</p>)}<Link href="/#works" className="text-link">تصفّح مؤلفاته <ArrowLeft size={18}/></Link></div></section></main>}
