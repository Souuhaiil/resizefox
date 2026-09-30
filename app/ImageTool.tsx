"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";

type Mode = "resize" | "compress" | "convert";
type OutputFormat = "image/jpeg" | "image/png" | "image/webp";

type ImageToolProps = {
  initialMode?: Mode;
  compressOnly?: boolean;
  resizeOnly?: boolean;
  convertOnly?: boolean;
  previewResult?: boolean;
  acceptedTypes?: string;
  uploadHint?: string;
  fixedFormat?: OutputFormat;
};

export default function ImageTool({
  initialMode = "resize",
  compressOnly = false,
  resizeOnly = false,
  convertOnly = false,
  previewResult = true,
  acceptedTypes = "image/jpeg,image/png,image/webp",
  uploadHint = "JPG, PNG and WEBP supported",
  fixedFormat,
}: ImageToolProps = {}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const revision = useRef(0);
  const urls = useRef({ preview: "", result: "" });
  const [message, setMessage] = useState("");
  const [resultDimensions, setResultDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => () => {
    revision.current++;
    URL.revokeObjectURL(urls.current.preview);
    URL.revokeObjectURL(urls.current.result);
  }, []);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [originalWidth, setOriginalWidth] = useState(0);
  const [originalHeight, setOriginalHeight] = useState(0);

  const [keepRatio, setKeepRatio] = useState(true);
  const [format, setFormat] = useState<OutputFormat>(
    fixedFormat ?? "image/jpeg"
  );
  const [quality, setQuality] = useState(90);
  const [targetKB, setTargetKB] = useState(500);

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);

  async function loadFile(selectedFile: File) {
    resetImage();
    const current = revision.current;
    const allowedTypes = acceptedTypes.split(",").map((type) => type.trim());
    if (!allowedTypes.includes(selectedFile.type)) {
      setMessage("Choose a supported image format. HEIC requires conversion first.");
      return;
    }
    if (selectedFile.size > 25 * 1024 * 1024) {
      setMessage("Choose an image smaller than 25 MB.");
      return;
    }
    setMessage("Reading image…");
    const url = URL.createObjectURL(selectedFile);
    const img = new Image();
    img.src = url;
    try {
      await img.decode();
      if (current !== revision.current) { URL.revokeObjectURL(url); return; }
      if (img.naturalWidth * img.naturalHeight > 40_000_000) {
        throw new Error("Choose an image no larger than 40 megapixels.");
      }
      urls.current.preview = url;
      setPreview(url);
      setFile(selectedFile);
      setWidth(img.naturalWidth);
      setHeight(img.naturalHeight);
      setOriginalWidth(img.naturalWidth);
      setOriginalHeight(img.naturalHeight);
      setMessage("");
    } catch (error) {
      URL.revokeObjectURL(url);
      if (current === revision.current) setMessage(error instanceof Error && error.message.includes("40 megapixels")
        ? error.message : "This image could not be read. Choose another JPG, PNG or WebP file.");
    }
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    loadFile(selectedFile);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    if (event.dataTransfer.files.length !== 1) {
      setMessage("Drop one image at a time.");
      return;
    }

    const droppedFile = event.dataTransfer.files?.[0];

    if (droppedFile) {
      loadFile(droppedFile);
    }
  }

  function changeWidth(newWidth: number) {
    resetResult();
    if (newWidth < 1) {
      setWidth(0);
      return;
    }

    setWidth(newWidth);

    if (keepRatio && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setHeight(Math.max(1, Math.round(newWidth * ratio)));
    }
  }

  function changeHeight(newHeight: number) {
    resetResult();
    if (newHeight < 1) {
      setHeight(0);
      return;
    }

    setHeight(newHeight);

    if (keepRatio && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setWidth(Math.max(1, Math.round(newHeight * ratio)));
    }
  }

  function getExtension() {
    if (format === "image/png") return "png";
    if (format === "image/webp") return "webp";
    return "jpg";
  }

  function formatBytes(bytes: number) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat(
      (bytes / Math.pow(k, i)).toFixed(2)
    )} ${sizes[i]}`;
  }

  async function processImage() {
    if (!file || !preview) return;
    resetResult();
    const current = revision.current;
    if (![width, height].every(value => Number.isInteger(value) && value > 0 && value <= 8192)
      || width * height > 24_000_000) {
      setMessage("Use dimensions from 1 to 8192 pixels, up to 24 megapixels in total.");
      return;
    }
    if (mode === "compress" && (!Number.isFinite(targetKB) || targetKB <= 0)) {
      setMessage("Enter a positive target file size.");
      return;
    }
    setProcessing(true);
    const canvas = document.createElement("canvas");
    let workingCanvas = canvas;
    const encode = (value: number): Promise<Blob> => new Promise((resolve, reject) => {
      workingCanvas.toBlob(blob => {
        if (!blob || blob.type !== format) reject(new Error("This browser cannot export that format. Try JPG or PNG."));
        else resolve(blob);
      }, format, value);
    });
    try {
      const image = new Image();
      image.src = preview;
      await image.decode();
      if (current !== revision.current) return;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Image processing is unavailable. Try a smaller image.");
      if (format === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
      }
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, 0, 0, width, height);
      let blob = await encode(mode === "compress" ? 1 : quality / 100);
      if (mode === "compress") {
        const limit = targetKB * 1024;
        if (format === "image/png") {
          for (let attempt = 0; blob.size > limit && attempt < 12; attempt++) {
            if (current !== revision.current) return;
            const scale = Math.max(0.72, Math.sqrt(limit / blob.size) * 0.94);
            const smaller = document.createElement("canvas");
            smaller.width = Math.max(1, Math.round(workingCanvas.width * scale));
            smaller.height = Math.max(1, Math.round(workingCanvas.height * scale));
            const context = smaller.getContext("2d");
            if (!context) throw new Error("Not enough memory. Try a smaller image.");
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = "high";
            context.drawImage(workingCanvas, 0, 0, smaller.width, smaller.height);
            workingCanvas.width = 0;
            workingCanvas.height = 0;
            workingCanvas = smaller;
            blob = await encode(1);
          }
        } else if (blob.size > limit) {
          let low = 0, high = 1;
          let best = await encode(0);
          for (let attempt = 0; attempt < 14; attempt++) {
            if (current !== revision.current) return;
            const midpoint = (low + high) / 2;
            const candidate = await encode(midpoint);
            if (candidate.size <= limit) { best = candidate; low = midpoint; }
            else high = midpoint;
          }
          blob = best;
        }
      }
      if (current !== revision.current) return;
      const url = URL.createObjectURL(blob);
      urls.current.result = url;
      setResultBlob(blob);
      setResultUrl(url);
      setResultDimensions({ width: workingCanvas.width, height: workingCanvas.height });
      setMessage("Your image is ready. Your original file is unchanged.");
    } catch (error) {
      if (current === revision.current) setMessage(error instanceof Error ? error.message : "Unable to process this image.");
    } finally {
      workingCanvas.width = 0;
      workingCanvas.height = 0;
      canvas.width = 0;
      canvas.height = 0;
      if (current === revision.current) setProcessing(false);
    }
  }

  function downloadResult() {
    if (!resultBlob || !resultUrl) return;

    const link = document.createElement("a");

    link.href = resultUrl;

    if (mode === "resize") {
      link.download = `resizefox-${resultDimensions.width}x${resultDimensions.height}.${getExtension()}`;
    } else if (mode === "compress") {
      link.download = `resizefox-compressed.${getExtension()}`;
    } else {
      link.download = `resizefox-converted.${getExtension()}`;
    }

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetResult() {
    revision.current++;
    URL.revokeObjectURL(urls.current.result);
    urls.current.result = "";
    setProcessing(false);
    setMessage("");
    setResultBlob(null);
    setResultUrl("");
  }

  function resetImage() {
    resetResult();
    URL.revokeObjectURL(urls.current.preview);
    urls.current.preview = "";

    setFile(null);
    setPreview("");
    setResultBlob(null);
    setResultUrl("");

    setWidth(0);
    setHeight(0);
    setOriginalWidth(0);
    setOriginalHeight(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function changeMode(newMode: Mode) {
    setMode(newMode);
    resetResult();
  }

  const savingPercent =
    file && resultBlob
      ? Math.max(
          0,
          Math.round((1 - resultBlob.size / file.size) * 100)
        )
      : 0;


  return (
<section className="mx-auto max-w-6xl px-5 pb-16 sm:px-8">
  <p role="status" aria-live="polite" className="mb-4 text-center text-sm text-slate-700">{message}</p>
  {!file ? (
    <div
      onDragOver={(event) => event.preventDefault()}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className="mx-auto max-w-3xl cursor-pointer rounded-[32px] border-2 border-dashed border-orange-200 bg-white px-6 py-16 text-center shadow-sm transition hover:border-orange-400 hover:shadow-md"
    >
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-3xl">
        🖼️
      </div>

      <h2 className="mt-6 text-2xl font-bold">
        Drop your image here
      </h2>

      <p className="mt-2 text-slate-500">
        Or choose an image from your device
      </p>

      <button className="mt-7 rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-white transition hover:bg-slate-800">
        Choose Image
      </button>

      <p className="mt-5 text-sm text-slate-400">
        {uploadHint}
      </p>
    </div>
  ) : (
    <div>
      {/* TABS */}

      {!compressOnly && !resizeOnly && !convertOnly && (
        <div className="mb-6 flex justify-center">
          <div className="grid w-full max-w-xl grid-cols-3 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
            {(["resize", "compress", "convert"] as Mode[]).map(
              (item) => (
                <button
                  key={item}
                  onClick={() => changeMode(item)}
                  className={`rounded-xl px-4 py-3 text-sm font-bold capitalize transition ${
                    mode === item
                      ? "bg-slate-950 text-white"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      )}

      {/* EDITOR */}

      <div className="grid gap-0 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm lg:grid-cols-[1fr_1.05fr]">
        {/* LEFT */}

        <div className="flex flex-col justify-center bg-slate-50 p-6 sm:p-9">
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl bg-white p-4">
            <img
              src={previewResult && resultUrl ? resultUrl : preview}
              alt={
                previewResult && resultUrl
                  ? "Processed image preview"
                  : "Image preview"
              }
              className="max-h-[420px] max-w-full rounded-xl object-contain"
            />
          </div>

          <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-500">
            <span>
              {originalWidth} × {originalHeight}px
            </span>

            <span>{formatBytes(file.size)}</span>

            <span>{file.type.replace("image/", "").toUpperCase()}</span>
          </div>
        </div>

        {/* RIGHT */}

        <div className="p-6 sm:p-9">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-orange-500">
                ResizeFox Tool
              </p>

              <h2 className="mt-1 text-3xl font-black capitalize">
                {mode} Image
              </h2>
            </div>

            <button
              onClick={resetImage}
              className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            >
              Change Image
            </button>
          </div>

          {/* DIMENSIONS */}

          {(mode === "resize" || mode === "compress") && (
            <>
              <div className="mt-6 flex flex-wrap gap-2" aria-label="Resize by percentage">
                {[25, 50, 75, 100].map(percent => (
                  <button key={percent} type="button" onClick={() => {
                    resetResult();
                    setWidth(Math.max(1, Math.round(originalWidth * percent / 100)));
                    setHeight(Math.max(1, Math.round(originalHeight * percent / 100)));
                  }} className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold hover:bg-orange-50">
                    {percent}%
                  </button>
                ))}
              </div>
              <label className="mt-5 block text-sm font-bold">
                Dimension preset
                <select value="" onChange={event => {
                  if (!event.target.value) return;
                  const [presetWidth, presetHeight] = event.target.value.split("x").map(Number);
                  resetResult(); setKeepRatio(false); setWidth(presetWidth); setHeight(presetHeight);
                }} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3">
                  <option value="">Choose dimensions</option>
                  <option value="1080x1080">Instagram square post · 1080 × 1080</option>
                  <option value="1080x1920">Instagram story · 1080 × 1920</option>
                  <option value="820x312">Facebook cover · 820 × 312</option>
                  <option value="1584x396">LinkedIn header · 1584 × 396</option>
                  <option value="413x531">35 × 45 mm photo at 300 dpi · 413 × 531</option>
                </select>
              </label>
              <p className="mt-2 text-xs leading-5 text-slate-500">Presets set both dimensions and unlock the ratio. A different image shape will stretch; use the crop tool to change its shape first. Photo dimensions alone do not meet passport requirements.</p>
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-bold">
                    Width
                  </label>

                  <div className="relative mt-2">
                    <input
                      aria-label="Width"
                      type="number"
                      value={width || ""}
                      min="1"
                      max="8192"
                      step="1"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        changeWidth(
                          e.target.value === ""
                            ? 0
                            : Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 outline-none transition focus:border-orange-400"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      px
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold">
                    Height
                  </label>

                  <div className="relative mt-2">
                    <input
                      aria-label="Height"
                      type="number"
                      value={height || ""}
                      min="1"
                      max="8192"
                      step="1"
                      onFocus={(e) => e.target.select()}
                      onChange={(e) =>
                        changeHeight(
                          e.target.value === ""
                            ? 0
                            : Number(e.target.value)
                        )
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 pr-10 outline-none transition focus:border-orange-400"
                    />

                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      px
                    </span>
                  </div>
                </div>
              </div>

              <label className="mt-5 flex cursor-pointer items-center gap-3 text-sm font-semibold">
                <input
                  type="checkbox"
                  checked={keepRatio}
                  onChange={(e) => {
                    resetResult(); setKeepRatio(e.target.checked);
                    if (e.target.checked && originalWidth > 0 && width > 0)
                      setHeight(Math.max(1, Math.round(width * originalHeight / originalWidth)));
                  }}
                  className="h-4 w-4 accent-orange-500"
                />

                Maintain aspect ratio
              </label>
            </>
          )}

          {/* FORMAT */}

          {fixedFormat ? (
            <div className="mt-7">
              <p className="text-sm font-bold">Output format</p>
              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 font-semibold">
                {fixedFormat === "image/jpeg"
                  ? "JPG"
                  : fixedFormat === "image/png"
                  ? "PNG"
                  : "WEBP"}
              </div>
            </div>
          ) : (
            <div className="mt-7">
              <label className="text-sm font-bold">
                Output format
              </label>

              <select
                aria-label="Output format"
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value as OutputFormat);
                  resetResult();
                }}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 outline-none transition focus:border-orange-400"
              >
                <option value="image/jpeg">JPG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WEBP</option>
              </select>
            </div>
          )}

          {/* QUALITY */}

          {(mode === "resize" || mode === "convert") &&
            format !== "image/png" && (
              <div className="mt-7">
                <div className="flex justify-between">
                  <label className="text-sm font-bold">
                    Quality
                  </label>

                  <span className="text-sm font-bold text-orange-500">
                    {quality}%
                  </span>
                </div>

                <input
                  aria-label="Quality"
                  type="range"
                  min="0"
                  max="100"
                  value={quality}
                  onChange={(e) => { resetResult(); setQuality(Number(e.target.value)); }}
                  className="mt-4 w-full accent-orange-500"
                />
              </div>
            )}

          {/* COMPRESSION */}

          {mode === "compress" && (
            <div className="mt-7">
              <label className="text-sm font-bold">
                Target file size
              </label>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {[100, 250, 500, 1024].map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setTargetKB(size);
                      resetResult();
                    }}
                    className={`rounded-xl border px-2 py-3 text-sm font-bold transition ${
                      targetKB === size
                        ? "border-orange-500 bg-orange-500 text-white"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    {size === 1024 ? "1 MB" : `${size} KB`}
                  </button>
                ))}
              </div>

              <div className="mt-4">
                <label className="text-xs font-semibold text-slate-500">
                  Custom size (KB)
                </label>

                <input
                  aria-label="Custom size (KB)"
                  type="number"
                  value={targetKB || ""}
                  min="10"
                  onFocus={(e) => e.target.select()}
                  onChange={(e) => {
                    setTargetKB(
                      e.target.value === ""
                        ? 0
                        : Number(e.target.value)
                    );

                    resetResult();
                  }}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3.5 outline-none transition focus:border-orange-400"
                />
              </div>

              {format === "image/png" && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                  PNG ignores the quality setting. To reduce its file size,
                  this tool may reduce pixel dimensions. Check the result dimensions before downloading.
                </div>
              )}
            </div>
          )}

          {/* PROCESS */}

          {!resultBlob && (
            <button
              disabled={
                processing ||
                width <= 0 ||
                height <= 0 ||
                (mode === "compress" && targetKB <= 0)
              }
              onClick={processImage}
              className="mt-8 w-full rounded-xl bg-orange-500 px-6 py-4 text-base font-extrabold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {processing
                ? "Processing..."
                : mode === "resize"
                ? "Resize Image"
                : mode === "compress"
                ? `Compress Image`
                : "Convert Image"}
            </button>
          )}

          {/* RESULT */}

          {resultBlob && (
            <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex items-center gap-2">
                <span>{mode === "compress" && resultBlob.size > targetKB * 1024 ? "⚠️" : "✅"}</span>

                <p className="font-extrabold text-green-900">
                  {mode === "compress" && resultBlob.size > targetKB * 1024
                    ? "Target size not reached"
                    : "Your image is ready"}
                </p>
              </div>

              {mode === "compress" && resultBlob.size > targetKB * 1024 && (
                <p role="status" className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
                  This file exceeds your {targetKB} KB limit. Choose Change Settings
                  and try JPG or WebP. If it is still too large, use the image
                  resizer to reduce its pixel dimensions, then compress the smaller copy.
                  The download below is the current result, not a file within your limit.
                </p>
              )}
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    Original
                  </p>

                  <p className="mt-1 font-bold">
                    {formatBytes(file.size)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-slate-500">
                    New size
                  </p>

                  <p className="mt-1 font-bold">
                    {formatBytes(resultBlob.size)}
                  </p>
                </div>
              </div>

              {(mode === "resize" || mode === "compress") && (
                <div className="mt-4 rounded-xl bg-white px-4 py-3 text-sm text-slate-700">
                  Result dimensions: <strong>{resultDimensions.width} × {resultDimensions.height}px</strong>
                </div>
              )}

              {resultBlob.size < file.size && (
                <div className="mt-4 rounded-xl bg-white px-4 py-3 text-sm font-bold text-green-700">
                  🎉 Saved {savingPercent}% of the original file
                  size.
                </div>
              )}

              <button
                onClick={downloadResult}
                className="mt-5 w-full rounded-xl bg-slate-950 px-6 py-4 font-extrabold text-white transition hover:bg-slate-800"
              >
                Download Image
              </button>

              <button
                onClick={resetResult}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-6 py-3 font-bold text-slate-700 hover:bg-slate-50"
              >
                Change Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )}

  <input
    ref={fileInputRef}
    type="file"
    accept={acceptedTypes}
    onChange={handleFile}
    className="hidden"
  />
</section>
  );
}
