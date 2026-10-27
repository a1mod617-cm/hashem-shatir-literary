import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Download, Feather } from "lucide-react";
import { books } from "../../data";
import { getBook } from "../../lib/books";
import Reviews from "../../components/Reviews";
import CoverGallery from "../../components/CoverGallery";

export const dynamic = "force-dynamic";
export function generateStaticParams(){return books.map(book=>({slug:book.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const book=await getBook(slug);return {title:book?.title??"كتاب",description:book?.description,openGraph:{images:book?[book.cover]:[]}}}
export default async function BookDetail({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const book=await getBook(slug);
  if(!book)notFound();
  return <main>
    <section className="page-top"><div className="container"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href="/#works">المؤلفات</Link> / {book.title}</div><span className="eyebrow" style={{marginTop:28}}>{book.type} · {book.genre}</span><h1>{book.title}</h1>{book.subtitle&&<p>{book.subtitle}</p>}</div></section>
    <section className="content-section"><div className="container"><div className="book-detail-grid">
      <div><CoverGallery book={book}/></div>
      <div><span className="eyebrow">بين يديك حكاية جديدة</span><h2 style={{fontSize:52,fontFamily:"Amiri",marginTop:12}}>عن هذا <em>العمل</em></h2><p className="detail-lead">{book.description}</p>
        <div className="detail-facts"><span>{book.type}</span><span>{book.genre}</span><span>سنة {book.year}</span><span>{book.pages} صفحة في PDF</span></div>
        <div className="detail-actions"><Link href={`/read/${book.slug}`} className="btn btn-gold"><BookOpen size={19}/> اقرأ الكتاب الآن <ArrowLeft size={17}/></Link><a href={book.pdf} download className="btn btn-outline"><Download size={18}/> تحميل PDF</a></div>
        <p className="details-note"><Feather size={14} style={{display:"inline",verticalAlign:"middle",marginLeft:7}}/> جميع حقوق هذا العمل محفوظة للمؤلف هاشم خالد شطير. أُتيحت القراءة والنسخة الرقمية بموافقته.</p>
      </div></div><div className="reviews-section"><h2>انطباعات <em>القرّاء</em></h2><p className="muted" style={{marginTop:10}}>شارك انطباعك عن العمل بكل صدق واحترام. تُراجع الآراء قبل نشرها.</p><Reviews bookSlug={book.slug}/></div></div></section>
  </main>;
}
