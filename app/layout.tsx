import type { Metadata } from "next";
import Link from "./components/NativeLink";
import { Feather, Heart } from "lucide-react";
import Header from "./components/Header";
import ScrollExperience from "./components/ScrollExperience";
import "./globals.css";
import "./literary.css";
import "./journal.css";
import "./motion.css";
import "./shelf.css";
import "./admin.css";
import "./refinement.css";
import "./reader.css";
import "./ebook-reader.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://hashem-shatir-literary.prettybard17.chatgpt.site"),
  title: { default: "هاشم خالد شطير | الموقع الأدبي", template: "%s | هاشم خالد شطير" },
  description: "الموقع الأدبي للكاتب والروائي اليمني هاشم خالد شطير. اقرأ رواياته وكتبه، واكتشف اقتباساته وعالمه الأدبي.",
  openGraph: { title: "هاشم خالد شطير | عالم من الحكايات", description: "حكايات تُقرأ، وأثرٌ يبقى بعد الصفحة الأخيرة.", images: ["/media/warith.jpg"], locale: "ar_YE", type: "website" },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) {
  return <html lang="ar" dir="rtl"><body><ScrollExperience/><Header/>{children}<footer className="site-footer"><div className="container footer-inner"><Link href="/" className="footer-brand"><Feather size={22}/><span>هاشم خالد شطير<small>عالمٌ من الحكايات</small></span></Link><p>«بعض الكلمات تظل حيّةً فينا طويلًا.»</p><span className="footer-copy">© {new Date().getFullYear()} هاشم خالد شطير · جميع الحقوق محفوظة <Heart size={12}/></span><Link href="/privacy" className="footer-copy">سياسة الخصوصية</Link></div></footer></body></html>;
}
