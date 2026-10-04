import Image100KBTool from "./resize-image-to-100kb/Image100KBTool";
import Link from "next/link";
import { WebApplicationJsonLd } from "./StructuredData";

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
        <p className="mt-6 text-slate-300">Need help with a rejected upload? <Link href="/blog/compress-image-upload-limit" className="text-orange-400 underline">Follow the file-size tutorial</Link> or <Link href="/blog/jpg-png-webp-file-extensions" className="text-orange-400 underline">compare image formats</Link>.</p>

        <section className="mx-auto mt-14 max-w-3xl text-left">
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
