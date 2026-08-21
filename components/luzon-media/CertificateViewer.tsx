"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * ARCON certificate thumbnail that opens into a lightbox.
 *
 * Mirrors the interaction of ImageGallery on property pages (click to enlarge,
 * Escape/backdrop to close, body scroll locked while open) so accreditation
 * proof behaves like every other enlargeable image on the site.
 */
export function CertificateViewer({
  src,
  alt,
  caption,
}: {
  src: string;
  alt: string;
  caption: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={`Enlarge ${alt}`}
        className="group relative block w-full overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm"
      >
        <Image
          src={src}
          alt={alt}
          width={1200}
          height={1830}
          sizes="(max-width: 1024px) 100vw, 460px"
          className="h-auto w-full"
        />
        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <Maximize2 size={16} />
        </span>
      </button>
      <p className="mt-3 text-xs text-[var(--color-text-muted)]">{caption}</p>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={alt}
          >
            <button
              type="button"
              aria-label="Close"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={20} />
            </button>
            <Image
              src={src}
              alt={alt}
              width={1200}
              height={1830}
              sizes="100vw"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-auto max-w-full rounded-lg object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
