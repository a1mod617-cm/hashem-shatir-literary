import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Feather, ScrollText } from "lucide-react";
import { getPublishedJournal } from "../lib/journal";

export const metadata: Metadata = {
  title: "مدونة هاشم خالد شطير | نصوص وتأملات",
  description: "مقالات وتأملات الكاتب والروائي اليمني هاشم خالد شطير في الحياة والكتابة والإنسان.",
};
export const dynamic = "force-dynamic";

export default async function JournalPage() {
  const posts = await getPublishedJournal();
  return <main>
    <section className="page-top journal-page-hero"><div className="container"><span className="eyebrow">من هامش الحكاية</span><h1>مدوّنتي <em>الأدبية.</em></h1><p>نصوص عابرة بين الكتابة والحياة؛ ما لم تتّسع له الروايات، وما بقي بعد انتهائها.</p></div></section>
    <section className="content-section"><div className="container">
      {posts.length ? <div className="journal-cards">{posts.map((post, index) => <Link key={post.slug} className="journal-card" href={`/journal/${post.slug}`}>
        <span className="journal-card-number">{String(index+1).padStart(2,"0")}</span>
        <span className="eyebrow">{post.category} · {new Date(post.createdAt).toLocaleDateString("ar-YE")}</span>
        <h2>{post.title}</h2><p>{post.excerpt}</p><span className="text-link">اقرأ المقال <ArrowLeft size={18}/></span>
      </Link>)}</div> : <div className="journal-empty"><div className="journal-empty-icon"><ScrollText size={45} strokeWidth={1}/></div><span className="eyebrow">صفحات لم تُكتب بعد</span><h2>هناك كلماتٌ <em>في الطريق.</em></h2><p>ستُفتح هذه المساحة لنصوص الكاتب وتأملاته قريبًا. وحتى ذلك الحين، يمكنك اكتشاف عوالمه المنشورة.</p><Link href="/#works" className="btn btn-gold">استكشف المؤلفات <ArrowLeft size={17}/></Link></div>}
      <div className="journal-footnote"><Feather size={18}/> «بعض الحكايات لا تُكتب لتُروى، بل لتجد روحًا أخرى تشبهها.»</div>
    </div></section>
  </main>;
}
