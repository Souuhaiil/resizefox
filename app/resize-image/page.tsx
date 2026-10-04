import ImageSizeReference from "../ImageSizeReference";
import type { Metadata } from "next";
import Link from "next/link";
import ImageTool from "../ImageTool";
import { FAQJsonLd, WebApplicationJsonLd } from "../StructuredData";
import AdPlaceholder from "../AdPlaceholder";

export const metadata: Metadata = {
  title: "Resize Images Online by Pixels — Free Image Resizer",
  description:
    "Resize JPG, PNG and WebP images online by width and height. Change image dimensions directly in your browser for free with no signup.",
  alternates: {
    canonical: "/resize-image",
  },
};

const sizeLinks = [
  { label: "20KB", href: "/resize-image-to-20kb" },
  { label: "50KB", href: "/resize-image-to-50kb" },
  { label: "100KB", href: "/resize-image-to-100kb" },
  { label: "200KB", href: "/resize-image-to-200kb" },
  { label: "250KB", href: "/resize-image-to-250kb" },
  { label: "500KB", href: "/resize-image-to-500kb" },
  { label: "1MB", href: "/resize-image-to-1mb" },
];

const faqs = [
  {
    question: "How do I resize an image to an exact pixel size?",
    answer:
      "Choose your image, enter the required width or height in pixels, and keep Maintain aspect ratio enabled if the image must retain its original shape. Turn it off only when you specifically need independent width and height values, because that can stretch the picture.",
  },
  {
    question: "Can I resize JPG, PNG and WebP images?",
    answer:
      "Yes. ResizeFox accepts JPG, PNG and WebP files and lets you download the resized result in any of those formats. Choose PNG when transparency matters, JPG for many photographs, or WebP for efficient web images.",
  },
  {
    question: "Does making an image larger improve its quality?",
    answer:
      "No. Increasing pixel dimensions creates more pixels but cannot recover detail that was not present in the source. Large enlargements can look soft or pixelated, so begin with the highest-quality original available.",
  },
  {
    question: "Should I resize or compress an image for an upload limit?",
    answer:
      "Resize when the image dimensions exceed what the destination needs. Compress when the dimensions are suitable but the file size is still too large. Many strict upload limits are easiest to meet by resizing first and compressing second.",
  },
  {
    question: "Are my images uploaded to ResizeFox?",
    answer:
      "No. Image processing happens locally in your browser, so the image does not need to be uploaded to ResizeFox servers for resizing.",
  },
];

export default function ResizeImagePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-slate-950">
      <FAQJsonLd questions={faqs} />
      <WebApplicationJsonLd
        name="ResizeFox Image Resizer"
        url="https://resizefox.com/resize-image"
        description="Resize JPG, PNG and WebP images online by width and height for free, with browser-based image processing and no signup."
      />

      <section className="mx-auto max-w-5xl px-5 pb-8 pt-16 text-center sm:px-8 sm:pt-20">
        <p className="font-bold text-orange-500">FREE • PRIVATE • NO SIGNUP</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">
          Resize Images Online by Pixels
        </h1>
        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Change the width and height of a JPG, PNG or WebP image in your
          browser. Keep the original proportions, preview the result and
          download a resized copy without uploading the image to our servers.
        </p>
      </section>

      <ImageTool initialMode="resize" resizeOnly previewResult />
      <ImageSizeReference />

      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <p className="text-sm font-bold uppercase tracking-wider text-orange-500">
            Simple workflow
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
            How to Resize an Image
          </h2>
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {[
              ["1", "Choose your image", "Select a JPG, PNG or WebP file from your device, or drag it onto the upload area."],
              ["2", "Set the dimensions", "Enter a width or height in pixels. Keep the aspect ratio locked to update the other value automatically."],
              ["3", "Preview and download", "Resize the image, compare its original and resulting dimensions, then download the finished file."],
            ].map(([number, heading, body]) => (
              <div key={number} className="rounded-2xl border border-slate-200 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 font-black text-white">
                  {number}
                </div>
                <h3 className="mt-5 text-xl font-bold">{heading}</h3>
                <p className="mt-3 leading-7 text-slate-600">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Width and Height in Pixels</h2>
          <p className="mt-5 leading-8 text-slate-600">
            Pixel dimensions describe how many picture elements run across and
            down an image. A 1200 × 800 image is 1200 pixels wide and 800 pixels
            high. The right dimensions depend on where the image will appear:
            a small profile photo needs fewer pixels than a full-width website
            banner. Reducing oversized dimensions can also lower file size.
          </p>
        </div>

        <div className="mt-14 rounded-2xl border border-slate-200 bg-white p-7">
          <h2 className="text-3xl font-black tracking-tight">Why Aspect Ratio Matters</h2>
          <p className="mt-5 leading-8 text-slate-600">
            Aspect ratio is the relationship between width and height. A 3:2
            photograph keeps the same shape at 1500 × 1000 or 900 × 600.
            Keeping the ratio locked prevents faces, logos and other objects
            from becoming stretched or squeezed. Unlock it only when the exact
            destination dimensions matter more than preserving the original shape;
            cropping is often a better choice when the shapes differ.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-slate-950 p-7 text-white">
            <h2 className="text-2xl font-black">Resize vs Compress</h2>
            <p className="mt-4 leading-7 text-slate-300">
              Resizing changes pixel dimensions. Compression changes how the
              image data is stored and may leave the dimensions unchanged. If
              your width and height are already correct but the file is heavy,
              use the <Link href="/compress-image" className="font-bold text-orange-400 underline">image compressor</Link>.
            </p>
          </div>
          <div className="rounded-2xl bg-orange-500 p-7 text-white">
            <h2 className="text-2xl font-black">When Images Become Blurry</h2>
            <p className="mt-4 leading-7 text-orange-50">
              Enlarging a small source cannot recreate missing detail, while
              aggressive quality reduction can soften edges and textures. Use
              the best original you have, avoid unnecessary enlargement and
              inspect the preview at the size where the image will be viewed.
            </p>
          </div>
        </div>

        <div className="mt-14">
          <h2 className="text-3xl font-black tracking-tight">Common Image Dimensions</h2>
          <p className="mt-5 leading-8 text-slate-600">
            These are useful starting points, not universal rules. Always check
            the current requirements of the website, form or service receiving
            the image.
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              ["1200 × 800", "A 3:2 landscape image suitable for many articles and content cards."],
              ["1080 × 1080", "A square format commonly used for profile content and social posts."],
              ["1920 × 1080", "A 16:9 landscape frame used for large screens and video thumbnails."],
              ["800 × 800", "A practical square product-image size for many marketplace listings."],
            ].map(([dimensions, use]) => (
              <div key={dimensions} className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold">{dimensions}px</h3>
                <p className="mt-2 leading-7 text-slate-600">{use}</p>
              </div>
            ))}
          </div>
          <p className="mt-6 leading-7 text-slate-600">
            Marketplace requirements need more than a generic preset. Sellers can use
            the{" "}
            <Link
              href="/etsy-image-resizer"
              className="font-bold text-orange-600 underline"
            >
              Etsy listing photo guide
            </Link>{" "}
            for current dimension, thumbnail and upload considerations.
          </p>
        </div>

        <div className="mt-14">
          <h2 className="text-3xl font-black tracking-tight">JPG vs PNG vs WebP When Resizing</h2>
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {[
              ["JPG", "Well suited to photographs and widely compatible. It does not preserve transparency and lower quality settings can add visible artifacts."],
              ["PNG", "Useful for transparent images, screenshots and sharp graphics. Photo-like PNG files can be considerably larger than JPG or WebP."],
              ["WebP", "A modern choice for website images that often balances detail and file size well. Confirm support if the destination has strict format rules."],
            ].map(([format, description]) => (
              <div key={format} className="rounded-2xl border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-bold">{format}</h3>
                <p className="mt-3 leading-7 text-slate-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-950 text-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 md:grid-cols-[0.8fr_1.2fr] md:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-orange-400">Privacy by design</p>
            <h2 className="mt-3 text-3xl font-black">Browser-Based Image Resizing</h2>
          </div>
          <p className="leading-8 text-slate-300">
            ResizeFox uses your browser&apos;s image and canvas capabilities to
            resize the selected file locally. Your image does not need to be
            uploaded to ResizeFox servers for processing, and the result stays
            on your device unless you choose to share it elsewhere.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight">Working With a File-Size Limit?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
            After setting suitable pixel dimensions, choose a focused tool when
            a form specifies a maximum file size.
          </p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {sizeLinks.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-orange-200 bg-white px-4 py-4 text-center font-bold transition hover:border-orange-500 hover:bg-orange-50"
            >
              {tool.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-20">
          <p className="text-sm font-bold uppercase tracking-wider text-orange-500">FAQ</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight">Image Resizing Questions</h2>
          <div className="mt-8 space-y-7">
            {faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="text-lg font-bold">{faq.question}</h3>
                <p className="mt-2 leading-7 text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-4xl px-5 py-12"><h2 className="text-2xl font-bold">Compare detail before you choose a format</h2><p className="mt-4 leading-8">Changing dimensions removes pixels; changing compression alters their encoding. Test these separately with small text, colored edges and smooth gradients in our <Link className="font-bold text-orange-700 underline" href="/compression-lab">Image Compression Lab</Link>. Download the results and inspect them at normal viewing size before preparing your final image.</p></section>
      <AdPlaceholder />
    </main>
  );
}
