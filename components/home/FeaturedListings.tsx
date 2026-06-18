import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import type { Property } from "@/types";
import { PropertyCard } from "@/components/listings/PropertyCard";

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
    <section className="bg-[var(--color-bg)] px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-end justify-between">
          <div>
            <span className="inline-block h-1 w-10 rounded-full bg-[var(--color-primary)]" />
            <h2 className="font-heading mt-3 text-2xl font-bold text-[var(--color-text)] sm:text-3xl">
              Featured listings
            </h2>
          </div>
          <Link
            href="/listings"
            className="hidden text-sm font-semibold text-[var(--color-heading)] sm:inline-block"
          >
            View all →
          </Link>
        </div>

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
