import type { Metadata } from "next";
import ImageSizeSeoPage from "../ImageSizeSeoPage";

export const metadata: Metadata = {
  title: "Compress Image to 100KB for Photo Uploads",
  description: "Prepare a photo for a 100KB upload field. Compress privately, then check exact bytes, dimensions and format before submitting your image.",
  alternates: { canonical: "/resize-image-to-100kb" },
};

export default function SizePage() {
  return <ImageSizeSeoPage
    badge="Free • Private • No Signup"
    heading="Compress an Image to 100KB"
    intro="Prepare a compact headshot or application attachment for a 100KB upload field. ResizeFox processes JPG, PNG and WebP files on your device; inspect the downloaded copy before submitting it."
    path="/resize-image-to-100kb"
    targetKB={100}
    sections={[
  {
    "heading": "Prepare a headshot for a 100KB form",
    "body": "Start with the original photo and read the receiving form requirements. If cropping is allowed, remove unused background with the crop tool before compression. Keep the whole face and any required margins visible. A tightly framed headshot spends the byte budget on the subject instead of scenery; it does not automatically satisfy passport or identity-photo rules."
  },
  {
    "heading": "Compress, inspect and submit",
    "body": "Choose your image and start compression. The tool searches quality settings at the original dimensions, then tries smaller dimensions if needed. Inspect eyes, hair edges and any lettering in the result at normal viewing size. Download the copy and check its width and height against the portal requirements; compression may have reduced both."
  },
  {
    "heading": "Why a file marked 100KB can be rejected",
    "body": "This tool allows 102,400 bytes. A portal using decimal kilobytes may accept only 100,000 bytes. A displayed rounded size is not enough to confirm acceptance: check the actual bytes in file properties. For a stricter portal, use a smaller custom target in the main compressor and leave a margin below its stated ceiling."
  },
  {
    "heading": "Choose the right format for the form",
    "body": "An oversized PNG is converted to JPG and transparent areas become white. WebP input stays WebP. A JPG-only portal can reject WebP even when the size is correct; convert it to JPG before compression. Files already within 102,400 bytes remain unchanged, including their format and dimensions."
  },
  {
    "heading": "When 100KB is too restrictive",
    "body": "A full-page scan, detailed certificate or photograph with small lettering may become unreadable at this size. Do not repeatedly compress an already compressed copy. Return to the original, crop only what the destination permits, or ask the receiving service for another submission method if its minimum dimensions and legibility requirements cannot both be met."
  }
]}
    faqHeading="100KB Upload Questions"
    faqs={[
  {
    "question": "Can I keep exact dimensions at 100KB?",
    "answer": "Not necessarily. The tool may reduce dimensions to reach the byte limit. Verify the downloaded dimensions; use the pixel resizer first if the form specifies a width and height, then inspect again after compression."
  },
  {
    "question": "Will a 75KB photo be increased to 100KB?",
    "answer": "No. A file already within the target is returned unchanged. Extra bytes would not restore missing detail."
  },
  {
    "question": "Does compressing to 100KB make an application photo compliant?",
    "answer": "It addresses file size only. The destination may also require a particular crop, background, format and dimensions. Follow those instructions separately."
  }
]}
  />;
}
