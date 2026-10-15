import Image100KBTool from "./resize-image-to-100kb/Image100KBTool";
import Link from "next/link";
import { WebApplicationJsonLd } from "./StructuredData";
import benchmark from "../public/compression-benchmark.json";

type Section = {
  heading: string;
  body: string;
};

type Faq = {
  question: string;
  answer: string;
};

type ImageSizeSeoPageProps = {
  badge: string;
  heading: string;
  intro: string;
  path: string;
  targetKB: number;
  sections: Section[];
  faqHeading: string;
  faqs: Faq[];
};

export default function ImageSizeSeoPage({
  badge,
  heading,
  intro,
  path,
  targetKB,
  sections,
  faqHeading,
  faqs,
}: ImageSizeSeoPageProps) {
  const measured = benchmark.results.find(result => `/resize-image-to-${result.target}` === path && result.fixture === "png");
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      <WebApplicationJsonLd
        name={heading}
        url={`https://resizefox.com${path}`}
        description={intro}
      />
      <section className="mx-auto max-w-5xl px-5 py-16 text-center sm:px-8 sm:py-20">
        <p className="font-bold text-orange-500">{badge}</p>
        <h1 className="mt-4 text-4xl font-black sm:text-6xl">{heading}</h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300">
          {intro}
        </p>

        <Image100KBTool targetKB={targetKB} />
        <section className="mx-auto mt-10 max-w-3xl text-left" aria-label="Choose your upload limit">
          <h2 className="text-2xl font-black">Choose the limit your upload form allows</h2>
          <p className="mt-4 leading-7 text-slate-300">This page uses {(targetKB * 1024).toLocaleString("en-US")} bytes as its ceiling. For a decimal limit, <Link href="/compress-image" className="text-orange-400 underline">set a smaller custom target</Link>. <Link href="/crop-image" className="text-orange-400 underline">Crop unused margins</Link> first if the form permits it.</p>
          <ul className="mt-4 flex flex-wrap gap-4">
            {[["20kb", "20KB"], ["100kb", "100KB"], ["200kb", "200KB"], ["250kb", "250KB"], ["500kb", "500KB"], ["1mb", "1MB"]].filter(([slug]) => path !== `/resize-image-to-${slug}`).map(([slug, label]) => <li key={slug}><Link href={`/resize-image-to-${slug}`} className="text-orange-400 underline">{label} limit</Link></li>)}
          </ul>
          <p className="mt-4 leading-7 text-slate-300">For a repeatable format comparison, <Link href="/compression-lab" className="text-orange-400 underline">try the image compression lab</Link>. Compare small text, gradients and transparency, then inspect your own file before submitting it.</p>
        </section>
        <p className="mt-6 text-slate-300">Need help with a rejected upload? <Link href="/blog/compress-image-upload-limit" className="text-orange-400 underline">Follow the file-size tutorial</Link> or <Link href="/blog/jpg-png-webp-file-extensions" className="text-orange-400 underline">compare image formats</Link>.</p>

        <section className="mx-auto mt-14 max-w-3xl text-left">
          {measured && <div className="mb-10 rounded-2xl border border-slate-700 p-6">
            <h2 className="text-2xl font-black">A measured compression example</h2>
            <p className="mt-4 leading-7 text-slate-300">In our October 13, 2026 browser test, a synthetic 1600 × 1200 PNG containing seeded noise and a transparent corner went from {measured.inputBytes.toLocaleString("en-US")} bytes to {measured.outputBytes.toLocaleString("en-US")} bytes. The downloaded JPG measured {measured.width} × {measured.height}px, and its transparent corner became white.</p>
            <p className="mt-4 leading-7 text-slate-300">This is an actual export, not a prediction for your photo. Noise is a demanding test pattern, and reaching the limit does not prove visual quality. Browser encoders and source images produce different results. <a href="/compression-benchmark.json" className="text-orange-400 underline">View the measured file sizes, browser version and verification hashes</a>, or try your own image in the tool above.</p>
          </div>}
          {sections.map((section, index) => (
            <div key={section.heading} className={index === 0 ? "" : "mt-10"}>
              <h2 className="text-2xl font-black">{section.heading}</h2>
              <p className="mt-4 leading-7 text-slate-300">{section.body}</p>
            </div>
          ))}
        </section>

        <section className="mx-auto mt-14 max-w-3xl text-left">
          <h2 className="text-2xl font-black">{faqHeading}</h2>
          <div className="mt-7 space-y-7">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-bold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-slate-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
