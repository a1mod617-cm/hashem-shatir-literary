"use client";
import { useEffect, useState } from "react";
import { Star, Send } from "lucide-react";
type Review={id:string;name:string;rating:number;content:string;createdAt:number};
export default function Reviews({bookSlug}:{bookSlug:string}){
  const [items,setItems]=useState<Review[]>([]);
  const [name,setName]=useState("");
  const [content,setContent]=useState("");
  const [rating,setRating]=useState(5);
  const [message,setMessage]=useState("");
  const [loading,setLoading]=useState(false);
  const [unavailable,setUnavailable]=useState(false);

  useEffect(()=>{
    let cancelled=false;
    fetch(`/api/reviews?book=${encodeURIComponent(bookSlug)}`)
      .then(response=>response.json() as Promise<{reviews?:Review[];unavailable?:boolean}>)
      .then(data=>{if(!cancelled){setItems(data.reviews??[]);setUnavailable(Boolean(data.unavailable))}})
      .catch(()=>{if(!cancelled)setUnavailable(true)});
    return()=>{cancelled=true};
  },[bookSlug]);

  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const website=String(new FormData(event.currentTarget).get("website")??"");
    setLoading(true);setMessage("");
    try{
      const response=await fetch("/api/reviews",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({bookSlug,name,content,rating,website})});
      const data=await response.json() as {message?:string;error?:string};
      setMessage(data.message||data.error||"حدث خطأ");
      if(response.ok){setName("");setContent("");setRating(5);setUnavailable(false)}
    }catch{setMessage("تعذر الاتصال بالخدمة الآن.")}
    finally{setLoading(false)}
  }

  return <div className="review-box">
    <form className="review-form" onSubmit={submit}>
      <label>اسمك أو اسم مستعار<input value={name} onChange={event=>setName(event.target.value)} minLength={2} maxLength={60} required placeholder="اكتب اسمك"/></label>
      <label>كيف تقيم هذا الكتاب؟</label>
      <div className="stars">{[1,2,3,4,5].map(n=><button type="button" key={n} className={n<=rating?"selected":""} onClick={()=>setRating(n)} aria-pressed={n===rating} aria-label={`${n} نجوم`}><Star size={25} fill={n<=rating?"currentColor":"none"}/></button>)}</div>
      <label>رأيك في الكتاب<textarea value={content} onChange={event=>setContent(event.target.value)} minLength={10} maxLength={1200} required placeholder="ماذا تركت هذه الحكاية في نفسك؟"/></label>
      <input aria-hidden="true" tabIndex={-1} autoComplete="off" name="website" style={{position:"absolute",left:"-9999px"}}/>
      <p className="muted" style={{fontSize:12,lineHeight:1.8}}>سيظهر اسمك المستعار ورأيك للقرّاء بعد موافقة المشرف.</p>
      <button type="submit" disabled={loading} className="btn btn-gold"><Send size={16}/>{loading?"جاري الإرسال...":"أرسل رأيك"}</button>
      {message&&<div className="notice" role="status">{message}</div>}
    </form>
    <div className="review-items">
      {unavailable&&<div className="notice" role="status">عرض الآراء غير متاح مؤقتًا. يمكنك المحاولة لاحقًا.</div>}
      {!unavailable && (items.length===0?<div className="review-item muted">كن أول من يشارك انطباعه عن هذا العمل.</div>:items.map(review=><article className="review-item" key={review.id}><div className="top"><strong>{review.name}</strong><span>{"★".repeat(review.rating)}{"☆".repeat(5-review.rating)}</span></div><p>{review.content}</p></article>))}
    </div>
  </div>;
}
