import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync("app/data.ts", "utf8");
const entries = [...source.matchAll(/slug:\s*"([a-z0-9-]+)"[\s\S]*?pages:\s*(\d+),/g)];
if (entries.length !== 4) throw Error(`Expected four original books; found ${entries.length}`);

let checkedPages = 0;
for (const [, slug, countText] of entries) {
  const pageCount = Number(countText);
  const pdf = join("public/books", `${slug}.pdf`);
  if (!existsSync(pdf) || statSync(pdf).size < 1000 || readFileSync(pdf).toString("ascii", 0, 5) !== "%PDF-") {
    throw Error(`Missing or invalid PDF: ${pdf}`);
  }
  for (let page = 1; page <= pageCount; page++) {
    const file = join("public/pages", slug, `${String(page).padStart(3, "0")}.webp`);
    if (!existsSync(file) || statSync(file).size < 100) throw Error(`Missing or empty reader page: ${file}`);
    const data = readFileSync(file);
    if (data.toString("ascii", 0, 4) !== "RIFF" || data.toString("ascii", 8, 12) !== "WEBP") {
      throw Error(`Invalid WebP page: ${file}`);
    }
    checkedPages++;
  }
  process.stdout.write(`✓ ${slug}: ${pageCount} pages and PDF ready\n`);
}
if (readFileSync("app/page.tsx", "utf8").includes("instagram.com/7wa_h/")) throw Error("Outdated Instagram link found");
for (const file of ["public/robots.txt", "public/sitemap.xml", "app/privacy/page.tsx"]) {
  if (!existsSync(file)) throw Error(`Missing release document: ${file}`);
}
process.stdout.write(`✓ Release assets verified: ${entries.length} books, ${checkedPages} reader pages.\n`);
