/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { pathToFileURL } = require('node:url');
const fs = require('node:fs');
(async () => {
  const { default: lighthouse } = await import(process.env.LIGHTHOUSE_MODULE ? pathToFileURL(process.env.LIGHTHOUSE_MODULE).href : 'lighthouse');
  const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--remote-debugging-port=9223'] });
  fs.mkdirSync('test-results/performance', { recursive: true });
  try {
    for (const slug of ['20kb', '100kb', '250kb', '1mb']) {
      const url = (process.env.TEST_BASE_URL || 'http://127.0.0.1:3022') + '/resize-image-to-' + slug;
      const { lhr } = await lighthouse(url, { port: 9223, output: 'json', onlyCategories: ['performance'], logLevel: 'error' });
      fs.writeFileSync(`test-results/performance/${slug}.json`, JSON.stringify(lhr, null, 2));
      if (lhr.runtimeError) throw new Error(JSON.stringify(lhr.runtimeError));
      console.log(JSON.stringify({ url, score: lhr.categories.performance.score, LCP: lhr.audits['largest-contentful-paint'].numericValue, CLS: lhr.audits['cumulative-layout-shift'].numericValue, TBT: lhr.audits['total-blocking-time'].numericValue, warnings: lhr.runWarnings }));
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
