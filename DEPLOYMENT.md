# ResizeFox static hosting

Run `npm run build` to generate `out/`. Run `npm start -- --port 3018` to preview with Cloudflare Wrangler. `npm run dev` still starts Next.js development mode.

Cloudflare Workers Builds publishes the existing `resizefox` service from GitHub main with `npx wrangler deploy`. `wrangler.jsonc` builds and uploads `out/` as static assets. There is no runtime Worker script and no request-time Next.js rendering. This avoids the resource-limit errors (1102) observed with the previous auto-generated OpenNext deployment. File processing remains client-side.

Do not enable SPA fallback: unknown URLs must return a real 404. HTML paths use no trailing slash. Keep the domain assignment on the existing Cloudflare service. No paid plan or DNS change is required by this configuration.

Run `node scripts/quality-check.cjs` against the preview. Set `PLAYWRIGHT_MODULE` to an installed Playwright module if needed, and `TEST_BASE_URL` for another origin. Chrome must be installed. Verify exports, client-side navigation, sitemap URLs, robots.txt, ads.txt and an unknown route. Repeat public HTTP checks after deploying. Build success is not evidence of AdSense eligibility.

## Google Privacy & messaging setup

The existing publisher ID is `ca-pub-7594630679770960`. Its AdSense loader also delivers Google's European regulations message once that message is published for this domain. No new live ad unit or Auto ads setting is enabled by these code changes; the 280px blocks on the home and resize pages are placeholders.

Before considering consent setup complete, in AdSense → Privacy & messaging → European regulations:

1. Create/publish a message for `resizefox.com`, with the correct site identity and privacy URL `https://resizefox.com/privacy`.
2. Provide accept, do-not-consent and manage-options choices. Check the selected partners and purposes.
3. Under settings, enable Consent Mode for advertising purposes **and analytics purposes**. The bridge intentionally blocks measurement when a purpose is unknown, denied, missing or NOT_CONFIGURED.
4. Preview the published message using `https://resizefox.com/?fc=alwaysshow&fctype=gdpr`. Verify accept, reject, custom choices and footer revocation with Google Tag Assistant. Preview parameters require a published message; they cannot create one.
5. Check the network: the AdSense/CMP loader connects to Google before a decision; `gtag/js` must not load before an allowed consent-mode result. The bridge conservatively requires all four purposes to be GRANTED or NOT_APPLICABLE. A partial grant keeps both measurement tags blocked. Once loaded, Google tags receive denied updates on revocation and Analytics is disabled; consent-mode pings may still occur from already loaded tags. Reloading with denied consent blocks loading them again.

`public/google-consent.js` runs before AdSense to establish defaults. The footer opens Google's own revocation flow. Missing or blocked CMP means no measurement tags and no custom fake banner. Publisher dashboard publication and live regional behavior must be verified separately from the local mocked-CMP tests. Existing cookies can be removed through browser settings.

Local checks: `node scripts/google-tag-check.cjs` and `node scripts/image-tool-check.cjs` against the production preview. These use stub Google responses to avoid sending test traffic. A passing stub test does not establish the state of the AdSense account.

Official references: [Google CMP API](https://developers.google.com/funding-choices/fc-api-docs), [Consent Mode settings](https://support.google.com/adsense/answer/16053245), [Revocation](https://support.google.com/adsense/answer/10959060).
