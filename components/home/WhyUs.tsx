import { ShieldCheck, Search, Users, TrendingUp } from "lucide-react";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

const POINTS = [
  {
    icon: ShieldCheck,
    title: "Verified listings",
    description: "Every property is vetted before it goes live, so what you see is what's real.",
  },
  {
    icon: Search,
    title: "Curated, not crowded",
    description: "We hand-pick listings instead of flooding you with noise.",
  },
  {
    icon: Users,
    title: "Expert agents",
    description: "Work with agents who know Lagos neighbourhoods inside out.",
  },
  {
    icon: TrendingUp,
    title: "Market insight",
    description: "Get pricing and investment guidance backed by real data.",
  },
];

export function WhyUs() {
  return (
    <section className="bg-[var(--color-bg-muted)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
        <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
          Why choose Luzon Prime Realtors
        </h2>

        <AnimatedStagger className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {POINTS.map(({ icon: Icon, title, description }) => (
            <AnimatedStaggerItem key={title}>
              <div className="h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-[var(--color-heading)]">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[var(--color-text)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-[var(--color-text-muted)]">
                  {description}
                </p>
              </div>
            </AnimatedStaggerItem>
          ))}
        </AnimatedStagger>
      </div>
    </section>
  );
}
