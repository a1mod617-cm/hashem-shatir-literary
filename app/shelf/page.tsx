import type { Metadata } from "next";
import ReadingShelf from "../components/ReadingShelf";

export const metadata: Metadata = {
  title: "مكتبتي | متابعة القراءة",
  description: "رف قراءتك الخاص في موقع هاشم خالد شطير. واصل الكتب التي بدأت بها واحفظ تقدمك على جهازك.",
};

export default function ShelfPage() {
  return <main>
    <section className="page-top shelf-hero"><div className="container"><span className="eyebrow">رفّك الأدبي الخاص</span><h1>لكل قارئٍ <em>حكاية.</em></h1><p>ضع علاماتك بين الصفحات، وواصل من حيث توقّفت. هنا تحتفظ الكتب بموضع عودتك إليها.</p></div></section>
    <section className="content-section"><div className="container"><ReadingShelf/></div></section>
  </main>;
}
