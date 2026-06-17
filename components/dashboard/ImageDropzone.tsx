"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

export function ImageDropzone({
  existingImages = [],
  onExistingImagesChange,
}: {
  existingImages?: string[];
  onExistingImagesChange?: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [kept, setKept] = useState<string[]>(existingImages);
  const [isDragging, setIsDragging] = useState(false);

  function syncInput(nextFiles: File[]) {
    const dt = new DataTransfer();
    nextFiles.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setFiles(nextFiles);
  }

  function addFiles(incoming: FileList | File[]) {
    const next = [...files, ...Array.from(incoming)];
    syncInput(next);
  }

  function removeNewFile(index: number) {
    syncInput(files.filter((_, i) => i !== index));
  }

  function removeExisting(url: string) {
    const next = kept.filter((u) => u !== url);
    setKept(next);
    onExistingImagesChange?.(next);
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5"
            : "border-[var(--color-border)]"
        }`}
      >
        <ImagePlus className="text-[var(--color-text-muted)]" size={28} />
        <p className="text-sm text-[var(--color-text-muted)]">
          Drag and drop images here, or click to browse
        </p>
        <input
          ref={inputRef}
          type="file"
          name="images"
          accept="image/png,image/jpeg,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {(kept.length > 0 || files.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          {kept.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--color-bg-muted)]">
              <input type="hidden" name="existing_images" value={url} />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeExisting(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {files.map((file, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--color-bg-muted)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeNewFile(i)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
