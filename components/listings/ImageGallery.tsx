"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

type MediaItem = { type: "image" | "video"; src: string };

function youTubeEmbed(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? `https://www.youtube.com/embed/${m[1]}?autoplay=1` : null;
}

export function ImageGallery({
  images,
  title,
  videoUrl,
}: {
  images: string[];
  title: string;
  videoUrl?: string | null;
}) {
  const media: MediaItem[] = [
    ...images.map((src) => ({ type: "image" as const, src })),
    ...(videoUrl ? [{ type: "video" as const, src: videoUrl }] : []),
  ];

  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  function next() {
    setActive((i) => (i + 1) % media.length);
  }
  function prev() {
    setActive((i) => (i - 1 + media.length) % media.length);
  }

  function open(index: number) {
    setActive(index);
    setLightboxOpen(true);
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
  }, [lightboxOpen, media.length]);

  if (media.length === 0) {
    return (
      <div className="flex aspect-[16/10] w-full items-center justify-center rounded-2xl bg-[var(--color-bg-muted)] text-[var(--color-text-muted)]">
        No media available
      </div>
    );
  }

  const mainIsVideo = media[0].type === "video";

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-4 sm:gap-3">
        <button
          type="button"
          onClick={() => open(0)}
          aria-label="Open media gallery"
          className="group relative col-span-4 aspect-[16/10] overflow-hidden rounded-2xl bg-[var(--color-bg-muted)] sm:col-span-3 sm:row-span-2"
        >
          {mainIsVideo ? (
            <div className="flex h-full items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[var(--color-primary)]">
                <Play size={28} className="ml-1" />
              </span>
            </div>
          ) : (
            <Image src={media[0].src} alt={title} fill className="object-cover" priority />
          )}
          <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
            <Expand size={13} /> View gallery
          </span>
        </button>

        {media.slice(1, 5).map((item, i) => (
          <button
            key={`${item.type}-${item.src}`}
            type="button"
            onClick={() => open(i + 1)}
            aria-label={item.type === "video" ? "Play video" : "View image"}
            className="relative hidden aspect-square overflow-hidden rounded-xl bg-[var(--color-bg-muted)] sm:block"
          >
            {item.type === "video" ? (
              <span className="flex h-full items-center justify-center text-[var(--color-primary)]">
                <Play size={24} />
              </span>
            ) : (
              <Image src={item.src} alt="" fill className="object-cover" />
            )}
            {i === 3 && media.length > 5 && (
              <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-sm font-semibold text-white">
                +{media.length - 5} more
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
            role="dialog"
            aria-modal="true"
            aria-label="Media viewer"
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close gallery"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <X size={20} />
            </button>

            {media.length > 1 && (
              <button
                type="button"
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div className="relative flex h-full max-h-[82vh] w-full max-w-5xl items-center justify-center">
              {media[active].type === "video" ? (
                youTubeEmbed(media[active].src) ? (
                  <iframe
                    src={youTubeEmbed(media[active].src)!}
                    title={`${title} video`}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                    className="aspect-video w-full max-w-4xl rounded-lg"
                  />
                ) : (
                  <video
                    src={media[active].src}
                    controls
                    autoPlay
                    className="max-h-full w-full max-w-4xl rounded-lg"
                  />
                )
              ) : (
                <Image src={media[active].src} alt={title} fill className="object-contain" />
              )}
            </div>

            {media.length > 1 && (
              <button
                type="button"
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
              >
                <ChevronRight size={22} />
              </button>
            )}

            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-white/70">
              {active + 1} / {media.length}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
