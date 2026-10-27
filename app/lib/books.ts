import "server-only";
import { books, type Book } from "../data";
import { getDb } from "../../db";
import { bookOverrides, extraBooks } from "../../db/schema";
export async function getBooks():Promise<Book[]> {
  try { const changes=await getDb().select().from(bookOverrides);const more=await getDb().select().from(extraBooks);const originals=books.map(book=>{const item=changes.find(c=>c.slug===book.slug);return item?{...book,title:item.title,description:item.description,genre:item.genre}:book});return [...originals,...more.map(item=>({slug:item.slug,title:item.title,subtitle:item.subtitle??undefined,type:item.type,genre:item.genre,year:item.year,pages:item.pages,cover:item.cover,pdf:item.pdf,description:item.description,color:"#8c7156"}))]; }
  catch{return books;}
}
export async function getBook(slug:string){return (await getBooks()).find(book=>book.slug===slug)}
