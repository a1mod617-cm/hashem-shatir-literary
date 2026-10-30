// Prepare the already-published, self-contained book site for Vercel.
// GitHub remains the source of truth; this does not modify the source files.
import { execFileSync } from 'node:child_process';
import { rm, stat } from 'node:fs/promises';

const output = 'vercel-static-output';
const repository = 'https://github.com/a1mod617-cm/hashem-shatir-literary.git';
execFileSync('git', ['clone', '--depth', '1', '--single-branch', '--branch', 'portable-site', repository, output], {
  stdio: 'inherit',
  timeout: 180_000,
});

await rm(`${output}/.git`, { recursive: true, force: true });

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
