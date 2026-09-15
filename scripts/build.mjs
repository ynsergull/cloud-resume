import { mkdir, writeFile, cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderPage } from '../src/components/page.mjs';
import { locales } from '../src/data/copy.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = path.join(root, 'dist');
await mkdir(output, { recursive: true });
await cp(path.join(root, 'public'), output, { recursive: true });
await cp(path.join(root, 'src/client'), path.join(output, 'js'), { recursive: true });
await mkdir(path.join(output, 'css'), { recursive: true });
await cp(path.join(root, 'src/styles/style.css'), path.join(output, 'css/style.css'));

for (const language of locales) {
  const directory = language === 'tr' ? output : path.join(output, language);
  await mkdir(directory, { recursive: true });
  await writeFile(path.join(directory, 'index.html'), renderPage(language));
}
console.log(`Built ${locales.length} static pages in dist/.`);
