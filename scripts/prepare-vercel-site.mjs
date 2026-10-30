// Prepare the already-published, self-contained book site for Vercel.
// GitHub remains the source of truth; this does not modify the source files.
import { execFileSync } from 'node:child_process';
import { rm, stat, copyFile, writeFile } from 'node:fs/promises';

const output = 'vercel-static-output';
const repository = 'https://github.com/a1mod617-cm/hashem-shatir-literary.git';
execFileSync('git', ['clone', '--depth', '1', '--single-branch', '--branch', 'portable-site', repository, output], {
  stdio: 'inherit',
  timeout: 180_000,
});

await rm(`${output}/.git`, { recursive: true, force: true });
// Vercel always serves the latest authored interface from main, even while
// the mirror's heavyweight 656-page rendering workflow is still catching up.
for (const name of ['index.html', 'style.css', 'app.js']) {
  await copyFile(`github-pages/${name}`, `${output}/${name}`);
}

// Serve branded discovery assets from the same public Vercel origin.
await copyFile('public/favicon.svg', `${output}/favicon.svg`);
await writeFile(`${output}/robots.txt`, `User-agent: *\nAllow: /\nSitemap: https://hashem-shatir-literary-a1mod617-cm.vercel.app/sitemap.xml\n`);
await writeFile(`${output}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://hashem-shatir-literary-a1mod617-cm.vercel.app/</loc></url></urlset>`);

for (const required of [
  'index.html',
  'app.js',
  'style.css',
  'books/12-12.pdf',
  'books/la-tuhaddiq-kathiran.pdf',
  'books/haribini-bisharaf.pdf',
  'books/warith-al-ahd.pdf',
  'pages/warith-al-ahd/218.webp',
]) {
  await stat(`${output}/${required}`);
}
console.log('Standalone author website and all required book assets are ready for Vercel.');
