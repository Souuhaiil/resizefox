"use client";

import { useEffect, useRef, useState } from "react";

type Output = { label: string; url: string; bytes: number; extension: string };
const encode = (canvas: HTMLCanvasElement, type: string, quality?: number) => new Promise<Blob>((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error("Your browser could not encode this image.")), type, quality));

export default function Lab() {
  const [sample, setSample] = useState("text");
  const [quality, setQuality] = useState(75);
  const [scale, setScale] = useState(100);
  const [file, setFile] = useState<File | null>(null);
  const [outputs, setOutputs] = useState<Output[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [dimensions, setDimensions] = useState("");
  const urls = useRef<string[]>([]);
  const fileInput = useRef<HTMLInputElement>(null);
  useEffect(() => () => urls.current.forEach(url => URL.revokeObjectURL(url)), []);
  function clear() { urls.current.forEach(url => URL.revokeObjectURL(url)); urls.current = []; setOutputs([]); setError(""); }

  async function compare() {
    clear(); setBusy(true);
    let bitmap: ImageBitmap | undefined;
    const created: string[] = [];
    try {
      const source = document.createElement("canvas");
      source.width = 960; source.height = 640;
      const ctx = source.getContext("2d");
      if (!ctx) throw new Error("Canvas is unavailable in this browser.");
      if (file) {
        if (file.size > 20 * 1024 * 1024) throw new Error("Choose a JPG, PNG or WebP under 20 MB.");
        if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new Error("Choose JPG, PNG or WebP.");
        bitmap = await createImageBitmap(file);
        if (bitmap.width * bitmap.height > 24_000_000) throw new Error("Choose an image with fewer than 24 million pixels.");
        source.width = bitmap.width; source.height = bitmap.height;
        ctx.drawImage(bitmap, 0, 0);
      } else if (sample === "text") {
        ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, 960, 640);
        ctx.fillStyle = "#0f172a"; ctx.fillRect(40, 40, 880, 100);
        ctx.fillStyle = "#fff"; ctx.font = "bold 32px sans-serif"; ctx.fillText("ResizeFox • readability test", 65, 103);
        [12, 16, 24, 36].forEach((size, i) => { ctx.font = `${size}px sans-serif`; ctx.fillStyle = "#0f172a"; ctx.fillText(`${size}px: Order #1048 — JPG / PNG / WebP`, 55, 200 + i * 65); });
        [1, 2, 3, 5].forEach((width, i) => { ctx.fillStyle = i % 2 ? "#f97316" : "#2563eb"; ctx.fillRect(55, 475 + i * 20, 800, width); });
        ctx.font = "16px sans-serif"; ctx.fillStyle = "#334155"; ctx.fillText("Inspect small letters, punctuation and colored edges at 100% zoom.", 55, 610);
      } else if (sample === "gradient") {
        const gradient = ctx.createLinearGradient(0, 0, 960, 640); gradient.addColorStop(0, "#172554"); gradient.addColorStop(0.5, "#fb923c"); gradient.addColorStop(1, "#fef3c7");
        ctx.fillStyle = gradient; ctx.fillRect(0, 0, 960, 640);
        for (let i = 0; i < 3000; i++) { ctx.fillStyle = `rgba(255,255,255,${(i % 7) / 15})`; ctx.fillRect((i * 137) % 960, (i * 71) % 640, 2, 2); }
        ctx.fillStyle = "#fff"; ctx.font = "bold 36px sans-serif"; ctx.fillText("Smooth tones + fine texture", 50, 100);
      } else {
        ctx.fillStyle = "#f97316"; ctx.beginPath(); ctx.arc(480, 270, 170, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#0f172a"; ctx.font = "bold 72px sans-serif"; ctx.textAlign = "center"; ctx.fillText("ResizeFox", 480, 530);
      }
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(source.width * scale / 100)); canvas.height = Math.max(1, Math.round(source.height * scale / 100));
      if (canvas.width * canvas.height > 24_000_000) throw new Error("The output is too large for this comparison.");
      const outputCtx = canvas.getContext("2d");
      if (!outputCtx) throw new Error("Canvas is unavailable.");
      outputCtx.imageSmoothingQuality = "high"; outputCtx.drawImage(source, 0, 0, canvas.width, canvas.height);
      const rows: Output[] = [];
      for (const [label, mime, extension] of [["PNG", "image/png", "png"], ["WebP", "image/webp", "webp"], ["JPG (white background)", "image/jpeg", "jpg"]]) {
        if (mime === "image/jpeg") { outputCtx.globalCompositeOperation = "destination-over"; outputCtx.fillStyle = "white"; outputCtx.fillRect(0, 0, canvas.width, canvas.height); }
        const blob = await encode(canvas, mime, quality / 100);
        if (blob.type !== mime) throw new Error(`${label} encoding is not supported by this browser. Try a current Chrome, Firefox or Edge browser.`);
        const url = URL.createObjectURL(blob); created.push(url); rows.push({ label, url, bytes: blob.size, extension });
      }
      urls.current = created; setOutputs(rows);
      setDimensions(`${source.width} × ${source.height} source → ${canvas.width} × ${canvas.height} output${file ? ` · original file: ${file.size.toLocaleString()} bytes` : " · original generated sample"}`);
    } catch (caught) { created.forEach(url => URL.revokeObjectURL(url)); setError(caught instanceof Error ? caught.message : "Unable to compare this image."); }
    finally { bitmap?.close(); setBusy(false); }
  }

  return <section aria-label="Interactive format comparison" className="my-10 rounded-3xl border border-orange-200 bg-white p-5 sm:p-8">
    <h2 className="text-2xl font-bold">Run your own comparison</h2>
    <p className="mt-3 text-slate-600">Choose an image to compare JPG, PNG and WebP, or try a sample. Your image stays private in this browser.</p>
    <fieldset disabled={busy} className="mt-6 grid gap-5 sm:grid-cols-2">
      <div className="min-w-0 rounded-2xl border-2 border-dashed border-orange-400 bg-orange-50 p-5">
        <label htmlFor="lab-image" className="flex items-center gap-2 text-lg font-bold">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 shrink-0 text-orange-700"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4" /></svg>
          Upload your image
        </label>
        <p id="lab-image-help" className="mt-2 text-sm text-slate-700">Click Choose file below to select an image from your device.</p>
        <input ref={fileInput} id="lab-image" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="lab-image-help lab-image-formats" onChange={e => { clear(); const selected = e.target.files?.[0]; if (selected) setFile(selected); }} className="mt-4 block w-full min-w-0 cursor-pointer rounded-lg text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-700 file:px-5 file:py-3 file:font-bold file:text-white hover:file:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700" />
        <p id="lab-image-formats" className="mt-3 text-sm text-slate-600">JPG, PNG or WebP · Up to 20 MB</p>
        <p role="status" className="mt-2 break-words text-sm font-semibold text-slate-800">{file ? `Ready to compare: ${file.name}` : "No image selected — choose a file or use a sample."}</p>
      </div>
      <label className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-5 font-semibold">Or try a sample<span className="mt-2 block text-sm font-normal text-slate-600">No image needed. Pick a test pattern to explore the results.</span><span className="mt-4 block text-sm">Test pattern</span><select aria-label="Test pattern" value={sample} onChange={e => { clear(); setSample(e.target.value); setFile(null); if (fileInput.current) fileInput.current.value = ""; }} className="mt-2 block w-full rounded-lg border bg-white p-3"><option value="text">Small text and colored lines</option><option value="gradient">Gradient and fine texture</option><option value="transparent">Transparent graphic</option></select>{file && <button type="button" onClick={() => { clear(); setFile(null); if (fileInput.current) fileInput.current.value = ""; }} className="mt-3 text-sm font-bold text-orange-800 underline">Use this sample instead</button>}</label>
      <label className="font-semibold">JPG / WebP quality: {quality}%<input type="range" min="10" max="100" value={quality} onChange={e => { clear(); setQuality(Number(e.target.value)); }} className="mt-3 block w-full accent-orange-500"/><span className="text-sm font-normal">PNG ignores this quality setting.</span></label>
      <label className="font-semibold">Output dimensions<select value={scale} onChange={e => { clear(); setScale(Number(e.target.value)); }} className="mt-2 block w-full rounded-lg border p-3"><option value={100}>100% — keep original dimensions</option><option value={75}>75% width and height</option><option value={50}>50% width and height</option><option value={25}>25% width and height</option></select></label>
      <button onClick={compare} className="rounded-xl bg-slate-950 px-5 py-3 font-bold text-white disabled:opacity-60">{busy ? "Comparing…" : "Compare formats"}</button>
    </fieldset>
    {error && <p role="alert" className="mt-4 text-red-700">{error}</p>}
    {outputs.length > 0 && <div aria-live="polite" className="mt-8"><p className="break-words font-semibold">{dimensions}</p><p className="mt-2 text-sm text-slate-600">Measured now in your browser. KB below means 1,024 bytes. These previews fit the card; download to inspect at 100% zoom.</p><div className="mt-5 grid gap-5 lg:grid-cols-3">{outputs.map(row => <figure key={row.label} className="min-w-0 rounded-xl border p-3">
      {/* Native img displays a local browser-generated Blob URL. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={row.url} alt={`${row.label} comparison output`} className="aspect-[3/2] w-full object-contain" style={{background: "repeating-conic-gradient(#e2e8f0 0% 25%, #fff 0% 50%) 0 / 20px 20px"}}/>
      <figcaption className="mt-3"><strong>{row.label}</strong><p>{row.bytes.toLocaleString()} bytes · {(row.bytes / 1024).toFixed(2)} KB</p><p className="text-sm">{row.extension === "png" ? "Lossless reference at these dimensions" : `${((1 - row.bytes / outputs[0].bytes) * 100).toFixed(1)}% smaller than this PNG (negative = larger)`}</p><a className="mt-3 inline-block font-bold text-orange-700 underline" download={`resizefox-comparison.${row.extension}`} href={row.url}>Download {row.extension.toUpperCase()}</a></figcaption>
    </figure>)}</div></div>}
  </section>;
}
