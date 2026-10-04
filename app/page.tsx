import type { Metadata } from "next";
import ImageSizeReference from "./ImageSizeReference";
import Link from "next/link";
import { WebSiteJsonLd } from "./StructuredData";
import ImageTool from "./ImageTool";
import AdPlaceholder from "./AdPlaceholder";

const title = "Free Image Resizer & PDF Tools | ResizeFox";
const description = "Use our free image resizer to change JPG, PNG and WebP dimensions in your browser. Compress images or edit and convert PDFs, with no signup.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: "/" },
  openGraph: { title, description, url: "https://resizefox.com", siteName: "ResizeFox", type: "website" },
  twitter: { card: "summary_large_image", title, description },
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-950">
      <WebSiteJsonLd />
      {/* HERO */}

      <section className="mx-auto max-w-5xl px-5 pb-10 pt-16 text-center sm:px-8 sm:pt-20">
        <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
          <span>⚡</span>
          Free image &amp; PDF tools. No signup required.
        </div>

        <h1 className="text-4xl font-black tracking-tight sm:text-6xl">
          Free Online Image Resizer
          <span className="block text-orange-500">
            Plus Image & PDF Tools
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          Use our free image resizer to change photo dimensions directly in your browser. Compress
          images or use our PDF converter to create, merge, split, rotate and
          compress documents without uploading files to our servers.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-5 text-sm font-medium text-slate-600">
          <span>✓ JPG, PNG & WEBP</span>
          <span>✓ No signup</span>
          <span>✓ Browser processing</span>
          <span>✓ Free to use</span>
        </div>
      </section>
      <ImageTool />
      <ImageSizeReference />
      <section id="image-tools" className="mx-auto max-w-5xl scroll-mt-6 px-5 pb-10 sm:px-8">
        <h2 className="text-center text-2xl font-black">Choose the tool for your task</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["/compression-lab", "Compare formats visually", "Experiment with small text, gradients and transparency using real measured exports."],
            ["/resize-image", "Image resizer by pixels", "Set width and height while keeping the image proportions."],
            ["/compress-image", "Reduce file size", "Choose an upload limit and check whether the result meets it."],
            ["/etsy-image-resizer", "Etsy image resizer", "Follow listing photo guidance for dimensions, detail and thumbnails."],
            ["/compress-image-for-email", "Prepare email attachments", "Balance readable images with the total size of your attachments."],
            ["/crop-image", "Crop an image", "Remove unwanted edges with an exact pixel crop area."],
            ["/rotate-image", "Rotate or correct orientation", "Turn an image 90, 180 or 270 degrees."],
            ["/flip-image", "Mirror an image", "Flip the picture horizontally or vertically."],
            ["/bulk-resize-images", "Bulk image resizer", "Apply one width to a group while preserving each aspect ratio."],
            ["/convert-image", "Convert image format", "Create a JPG, PNG or WebP copy in your browser."],
            ["/edit-pdf", "Edit a PDF", "Add text, images, highlights and signatures, then arrange your pages."],
            ["/images-to-pdf", "Convert images to PDF", "Combine JPG and PNG images into one private document."],
            ["/merge-pdf", "Merge PDF files", "Join several PDF documents in their selected order."],
            ["/split-pdf", "Extract PDF pages", "Separate every page or choose a specific page range."],
          ].map(([href, title, description]) => (
            <Link key={href} href={href} className="rounded-2xl border border-orange-200 bg-white p-6 transition hover:border-orange-500">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="mt-2 leading-7 text-slate-600">{description}</p>
            </Link>
          ))}
        </div>
      </section>
      {/* TOOL */}



      {/* BENEFITS */}
      <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
        <p className="text-sm font-bold uppercase tracking-wider text-orange-600">Learn before you export</p>
        <h2 className="mt-3 text-3xl font-black">Practical image tutorials</h2>
        <p className="mt-4 max-w-2xl leading-7 text-slate-600">Choose dimensions before using the image resizer for an Instagram post, artwork for Reels or TikTok, or a document image. Understand dimensions, file formats and quality before changing your file.</p>
        <div className="mt-6 flex flex-wrap gap-4">
          <Link href="/blog/instagram-post-image-size" className="font-bold text-orange-700 underline">Instagram image sizes</Link>
          <Link href="/blog/passport-photo-dimensions-pixels" className="font-bold text-orange-700 underline">Passport photo dimensions</Link>
          <Link href="/blog/jpg-png-webp-file-extensions" className="font-bold text-orange-700 underline">JPG, PNG or WebP?</Link>
          <Link href="/blog" className="font-bold text-orange-700 underline">All tutorials →</Link>
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-5 text-center"><Link href="/tools" className="font-bold text-orange-600 underline">See all image tools and formats →</Link><Link href="/tools#pdf-tools" className="font-bold text-orange-600 underline">Browse PDF tools →</Link></div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-16 sm:px-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-100 p-6">
            <div className="text-3xl">🔒</div>

            <h3 className="mt-4 text-lg font-bold">
              Private by design
            </h3>

            <p className="mt-2 leading-7 text-slate-500">
              The image resizer processes your files locally in your browser,
              without uploading them to our servers.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 p-6">
            <div className="text-3xl">⚡</div>

            <h3 className="mt-4 text-lg font-bold">
              Fast processing
            </h3>

            <p className="mt-2 leading-7 text-slate-500">
              Resize and compress images quickly without waiting for
              server uploads or queues.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 p-6">
            <div className="text-3xl">💸</div>

            <h3 className="mt-4 text-lg font-bold">
              Free to use
            </h3>

            <p className="mt-2 leading-7 text-slate-500">
              Use the image resizer without an account or subscription. Choose your file and start editing.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
        <div className="text-center">
          <p className="font-bold text-orange-500">
            SIMPLE & FAST
          </p>

          <h2 className="mt-2 text-3xl font-black sm:text-4xl">
            How ResizeFox works
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["1", "Upload", "Choose or drag your JPG, PNG or WEBP image."],
            ["2", "Customize", "Resize, compress or convert your image."],
            ["3", "Download", "Download your optimized image instantly."],
          ].map(([number, title, text]) => (
            <div
              key={number}
              className="rounded-2xl bg-white p-7 shadow-sm"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500 font-black text-white">
                {number}
              </div>

              <h3 className="mt-5 text-xl font-bold">
                {title}
              </h3>

              <p className="mt-2 leading-7 text-slate-500">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
        <h2 className="text-3xl font-black">Understand your resize settings</h2>
        <p className="mt-4 leading-7 text-slate-600">Pixel dimensions control how large an image is. File size measures its bytes and also depends on the format, quality and image content.</p>
        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guides/image-resizer-dimensions.svg" alt="Image resizer diagram: 1200 by 800 pixels becomes 600 by 400 pixels, keeping the same 3:2 proportions." width={640} height={360} loading="lazy" className="h-auto w-full" />
            <figcaption className="p-5 text-sm leading-6 text-slate-600">Halving both dimensions leaves one quarter of the original pixels. Keep the aspect ratio locked to avoid stretching.</figcaption>
          </figure>
          <figure className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/guides/image-resizer-workflow.svg" alt="Image resizer workflow: choose an image, set dimensions with the aspect ratio locked, then inspect and download the result." width={640} height={360} loading="lazy" className="h-auto w-full" />
            <figcaption className="p-5 text-sm leading-6 text-slate-600">Choose dimensions first, then inspect the export. If an upload form imposes a byte limit, compress the result and check readability again.</figcaption>
          </figure>
        </div>
      </section>

      {/* FAQ */}

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
          <div className="text-center">
            <p className="font-bold text-orange-500">FAQ</p>

            <h2 className="mt-2 text-3xl font-black">
              Frequently asked questions
            </h2>
          </div>

          <div className="mt-10 space-y-4">
            {[
              [
                "Is ResizeFox free?",
                "Yes. ResizeFox is free to use and does not require an account.",
              ],
              [
                "Are my images uploaded?",
                "No. Image processing happens directly inside your browser.",
              ],
              [
                "Which image formats are supported?",
                "Image tools support JPG, PNG and WebP. The PDF tools support PDF documents and can also create PDFs from JPG or PNG images.",
              ],
              [
                "Can I compress an image to a specific size?",
                "Yes. You can choose common targets such as 100 KB, 250 KB, 500 KB and 1 MB, or enter your own size.",
              ],
            ].map(([question, answer]) => (
              <div
                key={question}
                className="rounded-2xl border border-slate-200 p-6"
              >
                <h3 className="font-bold">{question}</h3>

                <p className="mt-2 leading-7 text-slate-500">
                  {answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      {/* POPULAR IMAGE COMPRESSION TOOLS */}
<section className="border-t border-slate-200 bg-white">
  <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
    <div className="text-center">
      <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        Popular Image Compression Tools
      </h2>

      <p className="mx-auto mt-3 max-w-2xl text-base text-slate-600">
        Quickly compress your images to a specific file size. Free, private
        and processed directly in your browser.
      </p>
    </div>

    <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <a
        href="/resize-image-to-20kb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 20KB
      </a>

      <a
        href="/resize-image-to-50kb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 50KB
      </a>

      <a
        href="/resize-image-to-100kb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 100KB
      </a>

      <a
        href="/resize-image-to-200kb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 200KB
      </a>

      <a
        href="/resize-image-to-250kb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 250KB
      </a>

      <a
        href="/resize-image-to-500kb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 500KB
      </a>

      <a
        href="/resize-image-to-1mb"
        className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center font-bold text-slate-900 transition hover:border-orange-400 hover:bg-orange-50"
      >
        Compress to 1MB
      </a>
    </div>
  </div>
</section>

      <AdPlaceholder />
    </main>
  );
}
