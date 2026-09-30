import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';
const directory = path.dirname(fileURLToPath(import.meta.url));
(async () => {
  const from = path.join(directory, 'input.css');
  const to = path.join(directory, 'styles.css');
  const result = await postcss([tailwind({ base: directory, optimize: true })])
    .process(await fs.readFile(from, 'utf8'), { from, to });
  await fs.writeFile(to, result.css);
  console.log('styles.css généré');
})().catch((error) => { console.error(error); process.exitCode = 1; });
