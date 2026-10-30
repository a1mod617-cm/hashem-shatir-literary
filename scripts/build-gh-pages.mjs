/** Assemble a fully self-contained static site for GitHub Pages.
 * Run from repository root, after generating public/pages via render-book-pages.py.
 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root=resolve(import.meta.dirname,'..');
const dist=resolve(root,'gh-pages-dist');
const counts={'12-12':112,'haribini-bisharaf':173,'la-tuhaddiq-kathiran':153,'warith-al-ahd':218};
const base='https://a1mod617-cm.github.io/hashem-shatir-literary/';
await rm(dist,{recursive:true,force:true});
await mkdir(dist,{recursive:true});
for(const name of ['index.html','style.css','app.js'])await cp(resolve(root,'github-pages',name),resolve(dist,name));
for(const dir of ['books','media','pages'])await cp(resolve(root,'public',dir),resolve(dist,dir),{recursive:true});
await cp(resolve(root,'public','favicon.svg'),resolve(dist,'favicon.svg'));
for(const [slug,expected] of Object.entries(counts)){
  const list=(await readdir(resolve(dist,'pages',slug))).filter(x=>/^\d{3}\.webp$/.test(x));
  if(list.length!==expected)throw Error(`${slug}: expected ${expected} pages, found ${list.length}. Render first.`);
  const pdf=await readFile(resolve(dist,'books',`${slug}.pdf`));
  if(pdf.subarray(0,4).toString()!=='%PDF')throw Error(`${slug}: invalid PDF`);
}
await writeFile(resolve(dist,'.nojekyll'),'');
await writeFile(resolve(dist,'robots.txt'),`User-agent: *\nAllow: /\nSitemap: ${base}sitemap.xml\n`);
await writeFile(resolve(dist,'sitemap.xml'),`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${base}</loc></url></urlset>`);
const source=(await readFile(resolve(dist,'index.html'),'utf8'));
if(source.includes('chatgpt.site'))throw Error('Unexpected ChatGPT hosting reference');
console.log(`GitHub Pages site ready: ${dist}; ${Object.values(counts).reduce((a,b)=>a+b,0)} rendered pages.`);
