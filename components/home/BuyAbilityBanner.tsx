import Link from "next/link";
import { Wallet } from "lucide-react";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

export function BuyAbilityBanner() {
  return (
    <section className="px-4 py-12 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="flex flex-col items-start gap-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-muted)] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
              <Wallet size={14} className="text-[var(--color-accent)]" /> Buy-Ability
            </span>
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Find homes in your budget
            </h2>
            <p className="mt-2 text-sm text-[var(--color-text-muted)]">
              See a real-time view of what you can afford in today&apos;s market —
              then browse buy-ability homes matched to your numbers.
            </p>
          </div>
          <Link
            href="/buy-ability"
            className="shrink-0 rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 dark:bg-white dark:text-[var(--color-primary)]"
          >
            Check your Buy-Ability
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
