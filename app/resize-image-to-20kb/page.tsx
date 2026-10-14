import type { Metadata } from "next";
import ImageSizeSeoPage from "../ImageSizeSeoPage";

export const metadata: Metadata = {
  title: "Compress Image to 20KB for Small Uploads",
  description: "Compress JPG, PNG or WebP toward 20KB. Check exact bytes and dimensions for signatures and small images, with private browser processing.",
  alternates: { canonical: "/resize-image-to-20kb" },
};

export default function ResizeImageTo20KB() {
  return <ImageSizeSeoPage
    badge="Free • Private • No Signup"
    heading="Compress an Image to 20KB Online"
    intro="Try a 20KB target for a small image or signature. Check the result against your form: this tool uses 20,480 bytes, while some forms allow only 20,000. ResizeFox works on your device and does not send the image to a server."
    path="/resize-image-to-20kb"
    targetKB={20}
    sections={[
      {"heading":"Protect thin signature strokes at 20KB","body":"If your portal accepts a signature image, crop blank margins in the crop tool while keeping every stroke intact. After compression, inspect dots, thin lines and the ends of letters against the background. The target here is 20,480 bytes; a decimal 20KB portal allows 20,000. Check the byte count and required dimensions before submitting, and use a smaller custom target if necessary."},
      { heading: "How the 20KB Compressor Works", body: "Select an image and start the compressor. Because 20KB is an unusually small target, ResizeFox tests lower image quality first and reduces the pixel dimensions when quality changes alone are not enough. You can review the final file size before downloading." },
      { heading: "When You May Need a 20KB Image", body: "Use this target when your application form, signature field or thumbnail uploader explicitly asks for 20KB. Small headshots, signatures and simple graphics tend to handle this target better than detailed photographs." },
      { heading: "Tips for a Clearer Result at 20KB", body: "Crop away unused background before uploading and begin with an image that has modest dimensions. Busy textures, noise and large transparent areas require more data, so a clean, tightly framed source usually produces a more readable 20KB file." },
    ]}
    faqHeading="20KB Image FAQ"
    faqs={[
      { question: "Will my image be exactly 20KB?", answer: "The tool aims for 20KB or below rather than adding data to hit an exact number. The result may therefore be slightly smaller." },
      { question: "Why can a 20KB image look softer?", answer: "Reaching such a small file size often requires both stronger compression and fewer pixels, especially for detailed photos." },
      { question: "Does ResizeFox store my file?", answer: "No. Compression happens locally in your browser, so your image does not need to leave your device." },
    ]}
  />;
}
