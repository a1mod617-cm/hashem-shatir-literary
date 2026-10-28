import type { Metadata } from "next";
import Link from "../components/NativeLink";

export const metadata: Metadata = { title: "سياسة الخصوصية" };

export default function PrivacyPage() {
  return <main>
    <section className="page-top"><div className="container"><span className="eyebrow">خصوصيتك تهمنا</span><h1>سياسة <em>الخصوصية</em></h1><p>كيف نتعامل مع قراءتك وآرائك على هذا الموقع.</p></div></section>
    <section className="content-section"><div className="container" style={{maxWidth:820,lineHeight:2.1}}>
      <h2>حفظ موضع القراءة</h2><p>يُحفظ آخر رقم صفحة وإعدادات القراءة والكتب التي أنهيتها داخل متصفحك على هذا الجهاز فقط، عبر التخزين المحلي. لا يلزم إنشاء حساب لقراءة المؤلفات، وقد تختفي هذه المعلومات عند مسح بيانات المتصفح أو استخدام جهاز آخر.</p>
      <h2 style={{marginTop:28}}>آراء القرّاء والتقييمات</h2><p>عندما ترسل رأيًا، نحفظ الاسم الذي اخترته والتقييم ونص الرأي وعنوان الكتاب المرتبط به ووقت الإرسال، لمراجعته قبل عرضه للزوار. لا تنشر في رأيك معلومات شخصية لا ترغب في مشاركتها علنًا. تُعرض الآراء المقبولة فقط، ويمكن للمشرف رفض أو إخفاء أي رأي.</p>
      <h2 style={{marginTop:28}}>الروابط الخارجية</h2><p>قد تنقلك أزرار التواصل إلى إنستغرام أو تلجرام أو واتساب. يخضع استخدام تلك الخدمات لسياسات الخصوصية الخاصة بها.</p>
      <h2 style={{marginTop:28}}>التواصل بشأن رأيك</h2><p>لطلب مراجعة رأي منشور أو إزالته، تواصل مع صاحب الموقع عبر <a href="https://www.instagram.com/7wa_h9/" target="_blank" rel="noopener noreferrer" style={{textDecoration:"underline"}}>حسابه الرسمي على إنستغرام</a>، وحدد الكتاب واسم العرض المستخدم في الرأي.</p>
      <div style={{marginTop:32}}><Link href="/" className="btn btn-outline">العودة إلى الرئيسية</Link></div>
    </div></section>
  </main>;
}
