import type { Metadata } from "next";
import ImageSizeSeoPage from "../ImageSizeSeoPage";

export const metadata: Metadata = {
  title: "Compress Image to 500KB for Web and Email",
  description:
    "Compress an image to 500KB or less for product listings, websites and email. Optimize JPG, PNG and WebP files free in your browser.",
  alternates: {
    canonical: "/resize-image-to-500kb",
  },
};

export default function ResizeImageTo500KB() {
  return <ImageSizeSeoPage
    badge="No Upload • No Software • Free"
    heading="Compress an Image to 500KB"
    intro="Keep useful visual detail while reducing a heavy image for the web, email or an online listing. The entire optimization runs privately in your browser."
    path="/resize-image-to-500kb"
    targetKB={500}
    sections={[
      {"heading":"Budget for several email attachments","body":"Ten files at this tool target can total 5,120,000 bytes before email encoding adds overhead. Check the combined attachment total against your mail service limit, rather than judging each photo alone. For a single upload, this target is 512,000 bytes; a decimal 500KB ceiling is 500,000. Product labels and textures should still be checked in each downloaded copy."},
      { heading: "A Simple 500KB Workflow", body: "Choose a supported image and start compression. ResizeFox evaluates several quality settings to use the available 500KB efficiently. When a very large source cannot meet the limit through quality adjustment alone, the tool also scales its dimensions." },
      { heading: "Useful for Product Photos and Email", body: "Half a megabyte is often enough for product shots, property photos, portfolio previews and email attachments that need visible detail without the weight of an original camera file. A lighter asset can upload more quickly and consume less recipient bandwidth." },
      { heading: "Choose Quality Based on How the Image Will Be Seen", body: "Inspect fine lines, text and faces after downloading. A 500KB copy may look excellent at normal webpage size but is not a replacement for a full-resolution original intended for printing or extensive editing. Keep the source file as your master copy." },
    ]}
    faqHeading="500KB Image FAQ"
    faqs={[
      { question: "Will the download exceed 500KB?", answer: "The compressor looks for a result at or below the target. Its exact size varies with the source image and browser encoding." },
      { question: "Is 500KB suitable for an email attachment?", answer: "Usually, yes. It is substantially lighter than many camera originals, though sending several images will increase the total message size." },
      { question: "Can I use ResizeFox on a phone?", answer: "Yes. Use a modern mobile browser and choose an image available on your device." },
    ]}
  />;
}
