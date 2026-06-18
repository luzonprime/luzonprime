import { Award, BadgeCheck, Globe2, Star, Trophy } from "lucide-react";
import { Marquee } from "@/components/shared/Marquee";

const ITEMS = [
  { icon: Trophy, text: "Africa's Most Innovative Real Estate Firm" },
  { icon: Award, text: "African Property Awards — Winner 2022/2023" },
  { icon: BadgeCheck, text: "Luxury Lifestyle Award — Winner 2025" },
  { icon: Star, text: "2,500+ properties sold worldwide" },
  { icon: Globe2, text: "Trusted across 12+ cities & currencies" },
  { icon: Award, text: "Real Estate Newcomer of the Year" },
];

export function TrustMarquee() {
  return (
    <section
      aria-label="Awards and recognition"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-muted)] py-5"
    >
      <Marquee speedSeconds={44}>
        {ITEMS.map((item, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className="flex items-center gap-2.5 px-6 sm:px-9">
              <Icon size={18} className="shrink-0 text-[var(--color-accent)]" />
              <span className="whitespace-nowrap text-sm font-medium text-[var(--color-text)]">
                {item.text}
              </span>
              <span className="text-[var(--color-text-muted)]/40" aria-hidden>
                •
              </span>
            </div>
          );
        })}
      </Marquee>
    </section>
  );
}
