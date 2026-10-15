/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('node:fs');
const assert = require('node:assert/strict');
const xml = fs.readFileSync('out/sitemap.xml', 'utf8');
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
for (const url of urls) {
  const pathname = new URL(url).pathname;
  const file = 'out' + (pathname === '/' ? '/index' : pathname) + '.html';
  assert.ok(fs.existsSync(file), 'Missing export: ' + url);
  const html = fs.readFileSync(file, 'utf8');
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)].map(match => match[1]);
  assert.equal(canonicals.length, 1, url);
  assert.equal(canonicals[0].replace(/\/$/, ''), url.replace(/\/$/, ''), url);
  assert.ok(!/<meta name="robots" content="[^"]*noindex/.test(html), url);
}
for (const slug of ['20kb', '100kb', '250kb', '1mb']) {
  const route = '/resize-image-to-' + slug;
  assert.ok(urls.includes('https://resizefox.com' + route));
  const html = fs.readFileSync('out' + route + '.html', 'utf8');
  assert.ok(html.includes('A measured compression example'));
  for (const href of [...html.matchAll(/href="(\/[^"?#]*)"/g)].map(match => match[1])) {
    if (href.startsWith('/_next/')) continue;
    assert.ok(fs.existsSync('out' + href) || fs.existsSync('out' + href + '.html'), 'Broken internal link: ' + href);
  }
}
assert.ok(fs.readFileSync('out/robots.txt', 'utf8').includes('https://resizefox.com/sitemap.xml'));
console.log(`PASS ${urls.length} sitemap exports, unique canonical URLs, index directives, four benchmark sections and their internal links`);
