import type { Guide } from "./articles";

// Distinct problem-solving articles grouped around existing, working image tools.
export const authorityGuides: Guide[] = [
  {
    slug: "compress-image-to-100kb-without-blurry-text",
    date: "2026-10-10",
    category: "Compression",
    title: "How to compress an image to 100 KB without making text blurry",
    description: "A practical workflow for 100 KB photo uploads: crop unused pixels, choose the right image format and check whether small text remains readable.",
    intro: "A 100 KB image limit is a byte limit, not a resolution. Two pictures with identical width and height may need different compression settings because a plain background and a detailed street scene contain different information. Use this workflow when a form actually specifies a maximum file size; otherwise, there is no reason to force every picture under 100 KB.",
    dimensions: [
      ["Upload ceiling", "100 KB", "Check whether the form means 100,000 or 102,400 bytes"],
      ["Example source", "2400 × 1600 px", "3:2 photograph"],
      ["Example smaller export", "1200 × 800 px", "3:2; one quarter as many pixels"],
    ],
    steps: [
      "Read the destination's permitted formats, minimum dimensions and maximum bytes before editing. A smaller file is not useful if the form rejects its dimensions.",
      "Keep an untouched original. Crop only unused edges or background while preserving all required information.",
      "For a photograph, try JPG or WebP if the destination accepts it. For screenshots, text and line artwork, first compare PNG with WebP; JPG may add visible halos around characters.",
      "Use the ResizeFox 100 KB tool on a copy. Download the result only when the tool confirms the file actually meets the size target; do not assume a selected target guarantees success.",
      "Open the downloaded file at normal viewing size. Read the smallest text, inspect edges and verify the width and height. If it fails either the visual or dimension check, try another format or a less aggressive crop.",
    ],
    sections: [
      { title: "Why 100 KB cannot guarantee identical quality", paragraphs: [
        "Image encoding removes or represents information differently depending on the format and the amount of detail. Smooth gradients, hair, foliage and small type react differently to the same output budget. This is why no universal quality slider value will always produce a readable 100 KB file.",
        "If the destination needs a minimum of 600 × 600 pixels, shrinking a 2000 × 2000 source to 300 × 300 may satisfy the byte limit but fail the submission. Check both constraints instead of optimizing only one number."
      ] },
      { title: "Worked geometry example: reduce pixels before lowering quality", paragraphs: [
        "A 2400 × 1600 image contains 3,840,000 pixels. A proportionally resized 1200 × 800 copy contains 960,000 pixels, exactly one quarter as many. That gives an encoder fewer samples to store, but does not mean the result will be one quarter of the bytes: format, image detail and metadata also matter.",
        "For a photo that will only appear as a small web thumbnail, this trade-off may be reasonable. For a scan with small writing, reducing both dimensions by half may make characters impossible to read. In that case crop unnecessary borders first and use the largest readable size that fits."
      ] },
      { title: "What to do when the tool cannot reach the target", paragraphs: [
        "A file-size target is not a promise. Some combinations of image content, dimensions and supported export formats cannot reach 100 KB while preserving acceptable quality. If the tool reports that it cannot meet the limit, do not relabel or merely rename the downloaded file.",
        "Check whether a smaller crop is allowed. If the form accepts multiple formats, compare JPG and WebP outputs; if it requires PNG, keep PNG even if the compressed file is larger. When a document authority specifies mandatory content, never remove information just to satisfy a size cap."
      ] },
    ],
    tool: "/resize-image-to-100kb",
    toolLabel: "Try the 100 KB image tool",
    sources: [{ label: "MDN guide to image file types and compression characteristics", url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types" }],
  },
  {
    slug: "jpg-vs-png-vs-webp-for-small-file-size",
    date: "2026-10-10",
    category: "File formats",
    title: "JPG vs PNG vs WebP: which format makes images smaller?",
    description: "Choose an image format for photographs, screenshots and transparent graphics, then compare measured results rather than relying on a universal file-size rule.",
    intro: "Format choice matters as much as a compression percentage. JPG is often practical for photographs, PNG preserves lossless pixel data and transparency, and WebP can encode both photographic and lossless-style images. The smallest file is not necessarily the best file if the receiving platform does not support it or critical details become unclear.",
    dimensions: [
      ["JPG", "Photographs", "Lossy compression; no alpha transparency"],
      ["PNG", "Text, screenshots, logos", "Lossless; alpha transparency"],
      ["WebP", "Photos and transparent graphics", "Can be lossy or lossless; check destination support"],
    ],
    steps: [
      "Identify the content: detailed photograph, screenshot with tiny text, or design with transparent edges.",
      "Check the upload destination's permitted file types before converting anything.",
      "Keep a master copy. Export a JPG, PNG and WebP test at the same pixel dimensions where possible.",
      "Compare byte sizes for the actual exported files and inspect each at 100% zoom and at its intended display size.",
      "Choose the smallest supported version that preserves what the audience needs to see, rather than declaring one format universally best.",
    ],
    sections: [
      { title: "Photographs: why JPG and WebP often win", paragraphs: [
        "Photographs contain gradual tone transitions and many colors. Lossy JPG or WebP encoding can reduce file size by discarding subtle information that is hard to notice at the intended display size. Increase compression too far and you may see blockiness, smudged texture and color artifacts.",
        "For product photos, inspect labels, stitching and material texture. A smaller file that hides a product feature is not an improvement. Keep the full-size original so you can repeat the export with better settings."
      ] },
      { title: "Screenshots and logos: preserve sharp edges", paragraphs: [
        "Screenshots often have flat color areas, sharp borders and tiny characters. PNG may compress this kind of content well while preserving exact pixels. JPG can introduce fringes around the edges of letters. WebP may be worth comparing, especially when supported by the target application.",
        "Transparency is another key difference. JPG cannot preserve transparent pixels. PNG does, and WebP can too; always inspect the actual downloaded copy on both light and dark backgrounds."
      ] },
      { title: "Run a fair size comparison", paragraphs: [
        "Do not compare a 2400-pixel JPG to a 600-pixel WebP and credit all of the difference to the format. Hold the dimensions and source content constant, then compare the encoded sizes and visible quality. If the formats differ in transparency handling, document that as part of the result.",
        "ResizeFox's Compression Lab provides original sample patterns for checking how fine text, smooth gradients and transparent artwork behave. Use its outputs as examples, not as a prediction of what every photograph will do."
      ] },
    ],
    tool: "/convert-image",
    toolLabel: "Compare and convert image formats",
    sources: [{ label: "MDN: Image file type and format guide", url: "https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types" }],
  },
  {
    slug: "optimize-website-images-dimensions-file-size",
    date: "2026-10-10",
    category: "Website images",
    title: "How to optimize website images: dimensions, format and file size",
    description: "A practical image optimization checklist for website owners: select appropriate pixel dimensions, avoid unnecessary bytes and keep product details clear.",
    intro: "A large image can slow a web page when the browser must download far more pixels than it displays. But image optimization is not simply making every file tiny. Plan each asset around its display area, device density and purpose, then evaluate the exported copy in the real page layout.",
    dimensions: [
      ["Illustrative card displayed at 400 CSS px", "800-pixel-wide source", "Example 2× density; not a universal requirement"],
      ["Illustrative hero displayed at 1200 CSS px", "Up to 2400-pixel source", "Depends on responsive design and device density"],
      ["File size", "No universal KB target", "Balance loading cost with readable details"],
    ],
    steps: [
      "List the places an image appears: hero, product listing, article body or thumbnail. Note the displayed CSS widths at common viewport sizes.",
      "Crop the original to the intended composition. Keep important subjects away from edges that may be hidden by responsive layouts.",
      "Choose one or more export widths appropriate to the displayed size and device pixel density. Avoid uploading the same enormous source for every thumbnail.",
      "Export a suitable modern format where your publishing stack and audience support it; use JPG or PNG fallbacks if necessary.",
      "Review the actual web page on mobile and desktop. Check sharpness, image layout shifts and whether loading prioritizes the main visible image.",
    ],
    sections: [
      { title: "Pixel width and displayed width are not identical", paragraphs: [
        "An image element that looks 400 CSS pixels wide can be shown on a screen with a device-pixel ratio of 2. An 800-pixel-wide export is therefore a useful illustrative candidate, but real responsive image choices depend on the layout and browser. Avoid blindly doubling every image without considering its content and placement.",
        "When different screen sizes need different assets, use responsive delivery through srcset, sizes or your site's image framework. A single compressed file cannot solve every responsive layout need."
      ] },
      { title: "How image optimization affects performance", paragraphs: [
        "Reducing unnecessary bytes may help pages load faster, particularly on slower connections. Yet compressing a hero image aggressively can make the most prominent visual look poor. Compare representative devices and pages rather than optimizing for a single arbitrary number.",
        "Dimensions also matter for layout stability. Set intrinsic width and height or an aspect ratio so the browser can reserve the correct space before the image downloads. Load offscreen images lazily where appropriate, but do not reflexively lazy-load the most important above-the-fold image."
      ] },
      { title: "An e-commerce image example", paragraphs: [
        "Suppose a catalog uses a 400-pixel-wide product tile and a separate full-screen zoom view. These are two different use cases. A smaller image can serve the grid, while a larger version can preserve fabric texture and small product labels when visitors zoom in.",
        "After exporting, check transparency, background consistency and the actual storefront preview. Compression should not hide relevant product information or turn a logo's transparent background into an opaque block."
      ] },
    ],
    tool: "/compress-image",
    toolLabel: "Optimize an image for your site",
    sources: [
      { label: "web.dev: responsive images", url: "https://web.dev/learn/images/responsive-images" },
      { label: "web.dev: image performance", url: "https://web.dev/learn/performance/image-performance" },
    ],
  },
];
