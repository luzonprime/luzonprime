import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Radio, Megaphone, MonitorPlay } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

const CHANNELS = [
  { icon: Megaphone, label: "Outdoor" },
  { icon: Radio, label: "Radio" },
  { icon: MonitorPlay, label: "TV & Digital" },
];

/**
 * Homepage entry point to Luzon Media, the group's 360° marketing communication
 * arm. Follows the same rounded-banner shape as BuyAbilityBanner, but carries
 * Luzon Media's own navy/cyan identity so the two brands read as related rather
 * than identical.
 */
export function LuzonMediaBanner() {
  return (
    <section id="luzon-media" className="scroll-mt-24 px-4 py-12 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="relative overflow-hidden rounded-3xl bg-[#0A1B33] p-8 sm:p-10">
          {/* Brand spiral, bled off the right edge as a watermark. */}
          <Image
            src="/luzon-media/spiral-mark.png"
            alt=""
            aria-hidden
            width={595}
            height={645}
            className="pointer-events-none absolute -right-16 -top-20 h-[22rem] w-[22rem] opacity-25 sm:-right-10 sm:h-[26rem] sm:w-[26rem]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#0A1B33] via-[#0A1B33]/85 to-transparent"
          />

          <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <Image
                src="/luzon-media/logo-on-dark.png"
                alt="Luzon Media"
                width={283}
                height={299}
                className="h-16 w-auto"
              />
              <span className="mt-5 block text-xs font-semibold uppercase tracking-widest text-[#4FC8E4]">
                Also from the group
              </span>
              <h2 className="font-heading mt-2 text-2xl font-bold text-white sm:text-3xl">
                Your 360° media powerhouse
              </h2>
              <p className="mt-3 text-sm text-white/70">
                Luzon Media is our 360° marketing communication agency —
                outdoor, radio, television, digital and full media planning &amp;
                buying for brands that need to be seen, heard and remembered.
              </p>

              <ul className="mt-5 flex flex-wrap gap-2">
                {CHANNELS.map(({ icon: Icon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80"
                  >
                    <Icon size={13} className="text-[#4FC8E4]" />
                    {label}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              href="/luzon-media"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#0A1B33] transition-transform hover:-translate-y-0.5"
            >
              Explore Luzon Media
              <ArrowRight size={16} />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
