"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const hasImages = images.length > 0;

  function next() {
    setActive((i) => (i + 1) % images.length);
  }
  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }

  useEffect(() => {
    if (!lightboxOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, images.length]);

  if (!hasImages) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]">
        No images available
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-4 sm:gap-3">
        <button
          type="button"
          onClick={() => {
            setActive(0);
            setLightboxOpen(true);
          }}
          className="group relative col-span-4 aspect-[16/10] overflow-hidden rounded-2xl sm:col-span-3 sm:row-span-2"
        >
          <Image src={images[0]} alt={title} fill className="object-cover" priority />
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Expand size={13} /> View gallery
          </span>
        </button>

        {images.slice(1, 5).map((img, i) => (
          <button
            key={img}
            type="button"
            onClick={() => {
              setActive(i + 1);
              setLightboxOpen(true);
            }}
            className="relative hidden aspect-square overflow-hidden rounded-xl sm:block"
          >
            <Image src={img} alt="" fill className="object-cover" />
            {i === 3 && images.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                +{images.length - 5} more
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white"
            >
              <X size={20} />
            </button>

            {images.length > 1 && (
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div className="relative h-full max-h-[80vh] w-full max-w-4xl">
              <Image src={images[active]} alt={title} fill className="object-contain" />
            </div>

            {images.length > 1 && (
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
              {active + 1} / {images.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
