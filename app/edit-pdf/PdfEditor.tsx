"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { PDFDocument, StandardFonts, rgb, pushGraphicsState, popGraphicsState, concatTransformationMatrix } from "pdf-lib";
import type { PDFDocumentProxy } from "pdfjs-dist";

type Mark = { id: number; page: number; kind: "text" | "image" | "highlight"; x: number; y: number; w: number; h: number; text?: string; data?: string; color: string; size: number };
type Frame = { width: number; height: number; transform: number[]; image: string; page: number };
const button = "rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold disabled:opacity-40 hover:border-orange-500";
const input = "mt-1 w-full rounded-lg border border-slate-300 bg-white p-2";
const clamp = (n: number, max: number) => Math.max(0, Math.min(n, max));

export default function PdfEditor() {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const source = useRef<ArrayBuffer | null>(null);
  const nextId = useRef(0);
  const generation = useRef(0);
  const [name, setName] = useState("");
  const [order, setOrder] = useState<number[]>([]);
  const [active, setActive] = useState(0);
  const [frame, setFrame] = useState<Frame | null>(null);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [text, setText] = useState("");
  const [size, setSize] = useState(20);
  const [color, setColor] = useState("#172033");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const resultRef = useRef("");
  const signature = useRef<HTMLCanvasElement>(null);
  const [signed, setSigned] = useState(false);
  const drawing = useRef(false);
  const drag = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const current = marks.find(m => m.id === selected && m.page === active);
  const ready = frame?.page === active && !busy;

  function invalidate() { if (resultRef.current) URL.revokeObjectURL(resultRef.current); resultRef.current = ""; setResult(""); }
  useEffect(() => () => { generation.current++; if (resultRef.current) URL.revokeObjectURL(resultRef.current); }, []);
  useEffect(() => () => { void pdf?.loadingTask.destroy(); }, [pdf]);
  useEffect(() => {
    if (!pdf) return;
    let cancelled = false;
    let task: ReturnType<Awaited<ReturnType<PDFDocumentProxy["getPage"]>>["render"]> | undefined;
    (async () => {
      try {
        const page = await pdf.getPage(active + 1);
        if (cancelled) return;
        const viewport = page.getViewport({ scale: 1 });
        const render = page.getViewport({ scale: Math.min(1.5, 1600 / Math.max(viewport.width, viewport.height)) });
        const canvas = document.createElement("canvas"); canvas.width = Math.ceil(render.width); canvas.height = Math.ceil(render.height);
        task = page.render({ canvas, canvasContext: canvas.getContext("2d")!, viewport: render }); await task.promise;
        if (!cancelled) setFrame({ width: viewport.width, height: viewport.height, transform: viewport.transform, image: canvas.toDataURL(), page: active });
      } catch { if (!cancelled) setError("This page could not be displayed. Try another PDF."); }
    })();
    return () => { cancelled = true; task?.cancel(); };
  }, [pdf, active]);

  async function open(file?: File) {
    if (!file) return;
    const version = ++generation.current;
    invalidate(); setBusy(true); setError(""); setPdf(null); setFrame(null); setMarks([]); setOrder([]); source.current = null;
    try {
      if (file.size > 50 * 1024 * 1024) throw new Error("Choose a PDF smaller than 50 MB.");
      const bytes = await file.arrayBuffer();
      // Validate encryption and export compatibility before offering editing controls.
      const check = await PDFDocument.load(bytes);
      if (check.getPageCount() > 100) throw new Error("Choose a PDF with 100 pages or fewer.");
      const lib = await import("pdfjs-dist");
      lib.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
      const loading = lib.getDocument({ data: new Uint8Array(bytes.slice(0)) });
      let doc: PDFDocumentProxy;
      try { doc = await loading.promise; } catch (e) { await loading.destroy(); throw e; }
      if (version !== generation.current) { await doc.loadingTask.destroy(); return; }
      source.current = bytes; setPdf(doc); setName(file.name); setOrder(Array.from({ length: doc.numPages }, (_, i) => i)); setActive(0); setSelected(null);
    } catch (e) { setError(e instanceof Error && /Choose a PDF/.test(e.message) ? e.message : "Unable to open this PDF. Use a valid, unencrypted PDF without a password."); }
    finally { setBusy(false); }
  }
  function add(mark: Partial<Mark> & Pick<Mark, "kind">) {
    if (!frame || !ready) return;
    invalidate();
    const w = Math.min(mark.w ?? 150, frame.width * 0.8), h = Math.min(mark.h ?? 28, frame.height * 0.8);
    const entry: Mark = { id: ++nextId.current, page: active, x: frame.width * 0.1, y: frame.height * 0.15, w, h, size, color, ...mark };
    entry.w = w; entry.h = h;
    setMarks(prev => [...prev, entry]); setSelected(entry.id);
  }
  async function addText() {
    setError("");
    if (!text.trim()) { setError("Enter some text first."); return; }
    try {
      const doc = await PDFDocument.create(); const font = await doc.embedFont(StandardFonts.Helvetica);
      font.encodeText(text);
      const width = font.widthOfTextAtSize(text, size);
      if (frame && width > frame.width * 0.8) { setError("This line is too wide. Use shorter text or a smaller font size."); return; }
      add({ kind: "text", text, w: width + 2, h: size * 1.2 });
    } catch { setError("Use Latin text and common punctuation. This editor does not support emoji or all writing systems."); }
  }
  async function addImage(file?: File) {
    if (!file) return;
    setError("");
    try {
      if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 10 * 1024 * 1024) throw new Error();
      const bitmap = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, 2000 / Math.max(bitmap.width, bitmap.height));
      canvas.width = Math.max(1, Math.round(bitmap.width * scale)); canvas.height = Math.max(1, Math.round(bitmap.height * scale));
      canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height); bitmap.close();
      const w = Math.min(180, (frame?.width ?? 600) * 0.5), h = w * canvas.height / canvas.width;
      const fit = Math.min(1, (frame?.height ?? 800) * 0.5 / h);
      add({ kind: 'image', data: canvas.toDataURL('image/png'), w: w * fit, h: h * fit });
    } catch { setError("Choose a valid JPG or PNG image under 10 MB."); }
  }
  function update(patch: Partial<Mark>) { invalidate(); setMarks(prev => prev.map(m => m.id === selected ? { ...m, ...patch } : m)); }
  function movePage(delta: number) {
    const index = order.indexOf(active), next = [...order];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    invalidate(); setOrder(next);
  }
  function signaturePoint(event: PointerEvent<HTMLCanvasElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    return [(event.clientX - rect.left) * 600 / rect.width, (event.clientY - rect.top) * 180 / rect.height];
  }
  async function download() {
    if (!source.current || !pdf) return;
    setBusy(true); setError(""); invalidate();
    try {
      const doc = await PDFDocument.load(source.current);
      const font = await doc.embedFont(StandardFonts.Helvetica);
      for (const pageIndex of order) {
        const page = doc.getPage(pageIndex);
        const view = (await pdf.getPage(pageIndex + 1)).getViewport({ scale: 1 });
        const [a,b,c,d,e,f] = view.transform, det = a*d-b*c;
        // Convert display-space (bottom-left) to the original PDF coordinates,
        // including page rotation and nonzero crop-box origins.
        page.pushOperators(pushGraphicsState(), concatTransformationMatrix(d/det,-b/det,c/det,-a/det,(-d*e+c*f-c*view.height)/det,(b*e-a*f+a*view.height)/det));
        for (const m of marks.filter(m => m.page === pageIndex)) {
          const value = parseInt(m.color.slice(1),16), ink = rgb((value>>16&255)/255,(value>>8&255)/255,(value&255)/255);
          if (m.kind === 'text') page.drawText(m.text!, { x:m.x, y:view.height-m.y-m.size, size:m.size, font, color:ink });
          else if (m.kind === 'highlight') page.drawRectangle({ x:m.x, y:view.height-m.y-m.h, width:m.w, height:m.h, color:ink, opacity:0.3 });
          else page.drawImage(await doc.embedPng(m.data!), { x:m.x, y:view.height-m.y-m.h, width:m.w, height:m.h });
        }
        page.pushOperators(popGraphicsState());
      }
      // Reuse the original page objects so existing text and page annotations remain.
      const pages = doc.getPages(); while(doc.getPageCount()) doc.removePage(0);
      order.forEach(i => doc.addPage(pages[i]));
      const bytes = await doc.save();
      const url = URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type:'application/pdf' }));
      resultRef.current = url; setResult(url);
    } catch { setError("Could not save this document. Try a simpler PDF and check that added text uses supported characters."); }
    finally { setBusy(false); }
  }

  return <section className="mx-auto max-w-7xl px-4 pb-14">
    <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6">
      <div className="min-w-0 rounded-2xl border-2 border-dashed border-orange-400 bg-orange-50 p-5 sm:p-6">
        <label htmlFor="editor-pdf-upload" className="flex items-center gap-2 text-lg font-bold">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6 shrink-0 text-orange-700"><path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m-4 4 4-4 4 4M4 16v4h16v-4" /></svg>
          Upload your PDF
        </label>
        <p id="editor-upload-help" className="mt-2 text-sm text-slate-700">Click Choose file below to open a PDF from your device and start editing.</p>
        <input id="editor-pdf-upload" aria-label="Choose PDF" aria-describedby="editor-upload-help editor-upload-limits" className="mt-4 block w-full min-w-0 cursor-pointer rounded-lg text-sm text-slate-700 file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-orange-700 file:px-5 file:py-3 file:font-bold file:text-white hover:file:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-orange-700 disabled:opacity-50" type="file" accept="application/pdf,.pdf" disabled={busy} onChange={e => { void open(e.target.files?.[0]); }} onClick={e => { e.currentTarget.value = ''; }} />
        <p id="editor-upload-limits" className="mt-3 text-sm text-slate-600">PDF files · Up to 50 MB / 100 pages · Files stay on your device</p>
        {pdf && <p role="status" className="mt-2 break-words text-sm font-semibold text-slate-800">Opened: {name}</p>}
      </div>
      <p className="mt-3 text-sm text-slate-600">Files stay on your device. Add content on top of a PDF; existing text cannot be rewritten. Highlights are not redaction. Drawn signatures are visual marks, not digital certificates.</p>
      {error && <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-red-800">{error}</p>}
      {busy && <p role="status" className="mt-3">Processing your PDF…</p>}
      {pdf && <>
        <div className="my-5 flex flex-wrap items-center gap-2"><span className="max-w-full break-all text-sm font-bold">{name}</span><label className="flex items-center gap-2">Page<select aria-label="Current page" className={input} disabled={busy} value={active} onChange={e => { setActive(Number(e.target.value)); setSelected(null); }}>{order.map((p,i) => <option key={p} value={p}>{i+1} (original {p+1})</option>)}</select></label><button className={button} disabled={busy || order.indexOf(active) === 0} onClick={() => movePage(-1)}>Move page earlier</button><button className={button} disabled={busy || order.indexOf(active) === order.length-1} onClick={() => movePage(1)}>Move page later</button><button className={button} disabled={busy || order.length===1} onClick={() => { const next=order.filter(i=>i!==active); invalidate(); setOrder(next); setActive(next[0]); setSelected(null); }}>Remove page</button><button className={button} disabled={busy || order.length===pdf.numPages} onClick={() => { invalidate(); setOrder(Array.from({length:pdf.numPages},(_,i)=>i)); }}>Restore all pages</button></div>
        <div className="grid gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
          <fieldset disabled={!ready} className="min-w-0 space-y-4">
            <legend className="mb-3 font-bold">Add to this page</legend>
            <label className="block text-sm">Text or note<input aria-label="Text or note" className={input} maxLength={300} value={text} onChange={e=>setText(e.target.value)} /></label>
            <div className="flex gap-3"><label className="flex-1 text-sm">Font size<input className={input} type="number" min={8} max={72} value={size} onChange={e=>setSize(clamp(Number(e.target.value)||8,72)<8?8:clamp(Number(e.target.value),72))} /></label><label className="text-sm">Color<input className="mt-1 block h-10 w-16" type="color" value={color} onChange={e=>setColor(e.target.value)} /></label></div>
            <button className={button} onClick={()=>void addText()}>Add text</button>
            <button className={button + ' ml-2'} onClick={()=>add({kind:'highlight',color:'#ffce00',w:160,h:24})}>Add highlight</button>
            <label className="block text-sm">Add image (JPG / PNG)<input aria-label="Add image" className={input} type="file" accept="image/png,image/jpeg" onChange={e=>{void addImage(e.target.files?.[0]); e.target.value='';}} /></label>
            <div><p className="mb-2 text-sm">Draw your signature</p><canvas ref={signature} aria-label="Signature pad" width={600} height={180} className="w-full touch-none rounded-lg border border-slate-300 bg-white" onPointerDown={e=>{drawing.current=true;e.currentTarget.setPointerCapture(e.pointerId);const ctx=e.currentTarget.getContext('2d')!;const [x,y]=signaturePoint(e);ctx.beginPath();ctx.moveTo(x,y);}} onPointerMove={e=>{if(!drawing.current)return;const ctx=e.currentTarget.getContext('2d')!;ctx.strokeStyle='#172033';ctx.lineWidth=3;ctx.lineCap='round';ctx.lineTo(...signaturePoint(e) as [number,number]);ctx.stroke();setSigned(true);}} onPointerUp={()=>{drawing.current=false;}} onPointerCancel={()=>{drawing.current=false;}} /><div className="mt-2 flex gap-2"><button className={button} onClick={()=>{signature.current?.getContext('2d')?.clearRect(0,0,600,180);setSigned(false);}}>Clear signature</button><button className={button} disabled={!signed || !ready} onClick={()=>add({kind:'image',data:signature.current!.toDataURL(),w:180,h:54})}>Add signature</button></div></div>
            <p className="text-sm text-slate-600">Select an addition to move it by dragging, or set its position below. Select a note from the list to remove it.</p>
            <label className="block text-sm">Selected addition<select aria-label="Selected addition" className={input} value={selected??''} onChange={e=>setSelected(Number(e.target.value))}><option value="" disabled>Choose an addition</option>{marks.filter(m=>m.page===active).map((m,i)=><option key={m.id} value={m.id}>{i+1}. {m.kind==='text'?m.text:m.kind}</option>)}</select></label>
            {current && frame && <div className="space-y-2 rounded-lg bg-orange-50 p-3"><div className="grid grid-cols-2 gap-2">{(['x','y'] as const).map(axis=><label key={axis} className="text-sm">{axis==='x'?'Left':'Top'} (%)<input aria-label={axis==='x'?'Left (%)':'Top (%)'} type="number" min={0} max={100} className={input} value={Math.round(current[axis]/(axis==='x'?frame.width:frame.height)*100)} onChange={e=>update({[axis]:clamp(Number(e.target.value)/100*(axis==='x'?frame.width:frame.height),(axis==='x'?frame.width-current.w:frame.height-current.h))})} /></label>)}</div>{current.kind!=='text' && <label className="block text-sm">Width (%)<input aria-label="Width (%)" className="w-full" type="range" min={5} max={90} value={current.w/frame.width*100} onChange={e=>{const w=Number(e.target.value)/100*frame.width;const h=current.kind==='image'?w*current.h/current.w:current.h;const fit=Math.min(1,(frame.height-current.y)/h,(frame.width-current.x)/w);update({w:w*fit,h:h*fit});}} /></label>}{current.kind==='highlight' && <label className="block text-sm">Height (%)<input aria-label="Height (%)" type="range" min={1} max={40} className="w-full" value={current.h/frame.height*100} onChange={e=>update({h:Math.min(Number(e.target.value)/100*frame.height,frame.height-current.y)})} /></label>}<button className={button} onClick={()=>{invalidate();setMarks(prev=>prev.filter(m=>m.id!==selected));setSelected(null);}}>Remove addition</button></div>}
          </fieldset>
          <div className="min-w-0 rounded-xl bg-slate-100 p-3 sm:p-6">{!ready ? <p role="status">Loading page preview…</p> : <div ref={stage} aria-label="PDF page preview" className="relative mx-auto w-full max-w-[850px] overflow-hidden bg-white shadow" style={{aspectRatio:`${frame.width}/${frame.height}`}}>
            {/* Native image displays a local rendered PDF preview, not a remote optimized asset. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={frame.image} alt={`Original PDF page ${active+1}`} className="absolute inset-0 h-full w-full" draggable={false}/>
            <svg viewBox={`0 0 ${frame.width} ${frame.height}`} className="absolute inset-0 h-full w-full" aria-label="Page additions">
              {marks.filter(m=>m.page===active).map(m=><g key={m.id} tabIndex={0} role="button" aria-label={`Select ${m.kind}${m.text?': '+m.text:''}`} className="cursor-move touch-none" onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(m.id);}}} onPointerDown={e=>{e.preventDefault();setSelected(m.id);e.currentTarget.setPointerCapture(e.pointerId);drag.current={id:m.id,x:e.clientX,y:e.clientY,left:m.x,top:m.y};}} onPointerMove={e=>{const start=drag.current;if(!start||start.id!==m.id||!stage.current)return;const rect=stage.current.getBoundingClientRect();invalidate();setMarks(prev=>prev.map(item=>item.id===m.id?{...item,x:clamp(start.left+(e.clientX-start.x)*frame.width/rect.width,frame.width-item.w),y:clamp(start.top+(e.clientY-start.y)*frame.height/rect.height,frame.height-item.h)}:item));}} onPointerUp={()=>{drag.current=null;}} onPointerCancel={()=>{drag.current=null;}}>
                {m.kind==='text'?<text x={m.x} y={m.y+m.size} fontSize={m.size} fontFamily="Helvetica, Arial, sans-serif" fill={m.color}>{m.text}</text>:m.kind==='image'?<image href={m.data} x={m.x} y={m.y} width={m.w} height={m.h}/>:<rect x={m.x} y={m.y} width={m.w} height={m.h} fill={m.color} opacity={0.3}/>}
                <rect x={m.x} y={m.y} width={m.w} height={m.h} fill="transparent" stroke={selected===m.id?'#f97316':'transparent'} strokeWidth={1.5} strokeDasharray="4 3"/>
              </g>)}
            </svg>
          </div>}</div>
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-4"><button className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white disabled:opacity-40" disabled={busy||!ready} onClick={()=>void download()}>Save edited PDF</button>{result && <a className="font-bold text-green-800 underline" href={result} download={name.replace(/\.pdf$/i,'')+'-edited.pdf'}>Download edited PDF</a>}<span className="text-sm text-slate-600">{order.length} pages • {marks.filter(m=>order.includes(m.page)).length} additions</span></div>
      </>}
    </div>
  </section>;
}
