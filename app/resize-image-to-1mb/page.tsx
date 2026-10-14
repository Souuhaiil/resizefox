import type { Metadata } from "next";
import ImageSizeSeoPage from "../ImageSizeSeoPage";

export const metadata: Metadata = {
  title: "Compress Image to 1MB for Large Photo Uploads",
  description: "Reduce a large photo toward 1MB in your browser. Review exact bytes and dimensions, and check whether your portal uses a decimal 1MB limit.",
  alternates: { canonical: "/resize-image-to-1mb" },
};

export default function ResizeImageTo1MB() {
  return <ImageSizeSeoPage
    badge="Private • Check Exact Bytes • Free"
    heading="Compress an Image to 1MB"
    intro="Reduce a large photo toward a 1MB target, then check the exported detail and dimensions. This page uses 1,048,576 bytes; a portal allowing only 1,000,000 bytes needs a smaller custom target. Nothing needs to be installed or transferred to our servers."
    path="/resize-image-to-1mb"
    targetKB={1024}
    sections={[
      {"heading":"Distinguish a 1MB portal limit from the tool target","body":"The target on this page is 1,048,576 bytes (1,024 × 1,024). Some portals use a decimal maximum of 1,000,000 bytes. A file shown as just under 1MB here can therefore be rejected there. Check its exact bytes and use a smaller custom target on the main compressor. For large camera photos, inspect fine textures at the intended viewing size and keep the original for printing."},
      { heading: "Turn a Large Photo Into a 1MB Copy", body: "Add a JPG, PNG or WebP image and let ResizeFox seek the highest usable quality within 1,024KB. Large camera images are tested at different quality levels, with dimension reduction available when the original resolution is too demanding for the limit." },
      { heading: "Why Choose a One-Megabyte Target?", body: "One megabyte gives detailed photos more breathing room. It is a useful ceiling for property submissions, support tickets, school portals and cloud uploads that reject multi-megabyte originals but still need a clear, reasonably large image." },
      { heading: "Preserve Your Original for Future Use", body: "The downloaded copy is intended for convenient sharing and online submission. Keep the untouched source if you may later need to print, crop or edit the photo, since compression cannot restore detail that has been removed." },
    ]}
    faqHeading="Under-1MB Image FAQ"
    faqs={[
      { question: "Does 1MB mean 1,000KB or 1,024KB here?", answer: "ResizeFox uses 1,048,576 bytes. A decimal 1MB portal may allow only 1,000,000 bytes. Check the exact byte count and use a smaller custom target if needed." },
      { question: "Will an image under 1MB still be high resolution?", answer: "It can be, especially when the source compresses efficiently. Complex or noisy photos may need smaller dimensions to stay within the limit." },
      { question: "Can I compress more than one image at once?", answer: "This tool processes one image at a time so you can inspect and download each result individually." },
    ]}
  />;
}
