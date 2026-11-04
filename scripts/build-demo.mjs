// Builds the clickable demo into docs/ (served by GitHub Pages).
// It takes the real app page from public/, swaps the Firebase connection for demo-src/demo-db.js
// (sample data kept in the browser), and makes paths relative so it works under /kahekesi-demo/.
// Run: node scripts/build-demo.mjs
import {readFileSync, writeFileSync, mkdirSync, cpSync, rmSync} from 'node:fs';

const root = new URL('..', import.meta.url).pathname;
const out = root + 'docs/';
rmSync(out, {recursive: true, force: true});
mkdirSync(out, {recursive: true});

let html = readFileSync(root + 'public/index.html', 'utf8');
const swap = (from, to) => {
  if (!html.includes(from)) throw new Error('Could not find: ' + from);
  html = html.split(from).join(to);
};
swap('<script type="module" src="/kk-firebase.js"></script>', '<script type="module" src="demo-db.js"></script>');
swap('href="/manifest.webmanifest"', 'href="manifest.webmanifest"');
swap('href="/icons/', 'href="icons/');
// The app resets the address to "/" after reading ?tab=; on GitHub Pages it lives in a sub-folder.
swap(",'','/')", ",'',location.pathname)");
html = html.replace('<title>', '<meta name="robots" content="noindex">\n<title>');
writeFileSync(out + 'index.html', html);

const manifest = JSON.parse(readFileSync(root + 'public/manifest.webmanifest', 'utf8'));
manifest.name = 'Kahekesi (demo)';
manifest.start_url = './';
manifest.scope = './';
for (const i of manifest.icons) i.src = i.src.replace(/^\//, '');
writeFileSync(out + 'manifest.webmanifest', JSON.stringify(manifest, null, 2) + '\n');

cpSync(root + 'public/icons', out + 'icons', {recursive: true});
cpSync(root + 'demo-src/demo-db.js', out + 'demo-db.js');
writeFileSync(out + '.nojekyll', '');
console.log('Demo built in docs/');
