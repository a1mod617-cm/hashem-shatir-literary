"use client";
import { useState } from "react";
import { Images, Rotate3D } from "lucide-react";
import type { Book } from "../data";
import Book3D from "./Book3D";
export default function CoverGallery({book}:{book:Book}){
  const pictures=[{src:book.cover,label:"الغلاف الأمامي"},...(book.gallery??[])];
  const [active,setActive]=useState(0);
  const [flipped,setFlipped]=useState(false);
  const back=book.gallery?.find(item=>item.label.includes("الخلفي"))?.src;
  return <div className="cover-gallery"><div className="cover-gallery-stage">
      {active===0?<Book3D cover={book.cover} title={book.title} back={back} accent={book.color} flipped={flipped} variant="detail" />:<img key={pictures[active].src} src={pictures[active].src} alt={`${book.title} — ${pictures[active].label}`} className={pictures[active].label.includes("خريطة")?"landscape":""}/>}
      {active===0&&<button className="book3d-turn" type="button" onClick={()=>setFlipped(value=>!value)} aria-label={flipped?"إعادة الغلاف للأمام":"تدوير المجسم لرؤية خلف الكتاب"} aria-pressed={flipped}><Rotate3D size={17}/>{flipped?"العودة للغلاف":"دوّر الكتاب"}</button>}
      <div className="cover-gallery-label"><Images size={15}/>{flipped&&active===0?"الجهة الخلفية":pictures[active].label}</div>
    </div>
    <div className="cover-thumbs">{pictures.map((picture,i)=><button key={picture.src} className={active===i?"active":""} onClick={()=>{setActive(i);setFlipped(false)}} aria-pressed={active===i} aria-label={`اعرض ${picture.label}`}><img src={picture.src} alt=""/><span>{picture.label}</span></button>)}</div>
  </div>
}
