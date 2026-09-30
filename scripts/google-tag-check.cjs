/* eslint-disable @typescript-eslint/no-require-imports */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const assert = require('node:assert/strict');
(async () => {
  const base = process.env.TEST_BASE_URL || 'http://localhost:3022';
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    let loaders = 0;
    await page.route(/^https?:\/\//, route => {
      const url = new URL(route.request().url());
      if (url.hostname === 'pagead2.googlesyndication.com') return route.fulfill({
        contentType: 'application/javascript',
        body: 'window.__adsenseSawDefaults = window.dataLayer?.[0]?.[0] === "consent" && window.dataLayer?.[0]?.[1] === "default";',
      });
      if (url.hostname === 'www.googletagmanager.com' && url.pathname === '/gtag/js') loaders++;
      return url.origin === new URL(base).origin ? route.continue()
        : route.fulfill({ contentType: 'application/javascript', body: '/* Stub: no test traffic */' });
    });
    await page.addInitScript(() => {
      window.__cmpValues = {};
      window.__revoked = 0;
      window.googlefc = {
        getGoogleConsentModeValues: () => window.__cmpValues,
        showRevocationMessage: () => window.__revoked++,
        callbackQueue: { push(entry) {
          if (typeof entry === 'function') entry();
          else Object.values(entry).forEach(callback => callback());
        } },
      };
      window.__tcfapi = (command, version, callback) => { window.__consentChanged = callback; };
      window.__decide = value => {
        window.__cmpValues = {
          adStoragePurposeConsentStatus: value, analyticsStoragePurposeConsentStatus: value,
          adUserDataPurposeConsentStatus: value, adPersonalizationPurposeConsentStatus: value,
        };
        window.__consentChanged({ eventStatus: 'useractioncomplete' }, true);
      };
    });
    await page.goto(base);
    await page.waitForFunction(() => !!window.resizefoxConsent);
    await page.waitForFunction(() => window.__adsenseSawDefaults === true);
    assert.equal(loaders, 0);
    for (const status of [2, 4, 0]) {
      await page.evaluate(status => window.__decide(status), status);
      await page.waitForTimeout(50);
      assert.equal(loaders, 0, 'denied/unconfigured/unknown must block measurement');
    }
    await page.evaluate(() => {
      window.__decide(1);
      window.__cmpValues.analyticsStoragePurposeConsentStatus = 2;
    });
    await page.waitForTimeout(50);
    assert.equal(loaders, 0, 'partial grant stays blocked');
    await page.evaluate(() => window.__decide(1));
    await page.waitForFunction(() => !!document.getElementById('google-tag'));
    await page.waitForTimeout(50);
    const commands = await page.evaluate(() => window.dataLayer.map(entry => Array.from(entry)));
    assert.deepEqual(commands[0], ['consent', 'default', {
      ad_storage: 'denied', analytics_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    }]);
    for (const id of ['G-64KRV3M9TN', 'AW-17041135809']) assert.equal(commands.filter(c => c[0] === 'config' && c[1] === id).length, 1);
    assert.equal(loaders, 1);
    await page.locator('a[href="/resize-image"]').first().click();
    await page.waitForURL(base + '/resize-image');
    assert.equal(loaders, 1);
    await page.getByRole('button', { name: 'Privacy and cookie settings', exact: true }).click();
    assert.equal(await page.evaluate(() => window.__revoked), 1);
    assert.equal(await page.evaluate(() => window['ga-disable-G-64KRV3M9TN']), true);
    assert.equal(await page.evaluate(() => window.dataLayer.at(-1)[2].analytics_storage), 'denied');
    await page.evaluate(() => window.__decide(2));
    await page.waitForTimeout(50);
    assert.equal(await page.evaluate(() => window['ga-disable-G-64KRV3M9TN']), true);
    await page.evaluate(() => window.__decide(1));
    await page.waitForFunction(() => window['ga-disable-G-64KRV3M9TN'] === false);
    assert.equal(loaders, 1);
    console.log('PASS consent defaults, missing/denied/unconfigured/partial consent, grant, navigation, revocation and re-grant without duplicate tags');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
