"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Award } from "lucide-react";
import { SearchBar } from "./SearchBar";

// Fallback awards if none are configured in the admin dashboard.
const DEFAULT_AWARDS = [
  { year: "2020", title: "Africa's Most Innovative Real Estate Firm" },
  { year: "2020", title: "Real Estate Newcomer of the Year" },
  { year: "'22/'23", title: "African Property Awards — Winner" },
  { year: "2025", title: "Luxury Lifestyle Award — Winner" },
];

export function HeroSection({
  awards,
}: {
  awards?: { year: string | null; title: string }[];
}) {
  const items = awards && awards.length > 0 ? awards : DEFAULT_AWARDS;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  return (
    <section
      ref={ref}
      className="relative -mt-16 flex min-h-[100svh] items-center overflow-hidden bg-[#091f46] sm:-mt-20"
    >
      {/* Background media — original imagery (video-ready), no blue overlay */}
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: 1.12 }}
        transition={{ duration: 24, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1618828665347-d870c38c95c7?w=2400&q=80&auto=format&fit=crop"
          alt="City skyline at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Neutral dark scrim for legibility (kept dark, not blue) */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/15" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-[1.125rem] sm:pt-32 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1.45fr_1fr]">
          <motion.div style={{ y: textY }}>
            <span className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-[var(--color-accent)] backdrop-blur-sm">
              Global Real Estate, Intelligently Curated
            </span>

            <h1 className="font-heading max-w-2xl text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl">
              Find your prime property, anywhere
            </h1>

            <p className="mt-5 max-w-xl text-base text-white/75 sm:text-lg">
              Discover verified homes, land, and commercial assets across
              multiple cities and currencies — from Lagos to London — backed by a
              team that knows every market.
            </p>

            <div className="mt-9 w-full">
              <SearchBar />
            </div>
          </motion.div>

          {/* Awards panel */}
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            {items.slice(0, 4).map((a, i) => (
              <div
                key={`${a.year}-${a.title}-${i}`}
                className="rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <Award size={18} className="text-[var(--color-accent)]" />
                  <span className="text-lg font-bold text-white">{a.year}</span>
                </div>
                <p className="mt-1.5 text-xs leading-snug text-white/80">{a.title}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
