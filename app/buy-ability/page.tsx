import type { Metadata } from "next";
import { CheckCircle2, Wallet } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { BuyAbilityForm } from "@/components/buyability/BuyAbilityForm";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

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

  let preselected: { id: string; title: string; city: string | null } | null = null;
  if (property) {
    const { data } = await supabase
      .from("properties")
      .select("id, title, city")
      .eq("id", property)
      .single();
    preselected = (data as { id: string; title: string; city: string | null } | null) ?? null;
  }

  const { data: cityRows } = await supabase
    .from("properties")
    .select("city")
    .eq("is_published", true)
    .eq("buy_ability", true);
  const cities = (cityRows ?? []) as { city: string | null }[];
  const locations = [...new Set(cities.map((r) => r.city).filter(Boolean))].sort() as string[];

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-5xl px-4 pt-12 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary)]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-heading)]">
            <Wallet size={14} /> Buy-Ability
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
            propertyId={preselected?.id}
            propertyTitle={preselected?.title}
            preselectedLocation={preselected?.city ?? undefined}
          />
        </div>
      </section>
    </div>
  );
}
