import { createClient } from "@/lib/supabase/server";
import type { Stat } from "@/types";
import { CountUp } from "@/components/shared/CountUp";
import { AnimatedStagger, AnimatedStaggerItem } from "@/components/shared/AnimatedSection";

export async function StatsBar() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("stats")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  const stats = (data ?? []) as Stat[];

  if (stats.length === 0) return null;

  return (
    <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-10 sm:px-[1.125rem]">
      <AnimatedStagger className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <AnimatedStaggerItem key={stat.id} className="text-center">
            <div className="font-heading text-3xl font-bold text-[var(--color-heading)] sm:text-4xl">
              <CountUp end={Number(stat.value)} suffix={stat.suffix ?? ""} />
            </div>
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{stat.label}</p>
          </AnimatedStaggerItem>
        ))}
      </AnimatedStagger>
    </section>
  );
}
