import { checkAdmin } from "../../lib/admin";
import BookEditor from "../../components/BookEditor";
import NewBookForm from "../../components/NewBookForm";
import Link from "../../components/NativeLink";
export const dynamic="force-dynamic";
export default async function AdminBooks(){const {isAdmin}=await checkAdmin();return <main><section className="page-top"><div className="container"><span className="eyebrow">لوحة الإدارة</span><h1>إدارة <em>المؤلفات</em></h1><Link href="/admin" className="back-link">العودة للوحة الإدارة</Link></div></section><section className="content-section"><div className="container">{isAdmin?<><BookEditor/><NewBookForm/></>:<div className="notice">لا تمتلك صلاحية الوصول إلى هذه الصفحة. يرجى تسجيل الدخول بحساب المشرف المعتمد.</div>}</div></section></main>}
