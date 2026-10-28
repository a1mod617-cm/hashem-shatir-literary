import type { Metadata } from "next";
import Link from "../components/NativeLink";
import { LockKeyhole, BookOpen, MessageCircle, NotebookPen } from "lucide-react";
import { checkAdmin } from "../lib/admin";
import { chatGPTSignInPath } from "../chatgpt-auth";
import AdminDashboard from "../components/AdminDashboard";
export const metadata:Metadata={title:"لوحة إدارة الكاتب",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
export default async function Admin(){
  const {user,isAdmin,configured}=await checkAdmin();
  return <main><section className="page-top"><div className="container"><span className="eyebrow">لوحة إدارة محمية</span><h1>مساحة <em>الكاتب</em></h1><p>إدارة تفاعل القرّاء والمحتوى من مكان واحد.</p></div></section>
    <section className="content-section"><div className="container">{isAdmin?
      <><div className="detail-actions" style={{margin:"0 0 45px"}}><Link href="/admin/books" className="btn btn-gold"><BookOpen size={17}/> إدارة المؤلفات</Link><Link href="/admin/journal" className="btn btn-outline"><NotebookPen size={17}/> إدارة المدونة</Link><span className="btn btn-outline"><MessageCircle size={17}/> إدارة المراجعات ↓</span></div><AdminDashboard/></>
      :<div className="notice" style={{maxWidth:650,margin:"0 auto",textAlign:"center",padding:38}}><LockKeyhole size={32} style={{margin:"0 auto 18px"}}/><h2 style={{fontFamily:"Amiri",fontSize:31}}>هذه المساحة مخصصة لإدارة الموقع</h2><p style={{marginTop:12}}>{!user?"سجّل الدخول بحساب المشرف للوصول إلى لوحة الإدارة.":!configured?"سيتم تفعيل صلاحيات الإدارة بعد اعتماد البريد الإلكتروني للكاتب أو المشرف.":"هذا الحساب لا يمتلك صلاحيات الإدارة."}</p>{!user&&<a className="btn btn-gold" style={{marginTop:20}} href={chatGPTSignInPath("/admin")} target="_top">تسجيل الدخول</a>}</div>}
    </div></section></main>;
}
