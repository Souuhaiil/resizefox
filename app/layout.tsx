import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "./SiteChrome";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://resizefox.com"),

  title: {
    default: "ResizeFox - Free Image & PDF Tools",
    template: "%s | ResizeFox",
  },

  description:
    "Resize, compress and convert JPG, PNG and WebP images. Use our free PDF converter to create, merge, split, rotate and compress PDF files privately.",
    verification: {
  google: "K5EcWw5UpwswHPyHgXkVzdUUTx7C-ulsY5rVIA3-Oy0",
},
  other: {
    "google-adsense-account": "ca-pub-7594630679770960",
  },
  keywords: [
    "image resizer",
    "resize image online",
    "image compressor",
    "compress image online",
    "image converter",
    "JPG compressor",
    "PNG resizer",
    "WebP converter",
    "resize image free",
    "compress image to 500KB",
    "PDF tools",
    "merge PDF",
    "images to PDF",
  ],

  openGraph: {
    title: "ResizeFox - Free Image & PDF Tools",
    description:
      "Edit images and use a free PDF converter to create, merge, split, rotate and compress PDF files privately in your browser.",
    url: "https://resizefox.com",
    siteName: "ResizeFox",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "ResizeFox - Free Image & PDF Tools",
    description:
      "Edit images and use a free PDF converter to create, merge, split, rotate and compress PDF files privately in your browser.",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Defaults and CMP callbacks must run before the AdSense loader. */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/google-consent.js" />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
