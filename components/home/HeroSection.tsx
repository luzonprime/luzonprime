"use client";

import { useRef } from "react";
import Image from "next/image";
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
      {/* background photo with slow Ken Burns pan/zoom */}
      <motion.div
        initial={{ scale: 1, x: 0, y: 0 }}
        animate={{ scale: 1.12, x: -18, y: -10 }}
        transition={{ duration: 24, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1618828665347-d870c38c95c7?w=2400&q=80&auto=format&fit=crop"
          alt="Lagos waterfront skyline at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* gradient backdrop / scrim */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(27,58,115,0.55)_0%,_rgba(9,31,70,0.75)_55%,_rgba(4,13,32,0.92)_100%)]" />

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
      <motion.div style={{ y: skylineY }} className="absolute inset-x-0 bottom-0 text-white/50">
        <SkylineSketch className="h-[28vh] w-full sm:h-[34vh]" />
      </motion.div>
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0 bg-gradient-to-b from-transparent via-[#040d20]/40 to-[#040d20]" />

      {/* content */}
      <motion.div
        style={{ y: textY }}
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-4 pt-28 pb-16 text-center sm:px-[1.125rem] sm:pt-32"
      >
        <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-sm">
          Global Real Estate, Intelligently Curated
        </span>

        <h1 className="font-heading max-w-3xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
          Find your prime property, anywhere
        </h1>

        <p className="mt-5 max-w-2xl text-base text-white/75 sm:text-lg">
          Discover verified homes, land, and commercial assets across multiple
          cities and currencies — from Lagos to London — backed by a team that
          knows every market.
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
