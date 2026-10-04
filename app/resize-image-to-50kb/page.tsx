import type { Metadata } from "next";
import ImageSizeSeoPage from "../ImageSizeSeoPage";

export const metadata: Metadata = {
  title: "Reduce Image Size to 50KB Online",
  description:
    "Reduce JPG, PNG and WebP images to 50KB online for forms, ID photos and lightweight uploads. Free to use with private on-device compression.",
  alternates: { canonical: "/resize-image-to-50kb" },
};

export default function ResizeImageTo50KB() {
  return <ImageSizeSeoPage
    badge="Fast • Local • Account-Free"
    heading="Reduce Image Size to 50KB"
    intro="Prepare a lightweight image for document portals, profile forms or mobile sharing. Upload a JPG, PNG or WebP file and compress it toward 50KB without installing software."
    path="/resize-image-to-50kb"
    targetKB={50}
    sections={[
      {"heading":"Prepare a small ID photo without losing the face","body":"Use a clear source with even lighting and avoid including scenery that the form does not need. At 50KB, facial outlines usually deserve more of the image area than background. This tool targets 51,200 bytes; decimal limits stop at 50,000. Check the exact bytes, crop rules and minimum dimensions after compression. A size-compliant file alone is not an approved ID photo."},
      { heading: "Three Steps to a 50KB Image", body: "Choose your source image, start compression, then download the optimized result. ResizeFox searches for a suitable quality level and only scales down the dimensions if the original cannot fit within the target at its current resolution." },
      { heading: "A Practical Size for Photos and Documents", body: "Fifty kilobytes can work well for passport-style photos, student records, scanned form attachments and compact previews. It offers more room for facial detail and text than a 20KB target while keeping uploads quick on limited connections." },
      { heading: "Check the Result Before Submitting", body: "Open the downloaded image and confirm that important text, faces and edges remain clear. A portal may specify pixel dimensions or an aspect ratio in addition to its 50KB file-size rule, so check those requirements separately." },
    ]}
    faqHeading="Questions About 50KB Images"
    faqs={[
      { question: "Can I use the tool for an ID or application photo?", answer: "Yes, provided the downloaded file also meets the portal's required dimensions, crop and accepted file format." },
      { question: "Which input formats can I choose?", answer: "You can select a JPG, PNG or WebP image. When compression is needed, PNG becomes JPG and WebP remains WebP. Files already within the limit keep their original format." },
      { question: "Do I need to create a ResizeFox account?", answer: "No. The 50KB tool is free to use and does not require signup." },
    ]}
  />;
}
