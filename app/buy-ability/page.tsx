import type { Metadata } from "next";
import { CheckCircle2, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BuyAbilityForm } from "@/components/buyability/BuyAbilityForm";
import { AnimatedSection } from "@/components/shared/AnimatedSection";
import type { Property } from "@/types";

export const metadata: Metadata = {
  title: "Buy-Ability | Luzon Prime Realtors",
  description:
    "See a real-time view of what you can afford in today's market, and discover homes within your Buy-Ability.",
  alternates: { canonical: "/buy-ability" },
};

const PERKS = [
  "Know your real budget before you shop",
  "See homes matched to what you can afford",
  "Our team follows up with tailored options",
];

export default async function BuyAbilityPage({
  searchParams,
}: {
  searchParams: Promise<{ property?: string }>;
}) {
  const { property } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let preselected: Property | undefined;
  if (property) {
    const { data } = await supabase
      .from("properties")
      .select("*")
      .eq("id", property)
      .eq("buy_ability", true)
      .single();
    preselected = (data as Property | null) ?? undefined;
  }

  // Deduped locations from buy-ability listings only.
  const { data: locRows } = await supabase
    .from("properties")
    .select("location, area, city")
    .eq("is_published", true)
    .eq("buy_ability", true);
  const locSet = new Set<string>();
  for (const r of (locRows ?? []) as { location: string | null; area: string | null; city: string | null }[]) {
    [r.location, r.area, r.city].forEach((v) => v && locSet.add(v));
  }
  const locations = [...locSet].sort();

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
            <Wallet size={14} className="text-[var(--color-accent)]" /> Buy-Ability
          </span>
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Find homes in your budget
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            See a real-time view of what you can afford in today&apos;s market.
            Tell us a little about your finances and we&apos;ll match you with
            buy-ability homes — and follow up with tailored options.
          </p>
          <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:gap-6">
            {PERKS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-[var(--color-text)]">
                <CheckCircle2 size={16} className="text-[var(--color-accent)]" /> {p}
              </li>
            ))}
          </ul>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10 sm:px-[1.125rem] lg:px-8">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8">
          <BuyAbilityForm
            defaultEmail={user?.email ?? ""}
            locations={locations}
            preselected={preselected}
          />
        </div>
      </section>
    </div>
  );
}
