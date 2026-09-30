/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const base = process.env.TEST_BASE_URL || 'http://localhost:3022';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route(/^https?:\/\//, route => new URL(route.request().url()).origin === new URL(base).origin ? route.continue() : route.abort());
    await page.goto(base + '/resize-image');
    const image = await page.evaluate(() => {
      const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 400;
      const ctx = canvas.getContext('2d'); ctx.fillStyle = 'orange'; ctx.fillRect(50, 50, 700, 300);
      return canvas.toDataURL('image/png').split(',')[1];
    });
    const upload = () => page.locator('input[type=file]').setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer: Buffer.from(image, 'base64') });
    const exportResult = async () => {
      await page.getByRole('button', { name: 'Resize Image', exact: true }).click();
      await page.getByRole('button', { name: 'Download Image', exact: true }).waitFor();
      return page.getByAltText('Processed image preview').evaluate(async element => {
        const blob = await (await fetch(element.src)).blob();
        const image = await createImageBitmap(blob);
        const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
        const ctx = canvas.getContext('2d'); ctx.drawImage(image, 0, 0);
        return { width: image.width, height: image.height, type: blob.type, alpha: ctx.getImageData(0, 0, 1, 1).data[3] };
      });
    };
    await upload();
    await page.getByLabel('Width', { exact: true }).waitFor();
    await page.getByRole('button', { name: '50%', exact: true }).click();
    assert.equal(await page.getByLabel('Width', { exact: true }).inputValue(), '400');
    assert.equal(await page.getByLabel('Height', { exact: true }).inputValue(), '200');
    let result = await exportResult();
    assert.deepEqual(result, { width: 400, height: 200, type: 'image/jpeg', alpha: 255 });
    await page.getByLabel('Width', { exact: true }).fill('200');
    assert.equal(await page.getByRole('button', { name: 'Download Image', exact: true }).count(), 0);
    assert.equal(await page.getByLabel('Height', { exact: true }).inputValue(), '100');
    for (const format of ['image/png', 'image/webp']) {
      await page.getByLabel('Output format', { exact: true }).selectOption(format);
      result = await exportResult();
      assert.equal(result.type, format); assert.equal(result.alpha, 0);
    }
    await page.getByLabel('Dimension preset').selectOption('1080x1920');
    assert.equal(await page.getByLabel('Maintain aspect ratio').isChecked(), false);
    assert.equal(await page.getByLabel('Height', { exact: true }).inputValue(), '1920');
    await page.getByLabel('Width', { exact: true }).fill('8193');
    await page.getByRole('button', { name: 'Resize Image', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Use dimensions' }).waitFor();
    await page.getByRole('button', { name: 'Change Image', exact: true }).click();
    await page.locator('input[type=file]').setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('invalid image') });
    await page.getByRole('status').filter({ hasText: 'could not be read' }).waitFor();
    await upload();
    await page.getByLabel('Width', { exact: true }).waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    const schema = await page.locator('script[type="application/ld+json"]').allTextContents();
    const faq = schema.map(JSON.parse).find(item => item['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 5);
    for (const item of faq.mainEntity) assert.ok(await page.getByText(item.name, { exact: true }).count());
    // PNG compression must report actual downscaled dimensions, not input values.
    await page.goto(base + '/compress-image');
    const texture = await page.evaluate(() => {
      const c = document.createElement('canvas'); c.width = 400; c.height = 300;
      const ctx = c.getContext('2d'), pixels = ctx.createImageData(400, 300);
      let seed = 42;
      for (let i = 0; i < pixels.data.length; i += 4) {
        seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
        pixels.data.set([seed & 255, (seed >>> 8) & 255, (seed >>> 16) & 255, 255], i);
      }
      ctx.putImageData(pixels, 0, 0); return c.toDataURL().split(',')[1];
    });
    await page.locator('input[type=file]').setInputFiles({ name: 'texture.png', mimeType: 'image/png', buffer: Buffer.from(texture, 'base64') });
    await page.getByLabel('Output format', { exact: true }).selectOption('image/png');
    await page.getByLabel('Custom size (KB)').fill('10');
    await page.getByRole('button', { name: 'Compress Image', exact: true }).click();
    await page.getByRole('button', { name: 'Download Image', exact: true }).waitFor();
    const compressed = await page.getByAltText('Processed image preview').evaluate(async element => {
      const blob = await (await fetch(element.src)).blob(); const image = await createImageBitmap(blob);
      return { width: image.width, height: image.height, size: blob.size };
    });
    assert.ok(compressed.width < 400 && compressed.size <= 10240);
    await page.getByText(`Result dimensions: ${compressed.width} × ${compressed.height}px`, { exact: true }).waitFor();
    assert.deepEqual(errors, []);
    console.log('PASS real Canvas exports, transparency, percentage, ratio, stale result, presets, bounds, invalid-file recovery, mobile, FAQ and PNG compression dimensions');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
