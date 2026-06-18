"use client";

import { useRef, useState } from "react";
import { FileVideo, X } from "lucide-react";

const MAX_BYTES = 50 * 1024 * 1024; // 50MB

export function MediaDropzone({
  name,
  accept,
  label,
  existing = [],
}: {
  name: string;
  accept: string;
  label: string;
  existing?: string[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [kept, setKept] = useState<string[]>(existing);
  const [error, setError] = useState<string | null>(null);

  function syncInput(next: File[]) {
    const dt = new DataTransfer();
    next.forEach((f) => dt.items.add(f));
    if (inputRef.current) inputRef.current.files = dt.files;
    setFiles(next);
  }

  function addFiles(incoming: FileList | File[]) {
    const arr = Array.from(incoming);
    for (const f of arr) {
      if (f.size > MAX_BYTES) {
        setError(`"${f.name}" exceeds the 50MB limit.`);
        return;
      }
    }
    setError(null);
    syncInput([...files, ...arr]);
  }

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[var(--color-border)] p-6 text-center transition-colors hover:border-[var(--color-primary)]"
      >
        <FileVideo className="text-[var(--color-text-muted)]" size={24} />
        <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
        <p className="text-xs text-[var(--color-text-muted)]">Up to 50MB each</p>
        <input
          ref={inputRef}
          type="file"
          name={name}
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
      </div>

      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}

      {(kept.length > 0 || files.length > 0) && (
        <ul className="mt-3 flex flex-col gap-2">
          {kept.map((url) => (
            <li
              key={url}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            >
              <input type="hidden" name={`existing_${name}`} value={url} />
              <span className="truncate text-[var(--color-text)]">
                {decodeURIComponent(url.split("/").pop() ?? "file")}
              </span>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => setKept((k) => k.filter((u) => u !== url))}
                className="shrink-0 text-[var(--color-text-muted)] hover:text-red-500"
              >
                <X size={16} />
              </button>
            </li>
          ))}
          {files.map((file, i) => (
            <li
              key={i}
              className="flex items-center justify-between gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm"
            >
              <span className="truncate text-[var(--color-text)]">{file.name}</span>
              <button
                type="button"
                aria-label="Remove"
                onClick={() => syncInput(files.filter((_, idx) => idx !== i))}
                className="shrink-0 text-[var(--color-text-muted)] hover:text-red-500"
              >
                <X size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
