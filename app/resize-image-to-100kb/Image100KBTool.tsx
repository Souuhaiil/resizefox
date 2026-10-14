"use client";

import { ChangeEvent, useRef, useState } from "react";

type ImageToolProps = {
  targetKB?: number;
};

export default function Image100KBTool({ targetKB = 100 }: ImageToolProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState("");
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [resultDimensions, setResultDimensions] = useState<{ width: number; height: number } | null>(null);

  function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selectedFile.type)) {
      setError("Please choose a valid image file.");
      return;
    }

    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setError("");
    setResultBlob(null);
    setResultDimensions(null);
    setResultUrl("");
    setFile(selectedFile);

    const url = URL.createObjectURL(selectedFile);
    setPreview(url);
  }

  function canvasToBlob(
    canvas: HTMLCanvasElement,
    type: string,
    quality: number
  ): Promise<Blob | null> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), type, quality);
    });
  }

  async function compressToTargetKB() {
    if (!file || !preview) return;

    setProcessing(true);
    setError("");
    setResultBlob(null);

    try {
      const img = new Image();
      img.src = preview;
      await img.decode();
        if (file.size <= targetKB * 1024) {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultBlob(file);
          setResultDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          setResultUrl(URL.createObjectURL(file));
          setProcessing(false);
          return;
        }

        let currentWidth = img.width;
        let currentHeight = img.height;

        const targetBytes = targetKB * 1024;
        const outputType =
          file.type === "image/webp" ? "image/webp" : "image/jpeg";

        let bestBlob: Blob | null = null;

        for (let dimensionPass = 0; dimensionPass < 8; dimensionPass++) {
          const canvas = document.createElement("canvas");

          canvas.width = Math.max(1, Math.round(currentWidth));
          canvas.height = Math.max(1, Math.round(currentHeight));

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            setError("Your browser could not process this image.");
            setProcessing(false);
            return;
          }

          if (outputType === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          let minQuality = 0.05;
          let maxQuality = 1;

          for (let i = 0; i < 14; i++) {
            const quality = (minQuality + maxQuality) / 2;

            const blob = await canvasToBlob(
              canvas,
              outputType,
              quality
            );

            if (!blob) break;

            if (blob.size <= targetBytes) {
              bestBlob = blob;
              minQuality = quality;
            } else {
              maxQuality = quality;
            }
          }

          if (bestBlob) break;

          currentWidth *= 0.85;
          currentHeight *= 0.85;
        }

        if (!bestBlob) {
          setError(
            `We could not reach ${targetLabel} for this image. Try a smaller source image.`
          );
          setProcessing(false);
          return;
        }

        if (resultUrl) URL.revokeObjectURL(resultUrl);

        const url = URL.createObjectURL(bestBlob);

        setResultBlob(bestBlob);
        setResultDimensions({ width: Math.max(1, Math.round(currentWidth)), height: Math.max(1, Math.round(currentHeight)) });
        setResultUrl(url);
        setProcessing(false);
    } catch {
      setError("Something went wrong while compressing the image.");
      setProcessing(false);
    }
  }

  function downloadResult() {
    if (!resultBlob || !resultUrl) return;

    const extension =
      resultBlob.type === "image/png" ? "png" : resultBlob.type === "image/webp" ? "webp" : "jpg";

    const link = document.createElement("a");

    link.href = resultUrl;
    link.download = `resizefox-${targetLabel}.${extension}`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function resetTool() {
    if (preview) URL.revokeObjectURL(preview);
    if (resultUrl) URL.revokeObjectURL(resultUrl);

    setFile(null);
    setPreview("");
    setResultBlob(null);
    setResultUrl("");
    setError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }
  const targetLabel =
  targetKB === 1024 ? "1MB" : `${targetKB}KB`;
  return (
    <div className="mt-10 rounded-3xl border border-orange-200 bg-white p-6 text-slate-900 shadow-sm sm:p-8">
      {!file ? (
        <button
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-2xl border-2 border-dashed border-orange-300 px-6 py-14 text-center transition hover:border-orange-500"
        >
          <div className="text-4xl">🖼️</div>

          <p className="mt-4 text-xl font-bold text-slate-900">
            Upload your image
          </p>

          <p className="mt-2 text-sm text-slate-500">
            JPG, PNG or WebP
          </p>
          <p className="mt-3 text-sm text-slate-600">
            Files already within the limit stay unchanged. When compression is
            needed, PNG becomes JPG with a white background. WebP stays WebP.
            Pixel dimensions may decrease to meet the limit.
          </p>

          <span className="mt-5 inline-block rounded-xl bg-orange-500 px-6 py-3 font-bold text-white">
            Choose Image
          </span>
        </button>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <img
              src={preview}
              alt="Selected image preview"
              className="max-h-[380px] w-full rounded-2xl bg-slate-50 object-contain"
            />

            <div className="mt-4 text-center text-sm text-slate-500">
              Original size: {formatBytes(file.size)}
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-bold text-orange-500">
              TARGET SIZE
            </p>

            <h2 className="mt-2 text-3xl font-black">
              Compress to {targetLabel}
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              Files already within the limit are kept unchanged. Otherwise,
              ResizeFox tries different quality settings and,
              when needed, smaller dimensions to reach {targetLabel}. Some images cannot reach this target.
            </p>

            {!resultBlob && (
            <button
               onClick={compressToTargetKB}
               disabled={processing}
               className="mt-7 rounded-xl bg-orange-500 px-6 py-4 font-extrabold text-white transition hover:bg-orange-600"
>
               {processing
                ? "Compressing..."
               : <>Compress Image to {targetLabel}</>}
              </button>
            )}    
            {resultBlob && (
              <div className="mt-7 rounded-2xl bg-green-50 p-5">
                <p className="font-extrabold text-green-800">
                  {resultBlob === file ? "✅ Already within the limit — original preserved" : "✅ Image ready"}
                </p>
                <img
                  src={resultUrl}
                  alt="Result preview — inspect detail and background before downloading"
                  className="mt-4 max-h-64 w-full rounded-xl bg-white object-contain"
                />
                <p className="mt-3 text-sm text-slate-600">
                  Exact size: {resultBlob.size.toLocaleString("en-US")} bytes / { (targetKB * 1024).toLocaleString("en-US") } byte limit.
                  {resultDimensions && <> Dimensions: {resultDimensions.width} × {resultDimensions.height}px.</>}
                </p>
                <p className="mt-3 text-sm text-slate-600">
                  Output: {resultBlob.type === "image/png" ? "PNG" : resultBlob.type === "image/webp" ? "WebP" : "JPG"}.
                  Check text, faces and fine detail in this preview before downloading.
                </p>
                {resultBlob === file && (
                  <p className="mt-3 text-sm text-slate-600">
                    No compression was necessary. The download preserves the original
                    bytes, format, dimensions and transparency.
                  </p>
                )}

                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-500">Original</p>
                    <p className="font-bold">
                      {formatBytes(file.size)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">New size</p>
                    <p className="font-bold">
                      {formatBytes(resultBlob.size)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={downloadResult}
                  className="mt-5 w-full rounded-xl bg-slate-950 px-6 py-4 font-extrabold text-white"
                >
                  Download Image
                </button>
              </div>
            )}

            {error && (
              <p className="mt-4 rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              onClick={resetTool}
              disabled={processing}
              className="mt-3 rounded-xl border border-slate-200 px-6 py-3 font-bold"
            >
              Choose Another Image
            </button>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
