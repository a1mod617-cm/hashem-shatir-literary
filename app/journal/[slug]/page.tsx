import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "../../components/NativeLink";
import { ArrowRight, Feather } from "lucide-react";
import { getPublishedArticle } from "../../lib/journal";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedArticle(slug);
  return { title: post?.title ?? "مقال", description: post?.excerpt };
}

export default async function JournalArticle({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedArticle(slug);
  if (!post) notFound();
  const paragraphs = post.body.split(/\n\s*\n/).map(text => text.trim()).filter(Boolean);
  return <main>
    <section className="page-top journal-article-head"><div className="container"><div className="breadcrumb"><Link href="/">الرئيسية</Link> / <Link href="/journal">المدونة</Link> / {post.category}</div><span className="eyebrow" style={{marginTop:27}}>{post.category} · {new Date(post.createdAt).toLocaleDateString("ar-YE")}</span><h1>{post.title}</h1><p>{post.excerpt}</p></div></section>
    <article className="content-section"><div className="container"><div className="journal-article-body">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="journal-signature"><Feather size={20}/> هاشم خالد شطير</div></div><Link href="/journal" className="text-link"><ArrowRight size={17}/> العودة إلى جميع المقالات</Link></div></article>
  </main>;
}
