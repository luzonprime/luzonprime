import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertyCard } from "@/components/listings/PropertyCard";
import { SectionHeader } from "@/components/home/SectionHeader";

export async function FeaturedListings() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .eq("is_published", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  const properties = (data ?? []) as Property[];

  return (
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-[1.125rem]">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          eyebrow="Featured"
          title="Featured listings"
          description="Hand-picked homes and investments, refreshed regularly."
          seeAllHref="/listings"
        />

        {properties.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-border)] p-12 text-center">
            <p className="text-sm text-[var(--color-text-muted)]">
              New listings are on the way. Check back soon, or{" "}
              <Link href="/contact" className="font-semibold text-[var(--color-heading)]">
                tell us what you&apos;re looking for
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
