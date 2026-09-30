import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the ResizeFox privacy policy and learn how your image files, PDF documents and usage data are handled.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-900">
      <article className="mx-auto max-w-3xl px-6 py-16">
        <h1 className="text-4xl font-black">Privacy Policy</h1>

        <p className="mt-3 text-sm text-slate-500">
          Last updated: September 30, 2026
        </p>

        <div className="mt-10 space-y-8 leading-7 text-slate-600">
          <section>
            <h2 className="text-xl font-bold text-slate-900">
              1. Overview
            </h2>

            <p className="mt-3">
              ResizeFox provides free browser-based tools for editing images
              and working with PDF documents. We respect your privacy and aim
              to collect as little personal information as possible.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              2. Your Files
            </h2>

            <p className="mt-3">
              Images and PDF documents processed with ResizeFox are handled
              locally in your web browser. They are not uploaded to our servers
              as part of the editing, compression, conversion, merging or page
              extraction process. The resulting download exists temporarily in
              your browser session until you close or reload the page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              3. Google Analytics 4
            </h2>

            <p className="mt-3">
              ResizeFox integrates Google Analytics 4 (GA4), provided by Google, to
              understand how people use the site and to help us improve the
              tools and user experience. Our GA4 Measurement ID is
              G-64KRV3M9TN.
            </p>
            <p className="mt-3">
              Analytics and Google Ads measurement are initially blocked. They
              load only when Google&apos;s consent platform reports the configured
              purposes as granted or not applicable. If consent information is
              unavailable or not configured, measurement stays blocked.
            </p>

            <p className="mt-3">
              Google Analytics may collect browser and device information,
              approximate location, pages viewed, interactions with the site,
              session and usage information, and cookies or similar
              identifiers. Google may also receive information such as your IP
              address and the URL of the page you visit. This analytics
              information does not include the image or PDF files you process
              with ResizeFox.
            </p>

            <p className="mt-3">
              To learn more, read{" "}
              <a
                href="https://policies.google.com/technologies/partner-sites"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                how Google uses information from sites that use its services
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              4. Cookies and Your Choices
            </h2>

            <p className="mt-3">
              Google Privacy &amp; messaging manages the consent message where
              configured and applicable. You can accept, reject or manage your
              choices in that message. When the consent service is available,
              use “Privacy and cookie settings” in the footer to reopen it and
              change or withdraw your choice. You can also delete existing
              cookies in your browser. File processing does not require consent
              to advertising or analytics.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              5. Google Ads measurement and Google AdSense
            </h2>

            <p className="mt-3">
              ResizeFox integrates the Google Ads tag to measure visits associated
              with our advertising campaigns. Google may process page URLs,
              advertising click identifiers, browser information and cookies
              for this measurement. Your image and PDF file contents are not
              included in this tracking.
            </p>
            <p className="mt-3">
              The AdSense integration loads Google code used for advertising
              and its consent message. This involves a connection to Google,
              even before Analytics or Google Ads measurement is enabled.
              Advertising availability depends on the publisher account settings.
              Google and its advertising partners may use cookies or similar
              technologies to serve and measure ads, and to personalize them
              where permitted by your choices. Your image and PDF contents are
              not sent to these services by our file-processing tools.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              6. Changes to This Policy
            </h2>

            <p className="mt-3">
              We may update this Privacy Policy when our services or legal
              requirements change. The latest version will always be
              published on this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900">
              7. Privacy Contact
            </h2>

            <p className="mt-3">
              If you have a question about this Privacy Policy or how ResizeFox
              handles information, email us at{" "}
              <a
                href="mailto:hmaidasouhail@gmail.com"
                className="font-semibold text-orange-600 hover:text-orange-700"
              >
                hmaidasouhail@gmail.com
              </a>
              .
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
