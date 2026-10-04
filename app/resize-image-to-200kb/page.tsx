import type { Metadata } from "next";
import ImageSizeSeoPage from "../ImageSizeSeoPage";

export const metadata: Metadata = {
  title: "Resize Image to 200KB for Faster Uploads",
  description:
    "Resize an image to 200KB or less for web forms, listings and profile photos. Compress JPG, PNG or WebP files privately in your browser.",
  alternates: { canonical: "/resize-image-to-200kb" },
};

export default function ResizeImageTo200KB() {
  return <ImageSizeSeoPage
    badge="Free • Browser-Based • Simple"
    heading="Resize an Image to 200KB"
    intro="Find a useful balance between image clarity and a smaller download. ResizeFox compresses your file toward 200KB for faster uploads and everyday online use."
    path="/resize-image-to-200kb"
    targetKB={200}
    sections={[
      {"heading":"Match the image to its displayed size","body":"For a content-card thumbnail, resize the original to a sensible display width before compressing instead of spending the 200KB budget on pixels that will not be shown. Check small labels at that width. The target is 204,800 bytes; a decimal 200KB form caps files at 200,000. Verify the actual bytes and use a smaller custom target when the destination uses the stricter definition."},
      { heading: "Compress to 200KB Without Guesswork", body: "Upload an image and let the tool compare multiple compression levels automatically. If the full-resolution version remains too large, it progressively reduces the dimensions until it can create a result within the 200KB allowance." },
      { heading: "Where a 200KB File Fits Well", body: "This target is useful for marketplace listings, blog thumbnails, account avatars and online forms that accept a moderate image size. Compared with very small limits, 200KB leaves more space for color gradients, readable details and larger pixel dimensions." },
      { heading: "File Size and Pixel Size Are Different", body: "A 200KB file does not have one fixed width or height. Two images with identical dimensions can have different file sizes because texture, color variation and format affect compression. ResizeFox adapts to the individual source rather than applying one preset." },
    ]}
    faqHeading="200KB Compression FAQ"
    faqs={[
      { question: "Is 200KB small enough for a website?", answer: "It is a reasonable target for many content images, although thumbnails may benefit from smaller files and hero images may need more detail." },
      { question: "What happens if my original is already below 200KB?", answer: "An image already within 204,800 bytes is returned unchanged, preserving its bytes, format and dimensions. Check the destination limit separately if it uses decimal KB." },
      { question: "Is the processing private?", answer: "Yes. Your browser performs the image processing locally instead of uploading the file to ResizeFox." },
    ]}
  />;
}
