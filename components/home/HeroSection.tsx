"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SkylineSketch } from "./SkylineSketch";
import { SearchBar } from "./SearchBar";

export function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const skylineY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.55, 0.85]);

  return (
    <section
      ref={ref}
      className="relative -mt-16 flex min-h-[100vh] items-center overflow-hidden bg-[#091f46] sm:-mt-20"
    >
      {/* gradient backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#1b3a73_0%,_#091f46_55%,_#040d20_100%)]" />

      {/* animated glow accents */}
      <motion.div
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.08, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -right-32 top-10 h-[28rem] w-[28rem] rounded-full bg-[var(--color-accent)]/20 blur-3xl"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -left-40 bottom-0 h-[24rem] w-[24rem] rounded-full bg-[#4f72c2]/25 blur-3xl"
      />

      {/* skyline sketch */}
      <motion.div style={{ y: skylineY }} className="absolute inset-x-0 bottom-0 text-white/60">
        <SkylineSketch className="h-[28vh] w-full sm:h-[34vh]" />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-[#040d20]" />

      {/* content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-28 pb-16 text-center sm:px-6 sm:pt-32"
      >
        <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-sm">
          Lagos Real Estate, Intelligently Curated
        </span>

        <h1 className="font-heading max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Find your prime property in Lagos
        </h1>

        <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-lg">
          Discover verified homes, land, and commercial assets across Ikoyi,
          Victoria Island, Banana Island, and Lekki — backed by a team that
          knows the market.
        </p>

        <div className="mt-9 w-full px-1 sm:px-0">
          <SearchBar />
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/50"
      >
        <div className="h-9 w-5 rounded-full border border-white/30 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/70" />
        </div>
      </motion.div>
    </section>
  );
}
