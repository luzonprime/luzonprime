"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";

export function InfoTip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]"
      >
        <Info size={13} />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute left-0 top-full z-30 mt-1.5 w-[min(15rem,calc(100vw-2rem))] rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-2.5 text-xs font-normal leading-relaxed text-[var(--color-text-muted)] shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  );
}
