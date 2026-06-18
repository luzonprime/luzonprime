import { CountUp } from "@/components/shared/CountUp";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

const STATS = [
  { value: 250, suffix: "+", label: "Properties listed" },
  { value: 180, suffix: "+", label: "Happy clients" },
  { value: 12, suffix: "", label: "Years of experience" },
  { value: 98, suffix: "%", label: "Client satisfaction" },
];

export function StatsBar() {
  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 sm:px-[1.125rem]">
      <AnimatedStagger className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        {STATS.map((stat) => (
          <AnimatedStaggerItem key={stat.label} className="text-center">
            <div className="font-heading text-3xl font-bold text-[var(--color-heading)] sm:text-4xl">
              <CountUp end={stat.value} suffix={stat.suffix} />
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{stat.label}</p>
          </AnimatedStaggerItem>
        ))}
      </AnimatedStagger>
    </section>
  );
}
