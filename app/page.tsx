import Link from "./components/NativeLink";
import { ArrowLeft, ArrowUpLeft, BookOpen, Feather, Camera as Instagram, Send, Sparkles, PenLine } from "lucide-react";
import BookLibrary from "./components/BookLibrary";
import QuoteExplorer from "./components/QuoteExplorer";
import Book3D from "./components/Book3D";

export default function HomePage() {
  return <main>
    <section className="hero" id="home"><div className="hero-grain" aria-hidden="true"/><div className="container hero-grid">
      <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-line"/> هاشم خالد شطير · كاتب وروائي يمني</span>
        <h1>للحكاياتِ <em>أرواحٌ</em><br/>لا تغادرنا.</h1>
        <p className="hero-lead">أكتبُ لأقترب من الإنسان، من أسئلته التي لا تهدأ، ومن الحكايات التي تظل حيّةً حتى بعد الصفحة الأخيرة.</p>
        <div className="hero-actions"><a href="#works" className="btn btn-gold">اكتشف مؤلفاتي <ArrowLeft size={17}/></a><a href="#about" className="btn btn-outline">تعرّف على الكاتب <ArrowUpLeft size={16}/></a></div>
        <div className="hero-note"><Feather size={16}/><span>«بعض الحكايات لا تُكتب لتُروى، بل لتجد روحًا أخرى تشبهها.»</span></div>
      </div>
      <div className="hero-portrait-wrap"><div className="hero-orbit orbit-one" aria-hidden="true"/><div className="hero-orbit orbit-two" aria-hidden="true"/><div className="hero-portrait-frame"><img src="/media/author.jpg" alt="الكاتب والروائي هاشم خالد شطير"/></div><span className="portrait-caption">HASHEM · KHALED · SHATIR</span><span className="portrait-number">01 / 04</span></div>
    </div><a href="#works" className="scroll-hint">تصفّح الموقع <span className="scroll-line"/></a></section>

    <div className="marquee-separator" aria-hidden="true"><span>روايات</span><i>✦</i><span>خواطر</span><i>✦</i><span>حكايات</span><i>✦</i><span>عالم أدبي</span></div>

    <section className="section works-section" id="works"><div className="container"><div className="section-heading split-heading"><div><span className="eyebrow">01 — المكتبة الأدبية</span><h2>عوالمٌ <em>تستحق القراءة.</em></h2></div><p>لكل كتاب باب، ولكل حكاية أثر. اختر العمل الذي يشبه مزاجك، وابدأ رحلتك بين صفحاته.</p></div><BookLibrary/></div></section>

    <section className="feature-story" aria-label="رواية وريث العهد"><div className="container feature-grid"><div className="feature-cover"><Book3D cover="/media/warith.jpg" title="وريث العهد" accent="#78674e" variant="feature" /></div><div className="feature-copy"><span className="eyebrow">من عوالم الفانتازيا · 2026</span><span className="small-star">✦</span><h2>وريث <em>العهد</em></h2><p>حين تتشابك الأقدار مع العهود، وتُختبر إرادة الإنسان أمام ما كُتب له وما يختار أن يكونه. عالم من الأسرار والصراعات ينتظر مَن يفتح بابه.</p><div className="feature-meta"><span>رواية فانتازيا</span><span>218 صفحة PDF</span></div><Link href="/read/warith-al-ahd" className="btn btn-gold">اقرأ رواية وريث العهد <ArrowLeft size={18}/></Link></div></div></section>

    <section className="section about-section" id="about"><div className="container about-grid"><div className="about-art"><div className="about-image"><img src="/media/author.jpg" alt="صورة هاشم خالد شطير"/></div><div className="about-stamp"><Feather size={25}/><span>الكلمة أثر</span></div></div><div className="about-copy"><span className="eyebrow">02 — وراء الكلمات</span><h2>الإنسانُ <em>قبل الحكاية.</em></h2><p>هاشم خالد شطير، كاتب وروائي يمني، تخرّج في كلية الصيدلة، لكن شغفه بالقراءة والأدب ظل رفيقًا له، يفتح أمامه أبوابًا أخرى لفهم الإنسان وعوالمه الخفية.</p><p>لا ينظر إلى الكتابة باعتبارها مجرّد حكايات تُروى، بل بوصفها محاولة لفهم الحياة من زوايا مختلفة، والاقتراب من الإنسان في لحظات ضعفه وتناقضه.</p><Link href="/about" className="text-link">اقرأ السيرة الكاملة <ArrowLeft size={18}/></Link></div></div></section>

    <section className="section quotes-section" id="quotes"><div className="container"><div className="section-heading center-heading"><span className="eyebrow">03 — من دفتر الكاتب</span><h2>كلماتٌ <em>تبقى.</em></h2><p>شذرات من الحياة والحب والفقد، تُقرأ بعينٍ وتبقى في القلب.</p></div><QuoteExplorer/></div></section>

    <section className="journal-home-banner"><div className="container journal-home-inner"><div className="journal-home-mark"><PenLine size={43} strokeWidth={1}/></div><div><span className="eyebrow">04 — على هامش الرواية</span><h2>ومن الكلمات ما لا <em>ينتهي.</em></h2><p>ثمة أفكار لا تسكن الكتب وحدها. من هنا، يفتح الكاتب دفتره للنصوص والتأملات التي تولد بين حكاية وأخرى.</p></div><Link href="/journal" className="btn btn-outline">مدونتي الأدبية <ArrowLeft size={18}/></Link></div></section>

    <section className="connect-section" id="contact"><div className="container connect-inner"><Sparkles className="connect-spark" size={30} strokeWidth={1}/><span className="eyebrow">05 — لنبقَ على اتصال</span><h2>قد تبدأ الحكايةُ <em>برسالة.</em></h2><p>للتواصل مع الكاتب، أو متابعة جديد مؤلفاته واقتباساته، ستجدونه هنا.</p><div className="social-buttons"><a href="https://www.instagram.com/7wa_h9/" target="_blank" rel="noopener noreferrer" aria-label="حساب الكاتب على إنستغرام 7wa_h9"><Instagram size={20}/> إنستغرام <ArrowUpLeft size={15}/></a><a href="https://t.me/H7wa_ha" target="_blank" rel="noopener noreferrer"><Send size={20}/> تلجرام <ArrowUpLeft size={15}/></a><a href="https://wa.me/967774722669" target="_blank" rel="noopener noreferrer"><BookOpen size={20}/> واتساب <ArrowUpLeft size={15}/></a></div></div></section>
  </main>;
}
