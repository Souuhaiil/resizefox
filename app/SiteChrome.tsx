import Link from "next/link";
import PrivacySettings from "./PrivacySettings";

const navigation = [
  { href: "/tools", label: "Image Tools" },
  { href: "/tools#pdf-tools", label: "PDF Tools" },
  { href: "/blog", label: "Tutorials" },
  { href: "/compression-lab", label: "Image Lab" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const footerGroups = [
  { title: "Edit", links: [{href:"/resize-image",label:"Resize"},{href:"/crop-image",label:"Crop"},{href:"/rotate-image",label:"Rotate"},{href:"/flip-image",label:"Flip"},{href:"/bulk-resize-images",label:"Bulk resize"}] },
  { title: "Optimize", links: [{href:"/compress-image",label:"Compress"},{href:"/compress-jpg",label:"Compress JPG"},{href:"/compress-png",label:"Compress PNG"},{href:"/compress-webp",label:"Compress WebP"}] },
  { title: "Convert", links: [{href:"/convert-image",label:"Converter"},{href:"/png-to-jpg",label:"PNG to JPG"},{href:"/jpg-to-png",label:"JPG to PNG"},{href:"/webp-to-jpg",label:"WebP to JPG"}] },
  { title: "PDF", links: [{href:"/edit-pdf",label:"Edit PDF"},{href:"/images-to-pdf",label:"Images to PDF"},{href:"/pdf-to-jpg",label:"PDF to JPG"},{href:"/merge-pdf",label:"Merge PDF"},{href:"/split-pdf",label:"Split PDF"},{href:"/compress-pdf",label:"Compress PDF"}] },
  { title: "ResizeFox", links: [{href:"/tools",label:"All tools"},{href:"/blog",label:"Tutorials"},{href:"/about",label:"About"},{href:"/updates",label:"Updates"},{href:"/contact",label:"Contact"},{href:"/privacy",label:"Privacy"},{href:"/terms",label:"Terms"}] },
];

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white text-slate-950">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="text-lg font-extrabold tracking-tight sm:text-xl">
            Resize<span className="text-orange-500">Fox</span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="flex flex-wrap justify-end items-center gap-3 text-xs font-semibold text-slate-600 sm:gap-6 sm:text-sm"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-orange-600"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-12 sm:px-8 lg:grid-cols-[1.2fr_2fr]">
        <div className="max-w-md">
          <Link href="/" className="text-xl font-extrabold tracking-tight">
            Resize<span className="text-orange-500">Fox</span>
          </Link>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Free browser-based tools for editing images and working with PDF
            documents without uploading them to our servers.
          </p>
          <PrivacySettings />
        </div>

        <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-7 text-sm sm:grid-cols-3 xl:grid-cols-5">
          {footerGroups.map(group => <div key={group.title}><h2 className="font-bold text-white">{group.title}</h2><div className="mt-3 flex flex-col gap-2 text-slate-400">{group.links.map(item => <Link key={item.href} href={item.href} className="transition hover:text-white">{item.label}</Link>)}</div></div>)}
        </nav>
      </div>
    </footer>
  );
}
