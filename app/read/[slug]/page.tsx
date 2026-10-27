import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { books } from "../../data";
import { getBook } from "../../lib/books";
import Reader from "../../components/Reader";
export const metadata:Metadata={title:"القراءة الإلكترونية"};
export const dynamic="force-dynamic";
export function generateStaticParams(){return books.map(book=>({slug:book.slug}))}
export default async function ReadBook({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const book=await getBook(slug);
  if(!book)notFound();
  return <Reader book={book}/>;
}
