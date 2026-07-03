import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Partner } from "@/types";
import {
  AnimatedSection,
  AnimatedStagger,
  AnimatedStaggerItem,
} from "@/components/shared/AnimatedSection";
import { PartnerTile } from "@/components/partners/PartnerTile";

export const metadata: Metadata = {
  title: "Partners | Luzon Prime Realtors",
  description:
    "The developers, consultants, and industry partners we collaborate with to deliver exceptional real estate outcomes.",
  alternates: { canonical: "/partners" },
  openGraph: {
    title: "Partners | Luzon Prime Realtors",
    description:
      "The developers, consultants, and industry partners we collaborate with.",
    url: "/partners",
    type: "website",
  },
};

export default async function PartnersPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("partners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  const partners = (data ?? []) as Partner[];

  return (
    <div className="bg-[var(--color-bg)]">
      <section className="mx-auto max-w-6xl px-4 pt-12 pb-4 sm:px-[1.125rem] lg:px-8">
        <AnimatedSection>
          <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)] dark:bg-white" />
          <h1 className="font-heading mt-3 text-3xl font-bold text-[var(--color-text)] sm:text-4xl">
            Our partners
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-[var(--color-text-muted)] sm:text-base">
            The developers, consultants, and industry partners we collaborate
            with to deliver exceptional real estate outcomes.
          </p>
        </AnimatedSection>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-[1.125rem] lg:px-8">
        {partners.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center text-sm text-[var(--color-text-muted)]">
            Partners will appear here soon.
          </div>
        ) : (
          <AnimatedStagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {partners.map((partner) => (
              <AnimatedStaggerItem key={partner.id}>
                <PartnerTile partner={partner} />
              </AnimatedStaggerItem>
            ))}
          </AnimatedStagger>
        )}
      </section>
    </div>
  );
}
