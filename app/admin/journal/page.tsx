import type { Metadata } from "next";
import Link from "../../components/NativeLink";
import { checkAdmin } from "../../lib/admin";
import JournalEditor from "../../components/JournalEditor";

export const metadata: Metadata = { title: "تحرير المدونة", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminJournal() {
  const { isAdmin } = await checkAdmin();
  return <main>
    <section className="page-top"><div className="container"><span className="eyebrow">لوحة الإدارة</span><h1>دفتر <em>الكاتب</em></h1><p>اكتب مقالاتك وتأملاتك، احتفظ بمسوداتها، وانشرها عندما يحين وقتها.</p><Link href="/admin" className="back-link">العودة للوحة الإدارة</Link></div></section>
    <section className="content-section"><div className="container">{isAdmin ? <JournalEditor/> : <div className="notice">هذه الصفحة مخصصة للمشرف المعتمد.</div>}</div></section>
  </main>;
}
