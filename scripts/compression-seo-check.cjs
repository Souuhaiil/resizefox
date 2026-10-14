/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const base = process.env.TEST_BASE_URL || 'http://127.0.0.1:3022';
const evidence = process.env.EVIDENCE_DIR || 'test-results/compression';
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
(async () => {
  fs.mkdirSync(evidence, { recursive: true });
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(/^https?:\/\//, route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.goto(base + '/resize-image-to-20kb');
    // Seeded synthetic fixture; not a photograph or a claim about typical quality.
    const fixtures = await page.evaluate(() => {
      const c = document.createElement('canvas'); c.width = 1600; c.height = 1200;
      const ctx = c.getContext('2d'); const pixels = ctx.createImageData(c.width, c.height);
      let seed = 42;
      for (let i = 0; i < pixels.data.length; i += 4) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        pixels.data.set([seed & 255, seed >>> 8 & 255, seed >>> 16 & 255, 255], i);
      }
      ctx.putImageData(pixels, 0, 0); ctx.clearRect(0, 0, 80, 80);
      const large = Object.fromEntries(['png', 'jpeg', 'webp'].map(type => [type, c.toDataURL('image/' + type, 1).split(',')[1]]));
      c.width = 40; c.height = 30;
      ctx.fillStyle = '#ff6600'; ctx.fillRect(10, 10, 20, 10);
      return { large, tiny: c.toDataURL().split(',')[1] };
    });
    for (const [slug, kb] of [['20kb', 20], ['100kb', 100], ['250kb', 250], ['1mb', 1024]]) {
      const route = '/resize-image-to-' + slug;
      assert.equal((await page.goto(base + route)).status(), 200);
      assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'), 'https://resizefox.com' + route);
      assert.equal(await page.locator('h1').count(), 1);
      assert.ok(await page.locator('a[href="/compression-lab"]').count());
      assert.ok(await page.locator('a[href="/compress-image"]').count());
      for (const type of ['png', 'jpeg', 'webp', 'tiny']) {
        if (type !== 'png') await page.getByRole('button', { name: 'Choose Another Image', exact: true }).click();
        const input = Buffer.from(type === 'tiny' ? fixtures.tiny : fixtures.large[type], 'base64');
        const mimeType = 'image/' + (type === 'tiny' ? 'png' : type);
        if (type !== 'tiny') assert.ok(input.length > kb * 1024, `${type} must exercise compression at ${slug}`);
        await page.locator('input[type=file]').setInputFiles({ name: type + '.png', mimeType, buffer: input });
        const started = Date.now();
        await page.getByRole('button', { name: 'Compress Image to ' + slug.toUpperCase(), exact: true }).click();
        await page.getByRole('button', { name: 'Download Image', exact: true }).waitFor({ timeout: 60000 });
        const elapsedMs = Date.now() - started;
        const actual = await page.getByAltText('Result preview — inspect detail and background before downloading').evaluate(async img => {
          const blob = await (await fetch(img.src)).blob(); const bitmap = await createImageBitmap(blob);
          const canvas = document.createElement('canvas'); canvas.width = bitmap.width; canvas.height = bitmap.height;
          const ctx = canvas.getContext('2d'); ctx.drawImage(bitmap, 0, 0);
          return { bytes: Array.from(new Uint8Array(await blob.arrayBuffer())), mime: blob.type, width: bitmap.width, height: bitmap.height, pixel: Array.from(ctx.getImageData(0, 0, 1, 1).data) };
        });
        const output = Buffer.from(actual.bytes);
        assert.ok(output.length <= kb * 1024);
        assert.ok(actual.width > 0 && actual.height > 0);
        assert.equal(actual.mime, type === 'tiny' ? 'image/png' : type === 'webp' ? 'image/webp' : 'image/jpeg');
        if (type === 'tiny') { assert.deepEqual(output, input); assert.equal(actual.pixel[3], 0); }
        else { assert.ok(actual.width <= 1600 && actual.height <= 1200); if (type === 'png') assert.ok(actual.pixel.every(value => value >= 245)); }
        await page.getByText(`Exact size: ${output.length.toLocaleString('en-US')} bytes`, { exact: false }).waitFor();
        await page.getByText(`Dimensions: ${actual.width} × ${actual.height}px.`, { exact: false }).waitFor();
        const downloadEvent = page.waitForEvent('download');
        await page.getByRole('button', { name: 'Download Image', exact: true }).click();
        const download = await downloadEvent;
        const exportedPath = path.join(evidence, `${slug}-${type}-${download.suggestedFilename()}`);
        await download.saveAs(exportedPath);
        assert.deepEqual(fs.readFileSync(exportedPath), output);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        if (type === 'png') await page.screenshot({ path: path.join(evidence, slug + '-mobile.png'), fullPage: true });
        results.push({ target: slug, fixture: type, inputBytes: input.length, outputBytes: output.length, width: actual.width, height: actual.height, mime: actual.mime, elapsedMs, inputSHA256: hash(input), outputSHA256: hash(output) });
      }
      await page.getByRole('button', { name: 'Choose Another Image', exact: true }).click();
      await page.locator('input[type=file]').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('broken') });
      await page.getByRole('button', { name: 'Compress Image to ' + slug.toUpperCase(), exact: true }).click();
      await page.getByText('Something went wrong while compressing the image.').waitFor();
      assert.equal(await page.getByRole('button', { name: 'Download Image', exact: true }).count(), 0);
    }
    assert.deepEqual(errors, []);
    fs.writeFileSync(path.join(evidence, 'measurements.json'), JSON.stringify({ date: new Date().toISOString(), browser: browser.version(), base, fixture: 'Seed 42 synthetic 1600x1200 noise, transparent corner; tiny 40x30 PNG', results }, null, 2));
    console.log(JSON.stringify(results, null, 2));
    console.log('PASS 16 real downloads, 4 invalid inputs, exact bytes, dimensions, formats, transparency, mobile width and canonical URLs');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
